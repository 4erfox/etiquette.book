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
    chevR: `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>`,
    back: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>`,
    save: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>`,
    grip: `<svg width="10" height="14" viewBox="0 0 10 14" fill="currentColor"><circle cx="3" cy="3" r="1.2"/><circle cx="7" cy="3" r="1.2"/><circle cx="3" cy="7" r="1.2"/><circle cx="7" cy="7" r="1.2"/><circle cx="3" cy="11" r="1.2"/><circle cx="7" cy="11" r="1.2"/></svg>`,
    plus: `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
};

function esc(s) { return String(s ?? '').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

let dragState = null;

// Загрузка ресурсов EasyMDE
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
            /* ── Контейнер редактора ── */
            .EasyMDEContainer {
                flex: 1;
                display: flex;
                flex-direction: column;
                min-height: 0;
                height: 100%;
            }

            /* ── Тулбар: Сделали светло-серым, чтобы был виден ── */
            .EasyMDEContainer .editor-toolbar {
                position: sticky;
                top: 0;
                z-index: 10;
                background: #f5f5f5 !important; 
                border-color: #cccccc !important;
                border-radius: 0;
                opacity: 1 !important;
                flex-shrink: 0;
            }
            .EasyMDEContainer .editor-toolbar button {
                color: #333333 !important;
            }
            .EasyMDEContainer .editor-toolbar button:hover {
                background: #e0e0e0 !important;
            }
            .EasyMDEContainer .editor-toolbar i.separator {
                border-color: #bbbbbb !important;
            }

            /* ── CodeMirror — тёмно-серый фон, светлый текст ── */
            .EasyMDEContainer .CodeMirror {
                flex: 1;
                background: #1e1e1e;
                color: #d4d4d4;
                border-color: ${t.border};
                font-family: ui-monospace, 'Cascadia Code', monospace;
                font-size: 13px;
                line-height: 1.7;
                height: 100% !important;
                min-height: 0 !important;
            }
            /* ... остальные стили CM ... */
            .EasyMDEContainer .CodeMirror-scroll { height: 100%; padding-bottom: 0 !important; margin-bottom: 0 !important; min-height: 0 !important; }
            .EasyMDEContainer .CodeMirror-cursor { border-left: 2px solid #d4d4d4; }
            .EasyMDEContainer .cm-header { color: #ce9178; font-weight: 700; }
            .EasyMDEContainer .cm-strong { color: #dcdcaa; font-weight: 700; }
            .EasyMDEContainer .cm-link { color: #4ec9b0; }

            .EasyMDEContainer .editor-statusbar {
                background: #f5f5f5;
                color: #666;
                border-top: 1px solid #ccc;
                padding: 4px 10px;
                flex-shrink: 0;
            }
            .EasyMDEContainer .CodeMirror-selected { background: #264f78 !important; }
        `;
        document.head.appendChild(style);
    });
}

