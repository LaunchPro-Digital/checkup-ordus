import { ReactNode, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { QUESTION_BANK_VERSION } from "@/lib/questionBank";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run once on mount in case page loads mid-scroll
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#000000' }}>
      {/* Skip to content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg"
        style={{ background: '#9A11E9', color: '#F0F0F3' }}
      >
        Pular para o conteúdo principal
      </a>

      {/* ── Navbar — DS Ordus: transparent at top → floating pill when scrolled ── */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          transition: 'all 150ms ease',
          ...(scrolled
            ? {
                // Floating pill — identical to site.ordusdigital.com.br
                top: '12px',
                marginLeft: 'auto',
                marginRight: 'auto',
                maxWidth: '900px',
                left: '16px',
                right: '16px',
                borderRadius: '100px',
                background: 'rgba(10,10,10,.88)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,.08)',
                boxShadow: '0 4px 24px rgba(0,0,0,.60)',
                padding: '0 8px',
              }
            : {
                // Transparent at top
                background: 'transparent',
                border: 'none',
                boxShadow: 'none',
                padding: '0',
              }),
        }}
      >
        <div
          className="max-w-5xl mx-auto px-4 flex items-center justify-between"
          style={{ height: '64px' }}
        >
          <Link
            to="/"
            className="flex items-center gap-3 w-fit"
            style={{ opacity: 1, transition: 'opacity var(--t)' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '0.75')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
          >
            {/* Rúbrica Ordus 32×32 — 4 paths SVG oficial */}
            <svg width="32" height="32" viewBox="0 0 1882 1882" fill="none" aria-hidden="true">
              <path d="M0 431.933L431.933 0V1881.18H0V431.933Z" fill="#7F2DC1"/>
              <path d="M1881.18 1449.25L1449.25 1881.18V0H1881.18V1449.25Z" fill="#7F2DC1"/>
              <path d="M0 1449.25H1449.25V1881.18H0V1449.25Z" fill="#7F2DC1"/>
              <path d="M431.933 0H1881.18V431.933H431.933V0Z" fill="#7F2DC1"/>
            </svg>
            <div>
              <span
                className="block text-base font-black uppercase"
                style={{ color: '#F0F0F3', letterSpacing: '-0.01em' }}
              >
                Checkup de Credibilidade
              </span>
              <p className="font-handle text-[12px]" style={{ color: '#6A6A6A' }}>
                @ordusdigital
              </p>
            </div>
          </Link>

          {/* Versão badge */}
          <span
            className="font-label text-[10px] px-2 py-1 rounded-full hidden sm:inline-flex"
            style={{
              background: 'rgba(154,17,233,.12)',
              color: '#9A11E9',
              border: '1px solid rgba(154,17,233,.25)',
              letterSpacing: '0.1em',
            }}
          >
            CRP v{QUESTION_BANK_VERSION}
          </span>
        </div>
      </header>

      {/* Spacer to push content below fixed navbar */}
      <div style={{ height: '64px' }} />

      {/* Main Content */}
      <main id="main-content" className="flex-1 container max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>

      {/* ── Footer — DS Ordus ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,.08)', paddingTop: '18px', paddingBottom: '18px' }}>
        <div className="container max-w-5xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 1882 1882" fill="none" aria-hidden="true">
              <path d="M0 431.933L431.933 0V1881.18H0V431.933Z" fill="#7F2DC1"/>
              <path d="M1881.18 1449.25L1449.25 1881.18V0H1881.18V1449.25Z" fill="#7F2DC1"/>
              <path d="M0 1449.25H1449.25V1881.18H0V1449.25Z" fill="#7F2DC1"/>
              <path d="M431.933 0H1881.18V431.933H431.933V0Z" fill="#7F2DC1"/>
            </svg>
            <span className="font-handle text-xs" style={{ color: '#6A6A6A' }}>
              Checkup de Credibilidade · Ordus Digital
            </span>
          </div>
          <span className="font-label text-[10px]" style={{ color: '#6A6A6A', letterSpacing: '0.1em' }}>
            © 2026 @ordusdigital
          </span>
        </div>
      </footer>
    </div>
  );
}
