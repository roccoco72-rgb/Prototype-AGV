import { ArrowLeft } from 'lucide-react';

interface RulesViewProps {
  onBackToCockpit: () => void;
}

const DECISION_RULES = [
  {
    criterion: 'Versicherte Bausumme',
    standard: 'Bis CHF 2\'500\'000.–',
    complex: 'Über CHF 2\'500\'000.– (Grossrisiko)',
  },
  {
    criterion: 'Kantonale Gefahrenkarte (AGIS)',
    standard: 'Zone Weiss oder Restgefährdung gering',
    complex: 'Zone Gelb, Blau (HQ100) oder Rot',
  },
  {
    criterion: 'Eigentümer & Grundbuch',
    standard: 'Exakte Übereinstimmung mit Baugesuch',
    complex: 'Abweichung, Baurecht oder unklare Trägerschaft',
  },
  {
    criterion: 'Objektschutznachweis',
    standard: 'Nicht erforderlich (keine Gefährdung)',
    complex: 'Fehlend oder unvollständig bei HQ30/HQ100',
  },
];

const INTEGRATIONS = [
  { name: 'BFS / GWR Register', role: 'EGID-Validierung, Gebäudekategorie & Koordinaten' },
  { name: 'Terravis / Grundbuch AG', role: 'Eigentümer- & Parzellenverifikation (GB-Nr.)' },
  { name: 'AGIS Geoportal Kanton Aargau', role: 'Gefahrenkarte Hochwasser (HQ30/HQ100), Oberflächenabfluss' },
  { name: 'eBau AG / Gemeindebauämter', role: 'Baugesuch-Nummer, Baubewilligung & Architekturpläne' },
  { name: 'TOPAX (AGV Kernsystem)', role: 'Policen-Anlage, Auflagenverwaltung & Pendenzen' },
  { name: 'SAP msg.PIA', role: 'Prämienkalkulation, Fakturierung & Debitorensynchronisation' },
];

export function RulesView({ onBackToCockpit }: RulesViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-slate-500">
            Transparente Entscheidungslogik · Human-in-the-Loop Governance
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 tracking-tight">
            AGV Regelwerk &amp; Register-Schnittstellen
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

      {/* Rule Thresholds Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-sm font-semibold text-slate-900">
            Aussteuerungskriterien: Standard (80%) vs. Komplex (20%)
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs text-slate-600">
                <th className="py-3 px-6 font-semibold">Prüfkriterium</th>
                <th className="py-3 px-6 font-semibold">1-Click Standard-Freigabe</th>
                <th className="py-3 px-6 font-semibold">Geführte Risikoprüfung (Aussteuerung)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs sm:text-sm">
              {DECISION_RULES.map((rule) => (
                <tr key={rule.criterion} className="hover:bg-slate-50/60">
                  <td className="py-3 px-6 font-semibold text-slate-900">{rule.criterion}</td>
                  <td className="py-3 px-6 text-emerald-800">{rule.standard}</td>
                  <td className="py-3 px-6 text-amber-900">{rule.complex}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Integrations Grid */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-sm font-semibold text-slate-900">
            Angeschlossene Register &amp; Kernsysteme
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200">
          {INTEGRATIONS.map((item) => (
            <div key={item.name} className="p-5 border-b border-slate-200 last:border-b-0">
              <p className="font-mono text-xs font-semibold text-[#003366]">{item.name}</p>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">{item.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