async function openMdEditor(container, slug, title, onClose) {
    const t = getT();
    await loadEasyMDE();

    const overlay = document.createElement('div');
    overlay.style.cssText = `position:absolute;inset:0;z-index:30;background:#1e1e1e;display:flex;flex-direction:column;overflow:hidden;`;
    
    // ПРЯМОЕ УПРАВЛЕНИЕ ЦВЕТАМИ КНОПОК ШАПКИ
    overlay.innerHTML = `
        <div style="display:flex;align-items:center;gap:8px;padding:8px 12px;border-bottom:1px solid ${t.border};background:${t.surface};flex-shrink:0">
            <button id="me-back" style="display:flex;align-items:center;gap:5px;padding:6px 10px;border-radius:6px;border:1px solid #ccc;background:#f0f0f0;color:#333;cursor:pointer;font-size:11px;font-family:${t.mono}">
                ${IC.back} Назад
            </button>
            <span style="flex:1;font-size:11px;font-weight:600;color:${t.fg};font-family:${t.mono};overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(title)}</span>
            <span id="me-dirty" style="display:none;font-size:10px;color:${t.warning};font-family:${t.mono}">● не сохранено</span>
            
            <button id="me-save" style="display:flex;align-items:center;gap:5px;padding:6px 14px;border-radius:6px;border:1px solid #333;background:#444444;color:#ffffff;cursor:pointer;font-size:11px;font-family:${t.mono};font-weight:600;transition: background 0.2s;">
                ${IC.save} Сохранить
            </button>
        </div>
        <div style="flex:1;display:flex;flex-direction:column;overflow:auto;min-height:0;" id="mde-anchor">
            <textarea id="me-editor" style="display:none;"></textarea>
        </div>
    `;

    container.appendChild(overlay);

    const saveBtn = overlay.querySelector('#me-save');
    // Добавляем эффект ховера для кнопки сохранения вручную
    saveBtn.onmouseover = () => { saveBtn.style.background = '#222222'; };
    saveBtn.onmouseout = () => { saveBtn.style.background = '#444444'; };

    const dirtyEl = overlay.querySelector('#me-dirty');
    let easyMDE = null;
    let dirty = false;

    try {
        const { content } = await bridge.readDoc(slug);
        const textarea = overlay.querySelector('#me-editor');
        textarea.value = content;
        
        easyMDE = new EasyMDE({
            element: textarea,
            spellChecker: false,
            nativeSpellcheck: false,
            status: ["words", "lines"],
            toolbar: [
                "bold", "italic", "heading", "|", "quote", "unordered-list", "ordered-list", "|", 
                "link", "image", "table", "|", "preview", "fullscreen", "|", "guide"
            ],
            shortcuts: { "save": "Ctrl-S" },
            minHeight: "100%",
        });

        const anchorEl = overlay.querySelector('#mde-anchor');
        const cmWrapper = easyMDE.codemirror.getWrapperElement();
        cmWrapper.style.cssText = 'height:100%;min-height:0;flex:1;';
        
        const mdeContainer = anchorEl.querySelector('.EasyMDEContainer');
        if (mdeContainer) {
            mdeContainer.style.cssText = 'flex:1;display:flex;flex-direction:column;min-height:0;height:100%;';
        }

        easyMDE.codemirror.refresh();
        easyMDE.codemirror.on("change", () => {
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
            const originalHtml = saveBtn.innerHTML;
            saveBtn.innerHTML = '✓ Сохранено';
            saveBtn.style.background = '#2e7d32'; // Зеленоватый только при успехе
            setTimeout(() => {
                saveBtn.innerHTML = originalHtml;
                saveBtn.style.background = '#444444';
            }, 2000);
            toast.success('Сохранено');
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
        if (onClose) onClose();
    });
}

// ... остальной код renderPagesPanel остается без изменений ...
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
    // (Оставшаяся часть функций renderLoading, renderError, render, renderSections идентична оригиналу)
    function renderLoading() {
        const t = getT();
        container.innerHTML = `<div style="flex:1;display:flex;align-items:center;justify-content:center;gap:8px;color:${t.fgMuted}"><span style="font-size:12px;font-family:${t.mono}">Загрузка...</span></div>`;
    }
    function renderError(msg) {
        const t = getT();
        container.innerHTML = `<div style="padding:20px;color:${t.danger}">${msg}</div>`;
    }
    function render() {
        const t = getT();
        container.innerHTML = `
            <div style="display:flex;flex-direction:column;height:100%;">
                <div style="display:flex;align-items:center;gap:8px;padding:10px 12px;border-bottom:1px solid ${t.border};background:${t.surface};flex-shrink:0;">
                    <span style="font-size:11px;color:${t.fgSub};font-family:${t.mono}">📄 Страницы</span>
                    <div style="flex:1"></div>
                    <button id="adm-reload" style="padding:5px 10px;border-radius:6px;border:1px solid ${t.border};background:transparent;color:${t.fgMuted};cursor:pointer;font-size:11px">${IC.reload} Обновить</button>
                </div>
                <div id="adm-sections" style="flex:1;overflow-y:auto;padding:8px;" class="adm-scroll"></div>
            </div>
        `;
        container.querySelector('#adm-reload')?.addEventListener('click', load);
        renderSections();
    }
    function renderSections() {
        const sectEl = container.querySelector('#adm-sections');
        if (!sectEl) return;
        nav.forEach(s => {
            const t = getT();
            const wrap = document.createElement('div');
            wrap.style.cssText = `margin-bottom:8px;border-radius:8px;border:1px solid ${t.border};overflow:hidden;`;
            const hdr = document.createElement('div');
            hdr.style.cssText = `padding:10px;background:${t.surface};cursor:pointer;font-weight:600;font-size:13px;color:${t.fg};display:flex;align-items:center;gap:8px;`;
            hdr.innerHTML = `<span>${IC.folder}</span> ${esc(s.title)}`;
            const body = document.createElement('div');
            if(s.pages) {
                s.pages.forEach(p => {
                    const row = document.createElement('div');
                    const slug = p.href.replace(/^.*\//, '').replace(/\.html$/, '');
                    row.style.cssText = `display:flex;align-items:center;padding:8px 12px;border-top:1px solid ${t.border};background:${t.bg};`;
                    row.innerHTML = `
                        <div style="flex:1;font-size:12px;color:${t.fg}">${esc(p.title)}</div>
                        <button class="adm-edit-btn" style="padding:4px 10px;border-radius:4px;border:1px solid #333;background:#444;color:#fff;cursor:pointer;font-size:10px;">${IC.edit} Правка</button>
                    `;
                    row.querySelector('.adm-edit-btn').addEventListener('click', () => openMdEditor(sectEl, slug, p.title, load));
                    body.appendChild(row);
                });
            }
            wrap.appendChild(hdr);
            wrap.appendChild(body);
            sectEl.appendChild(wrap);
        });
    }
    load();
}