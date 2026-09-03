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

const editorialCardThemes = [
  'bg-[#E9DCCB] dark:bg-[#4A3029] border-[#B28C70] dark:border-[#795448] text-[#3B2521] dark:text-[#F4E8D8]',
  'bg-[#F1E8D9] dark:bg-[#513A31] border-[#C6A98E] dark:border-[#846256] text-[#3B2521] dark:text-[#F4E8D8]',
  'bg-[#6B2737] dark:bg-[#572332] border-[#6B2737] dark:border-[#854255] text-[#FFF4E6] dark:text-[#F9E6D2]',
  'bg-[#D7B89C] dark:bg-[#432A27] border-[#A87562] dark:border-[#71453E] text-[#3B2521] dark:text-[#F4E8D8]',
];

// A distinct typographic "voice" paired with each color theme above — mixes serif,
// sans and mono treatments so cards read as a considered editorial system, not repeats.
const titleTypeStyles = [
  'font-editorial font-medium tracking-tight normal-case',
  'font-primary font-bold tracking-tight uppercase',
  'font-editorial font-semibold tracking-tighter normal-case',
  'font-mono font-bold tracking-wide uppercase',
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
      ? 'col-span-12'
      : deviceView === 'tablet'
      ? getTabletColSpanClass(card.colSpanTablet)
      : getDesktopColSpanClass(card.colSpanDesktop);

  const rowClass = deviceView === 'mobile' ? 'min-h-[190px]' : getRowSpanClass(card.rowSpanDesktop);
  const editorialTheme = editorialCardThemes[index % editorialCardThemes.length];
  const titleType = titleTypeStyles[index % titleTypeStyles.length];
  const eyebrow = eyebrowByType[card.type] || 'Nota';

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
      className={`group relative flex flex-col justify-between p-5 sm:p-6 transition-all duration-200 cursor-pointer select-none border hover:shadow-lg ${editorialTheme} ${colClass} ${rowClass} ${
        isSelected ? 'ring-2 ring-neutral-900 dark:ring-white' : ''
      }`}
    >
      {/* Eyebrow bar: corner marks + centered label + running index, editorial "spec sheet" framing */}
      <div className="flex items-center justify-between gap-2 pb-2 mb-3 border-b border-current/15">
        <span className="w-1 h-1 rounded-full bg-current/50 shrink-0" />
        <span className="flex-1 text-center text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.25em] opacity-60 truncate">
          {eyebrow}
        </span>
        <span className="text-[9px] sm:text-[10px] font-mono opacity-50 tabular-nums shrink-0">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      {/* Header: title + short subtitle, typographic voice varies per card */}
      <div>
        <h3
            className={`leading-snug ${titleType} ${
            isWide ? 'text-lg sm:text-2xl mb-1.5' : 'text-sm sm:text-base mb-1'
          }`}
        >
          {card.content.title || card.title}
        </h3>

        {/* Subtitle / Description if not metric */}
        {card.type !== 'metric' && card.type !== 'quote' && (card.content.subtitle || card.content.quoteText) && (
          <p
            className={`font-normal leading-relaxed line-clamp-2 font-primary opacity-75 ${
              isWide ? 'text-xs sm:text-sm' : 'text-xs'
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
            <span className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tighter font-editorial">
              {card.content.metricValue || '98.4%'}
            </span>
            {card.content.metricChange && (
              <span className="text-xs font-mono font-medium opacity-75">
                {card.content.metricChange}
              </span>
            )}
          </div>
          {card.content.metricLabel && (
            <div className="text-[10px] mt-1.5 font-mono uppercase tracking-widest opacity-60">
              {card.content.metricLabel}
            </div>
          )}
        </div>
      )}

      {card.type === 'quote' && (
        <div className="my-auto py-2 border-l border-current/40 pl-3.5 text-xs sm:text-sm font-medium font-editorial italic">
          "{card.content.quoteText || 'Weniger, aber besser.'}"
          {card.content.quoteAuthor && (
              <span className="block mt-1.5 text-[10px] font-mono not-italic uppercase tracking-widest opacity-60">
              — {card.content.quoteAuthor}
            </span>
          )}
        </div>
      )}

      {card.type === 'list' && card.content.listItems && card.content.listItems.length > 0 && (
        <div className="my-auto py-2 space-y-2">
          {card.content.listItems.slice(0, 3).map((item, i) => (
            <div key={i} className="flex items-center gap-2.5 text-xs opacity-80 font-primary">
              <span className="text-[9px] font-mono opacity-50 shrink-0">{String(i + 1).padStart(2, '0')}</span>
              <span className="truncate">{item.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
