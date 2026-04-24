import { onStatusChange, onAuthChange, login, logout, isAuthenticated, getStatus } from '/admin/bridge.js';
import { mountToastContainer, toast } from '/admin/toast.js';
import { getT, setTheme, detectTheme, onThemeChange } from '/admin/theme.js';
import { renderPagesPanel }    from '/admin/panels/PagesPanel.js';
import { renderContactsPanel } from '/admin/panels/ContactsPanel.js';
import { renderAssetsPanel }   from '/admin/panels/AssetsPanel.js';
import { renderSitePanel }     from '/admin/panels/SitePanel.js';

// ─────────────────────────────────────────────────────────────
// ПРОВЕРКА: админ-панель показывается ТОЛЬКО на localhost
// ─────────────────────────────────────────────────────────────
const isLocal = window.location.hostname === 'localhost' || 
                window.location.hostname === '127.0.0.1';

// Проверяем доступность сервера (без сообщений пользователю)
async function isServerAvailable() {
  try {
    const res = await fetch('/api/health');
    return res.ok;
  } catch {
    return false;
  }
}

// Запускаем проверку (тихо, без логов)
(async () => {
  const serverAvailable = await isServerAvailable();
  
  // Только если localhost И сервер запущен - показываем админ-панель
  if (isLocal && serverAvailable) {
    startAdminPanel();
  }
  // Во всех остальных случаях - ничего не делаем, панель скрыта
})();

