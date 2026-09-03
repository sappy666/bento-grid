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
      className={`group relative flex flex-col justify-between p-6 sm:p-7 transition-all duration-200 cursor-pointer select-none bg-white dark:bg-[#1C1C1E] border border-black/[0.04] dark:border-white/[0.06] hover:border-black/10 dark:hover:border-white/15 ${colClass} ${rowClass} ${
        isSelected ? 'ring-2 ring-neutral-900 dark:ring-white' : ''
      }`}
    >
      {/* Minimal Header: title + short subtitle, no icon / badge / index chrome */}
      <div>
        <h3
          className={`font-semibold tracking-tight text-neutral-900 dark:text-white leading-snug ${
            isWide ? 'text-lg sm:text-xl mb-1.5' : 'text-sm sm:text-base mb-1'
          }`}
        >
          {card.content.title || card.title}
        </h3>

        {/* Subtitle / Description if not metric */}
        {card.type !== 'metric' && card.type !== 'quote' && (card.content.subtitle || card.content.quoteText) && (
          <p
            className={`font-normal text-neutral-400 dark:text-neutral-500 leading-relaxed line-clamp-2 ${
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
            <span className="text-3xl sm:text-4xl lg:text-5xl font-extralight tracking-tight text-neutral-900 dark:text-white">
              {card.content.metricValue || '98.4%'}
            </span>
            {card.content.metricChange && (
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                {card.content.metricChange}
              </span>
            )}
          </div>
          {card.content.metricLabel && (
            <div className="text-xs text-neutral-400 mt-1">
              {card.content.metricLabel}
            </div>
          )}
        </div>
      )}

      {card.type === 'quote' && (
        <div className="my-auto py-2 border-l border-neutral-300 dark:border-neutral-700 pl-3.5 text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-300">
          "{card.content.quoteText || 'Weniger, aber besser.'}"
          {card.content.quoteAuthor && (
            <span className="block mt-1 text-[11px] text-neutral-400">
              — {card.content.quoteAuthor}
            </span>
          )}
        </div>
      )}

      {card.type === 'list' && card.content.listItems && card.content.listItems.length > 0 && (
        <div className="my-auto py-2 space-y-2">
          {card.content.listItems.slice(0, 3).map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
              <div className="w-1 h-1 rounded-full bg-neutral-400 dark:bg-neutral-500 shrink-0" />
              <span className="truncate">{item.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
