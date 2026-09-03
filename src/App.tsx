import React, { useState, useEffect } from 'react';
import { INITIAL_PROCESS_STEPS } from './data/processData';
import { ProcessStep } from './types';
import { StepCard } from './components/StepCard';
import { ConnectorLine } from './components/ConnectorLine';
import { StepDetailModal } from './components/StepDetailModal';
import { ExportSnippetModal } from './components/ExportSnippetModal';
import { Moon, Sun, Code2, RotateCcw, Check } from 'lucide-react';

export default function App() {
  const [steps, setSteps] = useState<ProcessStep[]>(INITIAL_PROCESS_STEPS);
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('design_process_theme');
      if (saved) return saved === 'dark';
      return false; // default to light as shown in the reference image
    }
    return false;
  });

  // Dark mode effect
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('design_process_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('design_process_theme', 'light');
    }
  }, [isDark]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2400);
  };

  const handleUpdateStep = (updated: ProcessStep) => {
    setSteps((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    showToast('Fase actualizada');
  };

  const handleReset = () => {
    setSteps(INITIAL_PROCESS_STEPS);
    showToast('Valores restablecidos');
  };

  const selectedStepIndex = steps.findIndex((s) => s.id === selectedStepId);
  const currentSelectedStep = selectedStepIndex !== -1 ? steps[selectedStepIndex] : null;

  return (
    <div className="min-h-screen bg-[#ECEBE6] text-[#111111] dark:bg-[#121212] dark:text-[#EAEAEA] transition-colors duration-200 antialiased selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-neutral-900 flex flex-col justify-between">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-3.5 py-2 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xl font-mono text-xs font-semibold animate-fade-in">
          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-12 flex-1 flex flex-col justify-between">
        
        {/* Top Header Row */}
        <header className="mb-10 sm:mb-14 lg:mb-16">
          <div className="flex items-center justify-between pb-3">
            {/* Left Badge: (02) Design Process */}
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full border border-neutral-800 dark:border-neutral-300 flex items-center justify-center text-[10px] font-bold font-mono text-neutral-800 dark:text-neutral-200">
                02
              </span>
              <span className="px-3 py-1 rounded-full bg-neutral-900 text-white dark:bg-[#F2F2F0] dark:text-neutral-900 text-xs font-semibold tracking-tight">
                Design Process
              </span>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold tracking-widest text-neutral-700 dark:text-neutral-400 select-none hidden sm:inline">
                &gt;&gt;&gt;
              </span>

              <div className="flex items-center gap-1.5 ml-2 border-l border-neutral-300 dark:border-neutral-700 pl-3">
                {/* Reset button */}
                <button
                  type="button"
                  onClick={handleReset}
                  className="p-1.5 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 transition-colors"
                  title="Restablecer contenido inicial"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                {/* Dark/Light toggle */}
                <button
                  type="button"
                  onClick={() => setIsDark(!isDark)}
                  className="p-1.5 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 transition-colors"
                  title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                  aria-label="Alternar tema de color"
                >
                  {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                </button>

                {/* Export Code */}
                <button
                  type="button"
                  onClick={() => setIsExportOpen(true)}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono uppercase bg-neutral-900 text-white dark:bg-[#F2F2F0] dark:text-neutral-900 hover:opacity-90 transition-opacity ml-1"
                >
                  <Code2 className="w-3 h-3" />
                  <span className="hidden sm:inline">Código</span>
                </button>
              </div>
            </div>
          </div>

          {/* Thin Hairline Divider */}
          <div className="h-px bg-neutral-300 dark:bg-neutral-800 w-full" />
        </header>

        {/* Hero Section: Display Headline + Subtitle */}
        <section className="mb-12 sm:mb-16 lg:mb-20">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 lg:gap-12">
            {/* Massive Display Title */}
            <h1 className="text-5xl sm:text-7xl lg:text-[5.75rem] font-bold tracking-tight leading-[0.93] text-[#111111] dark:text-white select-none">
              Designing<br />
              a Better<br />
              Experience
            </h1>

            {/* Side Subtitle */}
            <div className="md:pt-4 text-xs sm:text-sm font-mono font-semibold uppercase tracking-wider text-neutral-800 dark:text-neutral-300 max-w-[210px] leading-snug select-none">
              FOR THE<br />
              CONVENIENT USE<br />
              OF EACH USER
            </div>
          </div>
        </section>

        {/* 6 Process Cards Bento Grid */}
        <section className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-3.5">
            {steps.map((step, idx) => (
              <StepCard
                key={step.id}
                step={step}
                index={idx}
                isSelected={selectedStepId === step.id}
                onClick={() => setSelectedStepId(step.id)}
              />
            ))}
          </div>

          {/* Sinuous Connector Curve underneath the cards (Desktop) */}
          <ConnectorLine />
        </section>

        {/* Minimal Footer */}
        <footer className="mt-12 pt-6 border-t border-neutral-300/80 dark:border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-neutral-500 gap-2">
          <span>02 / PROCESO DE DISEÑO • RETÍCULA BENTO</span>
          <span className="text-[11px] text-neutral-400">
            Haz clic en cualquier fase para ver entregables y detalles
          </span>
        </footer>
      </div>

      {/* Step Detail Modal */}
      <StepDetailModal
        step={currentSelectedStep}
        onClose={() => setSelectedStepId(null)}
        hasPrev={selectedStepIndex > 0}
        hasNext={selectedStepIndex < steps.length - 1}
        onPrev={() => {
          if (selectedStepIndex > 0) {
            setSelectedStepId(steps[selectedStepIndex - 1].id);
          }
        }}
        onNext={() => {
          if (selectedStepIndex < steps.length - 1) {
            setSelectedStepId(steps[selectedStepIndex + 1].id);
          }
        }}
        onUpdateStep={handleUpdateStep}
      />

      {/* Code Export Modal */}
      {isExportOpen && (
        <ExportSnippetModal
          steps={steps}
          onClose={() => setIsExportOpen(false)}
        />
      )}
    </div>
  );
}