function startAdminPanel() {
  setTheme(detectTheme());
  new MutationObserver(() => setTheme(document.documentElement.getAttribute('data-theme') !== 'light'))
    .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  let panelOpen = false, activeTab = 'pages', panelEl = null, triggerEl = null;
  let panelRight = 16, panelTop = 40, panelW = 520, panelH = 600;

  const IC = {
    admin:   `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    pages:   `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
    contacts:`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    assets:  `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
    site:    `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
    close:   `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    logout:  `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
    lock:    `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
    wifi:    `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="1" y1="1" x2="23" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/><path d="M10.71 5.05A16 16 0 0 1 22.56 9"/><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>`,
    spin:    `<svg class="adm-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>`,
  };

  const TABS = [
    { id:'pages',    label:'Страницы', icon:IC.pages    },
    { id:'contacts', label:'Контакты', icon:IC.contacts },
    { id:'assets',   label:'Ассеты',   icon:IC.assets   },
    { id:'site',     label:'Сайт',     icon:IC.site     },
  ];

  function injectStyles() {
    if (document.getElementById('adm-styles')) return;
    const s = document.createElement('style');
    s.id = 'adm-styles';
    s.textContent = `
      @keyframes adm-spin  { to{transform:rotate(360deg)} }
      @keyframes adm-pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
      .adm-spin  { animation:adm-spin 1s linear infinite; display:inline-flex }
      .adm-pulse { animation:adm-pulse 1s ease-in-out infinite }
      .adm-scroll::-webkit-scrollbar{width:4px;height:4px}
      .adm-scroll::-webkit-scrollbar-track{background:transparent}
      .adm-scroll::-webkit-scrollbar-thumb{background:rgba(128,128,128,.2);border-radius:4px}
      #adm-panel *{box-sizing:border-box}
      #adm-panel input,#adm-panel textarea,#adm-panel select{font-family:inherit}
    `;
    document.head.appendChild(s);
  }

  function createTrigger() {
    const t = getT();
    const btn = document.createElement('button');
    btn.id = 'adm-trigger';
    btn.title = 'Админ Панель (Ctrl+Shift+A)';
    Object.assign(btn.style, {
      position:'fixed',left:'8px',bottom:'70px',zIndex:'99997',
      width:'44px',height:'44px',display:'flex',flexDirection:'column',
      alignItems:'center',justifyContent:'center',gap:'2px',
      borderRadius:'10px',border:`1px solid ${t.border}`,
      background:t.surface,color:t.fgMuted,cursor:'pointer',
      boxShadow:t.shadow,fontFamily:t.mono,
    });
    btn.innerHTML = `${IC.admin}<span style="font-size:7px;font-weight:700;letter-spacing:.05em">ADMIN</span>`;
    btn.addEventListener('click', () => panelOpen ? closePanel() : openPanel());
    btn.addEventListener('mouseenter', () => { btn.style.background=getT().surfaceHov; btn.style.color=getT().fg; });
    btn.addEventListener('mouseleave', () => { btn.style.background=getT().surface;    btn.style.color=getT().fgMuted; });
    document.body.appendChild(btn);
    return btn;
  }

  function renderLoginScreen(container) {
    const t = getT();
    container.innerHTML = `
      <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:32px 24px;gap:14px">
        <div style="color:${t.fgMuted};margin-bottom:4px">${IC.lock}</div>
        <div style="font-size:13px;font-weight:700;color:${t.fg};letter-spacing:.04em">ВХОД В ПАНЕЛЬ</div>
        <div style="font-size:11px;color:${t.fgSub}">Введите учётные данные администратора</div>
        <div style="width:100%;display:flex;flex-direction:column;gap:10px;margin-top:8px">
          <input id="adm-u" type="text"     autocomplete="username"         placeholder="Логин"
            style="width:100%;padding:9px 12px;border-radius:8px;border:1px solid ${t.border};background:${t.inpBg};color:${t.fg};font-size:12px;outline:none;font-family:${t.mono}">
          <input id="adm-p" type="password" autocomplete="current-password" placeholder="Пароль"
            style="width:100%;padding:9px 12px;border-radius:8px;border:1px solid ${t.border};background:${t.inpBg};color:${t.fg};font-size:12px;outline:none;font-family:${t.mono}">
          <div id="adm-lerr" style="font-size:11px;color:#ef4444;text-align:center;min-height:16px"></div>
          <button id="adm-lbtn" style="width:100%;padding:9px;border-radius:8px;border:none;background:rgba(124,92,252,.85);color:#fff;font-size:12px;font-weight:600;cursor:pointer;font-family:${t.mono}">Войти</button>
        </div>
        <div style="font-size:10px;color:${t.fgSub};text-align:center;margin-top:4px;font-family:${t.mono}">
          Настройки в <code style="background:${t.surface};padding:1px 4px;border-radius:3px">admin.env</code>
        </div>
      </div>
    `;

    const uEl   = container.querySelector('#adm-u');
    const pEl   = container.querySelector('#adm-p');
    const errEl = container.querySelector('#adm-lerr');
    const btn   = container.querySelector('#adm-lbtn');

    setTimeout(() => uEl.focus(), 60);

    async function doLogin() {
      const u = uEl.value.trim(), p = pEl.value;
      if (!u || !p) { errEl.textContent = 'Заполните все поля'; return; }
      btn.disabled = true;
      btn.innerHTML = IC.spin + ' Вход...';
      errEl.textContent = '';
      try {
        await login(u, p);
      } catch(e) {
        errEl.textContent = e.message || 'Ошибка входа';
        btn.disabled = false;
        btn.textContent = 'Войти';
        pEl.value = ''; pEl.focus();
      }
    }

    btn.addEventListener('click', doLogin);
    [uEl, pEl].forEach(el => el.addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); }));
  }

  function renderTabs() {
    if (!panelEl) return;
    const tabsEl = panelEl.querySelector('#adm-tabs');
    const authed = isAuthenticated();
    tabsEl.style.display = authed ? 'flex' : 'none';
    if (!authed) return;
    const t = getT();
    tabsEl.innerHTML = TABS.map(tab => `
      <button class="adm-tab" data-tab="${tab.id}" style="
        display:flex;align-items:center;gap:5px;padding:9px 12px;border:none;
        border-bottom:2px solid ${tab.id===activeTab ? t.fg : 'transparent'};
        background:transparent;color:${tab.id===activeTab ? t.fg : t.fgMuted};
        font-size:11px;font-weight:${tab.id===activeTab ? 600 : 400};
        cursor:pointer;font-family:${t.mono};flex-shrink:0;outline:none;
      ">${tab.icon}${tab.label}</button>
    `).join('');
    tabsEl.querySelectorAll('.adm-tab').forEach(btn => {
      btn.addEventListener('mousedown', e => { e.preventDefault(); activeTab = btn.dataset.tab; renderTabs(); renderActivePanel(); });
    });
  }

  function renderActivePanel() {
    if (!panelEl) return;
    const content   = panelEl.querySelector('#adm-panel-content');
    const logoutBtn = panelEl.querySelector('#adm-logout-btn');
    content.innerHTML = '';
    if (!isAuthenticated()) {
      if (logoutBtn) logoutBtn.style.display = 'none';
      renderLoginScreen(content);
      return;
    }
    if (logoutBtn) logoutBtn.style.display = 'flex';
    if (activeTab === 'pages')    renderPagesPanel(content);
    if (activeTab === 'contacts') renderContactsPanel(content);
    if (activeTab === 'assets')   renderAssetsPanel(content);
    if (activeTab === 'site')     renderSitePanel(content);
  }

  function updateStatus(status) {
    if (!panelEl) return;
    const t = getT();
    const dot = panelEl.querySelector('#adm-status-dot');
    const text = panelEl.querySelector('#adm-status-text');
    const offline = panelEl.querySelector('#adm-offline');
    
    const colors = { 
      connected: '#22c55e', 
      connecting: '#f59e0b', 
      disconnected: '#ef4444', 
      error: '#ef4444' 
    };
    
    const labels = { 
      connected: 'Подключено', 
      connecting: 'Подключение...', 
      disconnected: 'API не отвечает', 
      error: 'Ошибка API' 
    };
    
    if (dot) {
      dot.style.background = colors[status] || t.fgSub;
      dot.className = status === 'connecting' ? 'adm-pulse' : '';
    }
    
    if (text) {
      text.textContent = labels[status] || status;
      text.style.color = status === 'connected' ? '#22c55e' : t.fgSub;
    }
    
    if (offline) {
      offline.style.display = 'none';
    }
  }

  function createPanel() {
    const t = getT();
    const panel = document.createElement('div');
    panel.id = 'adm-panel';
    Object.assign(panel.style, {
      position:'fixed',right:panelRight+'px',top:panelTop+'px',
      width:panelW+'px',height:panelH+'px',zIndex:'99999',
      background:t.bg,border:`1px solid ${t.borderStrong}`,
      borderRadius:'12px',boxShadow:t.shadow,
      display:'flex',flexDirection:'column',overflow:'hidden',fontFamily:t.mono,
    });
    panel.innerHTML = `
      <header id="adm-header" style="position:relative;display:flex;align-items:center;gap:10px;padding:10px 12px 9px;background:${t.surface};border-bottom:1px solid ${t.border};flex-shrink:0;user-select:none">
        <button id="adm-drag" aria-label="move" style="position:absolute;inset:0;background:transparent;border:none;cursor:move;z-index:0"></button>
        <div style="position:relative;z-index:1;width:28px;height:28px;border-radius:7px;flex-shrink:0;background:${t.accentSoft};border:1px solid ${t.border};display:flex;align-items:center;justify-content:center">${IC.admin}</div>
        <div style="position:relative;z-index:1;flex:1;min-width:0">
          <div style="display:flex;align-items:center;gap:8px">
            <span style="font-size:11px;font-weight:800;color:${t.fg};letter-spacing:.06em">АДМИН ПАНЕЛЬ</span>
            <span style="font-size:8px;color:${t.fgMuted};background:${t.accentSoft};border:1px solid ${t.border};border-radius:3px;padding:1px 5px">LOCAL</span>
          </div>
          <div style="display:flex;align-items:center;gap:4px;margin-top:2px">
            <div id="adm-status-dot" style="width:5px;height:5px;border-radius:50%;background:${t.warning}" class="adm-pulse"></div>
            <span id="adm-status-text" style="font-size:9px;color:${t.fgSub}">Подключение...</span>
          </div>
        </div>
        <button id="adm-logout-btn" style="display:none;position:relative;z-index:1;align-items:center;gap:4px;padding:4px 8px;border-radius:6px;border:1px solid ${t.border};background:transparent;color:${t.fgMuted};cursor:pointer;font-size:10px;font-family:${t.mono}">${IC.logout} Выйти</button>
        <button id="adm-close-btn" style="position:relative;z-index:1;width:26px;height:26px;border-radius:6px;flex-shrink:0;display:flex;align-items:center;justify-content:center;border:1px solid ${t.border};background:transparent;color:${t.fgMuted};cursor:pointer">${IC.close}</button>
      </header>
      <div id="adm-tabs" style="display:none;background:${t.surface};border-bottom:1px solid ${t.border};flex-shrink:0;padding:0 4px"></div>
      <div style="flex:1;overflow:hidden;display:flex;flex-direction:column;position:relative">
        <div id="adm-offline" style="display:none;position:absolute;inset:0;z-index:10;background:rgba(17,17,18,.93);flex-direction:column;align-items:center;justify-content:center;gap:10px">
          <div id="adm-offline-icon">${IC.spin}</div>
          <div id="adm-offline-text" style="font-size:12px;color:rgba(255,255,255,.4)">Подключение...</div>
          <button id="adm-offline-reload" style="display:none;padding:6px 14px;border-radius:7px;border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.06);color:rgba(255,255,255,.7);cursor:pointer;font-size:11px;font-family:${t.mono}">Обновить</button>
        </div>
        <div id="adm-panel-content" style="flex:1;display:flex;flex-direction:column;overflow:hidden"></div>
      </div>
      <button aria-label="resize-r"  id="adm-r-r"  style="position:absolute;right:0;top:40px;bottom:8px;width:6px;cursor:col-resize;background:transparent;border:none;padding:0"></button>
      <button aria-label="resize-b"  id="adm-r-b"  style="position:absolute;bottom:0;left:8px;right:8px;height:6px;cursor:row-resize;background:transparent;border:none;padding:0"></button>
      <button aria-label="resize-rb" id="adm-r-rb" style="position:absolute;bottom:0;right:0;width:14px;height:14px;cursor:nwse-resize;background:transparent;border:none;padding:0;z-index:11"></button>
    `;

    panel.querySelector('#adm-close-btn').addEventListener('click', closePanel);
    panel.querySelector('#adm-offline-reload').addEventListener('click', () => location.reload());
    panel.querySelector('#adm-logout-btn').addEventListener('click', () => { logout(); toast.info('Вы вышли'); renderTabs(); renderActivePanel(); });

    let dragging = false, resizing = null, sd = {};
    panel.querySelector('#adm-drag').addEventListener('mousedown', e => {
      e.preventDefault(); dragging = true;
      sd = { mx:e.clientX, my:e.clientY, right:panelRight, top:panelTop };
      document.body.style.userSelect = 'none';
    });
    const onRS = dir => e => { e.preventDefault(); e.stopPropagation(); resizing=dir; sd={mx:e.clientX,my:e.clientY,right:panelRight,top:panelTop,w:panelW,h:panelH}; document.body.style.userSelect='none'; };
    panel.querySelector('#adm-r-r').addEventListener('mousedown',  onRS('r'));
    panel.querySelector('#adm-r-b').addEventListener('mousedown',  onRS('b'));
    panel.querySelector('#adm-r-rb').addEventListener('mousedown', onRS('rb'));
    document.addEventListener('mousemove', e => {
      if (!dragging && !resizing) return;
      const dx=e.clientX-sd.mx, dy=e.clientY-sd.my;
      if (dragging) { panelRight=Math.max(0,Math.min(window.innerWidth-panelW,sd.right-dx)); panelTop=Math.max(0,Math.min(window.innerHeight-60,sd.top+dy)); panel.style.right=panelRight+'px'; panel.style.top=panelTop+'px'; }
      else {
        if (resizing==='r'||resizing==='rb') { panelW=Math.max(380,Math.min(window.innerWidth-32,sd.w-dx)); panel.style.width=panelW+'px'; }
        if (resizing==='b'||resizing==='rb') { panelH=Math.max(300,Math.min(window.innerHeight-40,sd.h+dy)); panel.style.height=panelH+'px'; }
      }
    });
    document.addEventListener('mouseup', () => { dragging=false; resizing=null; document.body.style.userSelect=''; });
    return panel;
  }

  function openPanel() {
    panelW = Math.min(520, window.innerWidth-32);
    panelH = Math.min(820, window.innerHeight-56);
    panelRight = 16; panelTop = 40;
    if (!panelEl) { panelEl = createPanel(); document.body.appendChild(panelEl); }
    panelEl.style.display = 'flex';
    Object.assign(panelEl.style, { right:panelRight+'px', top:panelTop+'px', width:panelW+'px', height:panelH+'px' });
    updateStatus(getStatus()); renderTabs(); renderActivePanel();
    panelOpen = true;
  }

  function closePanel() { if (panelEl) panelEl.style.display = 'none'; panelOpen = false; }

  injectStyles();
  mountToastContainer();
  triggerEl = createTrigger();

  onStatusChange(status => updateStatus(status));
  onAuthChange(() => { if (panelEl) { renderTabs(); renderActivePanel(); } });

  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.shiftKey && e.key==='A') { e.preventDefault(); panelOpen ? closePanel() : openPanel(); }
    if (panelOpen && e.key==='Escape') closePanel();
  });
}