import React from 'react';
import { BentoCard, DeviceView } from '../types';
import {
  Target,
  Search,
  GitFork,
  Palette,
  FileText,
  TrendingUp,
  Quote,
  CheckCircle2,
  Check,
  Layers,
  ArrowUpRight,
  Workflow,
  Compass,
  LayoutGrid,
} from 'lucide-react';

interface BentoCardViewProps {
  card: BentoCard;
  index: number;
  deviceView: DeviceView;
  isSelected?: boolean;
  onClick?: () => void;
  isEmptyView?: boolean;
  borderRadius?: number;
}

const getDesktopColSpanClass = (span: number): string => {
  switch (span) {
    case 12:
      return 'col-span-12';
    case 8:
      return 'md:col-span-8 col-span-12';
    case 7:
      return 'md:col-span-7 col-span-12';
    case 6:
      return 'md:col-span-6 col-span-12';
    case 5:
      return 'md:col-span-5 col-span-12';
    case 4:
      return 'md:col-span-4 sm:col-span-6 col-span-12';
    case 3:
      return 'md:col-span-3 sm:col-span-6 col-span-12';
    case 2:
      return 'md:col-span-2 sm:col-span-4 col-span-12';
    default:
      return 'md:col-span-4 col-span-12';
  }
};

const getTabletColSpanClass = (span?: number): string => {
  switch (span) {
    case 12:
      return 'col-span-12';
    case 8:
      return 'sm:col-span-8 col-span-12';
    case 6:
      return 'sm:col-span-6 col-span-12';
    case 4:
      return 'sm:col-span-4 col-span-12';
    default:
      return 'sm:col-span-6 col-span-12';
  }
};

const getRowSpanClass = (span: number): string => {
  return span === 2 ? 'md:row-span-2 min-h-[360px]' : 'md:row-span-1 min-h-[220px] sm:min-h-[250px]';
};

