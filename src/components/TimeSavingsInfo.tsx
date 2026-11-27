import { useState, useRef, useEffect } from 'react';
import { Clock, Info, X } from 'lucide-react';
import { TIME_SAVINGS_BREAKDOWN } from '../data/cases';

interface TimeSavingsInfoProps {
  compact?: boolean;
}

export function TimeSavingsInfo({ compact = false }: TimeSavingsInfoProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative inline-flex items-center">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className={`inline-flex items-center gap-1.5 transition-colors rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00A3E0] ${
          compact
            ? 'text-slate-400 hover:text-[#003366] p-1'
            : 'text-xs font-medium text-[#003366] hover:text-[#00A3E0] bg-sky-50/80 hover:bg-sky-50 border border-sky-200/80 px-2.5 py-1.5 whitespace-nowrap shrink-0'
        }`}
      >
        {compact ? (
          <Info className="w-3.5 h-3.5" aria-hidden="true" />
        ) : (
          <>
            <Clock className="w-3.5 h-3.5 text-[#00A3E0] shrink-0" aria-hidden="true" />
            <span>Hier spart der Mensch 25 Min. Recherche</span>
          </>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Zeitersparnis durch automatisierte Registerabfragen"
          className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-lg shadow-lg p-4 z-40 text-left"
        >
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <p className="text-xs font-semibold text-[#003366]">
                Human-in-the-Loop Entlastung
              </p>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                Hier spart der Mensch 25 Minuten manuelle Recherche in kantonalen und kommunalen Registern.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Hinweis schliessen"
              className="text-slate-400 hover:text-slate-700 p-1 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <ul className="mt-3 space-y-2.5">
            {TIME_SAVINGS_BREAKDOWN.map((item) => (
              <li key={item.step} className="flex items-start justify-between gap-3 text-xs">
                <div>
                  <p className="font-medium text-slate-800">{item.step}</p>
                  <p className="text-slate-500 font-mono text-[11px]">{item.system}</p>
                </div>
                <span className="font-mono font-medium text-emerald-700 tabular-nums whitespace-nowrap shrink-0">
                  −{item.minutes} Min.
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="font-medium text-slate-700">Gesamtersparnis pro Dossier</span>
            <span className="font-mono font-semibold text-[#003366] tabular-nums">
              25 Min. automatisiert
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
