import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  ClipboardCheck,
  FileWarning,
  Loader2,
  Mail,
  MapPin,
  RotateCcw,
  ShieldAlert,
} from 'lucide-react';
import { AppraiserRegion, CaseItem, ComplexDecisionType, DecisionRecord } from '../types';
import {
  formatChf,
  SPECIAL_CLAUSES,
  STANDARD_AUFLAGEN_OPTIONS,
} from '../data/cases';
import { HazardMapSvg } from './HazardMapSvg';
import { TimeSavingsInfo } from './TimeSavingsInfo';

interface ComplexCaseViewProps {
  caseItem: CaseItem;
  hasNextOpenCase: boolean;
  onComplete: (caseId: string, decision: DecisionRecord) => void;
  onReopen: (caseId: string) => void;
  onOpenNext: () => void;
}

export function ComplexCaseView({
  caseItem,
  hasNextOpenCase,
  onComplete,
  onReopen,
  onOpenNext,
}: ComplexCaseViewProps) {
  const [selectedOption, setSelectedOption] = useState<ComplexDecisionType>('inquiry');
  const [emailTo, setEmailTo] = useState(caseItem.defaultEmailTemplate?.to ?? '');
  const [emailSubject, setEmailSubject] = useState(caseItem.defaultEmailTemplate?.subject ?? '');
  const [emailBody, setEmailBody] = useState(caseItem.defaultEmailTemplate?.body ?? '');

  const [appraiserRegion, setAppraiserRegion] = useState<AppraiserRegion>('nord');
  const [selectedAuflagen, setSelectedAuflagen] = useState<string[]>([
    STANDARD_AUFLAGEN_OPTIONS[0],
    STANDARD_AUFLAGEN_OPTIONS[1],
  ]);

  const [selectedClauseId, setSelectedClauseId] = useState<string>(SPECIAL_CLAUSES[0].id);
  const [fourEyesConfirmed, setFourEyesConfirmed] = useState(false);

  const [notes, setNotes] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setSelectedOption(caseItem.decision?.complexOption ?? 'inquiry');
    setEmailTo(caseItem.defaultEmailTemplate?.to ?? '');
    setEmailSubject(caseItem.defaultEmailTemplate?.subject ?? '');
    setEmailBody(caseItem.defaultEmailTemplate?.body ?? '');
    setAppraiserRegion(caseItem.decision?.appraiserRegion ?? 'nord');
    setSelectedAuflagen(
      caseItem.decision?.selectedAuflagen ?? [
        STANDARD_AUFLAGEN_OPTIONS[0],
        STANDARD_AUFLAGEN_OPTIONS[1],
      ]
    );
    setNotes(caseItem.decision?.notes ?? '');
    setValidationError(null);
    setIsSubmitting(false);
  }, [caseItem.id, caseItem.decision, caseItem.defaultEmailTemplate]);

  function toggleAuflage(item: string) {
    setSelectedAuflagen((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );
  }

  function handleConfirmDecision() {
    if (isSubmitting || caseItem.status === 'completed') return;

    if (selectedOption === 'appraiser' && selectedAuflagen.length === 0) {
      setValidationError('Bitte wählen Sie mindestens eine konkrete Auflage für den Schätzungsauftrag aus.');
      return;
    }

    if (selectedOption === 'clause' && !fourEyesConfirmed) {
      setValidationError(
        'Bitte bestätigen Sie die Risikodokumentation gemäss Kompetenzstufe 2 für eine manuelle Freigabe.'
      );
      return;
    }

    setValidationError(null);
    setIsSubmitting(true);

    window.setTimeout(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('de-CH', {
        hour: '2-digit',
        minute: '2-digit',
      });

      let decision: DecisionRecord;

      if (selectedOption === 'inquiry') {
        decision = {
          completedAt: `Heute, ${timeStr}`,
          decisionTitle: 'Rückfrage Objektschutznachweis',
          summary: `Nachforderung an ${emailTo} versendet. Dossier in TOPAX auf «Pendent — Objektschutz» gesetzt (Wiedervorlage 14 Tage).`,
          systemsSynced: [
            'E-Mail-Nachforderung versendet',
            'TOPAX Pendenz #P-2026-8492 erstellt',
            'Bauamt Windisch verknüpft',
          ],
          complexOption: 'inquiry',
          emailRecipient: emailTo,
          emailSubject,
          notes: notes.trim() || undefined,
        };
      } else if (selectedOption === 'appraiser') {
        const regionLabel =
          appraiserRegion === 'nord' ? 'Schätzung Nord (Brugg/Baden)' : 'Schätzung Süd (Aarau/Lenzburg)';
        decision = {
          completedAt: `Heute, ${timeStr}`,
          decisionTitle: `Schätzer aufgeboten (${appraiserRegion === 'nord' ? 'Nord' : 'Süd'})`,
          summary: `Digitaler Begehungsauftrag inkl. ${selectedAuflagen.length} Auflagen an ${regionLabel} übermittelt und in TOPAX protokolliert.`,
          systemsSynced: [
            `Digitaler Trigger an ${regionLabel}`,
            `${selectedAuflagen.length} Elementar-Auflagen in TOPAX erfasst`,
            'SAP msg.PIA Vorbehalt aktiv',
          ],
          complexOption: 'appraiser',
          appraiserRegion,
          selectedAuflagen,
          notes: notes.trim() || undefined,
        };
      } else {
        const clauseObj =
          SPECIAL_CLAUSES.find((c) => c.id === selectedClauseId) ?? SPECIAL_CLAUSES[0];
        decision = {
          completedAt: `Heute, ${timeStr}`,
          policyNumber: `${caseItem.policyPreviewNumber}-SK`,
          decisionTitle: `Freigabe mit Klausel ${clauseObj.id}`,
          summary: `Police #${caseItem.policyPreviewNumber}-SK mit Sonderklausel Elementarschutz ausgestellt, TOPAX-Status aktualisiert, SAP msg.PIA synchronisiert.`,
          systemsSynced: [
            `Police #${caseItem.policyPreviewNumber}-SK generiert`,
            `Sonderklausel ${clauseObj.id} eingebunden`,
            'TOPAX & SAP msg.PIA synchronisiert',
          ],
          complexOption: 'clause',
          selectedClause: clauseObj.label,
          notes: notes.trim() || undefined,
        };
      }

      setIsSubmitting(false);
      onComplete(caseItem.id, decision);
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
      {/* Prominent Hazard Warning Banner (Clean full 1px border, no thick left bar) */}
      <div
        role="alert"
        className="px-6 py-4 bg-amber-50 border-b border-amber-300 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-700 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="text-sm font-bold text-red-950">
              {caseItem.riskBannerHeadline}
            </p>
            <p className="text-xs text-amber-950/90 mt-1 leading-relaxed">
              {caseItem.riskBannerDetail}
            </p>
          </div>
        </div>
        <div className="shrink-0">
          <TimeSavingsInfo />
        </div>
      </div>

      {/* Case Header & Compact Stammdaten Strip */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-mono font-semibold text-amber-800">{caseItem.code}</span>
              <span aria-hidden="true">·</span>
              <span>Komplexer Case (20%-Segment · Geführte Risikoprüfung)</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">EGID {caseItem.egid}</span>
            </div>
            <h1 className="mt-2 text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
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

        {/* Compact Key-Value Summary Row */}
        <dl className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <dt className="text-slate-500">Bauherrschaft</dt>
            <dd className="mt-0.5 font-medium text-slate-900">{caseItem.ownerName}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Parzelle & Bauamt</dt>
            <dd className="mt-0.5 font-mono text-slate-900">
              {caseItem.parcelNumber} · BG-2026-0891
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">Architekturbüro</dt>
            <dd className="mt-0.5 font-medium text-slate-900">{caseItem.architectName}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Laufzeit Bauzeit</dt>
            <dd className="mt-0.5 font-medium text-slate-900 tabular-nums">
              {caseItem.durationLabel}
            </dd>
          </div>
        </dl>
      </div>

      {/* Completion Summary Banner if Decision Confirmed */}
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
                  Entscheidung bestätigt: {caseItem.decision.decisionTitle}
                </p>
                <p className="text-xs text-emerald-900 mt-1 leading-relaxed">
                  {caseItem.decision.summary}
                </p>
                {caseItem.decision.notes && (
                  <p className="mt-2 text-xs text-emerald-900 bg-white/80 border border-emerald-200 rounded px-3 py-2">
                    <span className="font-semibold">Sachbearbeiter-Notiz:</span>{' '}
                    {caseItem.decision.notes}
                  </p>
                )}
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
                <span>Entscheidung anpassen</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Split-Screen View: Left = Automatic Risk Analysis, Right = Guided Decision Cockpit */}
      <div className="grid grid-cols-1 xl:grid-cols-12 divide-y xl:divide-y-0 xl:divide-x divide-slate-200 items-stretch">
        {/* LEFT COLUMN: Automatische Risikoanalyse */}
        <section
          aria-labelledby="risk-analysis-heading"
          className="xl:col-span-6 p-6 flex flex-col gap-5"
        >
          <div className="flex items-baseline justify-between gap-2">
            <h2 id="risk-analysis-heading" className="text-sm font-semibold text-slate-900">
              Automatische Risikoanalyse (AGIS &amp; Baugesuch)
            </h2>
            <span className="text-xs font-medium text-red-700">3 Prüfbefunde erkannt</span>
          </div>

          {/* Interactive Cantonal Hazard Map */}
          <HazardMapSvg />

          {/* Detailed Risk Findings */}
          <div className="space-y-3">
            {caseItem.riskFindings?.map((finding) => {
              const isHigh = finding.severity === 'high';
              return (
                <div
                  key={finding.id}
                  className={`p-4 rounded-md border ${
                    isHigh
                      ? 'bg-red-50/55 border-red-200'
                      : 'bg-amber-50/60 border-amber-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2">
                      {isHigh ? (
                        <FileWarning
                          className="w-4 h-4 text-red-700 shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                      ) : (
                        <ShieldAlert
                          className="w-4 h-4 text-amber-700 shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                      )}
                      <h3 className="text-xs font-bold text-slate-900">{finding.title}</h3>
                    </div>
                    <span
                      className={`font-mono text-xs font-semibold tabular-nums whitespace-nowrap shrink-0 ${
                        isHigh ? 'text-red-800' : 'text-amber-900'
                      }`}
                    >
                      {finding.metric}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-700 leading-relaxed pl-6">
                    {finding.detail}
                  </p>
                  <p className="mt-2 pl-6 font-mono text-[10px] text-slate-500">
                    Quelle: {finding.source}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* RIGHT COLUMN: Entscheidungscockpit für den Sachbearbeiter */}
        <section
          aria-labelledby="decision-cockpit-heading"
          className="xl:col-span-6 p-6 flex flex-col justify-between gap-6 bg-slate-50/40"
        >
          <div className="space-y-5">
            <div className="flex items-baseline justify-between gap-2">
              <h2 id="decision-cockpit-heading" className="text-sm font-semibold text-slate-900">
                Entscheidungscockpit Sachbearbeitung
              </h2>
              <span className="text-xs text-slate-500">3 geführte Handlungsoptionen</span>
            </div>

            {/* 3 Option Cards */}
            <div role="radiogroup" aria-label="Entscheidungsoption wählen" className="space-y-2.5">
              {/* Option 1 */}
              <button
                type="button"
                role="radio"
                aria-checked={selectedOption === 'inquiry'}
                disabled={caseItem.status === 'completed'}
                onClick={() => {
                  setSelectedOption('inquiry');
                  setValidationError(null);
                }}
                className={`w-full text-left p-3.5 rounded-md border transition-colors flex items-start gap-3 focus-visible:outline-2 focus-visible:outline-[#00A3E0] ${
                  selectedOption === 'inquiry'
                    ? 'bg-white border-[#003366] ring-1 ring-[#003366]/20'
                    : 'bg-white/70 border-slate-200 hover:bg-white'
                } ${caseItem.status === 'completed' ? 'opacity-75 cursor-default' : ''}`}
              >
                <span
                  className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                    selectedOption === 'inquiry'
                      ? 'border-[#003366] bg-[#003366]'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {selectedOption === 'inquiry' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#003366] shrink-0" aria-hidden="true" />
                    <span className="text-xs sm:text-sm font-semibold text-slate-900">
                      1. Rückfrage an Bauherr/Architekt starten
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Vorgefertigtes E-Mail-Template zur Nachforderung des Objektschutznachweises (HQ100).
                  </p>
                </div>
              </button>

              {/* Option 2 */}
              <button
                type="button"
                role="radio"
                aria-checked={selectedOption === 'appraiser'}
                disabled={caseItem.status === 'completed'}
                onClick={() => {
                  setSelectedOption('appraiser');
                  setValidationError(null);
                }}
                className={`w-full text-left p-3.5 rounded-md border transition-colors flex items-start gap-3 focus-visible:outline-2 focus-visible:outline-[#00A3E0] ${
                  selectedOption === 'appraiser'
                    ? 'bg-white border-[#003366] ring-1 ring-[#003366]/20'
                    : 'bg-white/70 border-slate-200 hover:bg-white'
                } ${caseItem.status === 'completed' ? 'opacity-75 cursor-default' : ''}`}
              >
                <span
                  className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                    selectedOption === 'appraiser'
                      ? 'border-[#003366] bg-[#003366]'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {selectedOption === 'appraiser' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#003366] shrink-0" aria-hidden="true" />
                    <span className="text-xs sm:text-sm font-semibold text-slate-900">
                      2. Auflage erfassen &amp; Schätzer vor Ort aufbieten
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Digitaler Auftrag an Schätzung Nord/Süd inklusive verbindlicher Hochwasser-Auflagen.
                  </p>
                </div>
              </button>

              {/* Option 3 */}
              <button
                type="button"
                role="radio"
                aria-checked={selectedOption === 'clause'}
                disabled={caseItem.status === 'completed'}
                onClick={() => {
                  setSelectedOption('clause');
                  setValidationError(null);
                }}
                className={`w-full text-left p-3.5 rounded-md border transition-colors flex items-start gap-3 focus-visible:outline-2 focus-visible:outline-[#00A3E0] ${
                  selectedOption === 'clause'
                    ? 'bg-white border-[#003366] ring-1 ring-[#003366]/20'
                    : 'bg-white/70 border-slate-200 hover:bg-white'
                } ${caseItem.status === 'completed' ? 'opacity-75 cursor-default' : ''}`}
              >
                <span
                  className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                    selectedOption === 'clause'
                      ? 'border-[#003366] bg-[#003366]'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {selectedOption === 'clause' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <ClipboardCheck
                      className="w-3.5 h-3.5 text-[#003366] shrink-0"
                      aria-hidden="true"
                    />
                    <span className="text-xs sm:text-sm font-semibold text-slate-900">
                      3. Manuelle Freigabe mit Sonderklausel Elementarschutz
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Direkte Policierung mit spezifischer Risikoklausel gemäss Kompetenzstufe 2.
                  </p>
                </div>
              </button>
            </div>

            {/* Dynamic Configuration Panel for Active Option */}
            <div className="p-4 bg-white border border-slate-200 rounded-md space-y-3.5">
              {selectedOption === 'inquiry' && (
                <>
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
                    <span className="text-xs font-semibold text-[#003366]">
                      E-Mail-Template: Objektschutznachweis anfordern
                    </span>
                    <span className="text-[11px] text-slate-500">Editierbar vor Versand</span>
                  </div>
                  <div className="space-y-2.5 text-xs">
                    <div>
                      <label htmlFor="email-to" className="block font-medium text-slate-600 mb-1">
                        Empfänger
                      </label>
                      <input
                        id="email-to"
                        type="text"
                        value={emailTo}
                        disabled={caseItem.status === 'completed'}
                        onChange={(e) => setEmailTo(e.target.value)}
                        className="w-full px-3 py-1.5 font-mono text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-[#00A3E0] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email-subject"
                        className="block font-medium text-slate-600 mb-1"
                      >
                        Betreff
                      </label>
                      <input
                        id="email-subject"
                        type="text"
                        value={emailSubject}
                        disabled={caseItem.status === 'completed'}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-[#00A3E0] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="email-body" className="block font-medium text-slate-600 mb-1">
                        Nachrichtentext
                      </label>
                      <textarea
                        id="email-body"
                        rows={7}
                        value={emailBody}
                        disabled={caseItem.status === 'completed'}
                        onChange={(e) => setEmailBody(e.target.value)}
                        className="w-full px-3 py-2 text-xs leading-relaxed bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-[#00A3E0] focus:outline-none resize-y"
                      />
                    </div>
                  </div>
                </>
              )}

              {selectedOption === 'appraiser' && (
                <>
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
                    <span className="text-xs font-semibold text-[#003366]">
                      Digitaler Trigger an Schätzung Nord / Süd
                    </span>
                    <span className="text-[11px] text-slate-500">Windisch = Kreis Nord</span>
                  </div>

                  {/* Region Selector */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      disabled={caseItem.status === 'completed'}
                      onClick={() => setAppraiserRegion('nord')}
                      className={`p-2.5 text-left rounded border text-xs transition-colors ${
                        appraiserRegion === 'nord'
                          ? 'bg-sky-50 border-[#003366] text-[#003366] font-semibold'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white'
                      }`}
                    >
                      <span className="block">Schätzung Nord</span>
                      <span className="block text-[11px] font-normal text-slate-500 mt-0.5">
                        Brugg · Baden · Windisch (Empfohlen)
                      </span>
                    </button>
                    <button
                      type="button"
                      disabled={caseItem.status === 'completed'}
                      onClick={() => setAppraiserRegion('sued')}
                      className={`p-2.5 text-left rounded border text-xs transition-colors ${
                        appraiserRegion === 'sued'
                          ? 'bg-sky-50 border-[#003366] text-[#003366] font-semibold'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white'
                      }`}
                    >
                      <span className="block">Schätzung Süd</span>
                      <span className="block text-[11px] font-normal text-slate-500 mt-0.5">
                        Aarau · Lenzburg · Zofingen
                      </span>
                    </button>
                  </div>

                  {/* Auflagen Checklist */}
                  <div className="space-y-2 pt-1">
                    <p className="text-xs font-medium text-slate-700">
                      Verbindliche Auflagen für Begehung &amp; Police:
                    </p>
                    {STANDARD_AUFLAGEN_OPTIONS.map((auflage) => {
                      const checked = selectedAuflagen.includes(auflage);
                      return (
                        <label
                          key={auflage}
                          className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            disabled={caseItem.status === 'completed'}
                            onChange={() => toggleAuflage(auflage)}
                            className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-[#003366] focus:ring-[#00A3E0] shrink-0"
                          />
                          <span className="leading-snug">{auflage}</span>
                        </label>
                      );
                    })}
                  </div>
                </>
              )}

              {selectedOption === 'clause' && (
                <>
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
                    <span className="text-xs font-semibold text-[#003366]">
                      Sonderklausel Elementarschutz definieren
                    </span>
                    <span className="text-[11px] text-amber-800 font-medium">
                      Kompetenzstufe 2
                    </span>
                  </div>

                  <div className="space-y-2">
                    {SPECIAL_CLAUSES.map((clause) => {
                      const active = selectedClauseId === clause.id;
                      return (
                        <label
                          key={clause.id}
                          className={`flex items-start gap-2.5 p-2.5 rounded border cursor-pointer text-xs transition-colors ${
                            active
                              ? 'bg-sky-50/70 border-[#003366]'
                              : 'bg-slate-50 border-slate-200 hover:bg-white'
                          }`}
                        >
                          <input
                            type="radio"
                            name="special-clause"
                            checked={active}
                            disabled={caseItem.status === 'completed'}
                            onChange={() => setSelectedClauseId(clause.id)}
                            className="mt-0.5 h-3.5 w-3.5 text-[#003366] focus:ring-[#00A3E0] shrink-0"
                          />
                          <div>
                            <span className="font-semibold text-slate-900 block">
                              {clause.label}
                            </span>
                            <span className="text-slate-600 block mt-0.5">{clause.summary}</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>

                  <label className="flex items-start gap-2.5 pt-2 border-t border-slate-100 text-xs text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={fourEyesConfirmed}
                      disabled={caseItem.status === 'completed'}
                      onChange={(e) => {
                        setFourEyesConfirmed(e.target.checked);
                        setValidationError(null);
                      }}
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#003366] focus:ring-[#00A3E0] shrink-0"
                    />
                    <span>
                      Ich bestätige, dass die Risikoabwägung für Bausumme CHF 8&apos;700&apos;000.–
                      (HQ100) nachvollziehbar dokumentiert wurde.
                    </span>
                  </label>
                </>
              )}
            </div>

            {/* Sachbearbeiter Notizen & Auflagen */}
            <div>
              <label
                htmlFor="underwriter-notes"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Interne Notizen &amp; Begründung für TOPAX-Dossier
              </label>
              <textarea
                id="underwriter-notes"
                rows={3}
                value={notes}
                disabled={caseItem.status === 'completed'}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="z. B. Telefonat mit Architekt Meier geführt, Nachweis über Schwellenhöhe +0.55 m wird bis Freitag nachgereicht..."
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-md text-slate-900 placeholder:text-slate-400 focus:border-[#00A3E0] focus:outline-none resize-y"
              />
            </div>

            {validationError && (
              <p className="text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {validationError}
              </p>
            )}
          </div>

          {/* Confirm Decision Action Button */}
          {caseItem.status === 'open' && (
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                Wird revisionssicher im TOPAX-Dossier gespeichert.
              </span>
              <button
                type="button"
                onClick={handleConfirmDecision}
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#003366] hover:bg-[#002347] disabled:opacity-70 rounded-md shadow-xs transition-all active:scale-[0.99] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00A3E0]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                    <span>Wird verbucht…</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#00A3E0]" aria-hidden="true" />
                    <span>Entscheidung bestätigen</span>
                  </>
                )}
              </button>
            </div>
          )}
        </section>
      </div>
    </motion.div>
  );
}
