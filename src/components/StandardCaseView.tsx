import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Droplets,
  FileCheck2,
  Loader2,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import { CaseItem, DecisionRecord } from '../types';
import { formatChf } from '../data/cases';
import { TimeSavingsInfo } from './TimeSavingsInfo';

interface StandardCaseViewProps {
  caseItem: CaseItem;
  hasNextOpenCase: boolean;
  onApprove: (caseId: string, decision: DecisionRecord) => void;
  onReopen: (caseId: string) => void;
  onOpenNext: () => void;
}

export function StandardCaseView({
  caseItem,
  hasNextOpenCase,
  onApprove,
  onReopen,
  onOpenNext,
}: StandardCaseViewProps) {
  const [aquaProtectEnabled, setAquaProtectEnabled] = useState(true);
  const [showRegisterDetails, setShowRegisterDetails] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Reset local interactive UI controls when switching between standard cases
  useEffect(() => {
    setAquaProtectEnabled(caseItem.decision?.aquaProtectIncluded ?? true);
    setShowRegisterDetails(false);
    setIsProcessing(false);
  }, [caseItem.id, caseItem.decision?.aquaProtectIncluded]);

  const aquaBase = caseItem.aquaProtectPremiumChf ?? 265;
  const aquaDiscounted = Math.round(aquaBase * 0.9);

  function handleOneClickApprove() {
    if (isProcessing || caseItem.status === 'completed') return;
    setIsProcessing(true);

    window.setTimeout(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('de-CH', {
        hour: '2-digit',
        minute: '2-digit',
      });

      const decision: DecisionRecord = {
        completedAt: `Heute, ${timeStr}`,
        policyNumber: caseItem.policyPreviewNumber,
        decisionTitle: '1-Click Standard-Freigabe',
        summary: `Police #${caseItem.policyPreviewNumber} ausgestellt, TOPAX-Status aktualisiert, SAP msg.PIA synchronisiert.`,
        systemsSynced: [
          `Police #${caseItem.policyPreviewNumber} (PDF/ePost)`,
          'TOPAX Bestandsführung',
          'SAP msg.PIA Prämieninkasso',
          ...(aquaProtectEnabled ? ['AquaProtect Offerte (−10% Rabatt)'] : []),
        ],
        aquaProtectIncluded: aquaProtectEnabled,
      };

      setIsProcessing(false);
      onApprove(caseItem.id, decision);
    }, 550);
  }

  return (
    <motion.div
      key={caseItem.id}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white border border-slate-200 rounded-lg overflow-hidden"
    >
      {/* Top Case Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-mono font-semibold text-[#003366]">{caseItem.code}</span>
            <span aria-hidden="true">·</span>
            <span>Standardfall (80%-Segment)</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">EGID {caseItem.egid}</span>
          </div>
          <TimeSavingsInfo />
        </div>

        <div className="mt-3 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {caseItem.title}
            </h1>
            <p className="mt-1 text-sm text-slate-600">{caseItem.address}</p>
          </div>

          <div className="sm:text-right shrink-0">
            <span className="block text-xs text-slate-500">Versicherte Bausumme</span>
            <span className="font-mono text-2xl font-bold text-[#003366] tabular-nums">
              {formatChf(caseItem.buildingSumChf)}
            </span>
          </div>
        </div>
      </div>

      {/* Confirmation State Banner when Approved */}
      {caseItem.status === 'completed' && caseItem.decision && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="p-6 bg-emerald-50 border-b border-emerald-200"
          role="status"
          aria-live="polite"
        >
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle2
                className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <div>
                <p className="text-sm font-bold text-emerald-950">
                  Police #{caseItem.decision.policyNumber} ausgestellt, TOPAX-Status aktualisiert,
                  SAP msg.PIA synchronisiert
                </p>
                <p className="text-xs text-emerald-800 mt-1">
                  Abgeschlossen am {caseItem.decision.completedAt} durch Kundenservice Vertrag
                  {caseItem.decision.aquaProtectIncluded
                    ? ' · Inkl. automatischer AquaProtect-Offerte mit 10% Bauherren-Rabatt.'
                    : ' · Ohne Zusatz-Offerte AquaProtect.'}
                </p>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-emerald-900">
                  {caseItem.decision.systemsSynced.map((sys) => (
                    <span key={sys} className="inline-flex items-center gap-1.5 font-medium">
                      <Check className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
                      {sys}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {hasNextOpenCase && (
                <button
                  type="button"
                  onClick={onOpenNext}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#003366] hover:bg-[#002347] rounded-md transition-colors whitespace-nowrap shrink-0"
                >
                  <span>Nächster offener Fall</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              )}
              <button
                type="button"
                onClick={() => onReopen(caseItem.id)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-emerald-900 bg-white hover:bg-emerald-100/70 border border-emerald-300 rounded-md transition-colors whitespace-nowrap shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Erneut prüfen</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Content Body */}
      <div className="p-6 space-y-7">
        {/* Section 1: KI-Plausibilisierungs-Check (4 grüne Verifizierungs-Felder) */}
        <section aria-labelledby="plausibility-heading">
          <div className="flex items-baseline justify-between gap-2 mb-3">
            <h2 id="plausibility-heading" className="text-sm font-semibold text-slate-900">
              KI-Plausibilisierungs-Check
            </h2>
            <span className="text-xs font-medium text-emerald-700">
              4 / 4 Prüfkriterien erfüllt · Freigabe empfohlen
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
            {caseItem.plausibilityChecks.map((check) => (
              <div
                key={check.id}
                className="p-3.5 rounded-md bg-emerald-50/75 border border-emerald-200/90 flex flex-col justify-between"
              >
                <div className="flex items-start gap-2">
                  <ShieldCheck
                    className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-xs font-semibold text-emerald-950 leading-snug">
                      {check.label}
                    </p>
                    <p className="text-[11px] text-emerald-800/90 mt-1 leading-relaxed">
                      {check.detail}
                    </p>
                  </div>
                </div>
                <p className="mt-2.5 pt-2 border-t border-emerald-200/70 font-mono text-[10px] text-emerald-800/80">
                  {check.source}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Aggregierte Stammdaten */}
        <section aria-labelledby="stammdaten-heading" className="pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between gap-2 mb-4">
            <h2 id="stammdaten-heading" className="text-sm font-semibold text-slate-900">
              Aggregierte Stammdaten aus Registern
            </h2>
            <button
              type="button"
              onClick={() => setShowRegisterDetails((prev) => !prev)}
              className="inline-flex items-center gap-1 text-xs font-medium text-[#003366] hover:text-[#00A3E0] transition-colors whitespace-nowrap shrink-0"
            >
              <span>{showRegisterDetails ? 'Register-Abgleich ausblenden' : 'Bauamt- & Registerdaten prüfen'}</span>
              {showRegisterDetails ? (
                <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
              )}
            </button>
          </div>

          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
            <div className="pb-3 border-b border-slate-100">
              <dt className="text-xs text-slate-500">Bauherrschaft / Eigentümer</dt>
              <dd className="mt-0.5 font-medium text-slate-900">{caseItem.ownerName}</dd>
              <dd className="text-xs text-emerald-700 mt-0.5">
                {caseItem.ownerVerificationSource}
              </dd>
            </div>

            <div className="pb-3 border-b border-slate-100">
              <dt className="text-xs text-slate-500">Parzelle & Gebäudeidentifikator (EGID)</dt>
              <dd className="mt-0.5 font-mono font-medium text-slate-900 tabular-nums">
                {caseItem.parcelNumber} · EGID {caseItem.egid}
              </dd>
              <dd className="text-xs text-slate-500 mt-0.5">
                Gemeinde {caseItem.municipality} (Kanton Aargau)
              </dd>
            </div>

            <div className="pb-3 border-b border-slate-100">
              <dt className="text-xs text-slate-500">Bausumme & Vorkalkulierte Prämie</dt>
              <dd className="mt-0.5 font-mono font-semibold text-slate-900 tabular-nums">
                {formatChf(caseItem.buildingSumChf)}
                <span className="font-sans font-normal text-slate-500 text-xs ml-2">
                  (Prämie Bauzeit: {formatChf(caseItem.estimatedPremiumChf)})
                </span>
              </dd>
              <dd className="text-xs text-slate-500 mt-0.5">
                Policen-Vormerkung #{caseItem.policyPreviewNumber}
              </dd>
            </div>

            <div className="pb-3 border-b border-slate-100">
              <dt className="text-xs text-slate-500">Bauzeit / Versicherungs-Laufzeit</dt>
              <dd className="mt-0.5 font-medium text-slate-900 tabular-nums">
                {caseItem.durationLabel}
              </dd>
              <dd className="text-xs text-slate-500 mt-0.5">
                Gefahrenstufe AGIS: {caseItem.hazardLevel}
              </dd>
            </div>

            <div className="pb-3 border-b border-slate-100 md:col-span-2">
              <dt className="text-xs text-slate-500">Automatische Verknüpfung zum Bauamt</dt>
              <dd className="mt-1 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 font-medium text-slate-900">
                  <Building2 className="w-4 h-4 text-[#00A3E0] shrink-0" aria-hidden="true" />
                  <span className="font-mono text-xs sm:text-sm">{caseItem.bauamtRef}</span>
                </div>
                <span className="text-xs font-medium text-emerald-700">
                  {caseItem.bauamtStatus}
                </span>
              </dd>
            </div>
          </dl>

          {showRegisterDetails && (
            <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-700 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="font-semibold text-slate-900">Architekt / Projektverfasser</p>
                <p className="mt-1">{caseItem.architectName}</p>
                <p className="font-mono text-[11px] text-slate-500 mt-0.5">
                  {caseItem.architectEmail}
                </p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Automatische Zielsysteme</p>
                <p className="mt-1">TOPAX Vertragsanlage (Echtzeit)</p>
                <p className="text-slate-500 mt-0.5">SAP msg.PIA Debitorenbuchung</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Prüfprotokoll</p>
                <p className="mt-1">Abgleich ohne Abweichungen</p>
                <p className="font-mono text-[11px] text-slate-500 mt-0.5">
                  Dunkelprüfungs-Regelwerk AGV 2026
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Section 3: Integrierter Vertriebs-Trigger (AquaProtect) */}
        <section
          aria-labelledby="vertrieb-heading"
          className="pt-6 border-t border-slate-200"
        >
          <div className="flex items-baseline justify-between gap-2 mb-3">
            <h2 id="vertrieb-heading" className="text-sm font-semibold text-slate-900">
              Integrierter Vertriebs-Trigger (Cross-Selling)
            </h2>
            <span className="text-xs text-slate-500">Team Kundenservice Vertrag & Vertrieb</span>
          </div>

          <label
            htmlFor={`aquaprotect-${caseItem.id}`}
            className={`flex items-start gap-3.5 p-4 rounded-md border transition-colors cursor-pointer ${
              aquaProtectEnabled
                ? 'bg-sky-50/70 border-[#00A3E0]/50'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
            } ${caseItem.status === 'completed' ? 'opacity-75 cursor-default' : ''}`}
          >
            <input
              id={`aquaprotect-${caseItem.id}`}
              type="checkbox"
              checked={aquaProtectEnabled}
              disabled={caseItem.status === 'completed'}
              onChange={(e) => setAquaProtectEnabled(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#003366] focus:ring-[#00A3E0] shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-semibold text-slate-900 inline-flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-[#00A3E0] shrink-0" aria-hidden="true" />
                  Freiwillige Gebäudewasserversicherung «AquaProtect» automatisch mit 10%
                  Bauherren-Rabatt offerieren
                </span>
                <span className="font-mono text-xs font-semibold text-[#003366] tabular-nums whitespace-nowrap">
                  {formatChf(aquaDiscounted)} / Jahr
                  <span className="text-slate-400 line-through font-normal ml-1.5">
                    {formatChf(aquaBase)}
                  </span>
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {aquaProtectEnabled
                  ? 'Aktiviert: Die personalisierte AquaProtect-Offerte wird automatisch mit der Bauzeitpolice generiert und an die Bauherrschaft versendet.'
                  : 'Deaktiviert: Es wird ausschliesslich die obligatorische Bauzeitpolice ohne Zusatz-Offerte versendet.'}
              </p>
            </div>
          </label>
        </section>

        {/* Section 4: Primary 1-Click Action Footer */}
        {caseItem.status === 'open' && (
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs text-slate-600">
              <p className="font-medium text-slate-800">
                Bereit zur automatischen Policierung (#{caseItem.policyPreviewNumber})
              </p>
              <p className="mt-0.5">
                Synchronisiert TOPAX, SAP msg.PIA und den digitalen Versand in einem Schritt.
              </p>
            </div>

            <button
              type="button"
              onClick={handleOneClickApprove}
              disabled={isProcessing}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3 text-sm font-semibold text-white bg-[#003366] hover:bg-[#002347] disabled:opacity-70 rounded-md shadow-xs transition-all active:scale-[0.99] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00A3E0]"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  <span>Police wird generiert & synchronisiert…</span>
                </>
              ) : (
                <>
                  <FileCheck2 className="w-4 h-4 text-[#00A3E0]" aria-hidden="true" />
                  <span>1-Click Standard-Freigabe erteilen (Police generieren & versenden)</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
