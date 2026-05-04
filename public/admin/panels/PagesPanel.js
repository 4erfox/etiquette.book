/**
 * admin/panels/PagesPanel.js
 * Управление страницами через .md файлы
 * Редактор: чистый textarea + кастомные SVG-кнопки (без EasyMDE, без CDN)
 */
import { bridge } from '../bridge.js';
import { toast } from '../toast.js';
import { getT } from '../theme.js';

function esc(s) {
    return String(s ?? '').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ─── SVG иконки ───────────────────────────────────────────────────────────────
const IC = {
    file:   `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
    folder: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`,
    reload: `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>`,
    back:   `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>`,
    save:   `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>`,
    expand: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>`,
    shrink: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>`,
    delete: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>`,
};

// ─── Кнопки форматирования ────────────────────────────────────────────────────
const TOOLBAR_BTNS = [
    { label: 'B',   title: 'Жирный',        wrap: ['**','**'] },
    { label: 'I',   title: 'Курсив',         wrap: ['*','*'] },
    { label: 'H2',  title: 'Заголовок 2',    line: '## ' },
    { label: 'H3',  title: 'Заголовок 3',    line: '### ' },
    { sep: true },
    { label: '❝',   title: 'Цитата',         line: '> ' },
    { label: '•',   title: 'Список',         line: '- ' },
    { label: '1.',  title: 'Нумерованный',   line: '1. ' },
    { sep: true },
    { label: '🔗',  title: 'Ссылка',         tpl: '[текст](url)' },
    { label: '⎯',  title: 'Разделитель',    tpl: '\n---\n' },
];

function applyFormat(ta, btn) {
    const start = ta.selectionStart;
    const end   = ta.selectionEnd;
    const sel   = ta.value.slice(start, end);
    let newVal, newCursor;

    if (btn.wrap) {
        const [l, r] = btn.wrap;
        newVal = ta.value.slice(0, start) + l + (sel || 'текст') + r + ta.value.slice(end);
        newCursor = start + l.length + (sel || 'текст').length + r.length;
    } else if (btn.line) {
        const lineStart = ta.value.lastIndexOf('\n', start - 1) + 1;
        newVal = ta.value.slice(0, lineStart) + btn.line + ta.value.slice(lineStart);
        newCursor = start + btn.line.length;
    } else if (btn.tpl) {
        newVal = ta.value.slice(0, start) + btn.tpl + ta.value.slice(end);
        newCursor = start + btn.tpl.length;
    }

    ta.value = newVal;
    ta.focus();
    ta.setSelectionRange(newCursor, newCursor);
    ta.dispatchEvent(new Event('input'));
}

// ─── MD Редактор ─────────────────────────────────────────────────────────────
function openMdEditor(panelRoot, slug, title, onClose) {
    const prevPosition = panelRoot.style.position;
    panelRoot.style.position = 'relative';

    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:absolute;inset:0;z-index:50;background:#1a1a1a;display:flex;flex-direction:column;';

    // Топбар
    const topbar = document.createElement('div');
    topbar.style.cssText = 'display:flex;align-items:center;gap:8px;padding:8px 12px;border-bottom:1px solid #333;background:#222;flex-shrink:0;';
    topbar.innerHTML = `
        <button id="me-back" style="display:flex;align-items:center;gap:5px;padding:5px 11px;border-radius:6px;border:1px solid #555;background:#e0e0e0;color:#000;cursor:pointer;font-size:11px;font-weight:600;">
            ${IC.back} Назад
        </button>
        <span style="flex:1;font-size:11px;font-weight:600;color:#888;font-family:monospace;letter-spacing:0.07em;text-transform:uppercase;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
            ${esc(title)}
        </span>
        <span id="me-dirty" style="display:none;font-size:10px;color:#ff9800;white-space:nowrap;">● не сохранено</span>
        <button id="me-save" style="display:flex;align-items:center;gap:5px;padding:5px 14px;border-radius:6px;border:1px solid #555;background:#444;color:#fff;cursor:pointer;font-size:11px;font-weight:600;">
            ${IC.save} Сохранить
        </button>
    `;

    // Тулбар форматирования
    const toolbar = document.createElement('div');
    toolbar.style.cssText = 'display:flex;align-items:center;gap:2px;padding:5px 8px;background:#f0f0f0;border-bottom:1px solid #ccc;flex-shrink:0;flex-wrap:wrap;';

    TOOLBAR_BTNS.forEach(btn => {
        if (btn.sep) {
            const sep = document.createElement('div');
            sep.style.cssText = 'width:1px;height:18px;background:#ccc;margin:0 4px;';
            toolbar.appendChild(sep);
            return;
        }
        const b = document.createElement('button');
        b.title = btn.title;
        b.textContent = btn.label;
        b.style.cssText = 'padding:3px 8px;border-radius:4px;border:1px solid transparent;background:transparent;color:#222;cursor:pointer;font-size:12px;font-weight:600;line-height:1.4;min-width:28px;';
        b.onmouseenter = () => b.style.background = '#ddd';
        b.onmouseleave = () => b.style.background = 'transparent';
        b.onmousedown = (e) => {
            e.preventDefault();
            applyFormat(ta, btn);
        };
        toolbar.appendChild(b);
    });

    // Кнопка fullscreen в тулбаре
    const sep2 = document.createElement('div');
    sep2.style.cssText = 'flex:1;';
    toolbar.appendChild(sep2);

    const fsBtn = document.createElement('button');
    fsBtn.title = 'На весь экран';
    fsBtn.innerHTML = IC.expand;
    fsBtn.style.cssText = 'padding:3px 6px;border-radius:4px;border:1px solid transparent;background:transparent;color:#444;cursor:pointer;display:flex;align-items:center;';
    let isFullscreen = false;
    fsBtn.onclick = () => {
        isFullscreen = !isFullscreen;
        if (isFullscreen) {
            overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;background:#1a1a1a;display:flex;flex-direction:column;';
            fsBtn.innerHTML = IC.shrink;
            fsBtn.title = 'Выйти из полного экрана';
        } else {
            overlay.style.cssText = 'position:absolute;inset:0;z-index:50;background:#1a1a1a;display:flex;flex-direction:column;';
            fsBtn.innerHTML = IC.expand;
            fsBtn.title = 'На весь экран';
        }
    };
    toolbar.appendChild(fsBtn);

    // Textarea
    const editorWrap = document.createElement('div');
    editorWrap.style.cssText = 'flex:1;display:flex;min-height:0;';

    const ta = document.createElement('textarea');
    ta.id = 'me-textarea';
    ta.style.cssText = `
        flex: 1;
        width: 100%;
        padding: 14px 16px;
        background: #1e1e1e;
        color: #d4d4d4;
        border: none;
        outline: none;
        font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
        font-size: 13px;
        line-height: 1.6;
        resize: none;
        tab-size: 2;
        overflow-y: auto;
    `;

    // Статусбар
    const statusbar = document.createElement('div');
    statusbar.style.cssText = 'padding:3px 12px;background:#f0f0f0;border-top:1px solid #ccc;font-size:10px;color:#666;flex-shrink:0;font-family:monospace;';
    statusbar.textContent = 'слов: 0  строк: 0';

    function updateStatus() {
        const txt = ta.value;
        const words = txt.trim() ? txt.trim().split(/\s+/).length : 0;
        const lines = txt.split('\n').length;
        statusbar.textContent = `слов: ${words}  строк: ${lines}`;
    }

    editorWrap.appendChild(ta);
    overlay.appendChild(topbar);
    overlay.appendChild(toolbar);
    overlay.appendChild(editorWrap);
    overlay.appendChild(statusbar);
    panelRoot.appendChild(overlay);

    const dirtyEl = overlay.querySelector('#me-dirty');
    const saveBtn = overlay.querySelector('#me-save');
    let dirty = false;

    // Загружаем контент
    bridge.readDoc(slug).then(({ content }) => {
        ta.value = content;
        updateStatus();
        ta.focus();
    }).catch(e => {
        toast.error('Ошибка загрузки: ' + e.message);
        overlay.remove();
        panelRoot.style.position = prevPosition;
    });

    ta.oninput = () => {
        if (!dirty) { dirty = true; dirtyEl.style.display = 'inline'; }
        updateStatus();
    };

    ta.onkeydown = (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const s = ta.selectionStart;
            ta.value = ta.value.slice(0, s) + '  ' + ta.value.slice(ta.selectionEnd);
            ta.setSelectionRange(s + 2, s + 2);
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            doSave();
        }
    };

    async function doSave() {
        try {
            await bridge.writeDoc(slug, ta.value);
            dirty = false;
            dirtyEl.style.display = 'none';
            toast.success('Сохранено');
        } catch (e) { toast.error(e.message); }
    }

    saveBtn.onclick = doSave;

    overlay.querySelector('#me-back').onclick = () => {
        if (dirty && !confirm('Выйти без сохранения?')) return;
        overlay.remove();
        panelRoot.style.position = prevPosition;
        if (onClose) onClose();
    };
}

// ─── Главная панель ───────────────────────────────────────────────────────────
export function renderPagesPanel(container) {
    let nav = [];

    async function load() {
        container.innerHTML = `<div style="padding:20px;color:#888;font-family:monospace;">Загрузка...</div>`;
        try {
            const res = await bridge.listNav();
            nav = res.nav;
            render();
        } catch (e) {
            container.innerHTML = `<div style="padding:20px;color:red;">${e.message}</div>`;
        }
    }

    async function deletePage(slug, title) {
        if (!confirm(`Удалить страницу «${title}»? Это действие нельзя отменить.`)) return;
        try {
            await bridge.deleteDoc(slug);
            toast.success(`Страница «${title}» удалена`);
            load(); // перезагружаем список
        } catch (e) {
            toast.error('Ошибка удаления: ' + e.message);
        }
    }

    function render() {
        const t = getT();
        container.style.position = 'relative';

        container.innerHTML = `
            <div style="display:flex;flex-direction:column;height:100%;">
                <div style="display:flex;align-items:center;padding:10px 12px;border-bottom:1px solid ${t.border};background:${t.surface};flex-shrink:0;">
                    <span style="font-size:11px;color:${t.fgSub};font-family:monospace;letter-spacing:0.08em;font-weight:600;text-transform:uppercase;">📄 Редактор страниц</span>
                    <div style="flex:1;"></div>
                    <button id="adm-reload" style="padding:5px 10px;border-radius:6px;border:1px solid ${t.border};background:transparent;color:${t.fgMuted};cursor:pointer;font-size:11px;">${IC.reload} Обновить</button>
                </div>
                <div id="adm-sections" style="flex:1;overflow-y:auto;padding:8px;"></div>
            </div>
        `;

        const sectEl = container.querySelector('#adm-sections');

        nav.forEach(s => {
            const wrap = document.createElement('div');
            wrap.style.cssText = `margin-bottom:8px;border-radius:10px;border:1px solid ${t.border};overflow:hidden;background:${t.surface};`;

            const hdr = document.createElement('div');
            hdr.style.cssText = `display:flex;align-items:center;gap:10px;padding:10px 12px;`;
            hdr.innerHTML = `
                <span style="color:${t.fgMuted};">${IC.folder}</span>
                <span style="flex:1;font-size:13px;font-weight:600;color:${t.fg};">${esc(s.title)}</span>
            `;

            const body = document.createElement('div');
            body.style.borderTop = `1px solid ${t.border}`;

            (s.pages || []).forEach(p => {
                const slug = new URLSearchParams(p.href.split('?')[1] || '').get('slug')
             || p.href.replace(/^.*\//, '').replace(/\.html$/, '');
                const row = document.createElement('div');
                row.style.cssText = `display:flex;align-items:center;gap:10px;padding:8px 12px;border-bottom:1px solid ${t.border};`;
                row.innerHTML = `
                    <span style="color:${t.fgSub};">${IC.file}</span>
                    <div style="flex:1;font-size:12px;color:${t.fg};">${esc(p.title)}</div>
                    <button class="edit-btn" data-slug="${slug}" data-title="${esc(p.title)}" style="padding:5px 12px;border-radius:6px;border:1px solid #555;background:#444;color:#fff;cursor:pointer;font-size:10px;font-weight:600;">Правка</button>
                    <button class="delete-btn" data-slug="${slug}" data-title="${esc(p.title)}" style="padding:5px 10px;border-radius:6px;border:1px solid #ef4444;background:rgba(239,68,68,0.1);color:#ef4444;cursor:pointer;font-size:10px;font-weight:600;">${IC.delete} Удалить</button>
                `;
                row.querySelector('.edit-btn').onclick = () => openMdEditor(container, slug, p.title, load);
                row.querySelector('.delete-btn').onclick = () => deletePage(slug, p.title);
                body.appendChild(row);
            });

            wrap.appendChild(hdr);
            wrap.appendChild(body);
            sectEl.appendChild(wrap);
        });

        container.querySelector('#adm-reload').onclick = load;
    }

    load();
}