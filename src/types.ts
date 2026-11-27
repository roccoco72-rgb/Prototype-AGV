export type CaseCategory = 'standard' | 'complex';

export type CaseStatus = 'open' | 'completed';

export type ComplexDecisionType = 'inquiry' | 'appraiser' | 'clause';

export type AppraiserRegion = 'nord' | 'sued';

export type TopView = 'cockpit' | 'impact' | 'rules';

export interface PlausibilityCheck {
  id: string;
  label: string;
  source: string;
  detail: string;
}

export interface RiskFinding {
  id: string;
  severity: 'high' | 'medium';
  title: string;
  metric: string;
  detail: string;
  source: string;
}

export interface DecisionRecord {
  completedAt: string;
  policyNumber?: string;
  decisionTitle: string;
  summary: string;
  systemsSynced: string[];
  aquaProtectIncluded?: boolean;
  complexOption?: ComplexDecisionType;
  appraiserRegion?: AppraiserRegion;
  selectedAuflagen?: string[];
  selectedClause?: string;
  emailRecipient?: string;
  emailSubject?: string;
  notes?: string;
}

export interface CaseItem {
  id: string;
  code: string;
  category: CaseCategory;
  segmentLabel: string;
  title: string;
  municipality: string;
  address: string;
  egid: string;
  parcelNumber: string;
  buildingSumChf: number;
  estimatedPremiumChf: number;
  hazardLevel: string;
  hazardColor: 'white' | 'low' | 'yellow-blue';
  ownerName: string;
  ownerVerified: boolean;
  ownerVerificationSource: string;
  architectName: string;
  architectEmail: string;
  durationLabel: string;
  bauamtRef: string;
  bauamtStatus: string;
  aiRecommendation: string;
  receivedAt: string;
  timeSavedMinutes: number;
  status: CaseStatus;
  policyPreviewNumber: string;
  plausibilityChecks: PlausibilityCheck[];
  aquaProtectPremiumChf?: number;
  riskBannerHeadline?: string;
  riskBannerDetail?: string;
  riskFindings?: RiskFinding[];
  defaultEmailTemplate?: {
    to: string;
    subject: string;
    body: string;
  };
  decision?: DecisionRecord;
}
