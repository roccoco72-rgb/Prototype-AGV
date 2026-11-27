import { RotateCcw } from 'lucide-react';
import { TimeSavingsInfo } from './TimeSavingsInfo';

interface KpiBarProps {
  openCount: number;
  completedTotal: number;
  sessionCompletedCount: number;
  avgCycleMinutes: number;
  automationRate: number;
  onResetDemo: () => void;
}

export function KpiBar({
  openCount,
  completedTotal,
  sessionCompletedCount,
  avgCycleMinutes,
  automationRate,
  onResetDemo,
}: KpiBarProps) {
  return (
    <section
      aria-label="Kennzahlen Übersicht"
      className="bg-white border-b border-slate-200"
    >
      <div className="max-w-[1520px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          {/* KPI 1: Offene Fälle */}
          <div className="py-3.5 pr-4 flex flex-col justify-between">
            <span className="text-xs font-medium text-slate-500">Offene Fälle im Postkorb</span>
            <div className="mt-1 flex items-baseline gap-2.5">
              <span className="font-mono text-2xl font-semibold text-[#003366] tabular-nums">
                {openCount}
              </span>
              <span className="text-xs text-slate-500 tabular-nums">
                {openCount === 0
                  ? 'Alle Fälle abgeschlossen'
                  : `${openCount === 1 ? '1 Fall' : `${openCount} Fälle`} prüfbereit`}
              </span>
            </div>
          </div>

          {/* KPI 2: Erledigte Fälle */}
          <div className="py-3.5 pl-4 lg:px-6 flex flex-col justify-between">
            <span className="text-xs font-medium text-slate-500">Erledigte Fälle (heute)</span>
            <div className="mt-1 flex items-baseline gap-2.5">
              <span className="font-mono text-2xl font-semibold text-slate-900 tabular-nums">
                {completedTotal}
              </span>
              {sessionCompletedCount > 0 ? (
                <span className="text-xs font-medium text-emerald-700 tabular-nums">
                  +{sessionCompletedCount} in dieser Sitzung
                </span>
              ) : (
                <span className="text-xs text-slate-500">Team 11.2 FTE</span>
              )}
            </div>
          </div>

          {/* KPI 3: Durchlaufzeit-Schnitt */}
          <div className="py-3.5 pr-4 lg:px-6 flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-slate-500">Durchlaufzeit-Schnitt</span>
              <TimeSavingsInfo compact />
            </div>
            <div className="mt-1 flex items-baseline gap-2.5">
              <span className="font-mono text-2xl font-semibold text-slate-900 tabular-nums">
                {avgCycleMinutes.toFixed(1)} Min.
              </span>
              <span className="text-xs text-emerald-700 font-medium tabular-nums">
                −25 Min. ggü. manuell
              </span>
            </div>
          </div>

          {/* KPI 4: Automatisierungsquote + Reset */}
          <div className="py-3.5 pl-4 lg:pl-6 flex items-center justify-between gap-3">
            <div>
              <span className="text-xs font-medium text-slate-500">Automatisierungsquote</span>
              <div className="mt-1 flex items-baseline gap-2.5">
                <span className="font-mono text-2xl font-semibold text-[#003366] tabular-nums">
                  {automationRate}%
                </span>
                <span className="text-xs text-slate-500">Zielkorridor 80/20</span>
              </div>
            </div>
            {sessionCompletedCount > 0 && (
              <button
                type="button"
                onClick={onResetDemo}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-md transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00A3E0]"
                title="Alle 3 Beispielfälle auf Ausgangszustand zurücksetzen"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Demo zurücksetzen</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
