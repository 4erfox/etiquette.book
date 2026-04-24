/**
 * admin/panels/SitePanel.js — настройки сайта
 * Название и описание сайта
 */

import { bridge } from '../bridge.js';
import { toast } from '../toast.js';
import { getT } from '../theme.js';

const DEFAULTS = {
  siteTitle:       'Деловой этикет в Казахстане',
  siteDescription: 'Введение в профессиональную культуру и деловые отношения.',
};

export function renderSitePanel(container) {
  const t = getT();
  let cfg = { ...DEFAULTS };
  let dirty = false;
  let saved = false;

  async function load() {
    try {
      const res = await bridge.readSiteConfig();
      cfg = { ...DEFAULTS, ...res.config };
      dirty = false;
      render();
    } catch(e) {
      cfg = { ...DEFAULTS };
      render();
    }
  }

  async function save() {
    try {
      // ✅ ИСПРАВЛЕНО: сервер ожидает { siteTitle, siteDescription } напрямую,
      // а bridge.writeSiteConfig оборачивает в { config: cfg }.
      // Поэтому вызываем API напрямую через fetch:
      const token = localStorage.getItem('adm_jwt');
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          siteTitle:       cfg.siteTitle,
          siteDescription: cfg.siteDescription,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);

      dirty = false;
      saved = true;
      toast.success('Настройки успешно сохранены');
      renderSaveBtn();

      // Применяем на странице сразу без перезагрузки
      applyToPage(cfg);

      setTimeout(() => { saved = false; renderSaveBtn(); }, 2500);
    } catch(e) {
      toast.error('Ошибка: ' + e.message);
    }
  }

  // Применяем title и subtitle прямо на странице
  function applyToPage(config) {
    const mainTitle = document.querySelector('.hero h1');
    if (mainTitle && config.siteTitle) mainTitle.textContent = config.siteTitle;
    const subTitle = document.querySelector('.subtitle');
    if (subTitle && config.siteDescription) subTitle.textContent = config.siteDescription;
    if (config.siteTitle) document.title = config.siteTitle;
  }

  function renderSaveBtn() {
    const btn = container.querySelector('#adm-site-save');
    if (!btn) return;
    btn.textContent = saved ? '✓ Сохранено' : 'Сохранить';
    btn.style.borderColor = saved ? '#22c55e' : dirty ? t.borderStrong : t.border;
    btn.style.background  = saved ? 'rgba(34,197,94,0.1)' : dirty ? t.surfaceHov : 'transparent';
    btn.style.color       = saved ? '#22c55e' : dirty ? t.fg : t.fgMuted;
  }

  function escapeHtml(s) {
    return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function render() {
    container.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;padding:7px 10px;border-bottom:1px solid ${t.border};background:${t.surface};flex-shrink:0">
        <span style="flex:1;font-size:10px;color:${t.fgSub};font-family:${t.mono}">
          ${dirty ? `<span style="color:#f59e0b">● </span>` : ''}Настройки сайта
        </span>
        <button id="adm-site-reload" style="display:flex;align-items:center;gap:4px;padding:5px 9px;border-radius:6px;border:1px solid ${t.border};background:transparent;color:${t.fgMuted};cursor:pointer;font-size:11px;font-family:${t.mono}">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
          Обновить
        </button>
        <button id="adm-site-save" style="display:flex;align-items:center;gap:5px;padding:5px 12px;border-radius:6px;border:1px solid ${t.border};background:transparent;color:${t.fgMuted};cursor:pointer;font-size:11px;font-family:${t.mono}">
          Сохранить
          <span style="font-size:9px;color:${t.fgSub};background:${t.inpBg};border:1px solid ${t.border};border-radius:3px;padding:1px 4px">Ctrl+S</span>
        </button>
      </div>

      <div style="flex:1;overflow-y:auto;padding:12px;" class="adm-scroll">
        <div style="padding-top:4px;display:grid;grid-template-columns:1fr;gap:12px">
          <div>
            <label for="adm-site-siteTitle" style="display:block;font-size:9px;color:${t.fgSub};text-transform:uppercase;letter-spacing:0.07em;margin-bottom:4px;font-family:${t.mono}">Название сайта</label>
            <input id="adm-site-siteTitle" type="text" placeholder="Название сайта" value="${escapeHtml(cfg.siteTitle)}"
              style="width:100%;padding:6px 8px;border-radius:6px;border:1px solid ${t.border};background:${t.inpBg};color:${t.fg};font-size:11px;outline:none;font-family:${t.mono};box-sizing:border-box">
          </div>
          <div>
            <label for="adm-site-siteDescription" style="display:block;font-size:9px;color:${t.fgSub};text-transform:uppercase;letter-spacing:0.07em;margin-bottom:4px;font-family:${t.mono}">Описание сайта</label>
            <textarea id="adm-site-siteDescription" placeholder="Описание сайта" rows="4"
              style="width:100%;padding:6px 8px;border-radius:6px;border:1px solid ${t.border};background:${t.inpBg};color:${t.fg};font-size:11px;outline:none;font-family:${t.mono};box-sizing:border-box;resize:vertical">${escapeHtml(cfg.siteDescription)}</textarea>
          </div>
        </div>
      </div>
    `;

    const reloadBtn  = container.querySelector('#adm-site-reload');
    const saveBtn    = container.querySelector('#adm-site-save');
    const titleInput = container.querySelector('#adm-site-siteTitle');
    const descInput  = container.querySelector('#adm-site-siteDescription');

    if (reloadBtn) reloadBtn.addEventListener('click', load);
    if (saveBtn)   saveBtn.addEventListener('click', save);

    const updateValue = () => {
      cfg.siteTitle       = titleInput?.value || '';
      cfg.siteDescription = descInput?.value  || '';
      dirty = true;
      renderSaveBtn();
    };

    titleInput?.addEventListener('input', updateValue);
    titleInput?.addEventListener('change', updateValue);
    descInput?.addEventListener('input', updateValue);
    descInput?.addEventListener('change', updateValue);

    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        e.stopPropagation();
        dirty ? save() : toast.info('Нет изменений для сохранения');
      }
    };
    if (container._keydownHandler) container.removeEventListener('keydown', container._keydownHandler);
    container._keydownHandler = handleKeyDown;
    container.addEventListener('keydown', handleKeyDown);
    container.setAttribute('tabindex', '-1');
  }

  load();
}