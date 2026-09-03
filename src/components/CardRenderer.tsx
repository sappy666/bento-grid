import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  TrendingUp,
  Image as ImageIcon,
  CheckCircle2,
  Headphones,
  ToggleRight,
  Quote,
  ArrowUpRight,
  Check,
  Play,
  Pause,
  Volume2,
  ChevronDown,
  SlidersHorizontal
} from 'lucide-react';
import { BentoCard, CardType, CornerRadius, ViewMode } from '../types';
import { playToggleClick, startAmbientSoundscape, stopAmbientSoundscape } from '../utils/sound';

interface CardRendererProps {
  card: BentoCard;
  index: number;
  radius: CornerRadius;
  viewMode: ViewMode;
  onTypeChange?: (cardId: string, newType: CardType) => void;
  onToggleAction?: (cardId: string) => void;
}

const CARD_TYPE_OPTIONS: { type: CardType; label: string; icon: React.FC<{ className?: string }> }[] = [
  { type: 'featured', label: 'Destacada / Hero', icon: Sparkles },
  { type: 'metric', label: 'Métrica / Dato', icon: TrendingUp },
  { type: 'image', label: 'Foto / Imagen', icon: ImageIcon },
  { type: 'list', label: 'Recordatorios', icon: CheckCircle2 },
  { type: 'action', label: 'Control Rápido', icon: ToggleRight },
  { type: 'media', label: 'Música / Media', icon: Headphones },
  { type: 'quote', label: 'Nota / Cita', icon: Quote },
];

