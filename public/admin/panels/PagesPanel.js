/**
 * admin/panels/PagesPanel.js
 * Управление страницами через .md файлы + EasyMDE
 */
import { bridge } from '../bridge.js';
import { toast } from '../toast.js';
import { getT } from '../theme.js';

const IC = { 
    file: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
    folder: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`,
    edit: `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
    link: `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
    reload: `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>`,
    chevD: `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>`,
    back: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>`,
    save: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>`,
    grip: `<svg width="10" height="14" viewBox="0 0 10 14" fill="currentColor"><circle cx="3" cy="3" r="1.2"/><circle cx="7" cy="3" r="1.2"/><circle cx="3" cy="7" r="1.2"/><circle cx="7" cy="7" r="1.2"/><circle cx="3" cy="11" r="1.2"/><circle cx="7" cy="11" r="1.2"/></svg>`,
};

function esc(s) { return String(s ?? '').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
let dragState = null;

// 1. Загрузка ресурсов и внедрение CSS
function loadEasyMDE() {
    if (window.EasyMDE) return Promise.resolve();
    return new Promise(resolve => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/easymde/dist/easymde.min.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/easymde/dist/easymde.min.js';
        script.onload = resolve;
        document.head.appendChild(script);
        
        const t = getT();
        const style = document.createElement('style');
        style.innerHTML = `
            .EasyMDEContainer { flex: 1; display: flex; flex-direction: column; min-height: 0; }
            .EasyMDEContainer .CodeMirror { 
                flex: 1; background: ${t.bg}; color: ${t.fg}; 
                border-color: ${t.border}; font-family: ui-monospace, monospace; 
                font-size: 12px; line-height: 1.6; height: auto !important; min-height: 0;
            }
            .EasyMDEContainer .CodeMirror-scroll { min-height: 0; }
            .EasyMDEContainer .editor-toolbar { 
                background: ${t.surface}; border-color: ${t.border}; 
                opacity: 1; border-radius: 0; flex-shrink: 0; 
            }
            .EasyMDEContainer .editor-toolbar button { color: ${t.fgMuted} !important; }
            .EasyMDEContainer .editor-toolbar button:hover { background: ${t.surfaceHov}; }
            .EasyMDEContainer .editor-statusbar { background: ${t.surface}; color: ${t.fgSub}; border-color: ${t.border}; padding: 4px 10px; }
            .CodeMirror-cursor { border-left: 2px solid ${t.fg}; }
        `;
        document.head.appendChild(style);
    });
}

// 2. MD РЕДАКТОР
async function openMdEditor(container, slug, title, onClose) {
    const t = getT();
    await loadEasyMDE();

    const overlay = document.createElement('div');
    overlay.style.cssText = `position:absolute;inset:0;z-index:30;background:${t.bg};display:flex;flex-direction:column;overflow:hidden;`;
    
    overlay.innerHTML = `
        <div style="display:flex;align-items:center;gap:8px;padding:8px 12px;border-bottom:1px solid ${t.border};background:${t.surface};flex-shrink:0">
            <button id="me-back" style="display:flex;align-items:center;gap:5px;padding:5px 9px;border-radius:6px;border:1px solid ${t.border};background:transparent;color:${t.fgMuted};cursor:pointer;font-size:11px;font-family:${t.mono}">${IC.back} Назад</button>
            <span style="flex:1;font-size:11px;font-weight:600;color:${t.fg};font-family:${t.mono};overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(title)}</span>
            <span id="me-dirty" style="display:none;font-size:10px;color:${t.warning};font-family:${t.mono}">● не сохранено</span>
            <button id="me-save" style="display:flex;align-items:center;gap:5px;padding:5px 12px;border-radius:6px;border:1px solid ${t.borderStrong};background:${t.surfaceHov};color:${t.fg};cursor:pointer;font-size:11px;font-family:${t.mono};font-weight:600">${IC.save} Сохранить</button>
        </div>
        <div style="flex:1;overflow:hidden;display:flex;flex-direction:column;" id="mde-anchor">
            <textarea id="me-editor"></textarea>
        </div>
    `;

    container.appendChild(overlay);

    const dirtyEl = overlay.querySelector('#me-dirty');
    const saveBtn = overlay.querySelector('#me-save');
    let easyMDE = null;
    let dirty = false;

    try {
        const { content } = await bridge.readDoc(slug);
        
        easyMDE = new EasyMDE({
            element: overlay.querySelector('#me-editor'),
            initialValue: content, // Устанавливаем сразу, чтобы не ломать Ctrl+Z
            spellChecker: false,
            nativeSpellcheck: false,
            status: ["words", "lines"],
            toolbar: [
                "bold", "italic", "heading", "|", "quote", "unordered-list", "ordered-list", "|", 
                "link", "image", "table", "|", "preview", "side-by-side", "fullscreen", "|", "guide"
            ],
            shortcuts: { "save": "Ctrl-S" }
        });

        // Исправление прокрутки и размера
        const cm = easyMDE.codemirror;
        cm.getWrapperElement().style.flex = "1";
        cm.refresh();

        cm.on("change", () => {
            if (!dirty) {
                dirty = true;
                dirtyEl.style.display = 'inline';
            }
        });

    } catch (e) {
        toast.error('Ошибка загрузки: ' + e.message);
        overlay.remove();
        return;
    }

    async function save() {
        try {
            await bridge.writeDoc(slug, easyMDE.value());
            dirty = false;
            dirtyEl.style.display = 'none';
            saveBtn.innerHTML = '✓ Сохранено';
            saveBtn.style.color = t.success;
            setTimeout(() => {
                saveBtn.innerHTML = IC.save + ' Сохранить';
                saveBtn.style.color = t.fg;
            }, 2000);
            toast.success('Сохранено: docs/' + slug + '.md');
        } catch(e) {
            toast.error('Ошибка: ' + e.message);
        }
    }

    saveBtn.addEventListener('click', save);
    
    overlay.addEventListener('keydown', e => {
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            save();
        }
    });

    overlay.querySelector('#me-back').addEventListener('click', () => {
        if (dirty && !confirm('Есть несохранённые изменения. Выйти?')) return;
        if (easyMDE) easyMDE.toTextArea();
        overlay.remove();
    });
}

// 3. ГЛАВНАЯ ПАНЕЛЬ
export function renderPagesPanel(container) {
    let nav = [], expanded = {};

    async function load() {
        renderLoading();
        try {
            const res = await bridge.listNav();
            nav = res.nav;
            nav.forEach(s => { if (expanded[s.id] === undefined) expanded[s.id] = true; });
            render();
        } catch(e) { renderError(e.message); }
    }

    function renderLoading() {
        const t = getT();
        container.innerHTML = `<div style="flex:1;display:flex;align-items:center;justify-content:center;gap:8px;color:${t.fgMuted}"><svg class="adm-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg><span style="font-size:12px;font-family:${t.mono}">Загрузка...</span></div>`;
    }

    function renderError(msg) {
        const t = getT();
        container.innerHTML = `<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:24px;color:${t.danger};text-align:center"><div style="font-size:11px;font-family:${t.mono}">${esc(msg)}</div><button id="adm-err-reload" style="padding:6px 14px;border-radius:6px;border:1px solid ${t.border};background:${t.surfaceHov};color:${t.fg};cursor:pointer;font-size:11px;font-family:${t.mono}">Обновить</button></div>`;
        container.querySelector('#adm-err-reload')?.addEventListener('click', load);
    }

    function render() {
        const t = getT();
        const total = nav.reduce((a, s) => a + (s.pages?.length ?? 0), 0);
        container.innerHTML = `
            <div style="display:flex;align-items:center;gap:8px;padding:7px 10px;border-bottom:1px solid ${t.border};background:${t.surface};flex-shrink:0">
                <span style="font-size:10px;color:${t.fgSub};font-family:${t.mono}">${total} страниц · EasyMDE</span>
                <div style="flex:1"></div>
                <button id="adm-reload" style="display:flex;align-items:center;gap:4px;padding:6px 10px;border-radius:6px;border:1px solid ${t.border};background:transparent;color:${t.fgMuted};cursor:pointer;font-size:11px;font-family:${t.mono}">${IC.reload} Обновить</button>
            </div>
            <div id="adm-sections" style="flex:1;overflow-y:auto;padding:6px;position:relative" class="adm-scroll"></div>
        `;
        container.querySelector('#adm-reload').addEventListener('click', load);
        renderSections();
    }

    function renderSections() {
        const sectEl = container.querySelector('#adm-sections');
        if (!sectEl) return;
        sectEl.innerHTML = '';
        nav.forEach(s => {
            const t = getT();
            const isOpen = expanded[s.id] !== false;
            const wrap = document.createElement('div');
            wrap.style.cssText = `margin-bottom:4px;border-radius:8px;border:1px solid ${t.border};overflow:hidden;`;
            
            const hdr = document.createElement('div');
            hdr.style.cssText = `display:flex;align-items:center;gap:8px;padding:8px 10px;background:${t.surface};cursor:pointer;user-select:none;`;
            hdr.innerHTML = `
                <span style="color:${t.fgSub};flex-shrink:0;transition:transform 0.2s;transform:rotate(${isOpen ? 0 : -90}deg)">${IC.chevD}</span>
                <span style="color:${t.fgMuted};flex-shrink:0">${IC.folder}</span>
                <span style="flex:1;font-size:12px;font-weight:600;color:${t.fg};font-family:${t.mono}">${esc(s.title)}</span>
            `;

            const body = document.createElement('div');
            body.style.cssText = `display:${isOpen ? 'block' : 'none'};border-top:1px solid ${t.border};`;

            (s.pages || []).forEach(p => {
                const row = document.createElement('div');
                const slug = p.href.replace(/^.*\//, '').replace(/\.html$/, '');
                row.style.cssText = `display:flex;align-items:center;gap:8px;padding:7px 10px 7px 14px;border-bottom:1px solid ${t.border};background:${t.bg};`;
                row.innerHTML = `
                    <span style="color:${t.fgSub};flex-shrink:0">${IC.file}</span>
                    <div style="flex:1;min-width:0;font-size:11px;color:${t.fg};font-family:${t.mono}">${esc(p.title)}</div>
                    <button class="adm-edit-btn" style="padding:4px 8px;border-radius:5px;border:1px solid ${t.borderStrong};background:${t.surfaceHov};color:${t.fg};cursor:pointer;font-size:10px;font-family:${t.mono}">${IC.edit} Редактировать</button>
                `;
                row.querySelector('.adm-edit-btn').addEventListener('click', () => openMdEditor(container.querySelector('#adm-sections'), slug, p.title));
                body.appendChild(row);
            });

            hdr.addEventListener('click', () => {
                const newState = !expanded[s.id];
                expanded[s.id] = newState;
                hdr.querySelector('span:first-child').style.transform = newState ? 'rotate(0deg)' : 'rotate(-90deg)';
                body.style.display = newState ? 'block' : 'none';
            });

            wrap.appendChild(hdr);
            wrap.appendChild(body);
            sectEl.appendChild(wrap);
        });
    }

    load();
}