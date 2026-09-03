import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { PRESET_DISTRIBUTIONS, generateRandomBentoDistribution, LayoutDistribution } from './data/bentoLayouts';
import { BentoCard, DeviceView } from './types';
import { BentoCardView } from './components/BentoCardView';
import { EqualizerControl } from './components/EqualizerControl';
import {
  Shuffle,
  Monitor,
  Tablet,
  Smartphone,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Layers,
  Check,
  RotateCcw,
  X,
  LayoutGrid,
  FileText,
  SlidersHorizontal,
  ChevronDown,
  Palette,
  Linkedin,
  Globe2,
} from 'lucide-react';

const CARD_COUNTS = [2, 3, 4, 5, 6, 7, 8, 9];

// Long-form vignettes: shown on cards with room for a full paragraph (title = headline,
// subtitle = body). `badge` is the scene name — supplementary (modal + code export only).
const PRIMARY_CONTENT = [
  {
    badge: 'El gato de Cheshire',
    title: 'Depende de a dónde quieras ir',
    subtitle: '—¿Podrías decirme, por favor, qué camino tengo que tomar para salir de aquí? —Eso depende en gran parte a dónde quieras ir.',
  },
  {
    badge: 'Un secreto a voces',
    title: 'Siempre se llega a alguna parte',
    subtitle: '—¡Oh, siempre llegarás a alguna parte —dijo el Gato—, si caminas lo suficiente!',
  },
  {
    badge: 'Tiempo sin tiempo',
    title: 'Llego tarde a una cita importante',
    subtitle: '¡Ay, Dios mío! ¡Ay, Dios mío! ¡Qué tarde se me está haciendo! No hay tiempo para decir hola o adiós, ¡llego tarde!',
  },
];

// Short, punchy lines for compact metric/quote cards: `headline` fills the big display
// slot (metric value or quote text), `caption` is the small uppercase line underneath.
const SECONDARY_CONTENT = [
  { badge: 'El Sombrerero Loco', headline: 'Las mejores personas lo están.', caption: 'EL SOMBRERERO Y ALICIA' },
  { badge: 'El consejo del Absolem', headline: '¿Quién eres tú en realidad?', caption: 'LA ORUGA AZUL' },
  { badge: 'La Reina de Corazones', headline: '¡Que le corten la cabeza!', caption: 'REGLA DE LA CORONA' },
  { badge: 'Cuestión de tamaño', headline: 'A veces he creído seis cosas imposibles.', caption: 'ANTES DEL DESAYUNO' },
  { badge: 'Juicios y razones', headline: 'Aquí todos estamos locos.', caption: 'EL GATO DE CHESHIRE' },
  { badge: 'Un día cualquiera', headline: 'Es inútil volver a ayer.', caption: 'PUES ERA OTRA PERSONA' },
];

const withAliceContent = (distribution: LayoutDistribution): LayoutDistribution => ({
  ...distribution,
  cards: distribution.cards.map((card, index) => {
    // Metric/quote cards render a big value + small caption — that's exactly the
    // punchy secondary shape. Everything else (featured/list/...) gets the long form.
    if (card.type === 'metric' || card.type === 'quote') {
      const s = SECONDARY_CONTENT[index % SECONDARY_CONTENT.length];
      return {
        ...card,
        title: s.badge,
        content: {
          ...card.content,
          title: s.badge,
          badge: s.badge,
          subtitle: undefined,
          metricValue: s.headline,
          metricLabel: s.caption,
          metricChange: undefined,
          quoteText: s.headline,
          quoteAuthor: s.caption,
        },
      };
    }

    const p = PRIMARY_CONTENT[index % PRIMARY_CONTENT.length];
    const listItems = [0, 1, 2].map((offset) => ({
      text: SECONDARY_CONTENT[(index + offset) % SECONDARY_CONTENT.length].headline,
      done: true,
    }));

    return {
      ...card,
      title: p.title,
      content: {
        ...card.content,
        title: p.title,
        badge: p.badge,
        subtitle: p.subtitle,
        description: p.subtitle,
        listItems,
        trackTitle: p.badge,
        trackArtist: undefined,
        actionText: 'Seguir leyendo',
      },
    };
  }),
});

