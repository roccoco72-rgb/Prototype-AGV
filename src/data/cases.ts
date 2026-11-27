import { CaseItem } from '../types';

export const TIME_SAVINGS_BREAKDOWN = [
  { step: 'GWR- & EGID-Validierung (Gebäuderegister)', minutes: 6, system: 'BFS / GWR API' },
  { step: 'Grundbuch- & Eigentümerverifikation', minutes: 8, system: 'Terravis / Grundbuch AG' },
  { step: 'Abfrage Kantonale Gefahrenkarte & HQ-Zonen', minutes: 7, system: 'AGIS Geoportal' },
  { step: 'Bauamt-Verknüpfung & Prämien-Vorkalkulation', minutes: 4, system: 'eBau AG / TOPAX' },
];

export const INITIAL_CASES: CaseItem[] = [
  {
    id: 'fall-a',
    code: 'FALL A',
    category: 'standard',
    segmentLabel: 'Standard · 80%',
    title: 'Neubau EFH, Lenzburg',
    municipality: 'Lenzburg',
    address: 'Schlossgasse 14, 5600 Lenzburg',
    egid: '1928374',
    parcelNumber: 'GB-Nr. 1408',
    buildingSumChf: 1250000,
    estimatedPremiumChf: 687.5,
    hazardLevel: 'Keine Gefährdung (Weiss)',
    hazardColor: 'white',
    ownerName: 'Dr. Markus & Sabine Frei-Keller',
    ownerVerified: true,
    ownerVerificationSource: 'Grundbuchamt Lenzburg · eCH-0011 verifiziert',
    architectName: 'Bühler & Partner Architektur AG, Lenzburg',
    architectEmail: 'projekte@buehler-arch.ch',
    durationLabel: '01.03.2026 – 31.08.2027 (18 Monate)',
    bauamtRef: 'BG-2026-0142 · Bauamt Lenzburg',
    bauamtStatus: 'Baubewilligung rechtskräftig (automatisch verknüpft)',
    aiRecommendation: 'KI-Empfehlung: Freigabe',
    receivedAt: 'Heute, 08:14',
    timeSavedMinutes: 25,
    status: 'open',
    policyPreviewNumber: 'BV-2026-4812',
    aquaProtectPremiumChf: 265,
    plausibilityChecks: [
      {
        id: 'id-check',
        label: 'Identität geprüft',
        source: 'Grundbuch & eCH-0011',
        detail: 'Eigentümer stimmt exakt mit Baugesuch überein',
      },
      {
        id: 'value-check',
        label: 'Katasterwert plausibel',
        source: 'SIA 416 / AGV Index',
        detail: 'CHF 940/m³ innerhalb regionalem Vergleichsband',
      },
      {
        id: 'hazard-check',
        label: 'Gefahrenkarte sauber',
        source: 'AGIS Gefahrenkarte',
        detail: 'Zone Weiss — keine Hochwasser- oder Hangrutschgefahr',
      },
      {
        id: 'limit-check',
        label: 'Deckungssumme im Rahmen',
        source: 'AGV Kompetenzstufe 1',
        detail: 'Unterhalb Schwellenwert CHF 2\'500\'000.–',
      },
    ],
  },
  {
    id: 'fall-b',
    code: 'FALL B',
    category: 'standard',
    segmentLabel: 'Standard · 80%',
    title: 'Anbau / Sanierung MFH, Aarau',
    municipality: 'Aarau',
    address: 'Buchserstrasse 18, 5000 Aarau',
    egid: '3847291',
    parcelNumber: 'GB-Nr. 2914',
    buildingSumChf: 420000,
    estimatedPremiumChf: 248.0,
    hazardLevel: 'Restgefährdung gering',
    hazardColor: 'low',
    ownerName: 'STWEG Buchserstrasse 18 (Verw. AargauImmo AG)',
    ownerVerified: true,
    ownerVerificationSource: 'Grundbuchamt Aarau · UID CHE-114.289.031',
    architectName: 'Atelier K. Widmer Architekten, Aarau',
    architectEmail: 'info@atelier-widmer.ch',
    durationLabel: '15.04.2026 – 15.12.2026 (8 Monate)',
    bauamtRef: 'BG-2026-0319 · Stadtbauamt Aarau',
    bauamtStatus: 'Bauanzeige & Kostenvoranschlag verifiziert',
    aiRecommendation: 'KI-Empfehlung: Freigabe',
    receivedAt: 'Heute, 08:42',
    timeSavedMinutes: 25,
    status: 'open',
    policyPreviewNumber: 'BV-2026-4813',
    aquaProtectPremiumChf: 340,
    plausibilityChecks: [
      {
        id: 'id-check',
        label: 'Identität geprüft',
        source: 'Grundbuch & Zefix',
        detail: 'Stockwerkeigentümergemeinschaft & Verwaltung bestätigt',
      },
      {
        id: 'value-check',
        label: 'Katasterwert plausibel',
        source: 'AGV Vorpolice #44019',
        detail: 'Wertvermehrender Anteil plausibel zum Bestandswert',
      },
      {
        id: 'hazard-check',
        label: 'Gefahrenkarte sauber',
        source: 'AGIS Gefahrenkarte',
        detail: 'Restgefährdung gering (HQ300) — keine Auflagenpflicht',
      },
      {
        id: 'limit-check',
        label: 'Deckungssumme im Rahmen',
        source: 'AGV Kompetenzstufe 1',
        detail: 'Standard-Umbau unterhalb CHF 2\'500\'000.–',
      },
    ],
  },
  {
    id: 'fall-c',
    code: 'FALL C',
    category: 'complex',
    segmentLabel: 'Komplex · 20%',
    title: 'Gewerbehalle & Büros, Windisch an der Reuss',
    municipality: 'Windisch',
    address: 'Industriestrasse 8, 5210 Windisch',
    egid: '8492019',
    parcelNumber: 'GB-Nr. 672',
    buildingSumChf: 8700000,
    estimatedPremiumChf: 5420.0,
    hazardLevel: 'Hochwasserzone Gelb/Blau (HQ100)',
    hazardColor: 'yellow-blue',
    ownerName: 'ReussPark Immobilien AG, Brugg',
    ownerVerified: true,
    ownerVerificationSource: 'Grundbuchamt Brugg · UID CHE-392.410.882',
    architectName: 'Meier & Partner Architekten SIA, Baden',
    architectEmail: 'bauleitung@meier-partner-sia.ch',
    durationLabel: '01.05.2026 – 30.11.2028 (31 Monate)',
    bauamtRef: 'BG-2026-0891 · Bauverwaltung Windisch',
    bauamtStatus: 'In Prüfung — Objektschutznachweis pendent',
    aiRecommendation: 'KI-Warnung: Risikoprüfung erforderlich',
    receivedAt: 'Heute, 09:05',
    timeSavedMinutes: 25,
    status: 'open',
    policyPreviewNumber: 'BV-2026-4814',
    riskBannerHeadline:
      'Erhöhtes Elementarrisiko: Bauparzelle liegt in der Hochwasser-Gefahrenzone 2 (HQ100).',
    riskBannerDetail:
      'Automatische 1-Click-Freigabe durch AGV-Regelwerk gestoppt. Bausumme (CHF 8\'700\'000.–) und fehlender Hochwasserschutznachweis erfordern eine geführte Entscheidung.',
    plausibilityChecks: [
      {
        id: 'id-check',
        label: 'Identität geprüft',
        source: 'Grundbuch & Zefix',
        detail: 'ReussPark Immobilien AG verifiziert',
      },
    ],
    riskFindings: [
      {
        id: 'flood-depth',
        severity: 'high',
        title: 'Überflutungstiefe bei HQ100 / Starkregen',
        metric: 'ca. 0.42 m über Terrain',
        detail:
          'Parzelle GB-Nr. 672 grenzt direkt an den Perimeter Reuss-Uferzone. Bei einem 100-jährlichen Hochwasser oder Starkregen-Oberflächenabfluss beträgt die modellierte Wassertiefe 0.4 m im Bereich Zufahrt und Untergeschoss.',
        source: 'AGIS Gefahrenkarte Kanton Aargau (Layer HQ100)',
      },
      {
        id: 'missing-proof',
        severity: 'high',
        title: 'Fehlender Hochwasserschutznachweis im Baugesuch',
        metric: 'Dokument fehlt',
        detail:
          'Die automatische Dokumentenanalyse des Baugesuchs #BG-2026-0891 (Meier & Partner Architekten SIA) hat keinen verbindlichen Objektschutznachweis gemäss SIA 261/1 erkannt (keine Angaben zu Schwellenhöhen, Rückstauklappen oder druckwasserdichten Lichtschächten).',
        source: 'eBau AG Dokumentenextraktion (24 Seiten geprüft)',
      },
      {
        id: 'sum-threshold',
        severity: 'medium',
        title: 'Grossrisiko-Schwellenwert überschritten',
        metric: 'CHF 8\'700\'000.–',
        detail:
          'Die geplante Bausumme übersteigt das Standard-Limit für automatische Freigaben (CHF 2\'500\'000.–). Empfehlung: Präventive Auflagen oder Einbezug Schätzung Nord.',
        source: 'AGV Zeichnungsrichtlinie Bauzeitversicherung',
      },
    ],
    defaultEmailTemplate: {
      to: 'bauleitung@meier-partner-sia.ch, info@reusspark-immo.ch',
      subject:
        'AGV Bauzeitversicherung EGID 8492019 (Windisch, Parzelle 672) — Nachforderung Objektschutznachweis HQ100',
      body: `Guten Tag

Vielen Dank für die Einreichung der Bauzeitversicherungs-Anmeldung für das Bauprojekt «Gewerbehalle & Büros», Industriestrasse 8 in 5210 Windisch (EGID 8492019, Parzelle GB-Nr. 672, Bausumme CHF 8'700'000.–).

Gemäss kantonaler Gefahrenkarte (AGIS) liegt die Bauparzelle in der Hochwasser-Gefahrenzone 2 (HQ100, erwartete Überflutungstiefe ca. 0.4 m bei Starkregen/Hochwasser). In den uns vorliegenden Baugesuchsunterlagen (#BG-2026-0891) fehlt aktuell der verbindliche Hochwasser-Objektschutznachweis.

Für die definitive Policierung bitten wir Sie um Einreichung folgender Unterlagen innert 14 Tagen:
1. Nachweis der Erdgeschoss-Kote bzw. Schwellenhöhen (mind. +0.50 m über Terrain / HQ100-Kote)
2. Konzept für druckwasserdichte Gebäudeöffnungen (Lichtschächte, Tiefgaragenzufahrt, Rückstausicherung)
3. Massnahmen zum Schutz gelagerter Baumaterialien während der Rohbauphase

Nach Eingang prüfen wir die Unterlagen prioritär und stellen die definitive Bauzeitpolice aus.

Freundliche Grüsse
Team Kundenservice Vertrag & Vertrieb
Aargauische Gebäudeversicherung (AGV)`,
    },
  },
];

