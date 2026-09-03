import React from 'react';
import {
  Monitor,
  Tablet,
  Smartphone,
  Grid,
  Sun,
  Moon,
  Code2,
  Sparkles,
  Shuffle,
  Layers,
  Check
} from 'lucide-react';
import { BentoLayoutPreset, CornerRadius, DeviceView, GridGap, ViewMode } from '../types';

interface ControlsBarProps {
  cardCount: number;
  onCardCountChange: (count: number) => void;
  availablePresets: BentoLayoutPreset[];
  selectedPresetId: string;
  onSelectPreset: (presetId: string) => void;
  deviceView: DeviceView;
  onDeviceChange: (device: DeviceView) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  radius: CornerRadius;
  onRadiusChange: (radius: CornerRadius) => void;
  gap: GridGap;
  onGapChange: (gap: GridGap) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenExport: () => void;
  onRandomize: () => void;
}

const QUICK_COUNTS = [3, 4, 5, 6, 7, 8, 9, 10];

export const ControlsBar: React.FC<ControlsBarProps> = ({
  cardCount,
  onCardCountChange,
  availablePresets,
  selectedPresetId,
  onSelectPreset,
  deviceView,
  onDeviceChange,
  viewMode,
  onViewModeChange,
  radius,
  onRadiusChange,
  gap,
  onGapChange,
  isDark,
  onToggleTheme,
  onOpenExport,
  onRandomize,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#F7F7F5] dark:bg-[#121212] border-b border-[#E5E5E2] dark:border-[#242424] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          {/* Bauhaus Architectural Title */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-[#161616] dark:bg-[#F2F2F0] text-white dark:text-[#161616] rounded-sm flex items-center justify-center font-mono font-bold text-xs tracking-tight">
              BG
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold tracking-tight text-[#161616] dark:text-[#F2F2F0]">
                  BENTO GRID
                </h1>
                <span className="font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded-sm bg-neutral-200/80 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-300/60 dark:border-neutral-700/60">
                  BAUHAUS ARCHIVE
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 hidden sm:block">
                Sistemas modulares de retícula y proporción arquitectónica
              </p>
            </div>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* View Mode Toggle: Diseño vs Estructura */}
            <div className="flex items-center border border-neutral-300 dark:border-neutral-700 rounded-sm p-0.5 bg-neutral-100 dark:bg-neutral-800 text-xs">
              <button
                type="button"
                onClick={() => onViewModeChange('mockup')}
                className={`px-3 py-1 rounded-sm text-xs font-medium transition-all ${
                  viewMode === 'mockup'
                    ? 'bg-[#161616] text-white dark:bg-[#F2F2F0] dark:text-[#161616] shadow-sm font-semibold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                }`}
                title="Vista con contenido gráfico y tipografía"
              >
                Diseño
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange('wireframe')}
                className={`px-3 py-1 rounded-sm text-xs font-medium transition-all ${
                  viewMode === 'wireframe'
                    ? 'bg-[#161616] text-white dark:bg-[#F2F2F0] dark:text-[#161616] shadow-sm font-semibold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                }`}
                title="Vista técnica de rejilla CSS Grid"
              >
                Estructura
              </button>
            </div>

            {/* Responsive Viewport Switcher */}
            <div className="flex items-center border border-neutral-300 dark:border-neutral-700 rounded-sm p-0.5 bg-neutral-100 dark:bg-neutral-800 text-xs">
              <button
                type="button"
                onClick={() => onDeviceChange('desktop')}
                className={`px-2.5 py-1 rounded-sm text-xs font-mono transition-all ${
                  deviceView === 'desktop'
                    ? 'bg-[#161616] text-white dark:bg-[#F2F2F0] dark:text-[#161616] font-semibold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                }`}
                title="Escritorio (1200px)"
              >
                Desktop
              </button>
              <button
                type="button"
                onClick={() => onDeviceChange('tablet')}
                className={`px-2.5 py-1 rounded-sm text-xs font-mono transition-all ${
                  deviceView === 'tablet'
                    ? 'bg-[#161616] text-white dark:bg-[#F2F2F0] dark:text-[#161616] font-semibold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                }`}
                title="Tablet (768px)"
              >
                Tablet
              </button>
              <button
                type="button"
                onClick={() => onDeviceChange('mobile')}
                className={`px-2.5 py-1 rounded-sm text-xs font-mono transition-all ${
                  deviceView === 'mobile'
                    ? 'bg-[#161616] text-white dark:bg-[#F2F2F0] dark:text-[#161616] font-semibold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                }`}
                title="Móvil (390px)"
              >
                Móvil
              </button>
            </div>

            {/* Randomize button */}
            <button
              type="button"
              onClick={onRandomize}
              className="p-1.5 rounded-sm border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 transition-colors"
              title="Aleatorizar composición"
            >
              <Shuffle className="w-3.5 h-3.5" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              type="button"
              onClick={onToggleTheme}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-mono transition-colors"
              title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {isDark ? <Sun className="w-3.5 h-3.5 text-neutral-200" /> : <Moon className="w-3.5 h-3.5 text-neutral-800" />}
              <span className="text-[11px] font-mono hidden md:inline">{isDark ? 'Claro' : 'Oscuro'}</span>
            </button>

            {/* Minimalist Bauhaus Export Button */}
            <button
              type="button"
              onClick={onOpenExport}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#161616] hover:bg-black dark:bg-[#F2F2F0] dark:hover:bg-white text-white dark:text-[#161616] rounded-sm text-xs font-mono uppercase tracking-wider transition-all"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Exportar</span>
            </button>
          </div>
        </div>

        {/* Secondary Bar: Modules, Radio, Gap */}
        <div className="mt-2 pt-2 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-3 flex-wrap">
          {/* Module Count */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Módulos:
            </span>

            <div className="flex items-center gap-1">
              {QUICK_COUNTS.map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => onCardCountChange(num)}
                  className={`w-6 h-6 rounded-sm font-mono text-xs transition-all ${
                    cardCount === num
                      ? 'bg-[#161616] text-white dark:bg-[#F2F2F0] dark:text-[#161616] font-bold'
                      : 'border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                  }`}
                >
                  {num}
                </button>
              ))}

              {/* Number Input Stepper */}
              <div className="flex items-center pl-1 border-l border-neutral-300 dark:border-neutral-700">
                <input
                  type="number"
                  min={2}
                  max={16}
                  value={cardCount}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val) && val >= 2 && val <= 20) {
                      onCardCountChange(val);
                    }
                  }}
                  className="w-7 text-center font-mono text-xs font-bold text-neutral-900 dark:text-white bg-transparent focus:outline-none"
                  title="Cantidad personalizada"
                />
              </div>
            </div>
          </div>

          {/* Aesthetic Controls: Radius & Gap */}
          <div className="flex items-center gap-3">
            {/* Radius selector */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 hidden md:inline">
                Radio:
              </span>
              <div className="flex items-center border border-neutral-300 dark:border-neutral-700 rounded-sm p-0.5 bg-neutral-100 dark:bg-neutral-800 text-xs">
                <button
                  type="button"
                  onClick={() => onRadiusChange('rounded-none')}
                  className={`px-2 py-0.5 font-mono text-[11px] rounded-sm transition-all ${radius === 'rounded-none' ? 'bg-[#161616] text-white dark:bg-[#F2F2F0] dark:text-[#161616] font-semibold' : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'}`}
                  title="0px Rectilíneo Bauhaus"
                >
                  0px
                </button>
                <button
                  type="button"
                  onClick={() => onRadiusChange('rounded-lg')}
                  className={`px-2 py-0.5 font-mono text-[11px] rounded-sm transition-all ${radius === 'rounded-lg' ? 'bg-[#161616] text-white dark:bg-[#F2F2F0] dark:text-[#161616] font-semibold' : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'}`}
                  title="8px Nórdico Sutil"
                >
                  8px
                </button>
                <button
                  type="button"
                  onClick={() => onRadiusChange('rounded-2xl')}
                  className={`px-2 py-0.5 font-mono text-[11px] rounded-sm transition-all ${radius === 'rounded-2xl' ? 'bg-[#161616] text-white dark:bg-[#F2F2F0] dark:text-[#161616] font-semibold' : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'}`}
                  title="16px Geometría Suave"
                >
                  16px
                </button>
              </div>
            </div>

            {/* Gap / Gutter selector */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 hidden md:inline">
                Intersticio:
              </span>
              <div className="flex items-center border border-neutral-300 dark:border-neutral-700 rounded-sm p-0.5 bg-neutral-100 dark:bg-neutral-800 text-xs">
                <button
                  type="button"
                  onClick={() => onGapChange('gap-3')}
                  className={`px-2 py-0.5 font-mono text-[11px] rounded-sm transition-all ${gap === 'gap-3' ? 'bg-[#161616] text-white dark:bg-[#F2F2F0] dark:text-[#161616] font-semibold' : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'}`}
                >
                  12px
                </button>
                <button
                  type="button"
                  onClick={() => onGapChange('gap-4')}
                  className={`px-2 py-0.5 font-mono text-[11px] rounded-sm transition-all ${gap === 'gap-4' ? 'bg-[#161616] text-white dark:bg-[#F2F2F0] dark:text-[#161616] font-semibold' : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'}`}
                >
                  16px
                </button>
                <button
                  type="button"
                  onClick={() => onGapChange('gap-6')}
                  className={`px-2 py-0.5 font-mono text-[11px] rounded-sm transition-all ${gap === 'gap-6' ? 'bg-[#161616] text-white dark:bg-[#F2F2F0] dark:text-[#161616] font-semibold' : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'}`}
                >
                  24px
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Layout Presets Selector */}
        {availablePresets.length > 1 && (
          <div className="mt-2 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 shrink-0">
              Retículas:
            </span>
            <div className="flex items-center gap-1.5">
              {availablePresets.map((preset, idx) => {
                const isSelected = preset.id === selectedPresetId;
                const indexStr = String(idx + 1).padStart(2, '0');
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => onSelectPreset(preset.id)}
                    className={`shrink-0 flex items-center gap-2 px-2.5 py-1 rounded-sm border transition-all text-left ${
                      isSelected
                        ? 'border-black dark:border-white bg-[#161616] text-white dark:bg-[#F2F2F0] dark:text-[#161616]'
                        : 'border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                    }`}
                  >
                    <span className="font-mono text-[10px] opacity-70">
                      {indexStr}
                    </span>
                    <span className="text-xs font-medium leading-none">
                      {preset.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
