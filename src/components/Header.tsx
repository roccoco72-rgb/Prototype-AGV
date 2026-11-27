import { UserCheck } from 'lucide-react';
import { TopView } from '../types';

interface HeaderProps {
  activeView: TopView;
  onSelectView: (view: TopView) => void;
}

export function Header({ activeView, onSelectView }: HeaderProps) {
  const navItems: { id: TopView; label: string }[] = [
    { id: 'cockpit', label: 'Entscheidungscockpit' },
    { id: 'impact', label: '80/20 Wirkungsanalyse' },
    { id: 'rules', label: 'Regelwerk & Register' },
  ];

  return (
    <header className="bg-[#003366] text-white border-b border-[#002347] sticky top-0 z-30">
      <div className="max-w-[1520px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line AGV Brand Wordmark */}
        <button
          type="button"
          onClick={() => onSelectView('cockpit')}
          className="flex items-center gap-3 text-left whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00A3E0] rounded-sm"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            aria-hidden="true"
            className="shrink-0"
          >
            <rect width="28" height="28" rx="4" fill="#FFFFFF" />
            <path d="M5 13.5L14 6L23 13.5V22H17.5V16H10.5V22H5V13.5Z" fill="#003366" />
            <rect x="12.25" y="10.25" width="3.5" height="3.5" fill="#00A3E0" />
          </svg>
          <span className="font-display text-[15px] sm:text-base font-bold tracking-tight text-white">
            AGV Bauzeitversicherung
          </span>
        </button>

        {/* Zone 2: Clean single-line navigation links */}
        <nav
          aria-label="Hauptnavigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium"
        >
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectView(item.id)}
                className={`relative py-5 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00A3E0] ${
                  isActive ? 'text-white font-semibold' : 'text-slate-300 hover:text-white'
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#00A3E0]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: User Status */}
        <div className="flex items-center gap-2.5 text-xs sm:text-[13px] text-slate-200 whitespace-nowrap shrink-0">
          <UserCheck className="w-4 h-4 text-[#00A3E0] shrink-0" aria-hidden="true" />
          <span>Eingeloggt: Kundenservice Vertrag</span>
        </div>
      </div>

      {/* Mobile navigation strip */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden flex items-center gap-4 px-4 border-t border-[#0F4C81]/60 overflow-x-auto"
      >
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectView(item.id)}
              className={`py-2.5 text-xs font-medium whitespace-nowrap shrink-0 border-b-2 transition-colors ${
                isActive
                  ? 'border-[#00A3E0] text-white'
                  : 'border-transparent text-slate-300 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