export default function App() {
  const [cardCount, setCardCount] = useState<number>(4);
  const [deviceView, setDeviceView] = useState<DeviceView>('desktop');
  const [cardContentMode, setCardContentMode] = useState<'content' | 'empty'>('content');
  const [borderRadius, setBorderRadius] = useState<number>(20);
  const [gap, setGap] = useState<number>(16);
  const [showEqualizer, setShowEqualizer] = useState<boolean>(false);
  const [showStylesMenu, setShowStylesMenu] = useState<boolean>(false);
  
  // Custom / randomized distributions appended per card count so user can freely navigate back/forward
  const [customDistributionsByCount, setCustomDistributionsByCount] = useState<Record<number, LayoutDistribution[]>>({});
  const [distributionIndexByCount, setDistributionIndexByCount] = useState<Record<number, number>>({
    2: 0,
    3: 0,
    4: 2,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
  });

  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('design_process_theme');
      if (saved) return saved === 'dark';
      return false; // default light matching reference image
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
    setTimeout(() => setToastMessage(null), 2000);
  };

  // All distributions for current card count = curated presets + generated ones
  const allDistributions = useMemo(() => {
    const presets = PRESET_DISTRIBUTIONS[cardCount] || [];
    const customs = customDistributionsByCount[cardCount] || [];
    return [...presets, ...customs];
  }, [cardCount, customDistributionsByCount]);

  const currentIndex = Math.min(
    distributionIndexByCount[cardCount] ?? 0,
    Math.max(0, allDistributions.length - 1)
  );

  // Current active layout distribution
  const currentDistribution: LayoutDistribution = useMemo(() => {
    if (allDistributions.length > 0) {
      return allDistributions[currentIndex];
    }
    return generateRandomBentoDistribution(cardCount);
  }, [allDistributions, currentIndex, cardCount]);

  const displayedDistribution = useMemo(
    () => withAliceContent(currentDistribution),
    [currentDistribution]
  );

  // Handle Card Count Change
  const handleCountChange = (count: number) => {
    setCardCount(count);
    setSelectedCardId(null);
    showToast(`${count} tarjetas`);
  };

  // Next distribution preset or custom
  const handleNextDistribution = useCallback(() => {
    if (allDistributions.length <= 1) return;
    const nextIdx = (currentIndex + 1) % allDistributions.length;
    setDistributionIndexByCount((prev) => ({
      ...prev,
      [cardCount]: nextIdx,
    }));
    setSelectedCardId(null);
    showToast(`Distribución ${nextIdx + 1} de ${allDistributions.length}`);
  }, [allDistributions.length, currentIndex, cardCount]);

  // Prev distribution preset or custom
  const handlePrevDistribution = useCallback(() => {
    if (allDistributions.length <= 1) return;
    const prevIdx = (currentIndex - 1 + allDistributions.length) % allDistributions.length;
    setDistributionIndexByCount((prev) => ({
      ...prev,
      [cardCount]: prevIdx,
    }));
    setSelectedCardId(null);
    showToast(`Distribución ${prevIdx + 1} de ${allDistributions.length}`);
  }, [allDistributions.length, currentIndex, cardCount]);

  // Handle Randomize: appends new distribution so it can be navigated back/forward
  const handleRandomize = () => {
    const randomDist = generateRandomBentoDistribution(cardCount);
    const existingCustoms = customDistributionsByCount[cardCount] || [];
    const newCustoms = [...existingCustoms, randomDist];
    
    setCustomDistributionsByCount((prev) => ({
      ...prev,
      [cardCount]: newCustoms,
    }));

    const presetsCount = (PRESET_DISTRIBUTIONS[cardCount] || []).length;
    const newIndex = presetsCount + newCustoms.length - 1;
    
    setDistributionIndexByCount((prev) => ({
      ...prev,
      [cardCount]: newIndex,
    }));
    setSelectedCardId(null);
    showToast(`Nueva distribución añadida (${newIndex + 1} de ${presetsCount + newCustoms.length})`);
  };

  // Keyboard navigation for distributions (ArrowLeft / ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowLeft') {
        handlePrevDistribution();
      } else if (e.key === 'ArrowRight') {
        handleNextDistribution();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrevDistribution, handleNextDistribution]);

  // Reset to default 4-card reference layout
  const handleReset = () => {
    setCardCount(4);
    setDistributionIndexByCount((prev) => ({ ...prev, 4: 2 }));
    setCustomDistributionsByCount((prev) => ({ ...prev, 4: [] }));
    setDeviceView('desktop');
    setCardContentMode('content');
    setSelectedCardId(null);
    setBorderRadius(20);
    setGap(16);
    showToast('Restablecido a diseño original');
  };

  // Container width class depending on device view
  const containerWidthClass = {
    desktop: 'w-full max-w-7xl',
    tablet: 'w-full max-w-[768px]',
    mobile: 'w-full max-w-[390px]',
  }[deviceView];

  const selectedCard = displayedDistribution.cards.find((c) => c.id === selectedCardId);

  return (
    <div className="min-h-screen bg-[#ECEBE6] text-[#111111] dark:bg-[#121212] dark:text-[#EAEAEA] transition-colors duration-200 antialiased selection:bg-[#FCD8E6] selection:text-black dark:selection:bg-[#FCD8E6] dark:selection:text-black flex flex-col justify-between">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-3.5 py-2 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xl font-mono text-xs font-semibold">
          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Wrapper */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-12 flex-1 flex flex-col justify-between">
        
        {/* Top Header Row (Preserving user's reference image styling) */}
        <header className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between pb-3 flex-wrap gap-4">
            {/* Left Badge: (02) Design Process */}
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full border border-neutral-800 dark:border-neutral-300 flex items-center justify-center text-[10px] font-bold font-mono text-neutral-800 dark:text-neutral-200">
                02
              </span>
              <span className="px-3.5 py-1 rounded-full bg-neutral-900 text-white dark:bg-[#F2F2F0] dark:text-neutral-900 text-xs font-semibold tracking-tight">
                Design Process
              </span>
              <span className="text-neutral-400 dark:text-neutral-600 font-mono text-xs hidden md:inline">
                / Bento Grid Studio
              </span>
            </div>

            {/* Right Controls: Device Switcher, Theme & Reset */}
            <div className="flex items-center gap-2">
              {/* Device View Selector */}
              <div className="flex items-center p-0.5 rounded-full bg-neutral-200/80 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400">
                <button
                  type="button"
                  onClick={() => setDeviceView('desktop')}
                  className={`p-2.5 sm:p-1.5 rounded-full transition-colors ${
                    deviceView === 'desktop'
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                      : 'hover:text-neutral-900 dark:hover:text-white'
                  }`}
                  title="Desktop (12 cols)"
                >
                  <Monitor className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeviceView('tablet')}
                  className={`p-2.5 sm:p-1.5 rounded-full transition-colors ${
                    deviceView === 'tablet'
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                      : 'hover:text-neutral-900 dark:hover:text-white'
                  }`}
                  title="Tablet (768px)"
                >
                  <Tablet className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeviceView('mobile')}
                  className={`p-2.5 sm:p-1.5 rounded-full transition-colors ${
                    deviceView === 'mobile'
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                      : 'hover:text-neutral-900 dark:hover:text-white'
                  }`}
                  title="Móvil (390px)"
                >
                  <Smartphone className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                </button>
              </div>

              {/* Theme & Reset */}
              <div className="flex items-center gap-1 border-l border-neutral-300 dark:border-neutral-700 pl-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="p-2.5 sm:p-1.5 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 transition-colors"
                  title="Restablecer"
                >
                  <RotateCcw className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsDark(!isDark)}
                  className="p-2.5 sm:p-1.5 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 transition-colors"
                  title={isDark ? 'Modo claro' : 'Modo oscuro'}
                >
                  {isDark ? <Sun className="w-4 h-4 sm:w-3.5 sm:h-3.5" /> : <Moon className="w-4 h-4 sm:w-3.5 sm:h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Thin Hairline Divider */}
          <div className="h-px bg-neutral-300 dark:bg-neutral-800 w-full mb-5" />

          {/* Bento Grid Controls Bar (Icon-only with tooltips, precise and clean) */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 p-2 sm:p-2.5 rounded-2xl bg-white/80 dark:bg-[#1A1A1A]/80 backdrop-blur-sm border border-neutral-300/80 dark:border-neutral-800 shadow-xs">
            
            {/* 1. Card Count Selector (2 to 9) */}
            <div className="flex items-center gap-1.5 sm:gap-1">
              {CARD_COUNTS.map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => handleCountChange(count)}
                  className={`w-9 h-9 sm:w-7 sm:h-7 rounded-lg text-xs font-mono font-bold transition-all ${
                    cardCount === count
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs scale-105'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                  }`}
                  title={`${count} cards`}
                >
                  {count}
                </button>
              ))}
            </div>

            {/* 2. Group: Info / Empty Mode + Equalizer Toggle */}
            <div className="flex items-center gap-1.5">
              {/* Content vs Empty Cards Toggle */}
              <div className="flex items-center p-0.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700">
                <button
                  type="button"
                  onClick={() => setCardContentMode('content')}
                  className={`p-2.5 sm:p-1.5 rounded-lg transition-colors ${
                    cardContentMode === 'content'
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                  title="Con información"
                >
                  <FileText className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setCardContentMode('empty')}
                  className={`p-2.5 sm:p-1.5 rounded-lg transition-colors ${
                    cardContentMode === 'empty'
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                  title="Cards vacías"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>

              {/* Equalizer (Border Radius & Gap) Toggle Button */}
              <button
                type="button"
                onClick={() => setShowEqualizer(!showEqualizer)}
                className={`p-2.5 sm:p-1.5 rounded-xl border transition-all ${
                  showEqualizer
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-neutral-900 dark:border-white shadow-xs'
                    : 'bg-neutral-100 dark:bg-neutral-800/80 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
                title="Ecualizador de bordes y separación"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* 3. Distribution Navigation: [ < ] X/Y [ > ] + [ Shuffle ] */}
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5 bg-neutral-100 dark:bg-neutral-800/80 p-0.5 rounded-xl border border-neutral-200 dark:border-neutral-700">
                <button
                  type="button"
                  onClick={handlePrevDistribution}
                  className="p-2.5 sm:p-1.5 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-white dark:hover:bg-neutral-700 transition-colors"
                  title="Anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="px-2 py-0.5 text-xs font-mono font-bold text-neutral-800 dark:text-neutral-200 whitespace-nowrap min-w-[3rem] text-center">
                  {currentIndex + 1}/{allDistributions.length}
                </div>

                <button
                  type="button"
                  onClick={handleNextDistribution}
                  className="p-2.5 sm:p-1.5 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-white dark:hover:bg-neutral-700 transition-colors"
                  title="Siguiente"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Randomize Button (Icon Only with tooltip) */}
              <button
                type="button"
                onClick={handleRandomize}
                className="p-2.5 sm:p-2 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90 transition-opacity shadow-xs"
                title="Randomizar"
              >
                <Shuffle className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Equalizer Panel (Accordion / Pop-in) */}
          {showEqualizer && (
            <div className="mt-3">
              <EqualizerControl
                borderRadius={borderRadius}
                gap={gap}
                onBorderRadiusChange={setBorderRadius}
                onGapChange={setGap}
                onClose={() => setShowEqualizer(false)}
              />
            </div>
          )}

          {/* Active Distribution Subtitle & Style Selector Popover */}
          <div className="relative w-full flex items-center justify-between mt-2.5 px-2 text-xs font-mono text-neutral-500 dark:text-neutral-400">
            <div className="relative min-w-0">
              <button
                type="button"
                onClick={() => setShowStylesMenu(!showStylesMenu)}
                className="flex items-center gap-1.5 py-2 sm:py-1 px-2 -ml-2 rounded-lg hover:bg-neutral-200/70 dark:hover:bg-neutral-800 transition-colors cursor-pointer group text-left"
                title="Explorar todos los estilos de distribución"
              >
                <Layers className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white shrink-0 transition-colors" />
                <span className="font-semibold text-neutral-800 dark:text-neutral-200 truncate max-w-[200px] sm:max-w-xs md:max-w-md group-hover:text-neutral-950 dark:group-hover:text-white">
                  {displayedDistribution.name}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-transform duration-150 shrink-0 ${
                    showStylesMenu ? 'rotate-180 text-neutral-900 dark:text-white' : ''
                  }`}
                />
              </button>

              {/* Quick Styles Dropdown */}
              {showStylesMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowStylesMenu(false)}
                  />
                  <div className="absolute top-full left-0 mt-1.5 z-50 w-72 sm:w-84 max-w-[calc(100vw-2rem)] max-h-72 overflow-y-auto p-1.5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl font-sans">
                    <div className="px-2.5 py-1.5 text-[11px] font-mono font-medium text-neutral-400 dark:text-neutral-500 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                      <span>Estilos ({cardCount} tarjetas)</span>
                      <span>{allDistributions.length} disponibles</span>
                    </div>
                    <div className="py-1 space-y-0.5">
                      {allDistributions.map((dist, idx) => {
                        const isActive = idx === currentIndex;
                        return (
                          <button
                            key={dist.id}
                            type="button"
                            onClick={() => {
                              setDistributionIndexByCount(prev => ({ ...prev, [cardCount]: idx }));
                              setShowStylesMenu(false);
                            }}
                            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left text-xs transition-colors ${
                              isActive
                                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold shadow-xs'
                                : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                            }`}
                          >
                            <span className="truncate pr-2">{dist.name}</span>
                            {isActive && <Check className="w-3.5 h-3.5 shrink-0 text-emerald-400 dark:text-emerald-600" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            <span className="shrink-0 text-[11px] font-mono text-neutral-400 pl-2">
              r: {borderRadius}px • gap: {gap}px
            </span>
          </div>
        </header>

        {/* Bento Grid Workspace Container */}
        <main className="flex-1 flex flex-col items-center justify-start">
          {/* Device Frame Simulation Header when Tablet or Mobile is selected */}
          {deviceView !== 'desktop' && (
            <div className="mb-3 flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-xs font-mono text-neutral-600 dark:text-neutral-300">
              {deviceView === 'tablet' ? <Tablet className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
              <span className="uppercase">
                {deviceView === 'tablet' ? 'Simulador Tablet (768px)' : 'Simulador Móvil (390px)'}
              </span>
            </div>
          )}

          {/* Grid Container */}
          <div
            className={`transition-all duration-300 mx-auto ${containerWidthClass} ${
              deviceView !== 'desktop'
                ? 'p-3 sm:p-5 rounded-3xl bg-neutral-200/60 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 shadow-xl'
                : ''
            }`}
          >
            {/* 12-Column Responsive CSS Grid with dynamic gap */}
            <div
              className="grid grid-cols-12 auto-rows-min transition-all duration-200"
              style={{ gap: `${gap}px` }}
            >
              {displayedDistribution.cards.map((card, idx) => (
                <BentoCardView
                  key={`${displayedDistribution.id}-${card.id}-${idx}`}
                  card={card}
                  index={idx}
                  deviceView={deviceView}
                  isSelected={selectedCardId === card.id}
                  onClick={() => setSelectedCardId(card.id)}
                  isEmptyView={cardContentMode === 'empty'}
                  borderRadius={borderRadius}
                />
              ))}
            </div>
          </div>
        </main>

        {/* Minimal Footer */}
        <footer className="mt-12 pt-6 border-t border-neutral-300/80 dark:border-neutral-800/80 flex flex-col gap-5 text-xs font-mono text-neutral-500 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <span className="block text-neutral-700 dark:text-neutral-300">BENTO GRID STUDIO</span>
            <span className="block text-[11px] tracking-wide text-neutral-400 dark:text-neutral-500">
              macarena ramdohr / sappy
            </span>
          </div>

          <div className="flex flex-col items-start gap-3 sm:items-end">
            <nav aria-label="Enlaces de Macarena Ramdohr" className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <a
                href="https://www.behance.net/macarenaramdohr"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 transition-colors hover:text-neutral-900 dark:hover:text-white"
              >
                <Palette className="h-3.5 w-3.5" />
                Behance
              </a>
              <a
                href="https://www.linkedin.com/in/mramdohr/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 transition-colors hover:text-neutral-900 dark:hover:text-white"
              >
                <Linkedin className="h-3.5 w-3.5" />
                LinkedIn
              </a>
              <a
                href="https://portafolio-mramdohr.vercel.app/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 transition-colors hover:text-neutral-900 dark:hover:text-white"
              >
                <Globe2 className="h-3.5 w-3.5" />
                Portafolio
              </a>
            </nav>
            <span className="text-[11px] text-neutral-400 dark:text-neutral-500">
              {cardCount} CARDS • {deviceView.toUpperCase()}
            </span>
          </div>
        </footer>
      </div>

      {/* Card Detail Slide-over / Modal when clicked */}
      {selectedCard && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
          onClick={() => setSelectedCardId(null)}
        >
          <div
            className="w-full max-w-md bg-white dark:bg-[#1A1A1A] rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">
                {selectedCard.content.badge || 'Detalle del Módulo'}
              </span>
              <button
                type="button"
                onClick={() => setSelectedCardId(null)}
                className="inline-flex items-center gap-1 text-xs font-mono text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                <span>CERRAR</span>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                {selectedCard.content.title || selectedCard.title}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {selectedCard.content.subtitle || selectedCard.content.quoteText || 'Módulo interactivo dentro de la retícula Bento.'}
              </p>
            </div>

            {selectedCard.content.metricValue && (
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                <div className="text-3xl font-extrabold font-mono text-neutral-900 dark:text-white">
                  {selectedCard.content.metricValue}
                </div>
                <div className="text-xs font-mono uppercase text-neutral-400">
                  {selectedCard.content.metricLabel}
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-between items-center text-xs font-mono text-neutral-400">
              <span>
                Col: {selectedCard.colSpanDesktop} / Fila: {selectedCard.rowSpanDesktop}
              </span>
              <button
                type="button"
                onClick={() => setSelectedCardId(null)}
                className="px-3.5 py-1.5 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-semibold"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
