import { Router } from '@mulanjs/mulanjs';
import Cockpit from './pages/Cockpit.mujs';
import Settings from './pages/Settings.mujs';
import About from './pages/About.mujs';
import Login from './pages/Login.mujs';
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

    const isUserLoggedIn = () => {
        try {
            return !!localStorage.getItem('mulanpr_auth_user');
        } catch (e) {
            return false;
        }
    };

    // By default, open Login page if not authenticated
    const initialHash = window.location.hash || '';
    if (!isUserLoggedIn()) {
        if (!initialHash || initialHash === '#/' || initialHash === '#' || initialHash === '') {
            window.location.hash = '#/login';
        }
    }

    const routerMount = document.getElementById('router-mount');
    if (routerMount) {
        new Router([
            { path: '/', component: isUserLoggedIn() ? Cockpit : Login },
            { path: '/cockpit', component: Cockpit },
            { path: '/login', component: Login },
            { path: '/settings', component: Settings },
            { path: '/about', component: About }
        ], routerMount);
    }

    // Navigation Auth Guard & Header Visibility Control
    const updateHeaderVisibility = () => {
        const hm = document.getElementById('header-mount');
        if (!hm) return;
        const hash = window.location.hash || '#/login';
        if (hash === '#/login' || hash.startsWith('#/login') || !isUserLoggedIn()) {
            hm.style.display = 'none';
        } else {
            hm.style.display = 'block';
        }
    };

    updateHeaderVisibility();

    window.addEventListener('hashchange', () => {
        const hash = window.location.hash || '#/';
        if (!isUserLoggedIn() && (hash === '#/' || hash === '#/cockpit' || hash === '#/settings')) {
            window.location.hash = '#/login';
        }
        updateHeaderVisibility();
    });

    window.addEventListener('mulan-auth-change', () => {
        updateHeaderVisibility();
    });

    // Initialize MulanUI components
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

    // MutationObserver to auto-enhance dynamic MulanUI buttons
    if (typeof MutationObserver !== 'undefined') {
        let debounceTimer: any = null;
        const observer = new MutationObserver(() => {
            if (debounceTimer) clearTimeout(debounceTimer);
            debounceTimer = setTimeout(runMulanUIInit, 80);
        });
        observer.observe(app, { childList: true, subtree: true });
    }
}
