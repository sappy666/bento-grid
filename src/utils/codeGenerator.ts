import { BentoCard, CornerRadius, GridGap } from '../types';

export function getColSpanClass(colSpan: number, device: 'desktop' | 'tablet' | 'mobile'): string {
  if (device === 'mobile') return 'col-span-1';
  if (device === 'tablet') {
    return colSpan >= 2 ? 'md:col-span-2' : 'md:col-span-1';
  }
  // desktop
  switch (colSpan) {
    case 4: return 'lg:col-span-4';
    case 3: return 'lg:col-span-3';
    case 2: return 'lg:col-span-2';
    default: return 'lg:col-span-1';
  }
}

export function getRowSpanClass(rowSpan: number): string {
  switch (rowSpan) {
    case 3: return 'lg:row-span-3';
    case 2: return 'lg:row-span-2';
    default: return 'lg:row-span-1';
  }
}

export function generateTailwindHTML(
  cards: BentoCard[],
  radius: CornerRadius,
  gap: GridGap
): string {
  const cardHTMLs = cards.map((card, idx) => {
    const desktopCol = getColSpanClass(card.colSpanDesktop, 'desktop');
    const desktopRow = getRowSpanClass(card.rowSpanDesktop);
    const tabletCol = card.colSpanTablet ? `md:col-span-${card.colSpanTablet}` : 'md:col-span-1';

    let cardBody = '';
    const badgeHtml = card.content.badge
      ? `<span class="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-mono uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">${card.content.badge}</span>`
      : '';

    switch (card.type) {
      case 'featured':
        cardBody = `
    <div class="flex items-center justify-between gap-2 mb-3">
      ${badgeHtml}
      <span class="text-xs text-neutral-400 font-mono">0${idx + 1}</span>
    </div>
    <h3 class="text-xl font-bold tracking-tight text-neutral-900 dark:text-white mb-2 leading-snug">${card.content.title}</h3>
    <p class="text-xs text-neutral-600 dark:text-neutral-400 mb-3 leading-relaxed">${card.content.subtitle || ''}</p>
    ${card.content.imageUrl ? `<div class="w-full h-36 rounded-sm overflow-hidden mb-3 border border-neutral-200 dark:border-neutral-800"><img src="${card.content.imageUrl}" alt="${card.content.title}" class="w-full h-full object-cover grayscale" /></div>` : ''}
    ${card.content.actionText ? `<button class="inline-flex items-center justify-center px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider rounded-sm bg-[#161616] text-white hover:bg-black dark:bg-[#F2F2F0] dark:text-[#161616] dark:hover:bg-white transition-opacity">${card.content.actionText}</button>` : ''}
`;
        break;

      case 'metric':
        cardBody = `
    <div class="flex items-center justify-between gap-2 mb-3">
      ${badgeHtml}
      <span class="text-xs text-neutral-400 font-mono">0${idx + 1}</span>
    </div>
    <span class="text-[10px] font-mono uppercase tracking-widest text-neutral-500 dark:text-neutral-400">${card.content.title}</span>
    <div class="mt-2 flex items-baseline gap-2">
      <span class="text-4xl font-mono font-bold tracking-tight text-neutral-900 dark:text-white">${card.content.metricValue || '0'}</span>
      ${card.content.metricChange ? `<span class="font-mono text-[10px] px-1.5 py-0.5 rounded-sm bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">${card.content.metricChange}</span>` : ''}
    </div>
    <p class="mt-3 pt-2 border-t border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">${card.content.metricLabel || ''}</p>
`;
        break;

      case 'image':
        cardBody = `
    <div class="relative w-full h-36 rounded-sm overflow-hidden mb-2 border border-neutral-200 dark:border-neutral-800">
      <img src="${card.content.imageUrl || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80'}" alt="${card.content.title}" class="w-full h-full object-cover grayscale contrast-105" />
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2.5">
        <span class="font-mono text-xs text-white">${card.content.title}</span>
      </div>
    </div>
    <p class="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">${card.content.subtitle || ''}</p>
`;
        break;

      case 'list':
        cardBody = `
    <div class="flex items-center justify-between gap-2 mb-3">
      ${badgeHtml}
      <span class="text-xs text-neutral-400 font-mono">0${idx + 1}</span>
    </div>
    <h3 class="text-sm font-bold text-neutral-900 dark:text-white mb-2">${card.content.title}</h3>
    <ul class="space-y-1.5 text-xs text-neutral-800 dark:text-neutral-200">
      ${(card.content.listItems || []).map(item => `
      <li class="flex items-center gap-2">
        <span class="w-3.5 h-3.5 border border-neutral-400 dark:border-neutral-600 rounded-none inline-flex items-center justify-center text-[10px] shrink-0">✓</span>
        <span>${item.text}</span>
      </li>`).join('')}
    </ul>
`;
        break;

      case 'action':
        cardBody = `
    <div class="flex items-center justify-between gap-2 mb-3">
      ${badgeHtml}
      <span class="text-xs text-neutral-400 font-mono">0${idx + 1}</span>
    </div>
    <h3 class="text-sm font-bold text-neutral-900 dark:text-white">${card.content.title}</h3>
    <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-1 mb-4 leading-relaxed">${card.content.subtitle || ''}</p>
    <div class="flex items-center justify-between pt-2.5 border-t border-neutral-200 dark:border-neutral-800">
      <span class="font-mono text-xs uppercase text-neutral-700 dark:text-neutral-300">${card.content.actionText || 'ACTIVO'}</span>
      <div class="w-9 h-5 bg-[#161616] dark:bg-[#F2F2F0] border border-neutral-400 dark:border-neutral-600 p-[2px] flex items-center justify-end">
        <div class="w-3.5 h-3.5 bg-white dark:bg-[#161616]"></div>
      </div>
    </div>
`;
        break;

      case 'media':
        cardBody = `
    <div class="flex items-center justify-between gap-2 mb-2">
      ${badgeHtml}
      <span class="text-xs text-neutral-400 font-mono">0${idx + 1}</span>
    </div>
    <span class="font-mono text-[10px] uppercase tracking-widest text-neutral-500">${card.content.title}</span>
    <p class="text-sm font-bold text-neutral-900 dark:text-white mt-1">${card.content.trackTitle || 'Acoustic Study'}</p>
    <div class="flex items-center gap-1 mt-3 h-5 px-2 bg-neutral-100 dark:bg-neutral-800/60 rounded-sm">
      <div class="w-1 bg-neutral-800 dark:bg-neutral-200 h-2"></div>
      <div class="w-1 bg-neutral-800 dark:bg-neutral-200 h-4"></div>
      <div class="w-1 bg-neutral-800 dark:bg-neutral-200 h-3"></div>
      <div class="w-1 bg-neutral-800 dark:bg-neutral-200 h-5"></div>
      <div class="w-1 bg-neutral-800 dark:bg-neutral-200 h-2"></div>
    </div>
`;
        break;

      default:
        cardBody = `
    <div class="flex items-center justify-between gap-2 mb-2">
      ${badgeHtml}
      <span class="text-xs text-neutral-400 font-mono">0${idx + 1}</span>
    </div>
    <h3 class="text-sm font-bold text-neutral-900 dark:text-white mb-2">${card.content.title}</h3>
    <p class="text-xs text-neutral-600 dark:text-neutral-400 italic">“${card.content.quoteText || card.content.subtitle || ''}”</p>
    <div class="mt-3 pt-2 border-t border-neutral-200 dark:border-neutral-800 font-mono text-[11px] text-neutral-500">— ${card.content.quoteAuthor || 'Dieter Rams'}</div>
`;
        break;
    }

    return `  <!-- Bento Card ${idx + 1} [${card.type}] -->
  <div class="col-span-1 ${tabletCol} ${desktopCol} ${desktopRow} p-6 ${radius} bg-white dark:bg-[#181818] border border-neutral-200 dark:border-neutral-800 transition-colors flex flex-col justify-between">
${cardBody}
  </div>`;
  }).join('\n\n');

  return `<!-- Bento Grid Container -->
<div class="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 ${gap}">
${cardHTMLs}
  </div>
</div>`;
}