export const STANDARD_AUFLAGEN_OPTIONS = [
  'Schwellenhöhen & Zugänge mind. +0.50 m über Terrain / HQ100-Kote ausführen',
  'Druckwasserdichte Lichtschächte, Kellerfenster und Rückstauklappen dokumentieren',
  'Baustellen-Notfallkonzept Hochwasser Reuss vor Baubeginn vorlegen',
  'Lagerung hochwertiger Baumaterialien ausserhalb Gefahrenzone Gelb/Blau',
];

export const SPECIAL_CLAUSES = [
  {
    id: 'E-104',
    label: 'Klausel E-104: Erhöhter Elementar-Selbstbehalt CHF 25\'000.– während Rohbauphase',
    summary: 'Gilt bis zur schriftlichen Abnahme der permanenten Hochwasserschutz-Massnahmen.',
  },
  {
    id: 'E-108',
    label: 'Klausel E-108: Ausschluss ungeschützte Bauinstallationen unter Kote +352.40 m ü. M.',
    summary: 'Temporäre Baustellenlager im gefährdeten Uferperimeter sind gesondert zu sichern.',
  },
  {
    id: 'E-112',
    label: 'Klausel E-112: Provisorische Deckung (60 Tage) unter Vorbehalt Objektschutznachweis',
    summary: 'Automatische Wiedervorlage in TOPAX nach 60 Kalendertagen.',
  },
];

export function formatChf(amount: number): string {
  const isWhole = Number.isInteger(amount);
  const fixed = isWhole ? amount.toString() : amount.toFixed(2);
  const [intPart, decPart] = fixed.split('.');
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, "'");
  return isWhole ? `CHF ${formattedInt}.–` : `CHF ${formattedInt}.${decPart}`;
}
