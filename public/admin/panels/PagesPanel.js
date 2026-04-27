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

            /* ── Тулбар sticky — не уезжает при скролле текста ── */
            .EasyMDEContainer .editor-toolbar {
                position: sticky;
                top: 0;
                z-index: 10;
                background: ${t.surface};
                border-color: ${t.border};
                border-radius: 0;
                opacity: 1;
                flex-shrink: 0;
            }
            .EasyMDEContainer .editor-toolbar button {
                color: ${t.fgMuted} !important;
            }
            .EasyMDEContainer .editor-toolbar button:hover {
                background: ${t.surfaceHov};
            }
            .EasyMDEContainer .editor-toolbar i.separator {
                border-color: ${t.border};
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
            .EasyMDEContainer .CodeMirror-scroll {
                height: 100%;
                padding-bottom: 0 !important;
                margin-bottom: 0 !important;
                min-height: 0 !important;
            }
            .EasyMDEContainer .CodeMirror-sizer {
                margin-bottom: 0 !important;
            }

            /* ── Курсор ── */
            .EasyMDEContainer .CodeMirror-cursor {
                border-left: 2px solid #d4d4d4;
            }

            /* ── Подсветка синтаксиса Markdown ── */
            .EasyMDEContainer .cm-header   { color: #ce9178; font-weight: 700; }
            .EasyMDEContainer .cm-strong   { color: #dcdcaa; font-weight: 700; }
            .EasyMDEContainer .cm-em       { color: #9cdcfe; font-style: italic; }
            .EasyMDEContainer .cm-link     { color: #4ec9b0; }
            .EasyMDEContainer .cm-url      { color: #569cd6; }
            .EasyMDEContainer .cm-quote    { color: #6a9955; }
            .EasyMDEContainer .cm-comment  { color: #6a9955; }

            /* ── Preview — тёмный фон ── */
            .EasyMDEContainer .editor-preview {
                background: #1e1e1e !important;
                color: #d4d4d4 !important;
                border-color: ${t.border} !important;
            }
            .EasyMDEContainer .editor-preview h1,
            .EasyMDEContainer .editor-preview h2,
            .EasyMDEContainer .editor-preview h3 {
                color: #ce9178;
                border-color: ${t.border};
            }
            .EasyMDEContainer .editor-preview a { color: #4ec9b0; }
            .EasyMDEContainer .editor-preview blockquote {
                border-left-color: ${t.border};
                color: #888;
            }
            .EasyMDEContainer .editor-preview code {
                background: #2d2d2d;
                color: #ce9178;
                border-radius: 3px;
                padding: 1px 4px;
            }

            /* ── Статусбар ── */
            .EasyMDEContainer .editor-statusbar {
                background: ${t.surface};
                color: ${t.fgSub};
                border-color: ${t.border};
                padding: 4px 10px;
                flex-shrink: 0;
            }

            /* ── Выделение текста ── */
            .EasyMDEContainer .CodeMirror-selected { background: #264f78 !important; }
            .EasyMDEContainer .CodeMirror-focused .CodeMirror-selected { background: #264f78 !important; }

            /* ── Скроллбары и спиннер ── */
            .adm-spin { animation: spin 1s linear infinite; }
            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            .adm-scroll::-webkit-scrollbar       { width: 6px; height: 6px; }
            .adm-scroll::-webkit-scrollbar-track { background: ${t.surface}; border-radius: 3px; }
            .adm-scroll::-webkit-scrollbar-thumb { background: ${t.borderStrong}; border-radius: 3px; }
        `;
        document.head.appendChild(style);
    });
}

// MD Редактор (без side-by-side)
async function openMdEditor(container, slug, title, onClose) {
    const t = getT();
    await loadEasyMDE();

    const overlay = document.createElement('div');
    overlay.style.cssText = `position:absolute;inset:0;z-index:30;background:#1e1e1e;display:flex;flex-direction:column;overflow:hidden;`;
    
    overlay.innerHTML = `
        <div style="display:flex;align-items:center;gap:8px;padding:8px 12px;border-bottom:1px solid ${t.border};background:${t.surface};flex-shrink:0">
            <button id="me-back" style="display:flex;align-items:center;gap:5px;padding:5px 9px;border-radius:6px;border:1px solid ${t.border};background:transparent;color:${t.fgMuted};cursor:pointer;font-size:11px;font-family:${t.mono}">${IC.back} Назад</button>
            <span style="flex:1;font-size:11px;font-weight:600;color:${t.fg};font-family:${t.mono};overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(title)}</span>
            <span id="me-dirty" style="display:none;font-size:10px;color:${t.warning};font-family:${t.mono}">● не сохранено</span>
            <button id="me-save" style="display:flex;align-items:center;gap:5px;padding:5px 12px;border-radius:6px;border:1px solid ${t.borderStrong};background:${t.surfaceHov};color:${t.fg};cursor:pointer;font-size:11px;font-family:${t.mono};font-weight:600">${IC.save} Сохранить</button>
        </div>
        <div style="flex:1;display:flex;flex-direction:column;overflow:auto;min-height:0;" id="mde-anchor">
            <textarea id="me-editor" style="display:none;"></textarea>
        </div>
    `;

    container.appendChild(overlay);

    const dirtyEl = overlay.querySelector('#me-dirty');
    const saveBtn = overlay.querySelector('#me-save');
    let easyMDE = null;
    let dirty = false;

    try {
        const { content } = await bridge.readDoc(slug);
        
        const textarea = overlay.querySelector('#me-editor');
        textarea.value = content;
        textarea.style.display = '';
        
        // Убрали "side-by-side" из тулбара
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

        // Убираем авто-высоту CodeMirror и даём ей заполнить контейнер
        const anchorEl = overlay.querySelector('#mde-anchor');
        const cmWrapper = easyMDE.codemirror.getWrapperElement();
        cmWrapper.style.cssText = 'height:100%;min-height:0;flex:1;';
        
        // EasyMDEContainer должен быть flex-колонкой
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
            saveBtn.style.color = t.success;
            setTimeout(() => {
                saveBtn.innerHTML = originalHtml;
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
        if (onClose) onClose();
    });
}

// Главная панель
export function renderPagesPanel(container) {
    let nav = [], expanded = {};

    async function load() {
        renderLoading();
        try {
            const res = await bridge.listNav();
            nav = res.nav;
            nav.forEach(s => { 
                if (expanded[s.id] === undefined) expanded[s.id] = true; 
            });
            render();
        } catch(e) { renderError(e.message); }
    }

    function renderLoading() {
        const t = getT();
        container.innerHTML = `
            <div style="flex:1;display:flex;align-items:center;justify-content:center;gap:8px;color:${t.fgMuted}">
                <svg class="adm-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="2" x2="12" y2="6"/>
                    <line x1="12" y1="18" x2="12" y2="22"/>
                    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
                    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
                    <line x1="2" y1="12" x2="6" y2="12"/>
                    <line x1="18" y1="12" x2="22" y2="12"/>
                    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/>
                    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
                </svg>
                <span style="font-size:12px;font-family:${t.mono}">Загрузка страниц...</span>
            </div>
        `;
    }

    function renderError(msg) {
        const t = getT();
        container.innerHTML = `
            <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:32px;color:${t.danger};text-align:center">
                <div style="font-size:12px;font-family:${t.mono};max-width:300px">⚠️ ${esc(msg)}</div>
                <button id="adm-err-reload" style="padding:8px 16px;border-radius:8px;border:1px solid ${t.border};background:${t.surfaceHov};color:${t.fg};cursor:pointer;font-size:12px;font-family:${t.mono}">⟳ Повторить</button>
            </div>
        `;
        container.querySelector('#adm-err-reload')?.addEventListener('click', load);
    }

    function render() {
        const t = getT();
        const total = nav.reduce((a, s) => a + (s.pages?.length ?? 0), 0);
        
        container.innerHTML = `
            <div style="display:flex;flex-direction:column;height:100%;">
                <div style="display:flex;align-items:center;gap:8px;padding:10px 12px;border-bottom:1px solid ${t.border};background:${t.surface};flex-shrink:0;">
                    <span style="font-size:11px;color:${t.fgSub};font-family:${t.mono}">📄 ${total} страниц · EasyMDE</span>
                    <div style="flex:1"></div>
                    <button id="adm-reload" style="display:flex;align-items:center;gap:5px;padding:6px 12px;border-radius:6px;border:1px solid ${t.border};background:transparent;color:${t.fgMuted};cursor:pointer;font-size:11px;font-family:${t.mono};transition:all 0.2s" onmouseover="this.style.background='${t.surfaceHov}'" onmouseout="this.style.background='transparent'">${IC.reload} Обновить</button>
                </div>
                <div id="adm-sections" style="flex:1;overflow-y:auto;overflow-x:hidden;padding:8px;position:relative;" class="adm-scroll"></div>
            </div>
        `;
        
        container.querySelector('#adm-reload')?.addEventListener('click', load);
        renderSections();
    }

    function renderSections() {
        const sectEl = container.querySelector('#adm-sections');
        if (!sectEl) return;
        sectEl.innerHTML = '';
        
        nav.forEach(s => {
            const t = getT();
            const isOpen = expanded[s.id] !== false;
            const hasPages = s.pages && s.pages.length > 0;
            
            const wrap = document.createElement('div');
            wrap.style.cssText = `margin-bottom:8px;border-radius:10px;border:1px solid ${t.border};overflow:hidden;transition:all 0.2s;`;
            
            const hdr = document.createElement('div');
            hdr.style.cssText = `display:flex;align-items:center;gap:10px;padding:10px 12px;background:${t.surface};cursor:pointer;user-select:none;transition:background 0.2s;`;
            hdr.onmouseover = () => { hdr.style.background = t.surfaceHov; };
            hdr.onmouseout = () => { hdr.style.background = t.surface; };
            
            hdr.innerHTML = `
                <span style="color:${t.fgMuted};flex-shrink:0;display:flex;align-items:center;transition:transform 0.2s;transform:rotate(${isOpen ? 0 : -90}deg)">${IC.chevD}</span>
                <span style="color:${t.fgMuted};flex-shrink:0;display:flex;align-items:center">${IC.folder}</span>
                <span style="flex:1;font-size:13px;font-weight:600;color:${t.fg};font-family:${t.mono}">${esc(s.title)}</span>
                <span style="font-size:10px;color:${t.fgSub};font-family:${t.mono}">${hasPages ? s.pages.length : 0}</span>
            `;

            const body = document.createElement('div');
            body.style.cssText = `display:${isOpen ? 'block' : 'none'};border-top:1px solid ${t.border};max-height:500px;overflow-y:auto;`;
            
            if (hasPages) {
                s.pages.forEach(p => {
                    const row = document.createElement('div');
                    const slug = p.href.replace(/^.*\//, '').replace(/\.html$/, '');
                    row.style.cssText = `display:flex;align-items:center;gap:10px;padding:8px 12px 8px 20px;border-bottom:1px solid ${t.borderLight || t.border};background:${t.bg};transition:background 0.2s;`;
                    row.onmouseover = () => { row.style.background = t.surface; };
                    row.onmouseout = () => { row.style.background = t.bg; };
                    
                    row.innerHTML = `
                        <span style="color:${t.fgSub};flex-shrink:0;opacity:0.7">${IC.file}</span>
                        <div style="flex:1;min-width:0;">
                            <div style="font-size:12px;color:${t.fg};font-family:${t.mono};font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(p.title)}</div>
                            <div style="font-size:9px;color:${t.fgSub};font-family:${t.mono};margin-top:2px;">${slug}</div>
                        </div>
                        <button class="adm-edit-btn" style="display:flex;align-items:center;gap:5px;padding:5px 12px;border-radius:6px;border:1px solid ${t.borderStrong};background:${t.surfaceHov};color:${t.fg};cursor:pointer;font-size:10px;font-family:${t.mono};font-weight:500;transition:all 0.2s" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">${IC.edit} Редактировать</button>
                    `;
                    row.querySelector('.adm-edit-btn').addEventListener('click', (e) => {
                        e.stopPropagation();
                        openMdEditor(sectEl, slug, p.title, load);
                    });
                    body.appendChild(row);
                });
            } else {
                const emptyRow = document.createElement('div');
                emptyRow.style.cssText = `padding:16px;text-align:center;font-size:11px;color:${t.fgSub};font-family:${t.mono};background:${t.bg};`;
                emptyRow.innerText = 'Нет страниц в этом разделе';
                body.appendChild(emptyRow);
            }

            hdr.addEventListener('click', () => {
                const newState = !expanded[s.id];
                expanded[s.id] = newState;
                const chevSpan = hdr.querySelector('span:first-child');
                chevSpan.style.transform = newState ? 'rotate(0deg)' : 'rotate(-90deg)';
                body.style.display = newState ? 'block' : 'none';
            });

            wrap.appendChild(hdr);
            wrap.appendChild(body);
            sectEl.appendChild(wrap);
        });
        
        if (sectEl) sectEl.scrollTop = 0;
    }

    load();
}