/**
 * admin/panels/PagesPanel.js
 * Управление страницами через .md файлы + EasyMDE (Всегда темная тема)
 */
import { bridge } from '../bridge.js';
import { toast } from '../toast.js';

// Цветовая схема "Always Dark"
const DT = {
    bg: '#111111',
    surface: '#1a1a1a',
    surfaceHov: '#252525',
    border: '#333333',
    borderStrong: '#444444',
    fg: '#eeeeee',
    fgMuted: '#aaaaaa',
    fgSub: '#777777',
    accent: '#C1502E',
    success: '#4CAF50',
    warning: '#FF9800',
    mono: 'ui-monospace, "Cascadia Code", "Fira Code", monospace'
};

const IC = { 
    file: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
    folder: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`,
    edit: `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
    reload: `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>`,
    chevD: `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>`,
    back: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>`,
    save: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>`
};

function esc(s) { return String(s ?? '').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

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
        
        const style = document.createElement('style');
        style.innerHTML = `
            .EasyMDEContainer { flex: 1; display: flex; flex-direction: column; min-height: 0; background: ${DT.bg} !important; }
            .EasyMDEContainer .CodeMirror { 
                flex: 1; background: ${DT.bg} !important; color: ${DT.fg} !important; 
                border-color: ${DT.border} !important; font-family: ${DT.mono}; 
                font-size: 13px; line-height: 1.6; height: auto !important; min-height: 0;
            }
            .EasyMDEContainer .editor-toolbar { 
                background: ${DT.surface} !important; border-color: ${DT.border} !important; 
                opacity: 1 !important; border-radius: 0; flex-shrink: 0; 
            }
            /* Делаем иконки в тулбаре светлыми */
            .EasyMDEContainer .editor-toolbar button { 
                color: ${DT.fg} !important; 
            }
            .EasyMDEContainer .editor-toolbar button:before {
                filter: invert(1) brightness(2); /* Инверсия для стандартных иконок-картинок */
            }
            .EasyMDEContainer .editor-toolbar button:hover { background: ${DT.surfaceHov} !important; border-color: ${DT.accent} !important; }
            .EasyMDEContainer .editor-statusbar { background: ${DT.surface}; color: ${DT.fgSub}; border-color: ${DT.border}; }
            .CodeMirror-cursor { border-left: 2px solid ${DT.accent} !important; }
            .editor-preview-active-side { background: ${DT.bg} !important; color: ${DT.fg} !important; }
        `;
        document.head.appendChild(style);
    });
}