export const BentoCardView: React.FC<BentoCardViewProps> = ({
  card,
  index,
  deviceView,
  isSelected,
  onClick,
  isEmptyView = false,
  borderRadius,
}) => {
  const renderIcon = (type: string, title: string) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('visión') || titleLower.includes('estrategia') || titleLower.includes('marco') || titleLower.includes('ecosistema') || titleLower.includes('metodología')) {
      return <Compass className="w-5 h-5 text-neutral-900 dark:text-white" strokeWidth={1.8} />;
    }
    if (titleLower.includes('analysis') || titleLower.includes('task') || titleLower.includes('análisis') || titleLower.includes('requerimiento')) {
      return <Target className="w-5 h-5 text-neutral-900 dark:text-white" strokeWidth={1.8} />;
    }
    if (titleLower.includes('research') || titleLower.includes('persona') || titleLower.includes('investigación')) {
      return <Search className="w-5 h-5 text-neutral-900 dark:text-white" strokeWidth={1.8} />;
    }
    if (titleLower.includes('functional') || titleLower.includes('flow') || titleLower.includes('architecture') || titleLower.includes('flujo') || titleLower.includes('arquitectura')) {
      return <Workflow className="w-5 h-5 text-neutral-900 dark:text-white" strokeWidth={1.8} />;
    }
    if (titleLower.includes('wireframe') || titleLower.includes('design') || titleLower.includes('prototyp') || titleLower.includes('boceto')) {
      return <Palette className="w-5 h-5 text-neutral-900 dark:text-white" strokeWidth={1.8} />;
    }
    if (titleLower.includes('ui') || titleLower.includes('system') || titleLower.includes('token') || titleLower.includes('visual')) {
      return <Palette className="w-5 h-5 text-neutral-900 dark:text-white" strokeWidth={1.8} />;
    }
    if (titleLower.includes('presentation') || titleLower.includes('animation') || titleLower.includes('handoff') || titleLower.includes('entrega')) {
      return <FileText className="w-5 h-5 text-neutral-900 dark:text-white" strokeWidth={1.8} />;
    }
    if (type === 'metric') {
      return <TrendingUp className="w-5 h-5 text-neutral-900 dark:text-white" strokeWidth={1.8} />;
    }
    if (type === 'quote') {
      return <Quote className="w-5 h-5 text-neutral-900 dark:text-white" strokeWidth={1.8} />;
    }
    if (type === 'list') {
      return <CheckCircle2 className="w-5 h-5 text-neutral-900 dark:text-white" strokeWidth={1.8} />;
    }
    return <LayoutGrid className="w-5 h-5 text-neutral-900 dark:text-white" strokeWidth={1.8} />;
  };

  // Device view span overrides
  const colClass =
    deviceView === 'mobile'
      ? 'col-span-12'
      : deviceView === 'tablet'
      ? getTabletColSpanClass(card.colSpanTablet)
      : getDesktopColSpanClass(card.colSpanDesktop);

  const rowClass = deviceView === 'mobile' ? 'min-h-[190px]' : getRowSpanClass(card.rowSpanDesktop);

  const isWide = (deviceView === 'desktop' && card.colSpanDesktop >= 6) || (deviceView === 'tablet' && (card.colSpanTablet || 6) >= 8);

  // Pure Empty Cards Mode (No information, clean geometric surfaces)
  if (isEmptyView) {
    return (
      <div
        onClick={onClick}
        style={{
          borderRadius: borderRadius !== undefined ? `${borderRadius}px` : undefined,
        }}
        className={`group relative transition-all duration-200 cursor-pointer select-none bg-white dark:bg-[#1C1C1E] border border-black/[0.08] dark:border-white/[0.1] hover:border-black/25 dark:hover:border-white/30 hover:shadow-md ${colClass} ${rowClass} ${
          isSelected ? 'ring-2 ring-neutral-900 dark:ring-white shadow-lg' : ''
        }`}
      />
    );
  }

  return (
    <div
      onClick={onClick}
      style={{
        borderRadius: borderRadius !== undefined ? `${borderRadius}px` : undefined,
      }}
      className={`group relative flex flex-col justify-between p-6 sm:p-7 transition-all duration-200 cursor-pointer select-none bg-white dark:bg-[#1C1C1E] border border-black/[0.04] dark:border-white/[0.06] hover:shadow-md hover:-translate-y-0.5 ${colClass} ${rowClass} ${
        isSelected ? 'ring-2 ring-neutral-900 dark:ring-white shadow-lg' : ''
      }`}
    >
      {/* Top Header inside Card */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 group-hover:scale-105 transition-transform duration-200">
            {renderIcon(card.type, card.title)}
          </div>

          <div className="flex items-center gap-1.5">
            {card.content.badge && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                {card.content.badge}
              </span>
            )}
            <span className="font-mono text-[11px] text-neutral-400">
              #{String(index + 1).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Card Title */}
        <h3
          className={`font-bold tracking-tight text-neutral-900 dark:text-white leading-snug ${
            isWide ? 'text-lg sm:text-2xl mb-2' : 'text-sm sm:text-base mb-1.5'
          }`}
        >
          {card.content.title || card.title}
        </h3>

        {/* Subtitle / Description if not metric */}
        {card.type !== 'metric' && card.type !== 'quote' && (
          <p
            className={`text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-3 ${
              isWide ? 'text-xs sm:text-sm' : 'text-xs sm:text-[13px]'
            }`}
          >
            {card.content.subtitle || card.content.quoteText}
          </p>
        )}
      </div>

      {/* Center / Body Section: Specialized according to Card Type */}
      {card.type === 'metric' && (
        <div className="my-auto py-2">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-mono tracking-tight text-neutral-900 dark:text-white">
              {card.content.metricValue || '98.4%'}
            </span>
            {card.content.metricChange && (
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {card.content.metricChange}
              </span>
            )}
          </div>
          {card.content.metricLabel && (
            <div className="font-mono text-xs uppercase tracking-wider text-neutral-400 mt-1">
              {card.content.metricLabel}
            </div>
          )}
        </div>
      )}

      {card.type === 'quote' && (
        <div className="my-auto py-2 border-l-2 border-neutral-900 dark:border-white pl-3.5 italic text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 font-serif">
          "{card.content.quoteText || 'Weniger, aber besser.'}"
          {card.content.quoteAuthor && (
            <span className="block mt-1 font-sans text-[11px] not-italic font-mono uppercase text-neutral-400">
              — {card.content.quoteAuthor}
            </span>
          )}
        </div>
      )}

      {card.type === 'list' && card.content.listItems && card.content.listItems.length > 0 && (
        <div className="my-auto py-2 space-y-1.5">
          {card.content.listItems.slice(0, 3).map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
              <div className="w-3.5 h-3.5 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center shrink-0">
                <Check className="w-2 h-2 stroke-[3]" />
              </div>
              <span className="truncate">{item.text}</span>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Footer Section */}
      <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-[11px] font-mono text-neutral-400">
        <span className="uppercase">
          {deviceView === 'desktop'
            ? `${card.colSpanDesktop} col • ${card.rowSpanDesktop} fila`
            : deviceView === 'tablet'
            ? `${card.colSpanTablet || 6} col`
            : '1 col'}
        </span>
        <span className="flex items-center gap-1 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
          <span>Detalle</span>
          <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </span>
      </div>
    </div>
  );
};
