import React from 'react';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';

interface EqualizerControlProps {
  borderRadius: number;
  gap: number;
  onBorderRadiusChange: (value: number) => void;
  onGapChange: (value: number) => void;
  onReset: () => void;
}

export const EqualizerControl: React.FC<EqualizerControlProps> = ({
  borderRadius,
  gap,
  onBorderRadiusChange,
  onGapChange,
  onReset,
}) => {
  const radiusPresets = [0, 8, 16, 24, 32];
  const gapPresets = [0, 8, 16, 24, 32];

  return (
    <div className="w-full p-3 sm:p-4 rounded-2xl bg-white/90 dark:bg-[#1C1420]/90 backdrop-blur-md border border-neutral-300/80 dark:border-[#FCD8E6]/15 shadow-sm transition-all">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-200 dark:border-[#FCD8E6]/15 text-xs font-mono">
        <div className="flex items-center gap-2 text-neutral-800 dark:text-[#F4EFE8]">
          <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-500 dark:text-[#FCD8E6]/70" />
          <span className="font-semibold uppercase tracking-wider">Ecualizador</span>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="p-1 rounded-md text-neutral-400 hover:text-neutral-800 dark:hover:text-[#FCD8E6] transition-colors"
          title="Restablecer valores originales (Radio: 20px, Gap: 16px)"
          aria-label="Restablecer ecualizador"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Channel 1: Border Radius */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-neutral-500 dark:text-neutral-400">Radio</span>
            <span className="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-[#2A1E26] text-neutral-900 dark:text-[#FCD8E6] font-bold">
              {borderRadius}px
            </span>
          </div>

          <div className="relative flex items-center py-1">
            <input
              type="range"
              min="0"
              max="36"
              step="2"
              value={borderRadius}
              onChange={(e) => onBorderRadiusChange(Number(e.target.value))}
              className="w-full h-2 rounded-lg bg-neutral-200 dark:bg-[#2A1E26] appearance-none cursor-pointer accent-[#FCD8E6] focus:outline-none"
              aria-label="Ajustar radio de bordes"
            />
          </div>

          {/* Equalizer Presets / Notches */}
          <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
            {radiusPresets.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => onBorderRadiusChange(r)}
                className={`px-1.5 py-0.5 rounded hover:bg-neutral-200 dark:hover:bg-[#2A1E26] transition-colors ${
                  borderRadius === r ? 'text-neutral-900 dark:text-[#FCD8E6] font-bold' : ''
                }`}
              >
                {r}px
              </button>
            ))}
          </div>
        </div>

        {/* Channel 2: Gap Separation */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-neutral-500 dark:text-neutral-400">Separación</span>
            <span className="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-[#2A1E26] text-neutral-900 dark:text-[#FCD8E6] font-bold">
              {gap}px
            </span>
          </div>

          <div className="relative flex items-center py-1">
            <input
              type="range"
              min="0"
              max="32"
              step="2"
              value={gap}
              onChange={(e) => onGapChange(Number(e.target.value))}
              className="w-full h-2 rounded-lg bg-neutral-200 dark:bg-[#2A1E26] appearance-none cursor-pointer accent-[#FCD8E6] focus:outline-none"
              aria-label="Ajustar separación entre tarjetas"
            />
          </div>

          {/* Equalizer Presets / Notches */}
          <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
            {gapPresets.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => onGapChange(g)}
                className={`px-1.5 py-0.5 rounded hover:bg-neutral-200 dark:hover:bg-[#2A1E26] transition-colors ${
                  gap === g ? 'text-neutral-900 dark:text-[#FCD8E6] font-bold' : ''
                }`}
              >
                {g}px
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
