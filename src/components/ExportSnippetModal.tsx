import React, { useState } from 'react';
import { ProcessStep } from '../types';
import { X, Copy, Check, Download, Code2 } from 'lucide-react';

interface ExportSnippetModalProps {
  steps: ProcessStep[];
  onClose: () => void;
}

export const ExportSnippetModal: React.FC<ExportSnippetModalProps> = ({
  steps,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<'html' | 'react'>('html');

  const generateHtml = () => {
    const cardsHtml = steps
      .map(
        (s) => `      <!-- Card ${s.stepNumber} -->
      <div class="p-6 rounded-3xl bg-white border border-neutral-200/80 shadow-sm flex flex-col justify-between min-h-[300px]">
        <div>
          <div class="text-neutral-900 mb-4">
            <!-- Icon ${s.iconName} -->
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
              <circle cx="12" cy="12" r="9"></circle>
            </svg>
          </div>
          <h3 class="text-[15px] font-bold tracking-tight text-neutral-900 leading-snug">${s.title}</h3>
        </div>
        <div class="pt-6">
          <p class="text-[13px] text-neutral-500 leading-relaxed">${s.description}</p>
        </div>
      </div>`
      )
      .join('\n\n');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Designing a Better Experience — Design Process</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', system-ui, sans-serif; }
  </style>
</head>
<body class="bg-[#ECEBE6] text-[#111111] antialiased min-h-screen p-6 sm:p-12 lg:p-16">

  <!-- Header Badge & Rule -->
  <header class="max-w-7xl mx-auto mb-12 sm:mb-16">
    <div class="flex items-center justify-between pb-3">
      <div class="inline-flex items-center gap-2">
        <span class="w-6 h-6 rounded-full border border-neutral-900 flex items-center justify-center text-[10px] font-bold">02</span>
        <span class="px-3 py-1 rounded-full bg-neutral-900 text-white text-xs font-semibold">Design Process</span>
      </div>
      <div class="text-xs font-mono font-bold tracking-widest text-neutral-800">&gt;&gt;&gt;</div>
    </div>
    <div class="h-px bg-neutral-300 w-full"></div>
  </header>

  <!-- Hero Typography Section -->
  <section class="max-w-7xl mx-auto mb-16 sm:mb-20">
    <div class="flex flex-col md:flex-row md:items-start justify-between gap-6">
      <h1 class="text-5xl sm:text-7xl lg:text-[5.5rem] font-bold tracking-tight leading-[0.95] text-[#111111]">
        Designing<br />
        a Better<br />
        Experience
      </h1>
      <div class="md:pt-4 text-xs sm:text-sm font-mono font-semibold uppercase tracking-wider text-neutral-800 max-w-[200px] leading-tight">
        FOR THE<br />
        CONVENIENT USE<br />
        OF EACH USER
      </div>
    </div>
  </section>

  <!-- 6 Process Cards Grid -->
  <main class="max-w-7xl mx-auto">
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
${cardsHtml}
    </div>

    <!-- Sinuous Connector Line (Desktop) -->
    <div class="hidden lg:block w-full pt-4">
      <svg viewBox="0 0 1200 48" fill="none" class="w-full h-12 stroke-neutral-800">
        <path d="M 80 12 C 220 12, 380 20, 520 28 C 620 34, 670 32, 696 14" stroke-width="1.2" stroke-linecap="round"/>
        <path d="M 706 28 C 760 34, 880 34, 980 32 C 1040 30, 1065 24, 1076 14" stroke-width="1.2" stroke-linecap="round"/>
      </svg>
    </div>
  </main>

</body>
</html>`;
  };

  const generateReact = () => {
    return `import React from 'react';

const steps = ${JSON.stringify(steps, null, 2)};

export default function DesignProcessLayout() {
  return (
    <div className="bg-[#ECEBE6] dark:bg-[#121212] text-[#111111] dark:text-[#EAEAEA] antialiased min-h-screen p-6 sm:p-12 lg:p-16">
      {/* Top Header */}
      <header className="max-w-7xl mx-auto mb-12 sm:mb-16">
        <div className="flex items-center justify-between pb-3">
          <div className="inline-flex items-center gap-2">
            <span className="w-6 h-6 rounded-full border border-neutral-900 dark:border-white flex items-center justify-center text-[10px] font-bold">02</span>
            <span className="px-3 py-1 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-semibold">Design Process</span>
          </div>
          <div className="text-xs font-mono font-bold tracking-widest">&gt;&gt;&gt;</div>
        </div>
        <div className="h-px bg-neutral-300 dark:bg-neutral-800 w-full" />
      </header>

      {/* Hero Display Typography */}
      <section className="max-w-7xl mx-auto mb-16 sm:mb-20">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <h1 className="text-5xl sm:text-7xl lg:text-[5.5rem] font-bold tracking-tight leading-[0.95]">
            Designing<br />
            a Better<br />
            Experience
          </h1>
          <div className="md:pt-4 text-xs sm:text-sm font-mono font-semibold uppercase tracking-wider text-neutral-800 dark:text-neutral-300 max-w-[200px] leading-tight">
            FOR THE<br />
            CONVENIENT USE<br />
            OF EACH USER
          </div>
        </div>
      </section>

      {/* Cards Grid */}
      <main className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {steps.map((step) => (
            <div key={step.id} className="p-6 rounded-3xl bg-white dark:bg-[#1E1E1E] border border-neutral-200/80 dark:border-neutral-800 shadow-sm flex flex-col justify-between min-h-[300px]">
              <div>
                <h3 className="text-[15px] font-bold tracking-tight leading-snug">{step.title}</h3>
              </div>
              <div className="pt-6">
                <p className="text-[13px] text-neutral-500 dark:text-neutral-400 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}`;
  };

  const code = tab === 'html' ? generateHtml() : generateReact();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([generateHtml()], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'design-process-bento.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-white dark:bg-[#1A1A1A] rounded-2xl border border-neutral-300 dark:border-neutral-700 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-neutral-900 dark:text-white" />
            <h3 className="text-base font-bold text-neutral-900 dark:text-white font-mono uppercase">
              Exportar Código
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab & Actions bar */}
        <div className="px-6 py-2.5 bg-neutral-50 dark:bg-[#141414] border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setTab('html')}
              className={`px-3 py-1 text-xs font-mono rounded-md ${
                tab === 'html'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-bold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
              }`}
            >
              HTML Autónomo
            </button>
            <button
              type="button"
              onClick={() => setTab('react')}
              className={`px-3 py-1 text-xs font-mono rounded-md ${
                tab === 'react'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-bold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
              }`}
            >
              React + Tailwind
            </button>
          </div>

          <div className="flex items-center gap-2">
            {tab === 'html' && (
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono uppercase rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-100 text-neutral-800 dark:text-neutral-200"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar .html</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-mono uppercase rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90 transition-opacity"
            >
              {copied ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado' : 'Copiar Código'}</span>
            </button>
          </div>
        </div>

        {/* Code view */}
        <div className="flex-1 p-4 bg-[#111111] overflow-auto font-mono text-xs text-neutral-300">
          <pre className="whitespace-pre overflow-x-auto leading-relaxed">
            <code>{code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