export function generatePureCSSGridHTML(
  cards: BentoCard[],
  radius: CornerRadius,
  gap: GridGap
): string {
  const gapPx = gap === 'gap-3' ? '12px' : gap === 'gap-4' ? '16px' : '24px';
  const radiusPx = radius === 'rounded-none' ? '0px' : radius === 'rounded-lg' ? '8px' : '16px';

  let css = `/* Bento Grid Pure CSS (Bauhaus / Scandinavian Minimalist) */
.bento-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.bento-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: ${gapPx};
}

.bento-card {
  padding: 24px;
  border-radius: ${radiusPx};
  background: #ffffff;
  border: 1px solid #e5e5e2;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
}

@media (prefers-color-scheme: dark) {
  .bento-card {
    background: #181818;
    border-color: #282828;
    color: #eaeaea;
  }
}

/* Responsive Breakpoints */
@media (min-width: 768px) {
  .bento-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  ${cards.map((c, i) => c.colSpanTablet && c.colSpanTablet > 1 ? `.bento-card-${i + 1} { grid-column: span ${c.colSpanTablet}; }` : '').filter(Boolean).join('\n  ')}
}

@media (min-width: 1024px) {
  .bento-grid {
    grid-template-columns: repeat(4, 1fr);
  }
  ${cards.map((c, i) => {
    const rules = [];
    if (c.colSpanDesktop > 1) rules.push(`grid-column: span ${c.colSpanDesktop};`);
    if (c.rowSpanDesktop > 1) rules.push(`grid-row: span ${c.rowSpanDesktop};`);
    return rules.length > 0 ? `.bento-card-${i + 1} {\n    ${rules.join('\n    ')}\n  }` : '';
  }).filter(Boolean).join('\n  ')}
}
`;

  const markup = `<!-- Bento Grid HTML -->
<div class="bento-container">
  <div class="bento-grid">
${cards.map((card, i) => `    <div class="bento-card bento-card-${i + 1}">
      <h3>${card.content.title}</h3>
      <p>${card.content.subtitle || card.content.metricLabel || ''}</p>
    </div>`).join('\n')}
  </div>
</div>`;

  return `<style>\n${css}\n</style>\n\n${markup}`;
}

