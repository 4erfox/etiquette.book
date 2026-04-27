/**
 * admin/panels/PagesPanel.js
 * Управление страницами через .md файлы + EasyMDE
 */
import { bridge } from '../bridge.js';
import { toast } from '../toast.js';
import { getT } from '../theme.js';

const IC = {
    file:   `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
    folder: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`,
    reload: `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>`,
    back:   `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>`,
    save:   `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>`,
};

function esc(s) {
    return String(s ?? '').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ─── Загрузка EasyMDE ────────────────────────────────────────────────────────
let mdeLoaded = false;

function loadEasyMDE() {
    if (mdeLoaded || window.EasyMDE) { mdeLoaded = true; return Promise.resolve(); }
    return new Promise(resolve => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/easymde/dist/easymde.min.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/easymde/dist/easymde.min.js';
        script.onload = () => { mdeLoaded = true; resolve(); };
        document.head.appendChild(script);
    });
}

// Вставляем стили ПОСЛЕ того как EasyMDE уже загрузился и проинициализировался.
// Используем максимально специфичные селекторы + !important чтобы гарантированно
// перебить все стили CDN независимо от порядка загрузки (актуально для render.com).
function applyToolbarStyles() {
    const id = 'mde-force-styles';
    const old = document.getElementById(id);
    if (old) old.remove();

    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
        /* Тулбар — светлый */
        .EasyMDEContainer .editor-toolbar {
            background: #efefef !important;
            border-color: #d0d0d0 !important;
            opacity: 1 !important;
            display: block !important;
            visibility: visible !important;
        }
        .EasyMDEContainer .editor-toolbar button,
        .EasyMDEContainer .editor-toolbar a {
            color: #222 !important;
            opacity: 1 !important;
        }
        .EasyMDEContainer .editor-toolbar button:hover,
        .EasyMDEContainer .editor-toolbar a:hover {
            background: #ddd !important;
            border-color: #bbb !important;
        }
        .EasyMDEContainer .editor-toolbar button.active,
        .EasyMDEContainer .editor-toolbar a.active {
            background: #ccc !important;
        }
        .EasyMDEContainer .editor-toolbar i.separator {
            border-color: #c0c0c0 !important;
        }

        /* Редактор — тёмный */
        .EasyMDEContainer .CodeMirror {
            background: #1e1e1e !important;
            color: #d4d4d4 !important;
            border-color: #333 !important;
            font-family: monospace !important;
            font-size: 13px !important;
        }
        .EasyMDEContainer .CodeMirror-cursor {
            border-left-color: #fff !important;
        }

        /* Статусбар */
        .EasyMDEContainer .editor-statusbar {
            background: #efefef !important;
            color: #555 !important;
            border-top: 1px solid #d0d0d0 !important;
        }
    `;
    document.head.appendChild(s);
}

// ─── MD Редактор ─────────────────────────────────────────────────────────────
async function openMdEditor(panelRoot, slug, title, onClose) {
    await loadEasyMDE();

    // Overlay вставляем в panelRoot — корневой элемент панели.
    // panelRoot должен иметь position:relative (выставляем принудительно).
    const prevPosition = panelRoot.style.position;
    panelRoot.style.position = 'relative';

    const overlay = document.createElement('div');
    // НЕ используем overflow:hidden — он ломает отображение тулбара EasyMDE
    overlay.style.cssText = 'position:absolute;inset:0;z-index:50;background:#1e1e1e;display:flex;flex-direction:column;';

    overlay.innerHTML = `
        <div style="display:flex;align-items:center;gap:8px;padding:10px 12px;border-bottom:1px solid #333;background:#252525;flex-shrink:0;">
            <button id="me-back" style="display:flex;align-items:center;gap:5px;padding:6px 12px;border-radius:6px;border:1px solid #555;background:#e0e0e0;color:#000;cursor:pointer;font-size:11px;font-weight:600;">
                ${IC.back} Назад
            </button>
            <span style="flex:1;font-size:11px;font-weight:600;color:#999;font-family:monospace;letter-spacing:0.07em;text-transform:uppercase;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
                ${esc(title)}
            </span>
            <span id="me-dirty" style="display:none;font-size:10px;color:#ff9800;">● не сохранено</span>
            <button id="me-save" style="display:flex;align-items:center;gap:5px;padding:6px 15px;border-radius:6px;border:1px solid #555;background:#444;color:#fff;cursor:pointer;font-size:11px;font-weight:600;">
                ${IC.save} Сохранить
            </button>
        </div>
        <div style="flex:1;display:flex;flex-direction:column;">
            <textarea id="me-textarea"></textarea>
        </div>
    `;

    panelRoot.appendChild(overlay);

    const dirtyEl = overlay.querySelector('#me-dirty');
    const saveBtn = overlay.querySelector('#me-save');
    let easyMDE = null;
    let dirty = false;

    try {
        const { content } = await bridge.readDoc(slug);
        const textarea = overlay.querySelector('#me-textarea');
        textarea.value = content;

        easyMDE = new EasyMDE({
            element: textarea,
            spellChecker: false,
            status: ['words', 'lines'],
            toolbar: ['bold', 'italic', 'heading', '|', 'quote', 'unordered-list', 'ordered-list', '|', 'link', 'image', 'table', '|', 'preview', 'fullscreen'],
            minHeight: '400px',
            autofocus: true,
        });

        // Применяем стили тулбара: сразу + с задержкой (на случай render.com)
        applyToolbarStyles();
        setTimeout(applyToolbarStyles, 100);
        setTimeout(applyToolbarStyles, 600);

        easyMDE.codemirror.on('change', () => {
            if (!dirty) { dirty = true; dirtyEl.style.display = 'inline'; }
        });

    } catch (e) {
        toast.error('Ошибка загрузки: ' + e.message);
        overlay.remove();
        panelRoot.style.position = prevPosition;
        return;
    }

    saveBtn.onclick = async () => {
        try {
            await bridge.writeDoc(slug, easyMDE.value());
            dirty = false;
            dirtyEl.style.display = 'none';
            toast.success('Сохранено');
        } catch (e) { toast.error(e.message); }
    };

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

    function render() {
        const t = getT();

        // position:relative нужен чтобы overlay редактора позиционировался
        // относительно этого контейнера, а не улетел за его пределы
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
                const slug = p.href.replace(/^.*\//, '').replace(/\.html$/, '');
                const row = document.createElement('div');
                row.style.cssText = `display:flex;align-items:center;gap:10px;padding:8px 12px;border-bottom:1px solid ${t.border};`;
                row.innerHTML = `
                    <span style="color:${t.fgSub};">${IC.file}</span>
                    <div style="flex:1;font-size:12px;color:${t.fg};">${esc(p.title)}</div>
                    <button class="edit-btn" style="padding:5px 12px;border-radius:6px;border:1px solid #555;background:#444;color:#fff;cursor:pointer;font-size:10px;font-weight:600;">Правка</button>
                `;
                // ВАЖНО: передаём container (корень панели), а НЕ sectEl
                row.querySelector('.edit-btn').onclick = () => openMdEditor(container, slug, p.title, load);
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