import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router';
import { Footer } from './Footer';
import { Header } from './Header';
import { MobileActions } from './MobileActions';

/** Scroll to top (or to the #hash target) after navigation and move focus to the page for keyboard/screen-reader users. */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (hash) {
      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
      return;
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    document.getElementById('main')?.focus({ preventScroll: true });
  }, [pathname, hash]);

  return null;
}

export function Layout() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  return (
    <div className={`min-h-screen bg-background pb-24 text-foreground md:pb-0 ${isHome ? 'relative overflow-x-clip' : ''}`}>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <ScrollManager />
      <Header overlay={isHome} />
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <MobileActions />
    </div>
  );
}