export function generateSingleFileHTML(
  cards: BentoCard[],
  radius: CornerRadius,
  gap: GridGap,
  layoutName: string
): string {
  const tailwindSnippet = generateTailwindHTML(cards, radius, gap);

  return `<!DOCTYPE html>
<html lang="es" class="h-full">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${layoutName} — Retícula Bento Grid</title>
  <meta name="description" content="Layout Bento Grid minimalista inspirado en Bauhaus y diseño escandinavo.">
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'system-ui', 'sans-serif'],
            mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
          }
        }
      }
    }
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Inter', system-ui, sans-serif;
    }
  </style>
</head>
<body class="min-h-full bg-[#F7F7F5] text-[#161616] dark:bg-[#121212] dark:text-[#EAEAEA] transition-colors duration-200 font-sans">
  
  <!-- Minimalist Header Bar -->
  <header class="border-b border-neutral-200 dark:border-neutral-800 bg-[#F7F7F5] dark:bg-[#121212] px-6 py-4">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-7 h-7 bg-[#161616] text-white dark:bg-[#F2F2F0] dark:text-[#161616] rounded-sm flex items-center justify-center font-mono font-bold text-xs">
          B
        </div>
        <div>
          <h1 class="text-sm font-bold tracking-tight text-neutral-900 dark:text-white uppercase font-mono">${layoutName}</h1>
          <p class="text-[11px] font-mono text-neutral-500">${cards.length} MÓDULOS • RETÍCULA CSS</p>
        </div>
      </div>
      
      <!-- Theme Toggle Button -->
      <button id="themeToggle" class="px-3 py-1 text-xs font-mono rounded-sm border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors flex items-center gap-1.5">
        <span id="themeLabel">MODO OSCURO</span>
      </button>
    </div>
  </header>

  <!-- Bento Grid Content -->
  <main class="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
${tailwindSnippet}
  </main>

  <footer class="py-6 text-center text-xs font-mono text-neutral-400 border-t border-neutral-200 dark:border-neutral-800">
    BAUHAUS / SCANDINAVIAN BENTO GRID GENERATOR
  </footer>

  <script>
    const themeBtn = document.getElementById('themeToggle');
    const htmlElem = document.documentElement;
    const themeLabel = document.getElementById('themeLabel');

    function updateTheme(dark) {
      if (dark) {
        htmlElem.classList.add('dark');
        themeLabel.textContent = 'MODO CLARO';
      } else {
        htmlElem.classList.remove('dark');
        themeLabel.textContent = 'MODO OSCURO';
      }
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let isDark = prefersDark;
    updateTheme(isDark);

    themeBtn.addEventListener('click', () => {
      isDark = !isDark;
      updateTheme(isDark);
    });
  </script>
</body>
</html>`;
}
