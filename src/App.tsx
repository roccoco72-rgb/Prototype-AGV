import { useState, useMemo } from 'react';
import { INITIAL_CASES } from './data/cases';
import { CaseItem, DecisionRecord, TopView } from './types';
import { Header } from './components/Header';
import { KpiBar } from './components/KpiBar';
import { CaseSidebar } from './components/CaseSidebar';
import { StandardCaseView } from './components/StandardCaseView';
import { ComplexCaseView } from './components/ComplexCaseView';
import { ImpactView } from './components/ImpactView';
import { RulesView } from './components/RulesView';

const BASELINE_COMPLETED_TODAY = 14;

export default function App() {
  const [activeView, setActiveView] = useState<TopView>('cockpit');
  const [cases, setCases] = useState<CaseItem[]>(INITIAL_CASES);
  const [selectedCaseId, setSelectedCaseId] = useState<string>(INITIAL_CASES[0].id);

  const selectedCase = useMemo(
    () => cases.find((c) => c.id === selectedCaseId) ?? cases[0],
    [cases, selectedCaseId]
  );

  const openCases = useMemo(() => cases.filter((c) => c.status === 'open'), [cases]);
  const sessionCompletedCount = useMemo(
    () => cases.filter((c) => c.status === 'completed').length,
    [cases]
  );

  const completedTotal = BASELINE_COMPLETED_TODAY + sessionCompletedCount;

  // Slightly reflect real throughput as standard cases get approved in 1 click
  const avgCycleMinutes = useMemo(() => {
    const standardDone = cases.filter(
      (c) => c.category === 'standard' && c.status === 'completed'
    ).length;
    return Math.max(2.9, 3.4 - standardDone * 0.2);
  }, [cases]);

  const automationRate = useMemo(() => {
    const standardDone = cases.filter(
      (c) => c.category === 'standard' && c.status === 'completed'
    ).length;
    return 82 + standardDone;
  }, [cases]);

  function handleCompleteCase(caseId: string, decision: DecisionRecord) {
    setCases((prev) =>
      prev.map((item) =>
        item.id === caseId
          ? {
              ...item,
              status: 'completed',
              decision,
            }
          : item
      )
    );
  }

  function handleReopenCase(caseId: string) {
    setCases((prev) =>
      prev.map((item) =>
        item.id === caseId
          ? {
              ...item,
              status: 'open',
              decision: undefined,
            }
          : item
      )
    );
  }

  function handleOpenNextOpenCase() {
    const nextOpen = cases.find((c) => c.status === 'open' && c.id !== selectedCaseId);
    if (nextOpen) {
      setSelectedCaseId(nextOpen.id);
    }
  }

  function handleResetDemo() {
    setCases(INITIAL_CASES);
    setSelectedCaseId(INITIAL_CASES[0].id);
    setActiveView('cockpit');
  }

  const hasOtherOpenCase = openCases.some((c) => c.id !== selectedCase.id);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA] text-slate-900">
      <Header activeView={activeView} onSelectView={setActiveView} />

      <KpiBar
        openCount={openCases.length}
        completedTotal={completedTotal}
        sessionCompletedCount={sessionCompletedCount}
        avgCycleMinutes={avgCycleMinutes}
        automationRate={automationRate}
        onResetDemo={handleResetDemo}
      />

      <main className="flex-1 max-w-[1520px] w-full mx-auto px-4 sm:px-6 py-6">
        {activeView === 'cockpit' && (
          <div className="flex flex-col lg:flex-row items-start gap-6">
            <CaseSidebar
              cases={cases}
              selectedCaseId={selectedCase.id}
              onSelectCase={(id) => {
                setSelectedCaseId(id);
                setActiveView('cockpit');
              }}
            />

            <div className="flex-1 min-w-0 w-full">
              {selectedCase.category === 'standard' ? (
                <StandardCaseView
                  caseItem={selectedCase}
                  hasNextOpenCase={hasOtherOpenCase}
                  onApprove={handleCompleteCase}
                  onReopen={handleReopenCase}
                  onOpenNext={handleOpenNextOpenCase}
                />
              ) : (
                <ComplexCaseView
                  caseItem={selectedCase}
                  hasNextOpenCase={hasOtherOpenCase}
                  onComplete={handleCompleteCase}
                  onReopen={handleReopenCase}
                  onOpenNext={handleOpenNextOpenCase}
                />
              )}
            </div>
          </div>
        )}

        {activeView === 'impact' && (
          <ImpactView onBackToCockpit={() => setActiveView('cockpit')} />
        )}

        {activeView === 'rules' && (
          <RulesView onBackToCockpit={() => setActiveView('cockpit')} />
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white mt-auto">
        <div className="max-w-[1520px] mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <span>Aargauische Gebäudeversicherung (AGV) · Bereich Kundenservice Vertrag &amp; Vertrieb</span>
          <span>Interaktiver Prototyp · Human-in-the-Loop Bauzeitversicherung</span>
        </div>
      </footer>
    </div>
  );
}
