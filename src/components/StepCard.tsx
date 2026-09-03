import React from 'react';
import { ProcessStep } from '../types';
import { StepIcon } from './StepIcon';

interface StepCardProps {
  step: ProcessStep;
  index: number;
  isSelected?: boolean;
  onClick?: () => void;
}

export const StepCard: React.FC<StepCardProps> = ({
  step,
  index,
  isSelected = false,
  onClick,
}) => {
  return (
    <div
      id={`step-card-${step.id}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      className={`group relative flex flex-col justify-between text-left p-6 rounded-2xl sm:rounded-3xl transition-all duration-200 cursor-pointer min-h-[290px] sm:min-h-[320px] select-none ${
        isSelected
          ? 'bg-white dark:bg-[#222222] ring-2 ring-neutral-900 dark:ring-white shadow-lg'
          : 'bg-white dark:bg-[#1C1C1E] hover:shadow-md hover:-translate-y-0.5 border border-black/[0.04] dark:border-white/[0.06]'
      }`}
    >
      {/* Top Section: Icon & Title */}
      <div>
        <div className="text-neutral-900 dark:text-white mb-4 transition-transform group-hover:scale-105 duration-200">
          <StepIcon name={step.iconName} className="w-6 h-6" />
        </div>

        <h3 className="text-sm sm:text-[15px] font-bold tracking-tight text-neutral-900 dark:text-white leading-snug">
          {step.title}
        </h3>
      </div>

      {/* Bottom Section: Description */}
      <div className="pt-6">
        <p className="text-xs sm:text-[13px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
          {step.description}
        </p>

        {/* Deliverables preview dots indicator on hover */}
        {step.deliverables && step.deliverables.length > 0 && (
          <div className="mt-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono text-neutral-400">
            <span>{step.deliverables.length} ENTREGABLES</span>
          </div>
        )}
      </div>
    </div>
  );
};
