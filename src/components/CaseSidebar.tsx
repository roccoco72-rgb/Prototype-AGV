import { useState } from 'react';
import { AlertTriangle, CheckCircle2, Search, ShieldCheck } from 'lucide-react';
import { CaseItem } from '../types';
import { formatChf } from '../data/cases';

type FilterTab = 'all' | 'standard' | 'complex' | 'completed';

interface CaseSidebarProps {
  cases: CaseItem[];
  selectedCaseId: string;
  onSelectCase: (id: string) => void;
}

export function CaseSidebar({ cases, selectedCaseId, onSelectCase }: CaseSidebarProps) {
  const [filter, setFilter] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const counts = {
    all: cases.length,
    standard: cases.filter((c) => c.category === 'standard').length,
    complex: cases.filter((c) => c.category === 'complex').length,
    completed: cases.filter((c) => c.status === 'completed').length,
  };

  const filteredCases = cases.filter((item) => {
    if (filter === 'standard' && item.category !== 'standard') return false;
    if (filter === 'complex' && item.category !== 'complex') return false;
    if (filter === 'completed' && item.status !== 'completed') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.municipality.toLowerCase().includes(q) ||
        item.egid.includes(q) ||
        item.ownerName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const filterButtons: { id: FilterTab; label: string; count: number }[] = [
    { id: 'all', label: 'Alle', count: counts.all },
    { id: 'standard', label: 'Standard', count: counts.standard },
    { id: 'complex', label: 'Komplex', count: counts.complex },
    { id: 'completed', label: 'Erledigt', count: counts.completed },
  ];

  return (
    <aside
      aria-label="Postkorb Fall-Auswahl"
      className="w-full lg:w-[370px] xl:w-[390px] shrink-0 bg-white border border-slate-200 rounded-lg overflow-hidden flex flex-col"
    >
      {/* Postkorb Header */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="text-sm font-semibold text-slate-900">Postkorb Bauzeitversicherung</h2>
          <span className="text-xs text-slate-500 tabular-nums">
            {cases.filter((c) => c.status === 'open').length} offen
          </span>
        </div>

        {/* Search input */}
        <div className="mt-3 relative">
          <Search
            className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Gemeinde, EGID oder Bauherr suchen..."
            aria-label="Fälle filtern"
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#00A3E0] focus:outline-none transition-colors"
          />
        </div>

        {/* Interactive segmented filter control */}
        <div
          role="tablist"
          aria-label="Fall-Kategorie filtern"
          className="mt-3 grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-md"
        >
          {filterButtons.map((tab) => {
            const active = filter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(tab.id)}
                className={`px-2 py-1.5 text-[11px] font-medium rounded transition-colors whitespace-nowrap truncate focus-visible:outline-2 focus-visible:outline-[#00A3E0] ${
                  active
                    ? 'bg-white text-[#003366] shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Case List */}
      <div className="divide-y divide-slate-200 overflow-y-auto flex-1">
        {filteredCases.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm font-medium text-slate-700">Keine Fälle in dieser Ansicht</p>
            <p className="text-xs text-slate-500 mt-1">
              Wählen Sie einen anderen Filter oder setzen Sie die Suche zurück.
            </p>
            {(filter !== 'all' || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setFilter('all');
                  setSearchQuery('');
                }}
                className="mt-3 px-3 py-1.5 text-xs font-medium text-[#003366] hover:text-[#00A3E0] underline underline-offset-4"
              >
                Alle Fälle anzeigen
              </button>
            )}
          </div>
        ) : (
          filteredCases.map((item) => {
            const isSelected = item.id === selectedCaseId;
            const isCompleted = item.status === 'completed';
            const isComplex = item.category === 'complex';

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectCase(item.id)}
                aria-current={isSelected ? 'true' : undefined}
                className={`w-full text-left p-4 transition-colors block focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#00A3E0] ${
                  isSelected
                    ? 'bg-[#003366]/[0.06] ring-1 ring-inset ring-[#003366]/20'
                    : 'bg-white hover:bg-slate-50/90'
                }`}
              >
                {/* Unboxed top metadata line */}
                <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500">
                  <span className="font-mono font-medium text-slate-600">
                    {item.code} · {item.segmentLabel}
                  </span>
                  <span className="tabular-nums shrink-0">{item.receivedAt}</span>
                </div>

                {/* Case Title */}
                <h3
                  className={`mt-1.5 text-sm font-semibold leading-snug ${
                    isSelected ? 'text-[#003366]' : 'text-slate-900'
                  }`}
                >
                  {item.title}
                </h3>

                {/* Key numeric metadata */}
                <div className="mt-1.5 flex items-center justify-between gap-2 text-xs text-slate-600">
                  <span className="font-mono tabular-nums">EGID {item.egid}</span>
                  <span className="font-mono font-semibold text-slate-900 tabular-nums">
                    {formatChf(item.buildingSumChf)}
                  </span>
                </div>

                {/* Hazard summary */}
                <p className="mt-1 text-xs text-slate-500 truncate">
                  Gefahrenstufe: {item.hazardLevel}
                </p>

                {/* Status line (explicit icon + text, never hue-only, zero pill clutter) */}
                <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center gap-1.5 text-xs font-medium">
                  {isCompleted ? (
                    <>
                      <CheckCircle2
                        className="w-3.5 h-3.5 text-emerald-700 shrink-0"
                        aria-hidden="true"
                      />
                      <span className="text-emerald-800 truncate">
                        Erledigt
                        {item.decision?.policyNumber
                          ? ` · Police #${item.decision.policyNumber}`
                          : item.decision?.decisionTitle
                          ? ` · ${item.decision.decisionTitle}`
                          : ''}
                      </span>
                    </>
                  ) : isComplex ? (
                    <>
                      <AlertTriangle
                        className="w-3.5 h-3.5 text-amber-700 shrink-0"
                        aria-hidden="true"
                      />
                      <span className="text-amber-800 truncate">{item.aiRecommendation}</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck
                        className="w-3.5 h-3.5 text-emerald-700 shrink-0"
                        aria-hidden="true"
                      />
                      <span className="text-emerald-800 truncate">{item.aiRecommendation}</span>
                    </>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}
