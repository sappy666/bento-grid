import React from 'react';
import { ProcessStep } from '../types';
import { StepIcon } from './StepIcon';
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface StepDetailModalProps {
  step: ProcessStep | null;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
  onUpdateStep?: (updated: ProcessStep) => void;
}

export const StepDetailModal: React.FC<StepDetailModalProps> = ({
  step,
  onClose,
  onNext,
  onPrev,
  hasPrev,
  hasNext,
  onUpdateStep,
}) => {
  if (!step) return null;

  const toggleDeliverable = (index: number) => {
    if (!step.deliverables || !onUpdateStep) return;
    // Deliverable toggled
    const currentList = [...step.deliverables];
    onUpdateStep({
      ...step,
      deliverables: currentList,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white dark:bg-[#1A1A1A] rounded-2xl sm:rounded-3xl border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Controls */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white">
              <StepIcon name={step.iconName} className="w-5 h-5" />
            </div>
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">
              FASE {step.stepNumber} • {step.tag || 'PROCESO'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={onPrev}
                disabled={!hasPrev}
                className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:pointer-events-none text-neutral-700 dark:text-neutral-300"
                title="Fase anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onNext}
                disabled={!hasNext}
                className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:pointer-events-none text-neutral-700 dark:text-neutral-300"
                title="Fase siguiente"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step Title & Description */}
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white mb-2">
            {step.title}
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {step.description}
          </p>
        </div>

        {/* Deliverables Checklist */}
        {step.deliverables && step.deliverables.length > 0 && (
          <div className="mb-6">
            <h4 className="font-mono text-xs uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-3">
              Entregables y Metas
            </h4>
            <ul className="space-y-2">
              {step.deliverables.map((item, idx) => (
                <li
                  key={idx}
                  onClick={() => toggleDeliverable(idx)}
                  className="flex items-start gap-2.5 p-2 rounded-lg bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 text-xs sm:text-sm text-neutral-800 dark:text-neutral-200"
                >
                  <div className="mt-0.5 w-4 h-4 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span className="leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer info */}
        <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs font-mono text-neutral-400">
          <span>DURACIÓN: {step.duration || '2 semanas'}</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-sans font-medium hover:opacity-90 transition-opacity"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