export const CardRenderer: React.FC<CardRendererProps> = ({
  card,
  index,
  radius,
  viewMode,
  onTypeChange,
  onToggleAction,
}) => {
  const [actionState, setActionState] = useState(card.content.actionActive ?? true);
  const [listState, setListState] = useState(card.content.listItems || []);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Sync state if card content updates from preset or randomize
  useEffect(() => {
    if (card.content.actionActive !== undefined) {
      setActionState(card.content.actionActive);
    }
  }, [card.content.actionActive]);

  useEffect(() => {
    if (card.content.listItems) {
      setListState(card.content.listItems);
    }
  }, [card.content.listItems]);

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const toggleListItem = (itemIndex: number) => {
    setListState(prev => prev.map((item, i) => i === itemIndex ? { ...item, done: !item.done } : item));
    playToggleClick(true);
  };

  const handleActionToggle = () => {
    const newState = !actionState;
    setActionState(newState);
    playToggleClick(newState);
    if (onToggleAction) onToggleAction(card.id);
  };

  const handleTogglePlayback = () => {
    if (isPlaying) {
      setIsPlaying(false);
      stopAmbientSoundscape();
    } else {
      setIsPlaying(true);
      startAmbientSoundscape();
    }
  };

  // Apple iOS System Colors for tags and badges
  const badgeColorClasses = {
    blue: 'bg-[#007AFF]/12 text-[#007AFF] dark:bg-[#0A84FF]/20 dark:text-[#0A84FF]',
    green: 'bg-[#34C759]/12 text-[#34C759] dark:bg-[#30D158]/20 dark:text-[#30D158]',
    purple: 'bg-[#AF52DE]/12 text-[#AF52DE] dark:bg-[#BF5AF2]/20 dark:text-[#BF5AF2]',
    amber: 'bg-[#FF9500]/12 text-[#FF9500] dark:bg-[#FF9F0A]/20 dark:text-[#FF9F0A]',
    rose: 'bg-[#FF2D55]/12 text-[#FF2D55] dark:bg-[#FF375F]/20 dark:text-[#FF375F]',
    neutral: 'bg-[#767680]/12 text-[#8E8E93] dark:bg-[#767680]/25 dark:text-[#AEAEB2]',
  }[card.content.badgeColor || 'blue'];

  // Wireframe Blueprint Mode View
  if (viewMode === 'wireframe') {
    return (
      <div
        id={`card-${card.id}`}
        className={`h-full min-h-[170px] p-5 ${radius} border border-dashed border-neutral-400 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 flex flex-col justify-between transition-colors`}
      >
        <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-2 font-mono">
            <span className="w-5 h-5 rounded-sm bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-[10px] font-bold text-neutral-900 dark:text-neutral-100">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="text-[10px] uppercase tracking-wider font-semibold">{card.type}</span>
          </div>
          <span className="px-2 py-0.5 rounded-sm bg-neutral-200 dark:bg-neutral-800 font-mono text-[10px] text-neutral-800 dark:text-neutral-200">
            {card.colSpanDesktop}×{card.rowSpanDesktop}
          </span>
        </div>

        <div className="my-auto py-2 text-center">
          <p className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-white truncate">
            {card.content.title}
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-1.5 font-mono text-[10px] text-neutral-500">
            <span className="border border-neutral-300 dark:border-neutral-700 px-1.5 py-0.5 rounded-sm">
              COL: {card.colSpanDesktop}
            </span>
            <span className="border border-neutral-300 dark:border-neutral-700 px-1.5 py-0.5 rounded-sm">
              ROW: {card.rowSpanDesktop}
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-neutral-300 dark:border-neutral-800 flex items-center justify-between text-[10px] font-mono text-neutral-500">
          <span className="uppercase">CSS GRID</span>
          <span className="font-semibold text-neutral-900 dark:text-neutral-100">span {card.colSpanDesktop}</span>
        </div>
      </div>
    );
  }

  // Design Mockup Mode View (Bauhaus / Scandinavian Minimalist)
  return (
    <div
      id={`card-${card.id}`}
      className={`relative group h-full min-h-[185px] p-5 sm:p-6 ${radius} bg-white dark:bg-[#181818] border border-neutral-200 dark:border-neutral-800 transition-all duration-200 flex flex-col justify-between`}
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-2 mb-3 relative z-20">
        <div className="flex items-center gap-2">
          {card.content.badge && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-mono uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
              {card.content.badge}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2" ref={menuRef}>
          {/* Context Menu for Card Type */}
          {onTypeChange && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 px-1.5 py-0.5 rounded-sm text-[10px] font-mono border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                title="Cambiar tipo de tarjeta"
              >
                <SlidersHorizontal className="w-2.5 h-2.5" />
                <ChevronDown className="w-2 h-2 opacity-70" />
              </button>

              {/* Minimalist Dropdown */}
              {isMenuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-48 py-1 rounded-sm bg-white dark:bg-[#1E1E1E] border border-neutral-300 dark:border-neutral-700 shadow-lg z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1 text-[9px] font-mono uppercase tracking-widest text-neutral-400 border-b border-neutral-200 dark:border-neutral-800">
                    Tipo de Módulo
                  </div>
                  <div className="py-1">
                    {CARD_TYPE_OPTIONS.map((opt) => {
                      const IconComponent = opt.icon;
                      const isCurrent = card.type === opt.type;
                      return (
                        <button
                          key={opt.type}
                          type="button"
                          onClick={() => {
                            onTypeChange(card.id, opt.type);
                            setIsMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-left transition-colors ${
                            isCurrent
                              ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-medium'
                              : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <IconComponent className="w-3.5 h-3.5" />
                            <span>{opt.label}</span>
                          </div>
                          {isCurrent && <Check className="w-3 h-3 stroke-[2]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          <span className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Dynamic Content by Card Type */}
      {card.type === 'featured' && (
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900 dark:text-white leading-snug mb-1.5">
              {card.content.title}
            </h3>
            {card.content.subtitle && (
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-3">
                {card.content.subtitle}
              </p>
            )}
          </div>

          {card.content.imageUrl && (
            <div className="mt-3 w-full h-36 sm:h-40 rounded-sm overflow-hidden border border-neutral-200 dark:border-neutral-800 group/img">
              <img
                src={card.content.imageUrl}
                alt={card.content.title}
                className="w-full h-full object-cover grayscale contrast-105 group-hover/img:scale-105 transition-transform duration-300"
              />
            </div>
          )}

          {card.content.actionText && (
            <div className="mt-3 pt-1">
              <button
                type="button"
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-sm bg-[#161616] text-white hover:bg-black dark:bg-[#F2F2F0] dark:text-[#161616] dark:hover:bg-white transition-opacity"
              >
                <span>{card.content.actionText}</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}

      {card.type === 'metric' && (
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                {card.content.title}
              </span>
              <TrendingUp className="w-3.5 h-3.5 text-neutral-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2 flex-wrap">
              <span className="text-3xl sm:text-4xl font-mono font-bold tracking-tight text-neutral-900 dark:text-white">
                {card.content.metricValue || '99.9%'}
              </span>
              {card.content.metricChange && (
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-sm bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
                  {card.content.metricChange}
                </span>
              )}
            </div>
          </div>
          <div className="mt-4 pt-2.5 border-t border-neutral-200 dark:border-neutral-800">
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {card.content.metricLabel || 'Proporción áurea y balance geométrico continuo.'}
            </p>
          </div>
        </div>
      )}

      {card.type === 'image' && (
        <div className="flex-1 flex flex-col justify-between">
          <div className="relative w-full h-32 sm:h-36 rounded-sm overflow-hidden border border-neutral-200 dark:border-neutral-800 mb-2">
            <img
              src={card.content.imageUrl || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80'}
              alt={card.content.title}
              className="w-full h-full object-cover grayscale contrast-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2.5">
              <span className="font-mono text-xs text-white tracking-wide">
                {card.content.title}
              </span>
            </div>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-2">
            {card.content.subtitle || 'Estudio de textura, luz rasante y forma espacial.'}
          </p>
        </div>
      )}

      {card.type === 'list' && (
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold tracking-tight text-neutral-900 dark:text-white mb-1">
              {card.content.title}
            </h3>
            {card.content.subtitle && (
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2.5">{card.content.subtitle}</p>
            )}
            <ul className="space-y-2 mt-2">
              {listState.map((item, idx) => (
                <li
                  key={idx}
                  onClick={() => toggleListItem(idx)}
                  className="flex items-start gap-2 text-xs text-neutral-800 dark:text-neutral-200 cursor-pointer select-none"
                >
                  {/* Geometric Bauhaus square checkbox */}
                  <div
                    className={`mt-0.5 w-3.5 h-3.5 rounded-none flex items-center justify-center transition-all shrink-0 border ${
                      item.done
                        ? 'bg-[#161616] dark:bg-white text-white dark:text-[#161616] border-[#161616] dark:border-white'
                        : 'border-neutral-400 dark:border-neutral-600'
                    }`}
                  >
                    {item.done && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                  <span
                    className={`leading-snug transition-all ${
                      item.done
                        ? 'line-through text-neutral-400 dark:text-neutral-500'
                        : 'text-neutral-800 dark:text-neutral-200'
                    }`}
                  >
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-3 pt-2 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between font-mono text-[10px] text-neutral-500">
            <span>ESTADO</span>
            <span className="font-semibold text-neutral-900 dark:text-white">
              {listState.filter(i => i.done).length}/{listState.length} HECHO
            </span>
          </div>
        </div>
      )}

      {card.type === 'action' && (
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold tracking-tight text-neutral-900 dark:text-white">
                {card.content.title}
              </h3>
              <div className="w-6 h-6 rounded-sm bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-300">
                <ToggleRight className="w-3.5 h-3.5" />
              </div>
            </div>
            {card.content.subtitle && (
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                {card.content.subtitle}
              </p>
            )}
          </div>

          <div className="mt-4 pt-2.5 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <span className="font-mono text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase">
              {actionState ? 'ACTIVO' : 'INACTIVO'}
            </span>

            {/* Minimalist Bauhaus Toggle Switch */}
            <button
              type="button"
              onClick={handleActionToggle}
              role="switch"
              aria-checked={actionState}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-none transition-colors duration-150 ease-in-out border border-neutral-400 dark:border-neutral-600 ${
                actionState ? 'bg-[#161616] dark:bg-[#F2F2F0]' : 'bg-neutral-200 dark:bg-neutral-800'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-none transition duration-150 ease-in-out my-[2px] ${
                  actionState
                    ? 'translate-x-4 bg-white dark:bg-[#161616]'
                    : 'translate-x-0.5 bg-neutral-600 dark:bg-neutral-400'
                }`}
              />
            </button>
          </div>
        </div>
      )}

      {card.type === 'media' && (
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                AUDIO ESTOCÁSTICO
              </span>
              <Volume2 className="w-3.5 h-3.5 text-neutral-400" />
            </div>
            <p className="text-sm font-bold text-neutral-900 dark:text-white mt-1 truncate">
              {card.content.trackTitle || 'Loop Acústico Braun'}
            </p>
            {card.content.trackArtist && (
              <p className="font-mono text-xs text-neutral-500 truncate">{card.content.trackArtist}</p>
            )}
          </div>

          <div className="mt-3 flex items-center gap-2.5 pt-2">
            {/* Minimalist Play/Pause Button */}
            <button
              type="button"
              onClick={handleTogglePlayback}
              className="w-8 h-8 rounded-sm bg-[#161616] dark:bg-[#F2F2F0] text-white dark:text-[#161616] flex items-center justify-center hover:opacity-90 transition-all shrink-0"
              aria-label={isPlaying ? 'Pausar audio' : 'Reproducir audio'}
            >
              {isPlaying ? (
                <Pause className="w-3.5 h-3.5 fill-current" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
              )}
            </button>

            {/* Minimalist monochrome equalizer wave bars */}
            <div className="flex-1 flex items-center gap-1 h-7 px-2 bg-neutral-100 dark:bg-neutral-800/70 rounded-sm">
              {[25, 60, 85, 45, 95, 65, 35, 75, 50, 90, 35, 70].map((height, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-none bg-neutral-800 dark:bg-neutral-200 transition-all duration-300 ${isPlaying ? 'opacity-100' : 'opacity-30'}`}
                  style={{
                    height: isPlaying ? `${Math.max(20, (height * (i % 2 === 0 ? 0.9 : 1.25)) % 100)}%` : `${height * 0.3}%`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {card.type === 'quote' && (
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <Quote className="w-5 h-5 text-neutral-300 dark:text-neutral-700 mb-2" />
            <p className="text-sm font-medium tracking-tight text-neutral-800 dark:text-neutral-200 leading-relaxed italic">
              {card.content.quoteText || '“Menos, pero con mejor ejecución.”'}
            </p>
          </div>

          <div className="mt-3 pt-2 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between font-mono text-xs">
            <span className="font-semibold text-neutral-900 dark:text-white">
              {card.content.quoteAuthor || 'Dieter Rams'}
            </span>
            <span className="text-[10px] text-neutral-500 uppercase">
              {card.content.quoteRole || '1976'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
