import React from 'react';
import { BentoCard, DeviceView } from '../types';

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

// Mobile: break the flat single-column stack into a mosaic — compact card types pair up
// two-per-row while wide/tall/text-heavy cards keep the full row, echoing the desktop rhythm.
const getMobileColSpanClass = (card: BentoCard): string => {
  const isCompact = card.type === 'metric' || card.type === 'quote' || (card.colSpanDesktop <= 4 && card.rowSpanDesktop === 1);
  return isCompact ? 'col-span-6' : 'col-span-12';
};

const getMobileRowSpanClass = (card: BentoCard): string => {
  if (card.rowSpanDesktop === 2) return 'min-h-[280px]';
  switch (card.type) {
    case 'metric':
      return 'min-h-[160px]';
    case 'quote':
      return 'min-h-[180px]';
    case 'list':
      return 'min-h-[220px]';
    default:
      return 'min-h-[200px]';
  }
};

const editorialCardThemes = [
  'bg-[#FCD8E6] dark:bg-[#3A222D] border-black dark:border-[#FCD8E6]/40 text-black dark:text-[#FCD8E6]',
  'bg-[#F4EFE8] dark:bg-[#221F1B] border-black dark:border-[#F4EFE8]/40 text-black dark:text-[#F4EFE8]',
  'bg-black dark:bg-black border-black dark:border-white/40 text-white',
  'bg-[#FCD8E6] dark:bg-[#3A222D] border-black dark:border-[#FCD8E6]/40 text-black dark:text-[#FCD8E6]',
];

// Alternates two serif voices — Eczar (upright) and Gentium Basic (italic) — so
// consecutive cards don't read as a single repeated typeface.
const titleTypeStyles = [
  'font-editorial font-medium tracking-tight normal-case',
  'font-gentium italic font-normal tracking-tight normal-case',
];