async function openMdEditor(container, slug, title) {
    await loadEasyMDE();

    const overlay = document.createElement('div');
    overlay.style.cssText = `position:absolute;inset:0;z-index:999999;background:${DT.bg};display:flex;flex-direction:column;overflow:hidden;`;
    
    overlay.innerHTML = `
        <div style="display:flex;align-items:center;gap:12px;padding:10px 15px;border-bottom:1px solid ${DT.border};background:${DT.surface};flex-shrink:0">
            <button id="me-back" style="display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:6px;border:1px solid ${DT.border};background:#222;color:${DT.fg};cursor:pointer;font-size:12px;font-family:${DT.mono}">${IC.back} Назад</button>
            <span style="flex:1;font-size:12px;font-weight:600;color:${DT.fg};font-family:${DT.mono};overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(title)}</span>
            <span id="me-dirty" style="display:none;font-size:10px;color:${DT.warning};font-family:${DT.mono}">● не сохранено</span>
            <button id="me-save" style="display:flex;align-items:center;gap:6px;padding:6px 16px;border-radius:6px;border:1px solid ${DT.accent};background:${DT.accent};color:white;cursor:pointer;font-size:12px;font-family:${DT.mono};font-weight:600">${IC.save} Сохранить</button>
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
            initialValue: content,
            spellChecker: false,
            nativeSpellcheck: false,
            status: ["words", "lines"],
            toolbar: [
                "bold", "italic", "heading", "|", "quote", "unordered-list", "ordered-list", "|", 
                "link", "image", "table", "|", "preview", "side-by-side", "fullscreen", "|", "guide"
            ],
            shortcuts: { "save": "Ctrl-S" }
        });

        const cm = easyMDE.codemirror;
        cm.getWrapperElement().style.flex = "1";
        setTimeout(() => cm.refresh(), 100);

        cm.on("change", () => {
            if (!dirty) { dirty = true; dirtyEl.style.display = 'inline'; }
        });

    } catch (e) {
        toast.error('Ошибка: ' + e.message);
        overlay.remove();
        return;
    }

    async function save() {
        try {
            await bridge.writeDoc(slug, easyMDE.value());
            dirty = false;
            dirtyEl.style.display = 'none';
            saveBtn.style.background = DT.success;
            saveBtn.innerHTML = '✓ Сохранено';
            setTimeout(() => {
                saveBtn.style.background = DT.accent;
                saveBtn.innerHTML = IC.save + ' Сохранить';
            }, 2000);
            toast.success('Сохранено');
        } catch(e) {
            toast.error('Ошибка: ' + e.message);
        }
    }

    saveBtn.addEventListener('click', save);
    overlay.addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); save(); } });
    overlay.querySelector('#me-back').addEventListener('click', () => {
        if (dirty && !confirm('Выйти без сохранения?')) return;
        if (easyMDE) easyMDE.toTextArea();
        overlay.remove();
    });
}

export function renderPagesPanel(container) {
    let nav = [], expanded = {};

    async function load() {
        container.innerHTML = `<div style="padding:20px;color:${DT.fgMuted};font-family:${DT.mono}">Загрузка...</div>`;
        try {
            const res = await bridge.listNav();
            nav = res.nav;
            nav.forEach(s => { if (expanded[s.id] === undefined) expanded[s.id] = true; });
            render();
        } catch(e) { 
            container.innerHTML = `<div style="padding:20px;color:red">${e.message}</div>`;
        }
    }

    function render() {
        const total = nav.reduce((a, s) => a + (s.pages?.length ?? 0), 0);
        container.innerHTML = `
            <div style="display:flex;align-items:center;gap:8px;padding:10px;border-bottom:1px solid ${DT.border};background:${DT.surface};flex-shrink:0">
                <span style="font-size:10px;color:${DT.fgSub};font-family:${DT.mono}">${total} страниц</span>
                <div style="flex:1"></div>
                <button id="adm-reload" style="padding:5px 10px;border-radius:4px;border:1px solid ${DT.border};background:transparent;color:${DT.fgMuted};cursor:pointer;font-size:11px">${IC.reload} Обновить</button>
            </div>
            <div id="adm-sections" style="flex:1;overflow-y:auto;padding:10px;background:${DT.bg}"></div>
        `;
        container.querySelector('#adm-reload').addEventListener('click', load);
        renderSections();
    }

    function renderSections() {
        const sectEl = container.querySelector('#adm-sections');
        if (!sectEl) return;
        sectEl.innerHTML = '';
        nav.forEach(s => {
            const isOpen = expanded[s.id] !== false;
            const wrap = document.createElement('div');
            wrap.style.cssText = `margin-bottom:8px;border-radius:6px;border:1px solid ${DT.border};background:${DT.surface};overflow:hidden;`;
            
            const hdr = document.createElement('div');
            hdr.style.cssText = `display:flex;align-items:center;gap:10px;padding:10px;cursor:pointer;user-select:none;`;
            hdr.innerHTML = `
                <span style="color:${DT.fgSub};transition:transform 0.2s;transform:rotate(${isOpen ? 0 : -90}deg)">${IC.chevD}</span>
                <span style="flex:1;font-size:12px;font-weight:600;color:${DT.fg};font-family:${DT.mono}">${esc(s.title)}</span>
            `;

            const body = document.createElement('div');
            body.style.cssText = `display:${isOpen ? 'block' : 'none'};background:${DT.bg};`;

            (s.pages || []).forEach(p => {
                const slug = p.href.replace(/^.*\//, '').replace(/\.html$/, '');
                const row = document.createElement('div');
                row.style.cssText = `display:flex;align-items:center;gap:10px;padding:8px 12px;border-bottom:1px solid ${DT.border};`;
                row.innerHTML = `
                    <span style="color:${DT.fgSub}">${IC.file}</span>
                    <div style="flex:1;font-size:11px;color:${DT.fg};font-family:${DT.mono}">${esc(p.title)}</div>
                    <button class="adm-edit-btn" style="padding:4px 10px;border-radius:4px;border:1px solid ${DT.borderStrong};background:${DT.surfaceHov};color:${DT.fg};cursor:pointer;font-size:10px">${IC.edit} Редактировать</button>
                `;
                row.querySelector('.adm-edit-btn').addEventListener('click', () => {
                    openMdEditor(container, slug, p.title);
                });
                body.appendChild(row);
            });

            hdr.addEventListener('click', () => {
                const newState = !expanded[s.id];
                expanded[s.id] = newState;
                hdr.querySelector('span').style.transform = newState ? 'rotate(0deg)' : 'rotate(-90deg)';
                body.style.display = newState ? 'block' : 'none';
            });

            wrap.appendChild(hdr);
            wrap.appendChild(body);
            sectEl.appendChild(wrap);
        });
    }

    load();
}