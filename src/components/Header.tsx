import { ChevronRight, Menu, Phone, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { NAV } from '../config/nav';
import { SITE } from '../config/site';

export function Header({ overlay = false }: { overlay?: boolean }) {
  // Re-mounting on navigation closes the mobile menu without any effect-driven state changes.
  const { pathname } = useLocation();
  return <HeaderBar key={pathname} overlay={overlay} />;
}

function HeaderBar({ overlay }: { overlay: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const dark = overlay;
  const tone = dark ? 'border-white/10 bg-dark/90 text-white' : 'border-black/10 bg-background/95 text-dark';
  const position = overlay ? 'absolute inset-x-0 top-0 z-50' : 'sticky top-0 z-50';

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    dark
      ? `text-sm font-medium transition hover:text-secondary ${isActive ? 'text-secondary' : 'text-white/70'}`
      : `text-sm font-medium transition hover:text-primary ${isActive ? 'text-primary' : 'text-dark/70'}`;

  return (
    <header className={`${position} border-b backdrop-blur-xl ${tone}`} {...(dark ? { 'data-dark': '' } : {})}>
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link to="/" className="group flex items-center gap-3" aria-label="PMS Tours and Travels home">
          <img
            src="/logo-mark.svg"
            width={40}
            height={40}
            alt=""
            className="size-10 transition-transform group-hover:rotate-[-12deg]"
          />
          <span>
            <span className="block font-display text-[15px] font-bold tracking-tight">
              P.M.S <span className={dark ? 'font-medium text-white/70' : 'font-medium text-dark/70'}>Tours &amp; Travels</span>
            </span>
            <span className={`block text-[9px] font-semibold uppercase tracking-[.22em] ${dark ? 'text-secondary' : 'text-gold-ink'}`}>
              {SITE.tagline}
            </span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <a
          href={`tel:${SITE.phone.tel}`}
          className="hidden items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#c53a2c] lg:flex"
        >
          <Phone size={15} aria-hidden="true" /> Call our team
        </a>

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className={`grid size-10 place-items-center rounded-full border ${dark ? 'border-white/15' : 'border-black/15'} lg:hidden`}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>
      </div>

      {menuOpen && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className={`border-t px-5 pb-6 pt-3 lg:hidden ${dark ? 'border-white/10 bg-dark' : 'border-black/10 bg-background'}`}
        >
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center justify-between border-b py-4 text-sm ${dark ? 'border-white/10 text-white/80' : 'border-black/10 text-dark/80'}`}
            >
              {item.label}
              <ChevronRight size={16} aria-hidden="true" />
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
