import { Router } from '@mulanjs/mulanjs';
import Home from './pages/Home.mujs';
import Runner from './pages/Runner.mujs';
import Settings from './pages/Settings.mujs';
import About from './pages/About.mujs';
import Header from './components/Header.mujs';
// @ts-ignore
import initMulanUI from '@mulanui/mulanui';
import '@mulanui/mulanui/dist/mulan-ui.min.css';
import './style.css';

const app = document.getElementById('app');
if (app) {
    app.innerHTML = '<div id="header-mount"></div><div id="router-mount"></div>';
    
    const headerMount = document.getElementById('header-mount');
    if (headerMount) new Header(headerMount).mount();
    
    const routerMount = document.getElementById('router-mount');
    if (routerMount) {
        new Router([
            { path: '/', component: Home },
            { path: '/runner', component: Runner },
            { path: '/settings', component: Settings },
            { path: '/about', component: About }
        ], routerMount);
    }

    // Initialize MulanUI components (Buttons, Chips, Dropdowns, Toolbars)
    const runMulanUIInit = () => {
        try {
            if (typeof initMulanUI === 'function') {
                initMulanUI(document);
            }
        } catch (err) {
            // Non-blocking fallback
        }
    };

    runMulanUIInit();
    window.addEventListener('hashchange', () => setTimeout(runMulanUIInit, 100));
    
    // MutationObserver to auto-enhance dynamic MulanUI buttons rendered by SFCs
    if (typeof MutationObserver !== 'undefined') {
        let debounceTimer: any = null;
        const observer = new MutationObserver(() => {
            if (debounceTimer) clearTimeout(debounceTimer);
            debounceTimer = setTimeout(runMulanUIInit, 80);
        });
        observer.observe(app, { childList: true, subtree: true });
    }
}