import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { TIME_SAVINGS_BREAKDOWN } from '../data/cases';

interface ImpactViewProps {
  onBackToCockpit: () => void;
}

export function ImpactView({ onBackToCockpit }: ImpactViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-slate-500">
            Bereichsleitung &amp; Team Kundenservice Vertrag &amp; Vertrieb (11.2 FTE)
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 tracking-tight">
            80/20 Wirkungsanalyse: Human-in-the-Loop Bauzeitversicherung
          </h1>
        </div>
        <button
          type="button"
          onClick={onBackToCockpit}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#003366] hover:bg-[#002347] rounded-md transition-colors whitespace-nowrap shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Zurück zum Postkorb</span>
        </button>
      </div>

      {/* Comparison Grid */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          {/* 80% Segment */}
          <div className="p-6 space-y-4">
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="text-base font-bold text-[#003366]">
                Modus 1: 1-Click Standard-Freigabe
              </h2>
              <span className="font-mono text-sm font-semibold text-emerald-700 tabular-nums">
                ca. 80% Volumen
              </span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Standard-Bauvorhaben (EFH, kleinere MFH-Sanierungen) unterhalb CHF 2&apos;500&apos;000.–
              in Gefahrenzone Weiss oder geringer Restgefährdung werden vollständig über
              Register-APIs vorplausibilisiert.
            </p>
            <dl className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-4 text-xs">
              <div>
                <dt className="text-slate-500">Durchlaufzeit manuell (bisher)</dt>
                <dd className="mt-1 font-mono text-base font-semibold text-slate-400 line-through tabular-nums">
                  27.0 Min.
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Durchlaufzeit mit Cockpit</dt>
                <dd className="mt-1 font-mono text-base font-bold text-emerald-700 tabular-nums">
                  1.8 Min. (−93%)
                </dd>
              </div>
            </dl>
            <ul className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>Automatische Synchronisation in TOPAX und SAP msg.PIA ohne Medienbruch</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>Integriertes Cross-Selling «AquaProtect» mit 10% Bauherren-Rabatt</span>
              </li>
            </ul>
          </div>

          {/* 20% Segment */}
          <div className="p-6 space-y-4">
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="text-base font-bold text-slate-900">
                Modus 2: Geführte Risikoprüfung
              </h2>
              <span className="font-mono text-sm font-semibold text-amber-800 tabular-nums">
                ca. 20% Volumen
              </span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Grossprojekte, Gewerbebauten und Objekte in Hochwasser-Gefahrenzonen (Gelb/Blau,
              HQ100) werden automatisch ausgesteuert. Die KI liefert die aufbereitete Risikoanalyse;
              die Fachperson trifft den Entscheid.
            </p>
            <dl className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-4 text-xs">
              <div>
                <dt className="text-slate-500">Recherchezeit manuell (bisher)</dt>
                <dd className="mt-1 font-mono text-base font-semibold text-slate-400 line-through tabular-nums">
                  36.5 Min.
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Prüfzeit mit Risiko-Cockpit</dt>
                <dd className="mt-1 font-mono text-base font-bold text-[#003366] tabular-nums">
                  11.5 Min. (−68%)
                </dd>
              </div>
            </dl>
            <ul className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00A3E0] shrink-0 mt-0.5" />
                <span>Rechtssichere Dokumentation von Auflagen und Sonderklauseln im Dossier</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00A3E0] shrink-0 mt-0.5" />
                <span>Direkter digitaler Auftrag an Schätzung Nord / Süd ohne E-Mail-Pingpong</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Time Savings Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-baseline justify-between gap-2">
          <h2 className="text-sm font-semibold text-slate-900">
            Aufschlüsselung: 25 Minuten eingesparte Recherche pro Dossier
          </h2>
          <span className="text-xs text-slate-500">Automatisierte Vorab-Aggregation</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs text-slate-600">
                <th className="py-3 px-6 font-semibold">Automatisierter Prüfschritt</th>
                <th className="py-3 px-6 font-semibold">Angeschlossenes Register / System</th>
                <th className="py-3 px-6 font-semibold text-right">Eingesparte Zeit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs sm:text-sm">
              {TIME_SAVINGS_BREAKDOWN.map((row) => (
                <tr key={row.step} className="hover:bg-slate-50/60">
                  <td className="py-3 px-6 font-medium text-slate-900">{row.step}</td>
                  <td className="py-3 px-6 font-mono text-xs text-slate-600">{row.system}</td>
                  <td className="py-3 px-6 font-mono font-semibold text-emerald-700 text-right tabular-nums">
                    −{row.minutes} Min.
                  </td>
                </tr>
              ))}
              <tr className="bg-slate-50 font-semibold">
                <td className="py-3.5 px-6 text-slate-900">Gesamtersparnis pro Bauzeit-Fall</td>
                <td className="py-3.5 px-6 text-xs text-slate-500">
                  Entlastung für Team 11.2 FTE — Fokus auf Beratung &amp; komplexe Risiken
                </td>
                <td className="py-3.5 px-6 font-mono text-[#003366] text-right tabular-nums">
                  −25 Min.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