const eyebrowByType: Record<string, string> = {
  featured: 'Destacado',
  metric: 'Métrica',
  list: 'Índice',
  quote: 'Cita',
  image: 'Visual',
  media: 'Media',
  action: 'Acción',
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
  // Device view span overrides
  const colClass =
    deviceView === 'mobile'
      ? getMobileColSpanClass(card)
      : deviceView === 'tablet'
      ? getTabletColSpanClass(card.colSpanTablet)
      : getDesktopColSpanClass(card.colSpanDesktop);

  const rowClass = deviceView === 'mobile' ? getMobileRowSpanClass(card) : getRowSpanClass(card.rowSpanDesktop);
  const editorialTheme = editorialCardThemes[index % editorialCardThemes.length];
  const titleType = titleTypeStyles[index % titleTypeStyles.length];
  const eyebrow = eyebrowByType[card.type] || 'Nota';

  const isMobile = deviceView === 'mobile';
  const isWide =
    (deviceView === 'desktop' && card.colSpanDesktop >= 6) ||
    (deviceView === 'tablet' && (card.colSpanTablet || 6) >= 8) ||
    (isMobile && colClass === 'col-span-12');

  // Pure Empty Cards Mode (No information, clean geometric surfaces)
  if (isEmptyView) {
    return (
      <div
        onClick={onClick}
        style={{
          borderRadius: borderRadius !== undefined ? `${borderRadius}px` : undefined,
        }}
        className={`group relative transition-all duration-200 cursor-pointer select-none border hover:shadow-md hover:opacity-90 ${editorialTheme} ${colClass} ${rowClass} ${
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
      className={`group relative flex flex-col justify-between overflow-hidden p-4 sm:p-6 transition-all duration-200 cursor-pointer select-none border hover:shadow-lg ${editorialTheme} ${colClass} ${rowClass} ${
        isSelected ? 'ring-2 ring-neutral-900 dark:ring-white' : ''
      }`}
    >
      {/* Eyebrow bar: corner marks + centered label (+ running index on wider cards only —
          dropped on narrow mobile cards where there isn't room for all three without crowding) */}
      <div className="flex items-center justify-between gap-2 pb-2 mb-3 border-b border-current/15">
        <span className="w-1 h-1 rounded-full bg-current/50 shrink-0" />
        <span className={`flex-1 min-w-0 text-center font-mono uppercase tracking-[0.25em] opacity-60 truncate ${isMobile ? 'text-[11px]' : 'text-[9px] sm:text-[10px]'}`}>
          {eyebrow}
        </span>
        {(!isMobile || isWide) && (
          <span className={`font-mono opacity-50 tabular-nums shrink-0 ${isMobile ? 'text-[11px]' : 'text-[9px] sm:text-[10px]'}`}>
            {String(index + 1).padStart(2, '0')}
          </span>
        )}
      </div>

      {/* Header: title + short subtitle, typographic voice varies per card */}
      <div>
        <h3
            className={`leading-[1.05] ${titleType} ${
            isMobile
              ? isWide ? 'text-4xl mb-2.5' : 'text-2xl mb-2'
              : isWide ? 'text-3xl sm:text-4xl md:text-5xl mb-2.5' : 'text-xl sm:text-2xl mb-1.5'
          }`}
        >
          {card.content.title || card.title}
        </h3>

        {/* Subtitle / Description if not metric */}
        {card.type !== 'metric' && card.type !== 'quote' && (card.content.subtitle || card.content.quoteText) && (
          <p
            className={`font-normal leading-relaxed line-clamp-2 font-primary opacity-75 ${
              isMobile
                ? isWide ? 'text-lg' : 'text-base'
                : isWide ? 'text-sm sm:text-base' : 'text-sm'
            }`}
          >
            {card.content.subtitle || card.content.quoteText}
          </p>
        )}
      </div>

      {/* Center / Body Section: Specialized according to Card Type */}
      {card.type === 'metric' && (
        <div className="my-auto py-2 min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 min-w-0">
            <span
              className={`font-medium tracking-tighter font-editorial break-words ${
                isMobile
                  ? isWide ? 'text-6xl' : 'text-4xl'
                  : isWide ? 'text-5xl sm:text-6xl lg:text-7xl' : 'text-3xl sm:text-4xl'
              }`}
            >
              {card.content.metricValue || '98.4%'}
            </span>
            {card.content.metricChange && (
              <span className={`font-mono font-medium opacity-75 ${isMobile ? 'text-base' : 'text-sm'}`}>
                {card.content.metricChange}
              </span>
            )}
          </div>
          {card.content.metricLabel && (
            <div className={`mt-2 font-mono uppercase tracking-widest opacity-60 line-clamp-1 ${isMobile ? 'text-sm' : 'text-xs'}`}>
              {card.content.metricLabel}
            </div>
          )}
        </div>
      )}

      {card.type === 'quote' && (
        <div className={`my-auto py-2 border-l-2 border-current/40 pl-4 font-normal font-gentium italic leading-snug ${isMobile ? 'text-2xl' : 'text-lg sm:text-xl'}`}>
          "{card.content.quoteText || 'Weniger, aber besser.'}"
          {card.content.quoteAuthor && (
              <span className={`block mt-2 font-mono not-italic uppercase tracking-widest opacity-60 ${isMobile ? 'text-sm' : 'text-xs'}`}>
              — {card.content.quoteAuthor}
            </span>
          )}
        </div>
      )}

      {card.type === 'list' && card.content.listItems && card.content.listItems.length > 0 && (
        <div className="my-auto py-2 space-y-2.5">
          {card.content.listItems.slice(0, 3).map((item, i) => (
            <div key={i} className={`flex items-center gap-3 opacity-80 font-primary min-w-0 ${isMobile ? 'text-lg' : 'text-base'}`}>
              <span className={`font-mono opacity-50 shrink-0 ${isMobile ? 'text-xs' : 'text-[11px]'}`}>{String(i + 1).padStart(2, '0')}</span>
              <span className="min-w-0 truncate">{item.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
