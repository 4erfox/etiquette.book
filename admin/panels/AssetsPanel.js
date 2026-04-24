/**
 * admin/panels/AssetsPanel.js — Управление ассетами и favicon
 */

import { bridge } from '../bridge.js';
import { getT } from '../theme.js';

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#22c55e' : '#3b82f6'};
        color: white;
        padding: 8px 16px;
        border-radius: 8px;
        font-size: 12px;
        font-family: monospace;
        z-index: 100000;
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function escapeHtml(str) {
    return String(str ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export async function renderAssetsPanel(container) {
    const t = getT();
    let assets = [];

    async function loadAssets() {
        try {
            const result = await bridge.listAssets();
            assets = result.assets || [];
            renderAssetsList();
        } catch (err) {
            console.error('Ошибка загрузки ассетов:', err);
            showToast('Не удалось загрузить список изображений', 'error');
        }
    }

    function renderAssetsList() {
        const listContainer = container.querySelector('#assets-list');
        if (!listContainer) return;

        if (assets.length === 0) {
            listContainer.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: ${t.fgSub}; font-family: ${t.mono}; font-size: 10px;">
                    Нет загруженных изображений
                </div>
            `;
            return;
        }

        listContainer.innerHTML = assets.map(asset => `
            <div style="display: flex; align-items: center; gap: 12px; padding: 10px; border-bottom: 0.5px solid ${t.border};">
                <div style="width: 44px; height: 44px; background: ${t.surface}; border-radius: 6px; overflow: hidden; display: flex; align-items: center; justify-content: center;">
                    <img src="${asset.path}" style="max-width: 100%; max-height: 100%; object-fit: cover;" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'44\\' height=\\'44\\' viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'%23999\\' stroke-width=\\'1.5\\'%3E%3Crect x=\\'3\\' y=\\'3\\' width=\\'18\\' height=\\'18\\' rx=\\'2\\'/%3E%3C/svg%3E'">
                </div>
                <div style="flex: 1; min-width: 0;">
                    <div style="font-size: 10px; font-weight: 500; margin-bottom: 3px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: ${t.fg};">
                        ${escapeHtml(asset.name)}
                    </div>
                    <div style="font-size: 8px; color: ${t.fgSub};">
                        ${formatFileSize(asset.size)}
                    </div>
                    <div style="font-size: 7px; color: ${t.fgMuted}; margin-top: 3px; font-family: monospace;">
                        ${asset.path}
                    </div>
                </div>
                <div style="display: flex; gap: 5px;">
                    <button class="copy-markdown-btn" data-path="${asset.path}" data-name="${asset.name}" style="padding: 4px 8px; background: ${t.surface}; border: 0.5px solid ${t.border}; border-radius: 5px; cursor: pointer; font-size: 9px; color: ${t.fg}; font-family: ${t.mono};">
                        MD
                    </button>
                    <button class="copy-url-btn" data-path="${asset.path}" style="padding: 4px 8px; background: ${t.surface}; border: 0.5px solid ${t.border}; border-radius: 5px; cursor: pointer; font-size: 9px; color: ${t.fg}; font-family: ${t.mono};">
                        URL
                    </button>
                    <button class="delete-asset-btn" data-name="${asset.name}" style="padding: 4px 8px; background: rgba(239, 68, 68, 0.1); border: 0.5px solid rgba(239, 68, 68, 0.3); border-radius: 5px; cursor: pointer; color: #ef4444; font-size: 9px; font-family: ${t.mono};">
                        Удалить
                    </button>
                </div>
            </div>
        `).join('');

        document.querySelectorAll('.copy-url-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const path = btn.dataset.path;
                const fullUrl = `${window.location.origin}${path}`;
                try {
                    await navigator.clipboard.writeText(fullUrl);
                    showToast('URL скопирован', 'success');
                    btn.textContent = '✓';
                    setTimeout(() => { btn.textContent = 'URL'; }, 1500);
                } catch (err) {
                    showToast('Не удалось скопировать', 'error');
                }
            });
        });

        document.querySelectorAll('.copy-markdown-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const path = btn.dataset.path;
                const name = btn.dataset.name;
                const cleanName = name.replace(/\.[^/.]+$/, '');
                const markdown = `![${cleanName}](${path})`;
                try {
                    await navigator.clipboard.writeText(markdown);
                    showToast('Markdown скопирован', 'success');
                    btn.textContent = '✓';
                    setTimeout(() => { btn.textContent = 'MD'; }, 1500);
                } catch (err) {
                    showToast('Не удалось скопировать', 'error');
                }
            });
        });

        document.querySelectorAll('.delete-asset-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const filename = btn.dataset.name;
                if (confirm(`Удалить ${filename}?`)) {
                    try {
                        await bridge.deleteFile(`public/assets/${filename}`);
                        showToast(`Удалено: ${filename}`, 'success');
                        await loadAssets();
                    } catch (err) {
                        showToast('Ошибка удаления', 'error');
                    }
                }
            });
        });
    }

    async function uploadFavicon(file) {
        if (!file.type.startsWith('image/')) {
            showToast('Загрузите изображение (PNG, JPG, SVG)', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
            const base64 = e.target.result.split(',')[1];
            try {
                await bridge.uploadFavicon(base64, file.type);
                showToast('Favicon обновлён', 'success');
                updateFaviconOnPage();
            } catch (err) {
                showToast('Ошибка загрузки favicon', 'error');
            }
        };
        reader.readAsDataURL(file);
    }

    function updateFaviconOnPage() {
        const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.type = 'image/png';
        link.rel = 'shortcut icon';
        link.href = '/favicon.png?' + Date.now();
        document.head.appendChild(link);
        
        const previewImg = container.querySelector('#favicon-preview-img');
        if (previewImg) {
            previewImg.src = '/favicon.png?' + Date.now();
        }
    }

    async function uploadAsset(file) {
        if (!file.type.startsWith('image/')) {
            showToast('Загрузите изображение', 'error');
            return;
        }

        showToast(`Загрузка ${file.name}...`, 'info');
        
        const reader = new FileReader();
        reader.onload = async (e) => {
            const base64 = e.target.result.split(',')[1];
            const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
            const filename = `${Date.now()}-${safeName}`;
            try {
                await bridge.uploadAsset(filename, base64, file.type);
                showToast(`Загружено: ${filename}`, 'success');
                await loadAssets();
            } catch (err) {
                showToast('Ошибка загрузки', 'error');
            }
        };
        reader.readAsDataURL(file);
    }

    function setupDragAndDrop(dropZone, uploadHandler) {
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.style.background = 'rgba(124, 92, 252, 0.08)';
            dropZone.style.borderColor = '#7c5cfc';
        });
        dropZone.addEventListener('dragleave', () => {
            dropZone.style.background = '';
            dropZone.style.borderColor = '';
        });
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.style.background = '';
            dropZone.style.borderColor = '';
            const file = e.dataTransfer.files[0];
            if (file) uploadHandler(file);
        });
        dropZone.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e) => {
                if (e.target.files[0]) uploadHandler(e.target.files[0]);
            };
            input.click();
        });
    }

    container.innerHTML = `
        <div style="display:flex;align-items:center;gap:8px;padding:7px 10px;border-bottom:1px solid ${t.border};background:${t.surface};flex-shrink:0">
            <span style="flex:1;font-size:9px;color:${t.fgSub};font-family:${t.mono}">
                Управление файлами
            </span>
        </div>

        <div style="flex:1;overflow-y:auto;padding:12px;" class="adm-scroll">
            <div style="margin-bottom:20px;">
                <div style="display:flex;align-items:center;gap:7px;padding:8px 0;font-size:9px;font-weight:700;color:${t.fgMuted};font-family:${t.mono};text-transform:uppercase;letter-spacing:0.08em;border-bottom:1px solid ${t.border}">
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                    </svg>
                    FAVICON / ЛОГОТИП
                </div>
                <div id="favicon-dropzone" style="border:1px dashed ${t.border};border-radius:10px;padding:16px;text-align:center;cursor:pointer;transition:all 0.2s ease;margin-top:10px;">
                    <div style="font-size:9px;color:${t.fgSub};font-family:${t.mono}">Перетащи или кликни</div>
                    <div style="font-size:7px;color:${t.fgMuted};margin-top:5px;font-family:${t.mono}">PNG, JPG, SVG → public/favicon.png</div>
                </div>
                <div id="favicon-preview" style="margin-top:10px;display:flex;align-items:center;gap:10px;padding:8px;background:${t.surface};border-radius:6px;border:0.5px solid ${t.border}">
                    <img id="favicon-preview-img" src="/favicon.png?${Date.now()}" style="width:32px;height:32px;border-radius:5px;object-fit:cover;" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'32\\' height=\\'32\\' viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'%23999\\' stroke-width=\\'1.5\\'%3E%3Crect x=\\'3\\' y=\\'3\\' width=\\'18\\' height=\\'18\\' rx=\\'2\\'/%3E%3C/svg%3E'">
                    <div style="flex:1;">
                        <div style="font-size:9px;font-weight:500;color:${t.fg}">Текущий favicon</div>
                        <div style="font-size:7px;color:${t.fgMuted};font-family:${t.mono}">public/favicon.png</div>
                    </div>
                    <button id="refresh-favicon" style="padding:4px 8px;background:${t.surface};border:0.5px solid ${t.border};border-radius:5px;cursor:pointer;font-size:8px;color:${t.fg};font-family:${t.mono}">
                        Обновить
                    </button>
                </div>
            </div>

            <div style="margin-bottom:16px;">
                <div style="display:flex;align-items:center;gap:7px;padding:8px 0;font-size:9px;font-weight:700;color:${t.fgMuted};font-family:${t.mono};text-transform:uppercase;letter-spacing:0.08em;border-bottom:1px solid ${t.border}">
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <rect x="2" y="2" width="20" height="20" rx="2.18"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                    </svg>
                    ИЗОБРАЖЕНИЯ (PUBLIC/ASSETS/)
                </div>
                <div id="assets-dropzone" style="border:1px dashed ${t.border};border-radius:10px;padding:16px;text-align:center;cursor:pointer;transition:all 0.2s ease;margin-top:10px;margin-bottom:16px;">
                    <div style="font-size:9px;color:${t.fgSub};font-family:${t.mono}">Перетащи или кликни</div>
                    <div style="font-size:7px;color:${t.fgMuted};margin-top:5px;font-family:${t.mono}">PNG, JPG, GIF, SVG, WEBP</div>
                </div>

                <div style="font-size:8px;font-weight:500;margin-bottom:8px;color:${t.fgSub};font-family:${t.mono};text-transform:uppercase;letter-spacing:0.08em">
                    ЗАГРУЖЕННЫЕ ФАЙЛЫ
                </div>
                <div id="assets-list" style="max-height:320px;overflow-y:auto;border:0.5px solid ${t.border};border-radius:6px;">
                    <div style="text-align:center;padding:2rem;color:${t.fgSub};font-family:${t.mono};font-size:9px;">Загрузка...</div>
                </div>
            </div>
        </div>
    `;

    const faviconZone = container.querySelector('#favicon-dropzone');
    if (faviconZone) setupDragAndDrop(faviconZone, uploadFavicon);

    const assetsZone = container.querySelector('#assets-dropzone');
    if (assetsZone) setupDragAndDrop(assetsZone, uploadAsset);

    const refreshBtn = container.querySelector('#refresh-favicon');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            updateFaviconOnPage();
            showToast('Favicon обновлён', 'info');
        });
    }

    await loadAssets();
}