import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Download,
  FileCode,
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { BentoCard, CornerRadius, GridGap } from '../types';
import {
  generatePureCSSGridHTML,
  generateSingleFileHTML,
  generateTailwindHTML,
} from '../utils/codeGenerator';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  cards: BentoCard[];
  radius: CornerRadius;
  gap: GridGap;
  layoutName: string;
}

type TabType = 'singlefile' | 'tailwind' | 'purecss' | 'react';

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  cards,
  radius,
  gap,
  layoutName,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('singlefile');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const singleFileCode = generateSingleFileHTML(cards, radius, gap, layoutName);
  const tailwindCode = generateTailwindHTML(cards, radius, gap);
  const pureCssCode = generatePureCSSGridHTML(cards, radius, gap);
  const reactCode = `import React from 'react';\n\nexport const BentoGrid = () => {\n  return (\n${tailwindCode.split('\n').map(l => `    ${l}`).join('\n')}\n  );\n};`;

  const getActiveCode = () => {
    switch (activeTab) {
      case 'singlefile': return singleFileCode;
      case 'tailwind': return tailwindCode;
      case 'purecss': return pureCssCode;
      case 'react': return reactCode;
    }
  };

  const handleCopy = async () => {
    const code = getActiveCode();
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleDownloadSingleFile = () => {
    const blob = new Blob([singleFileCode], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bento-grid-${cards.length}-cards.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 font-sans">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-[#161616] rounded-sm border border-neutral-300 dark:border-neutral-700 shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-neutral-50 dark:bg-[#1A1A1A] border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-[#161616] dark:bg-[#F2F2F0] text-white dark:text-[#161616] rounded-sm flex items-center justify-center">
              <FileCode className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight text-neutral-900 dark:text-white">
                EXPORTAR RETÍCULA
              </h2>
              <p className="text-[11px] font-mono text-neutral-500">
                {layoutName} • {cards.length} MÓDULOS CSS GRID
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-sm border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center justify-center text-neutral-600 dark:text-neutral-300 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 py-2.5 bg-neutral-100/70 dark:bg-[#181818] border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center border border-neutral-300 dark:border-neutral-700 rounded-sm p-0.5 bg-white dark:bg-neutral-800">
            <button
              type="button"
              onClick={() => setActiveTab('singlefile')}
              className={`px-3 py-1 text-xs font-mono rounded-sm transition-all ${
                activeTab === 'singlefile'
                  ? 'bg-[#161616] text-white dark:bg-[#F2F2F0] dark:text-[#161616] font-semibold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
              }`}
            >
              HTML Autónomo
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('tailwind')}
              className={`px-3 py-1 text-xs font-mono rounded-sm transition-all ${
                activeTab === 'tailwind'
                  ? 'bg-[#161616] text-white dark:bg-[#F2F2F0] dark:text-[#161616] font-semibold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
              }`}
            >
              Tailwind CSS
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('purecss')}
              className={`px-3 py-1 text-xs font-mono rounded-sm transition-all ${
                activeTab === 'purecss'
                  ? 'bg-[#161616] text-white dark:bg-[#F2F2F0] dark:text-[#161616] font-semibold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
              }`}
            >
              CSS Grid Puro
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('react')}
              className={`px-3 py-1 text-xs font-mono rounded-sm transition-all ${
                activeTab === 'react'
                  ? 'bg-[#161616] text-white dark:bg-[#F2F2F0] dark:text-[#161616] font-semibold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
              }`}
            >
              React JSX
            </button>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'singlefile' && (
              <button
                type="button"
                onClick={handleDownloadSingleFile}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono uppercase tracking-wider rounded-sm border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-50 text-neutral-800 dark:text-neutral-200 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar .html</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleCopy}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-mono uppercase tracking-wider rounded-sm transition-all ${
                copied
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-black font-bold'
                  : 'bg-[#161616] hover:bg-black dark:bg-[#F2F2F0] dark:hover:bg-white text-white dark:text-[#161616]'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado' : 'Copiar'}</span>
            </button>
          </div>
        </div>

        {/* Code Content Area */}
        <div className="flex-1 p-4 bg-[#111111] overflow-auto font-mono text-xs text-neutral-300 max-h-[500px]">
          <pre className="overflow-x-auto leading-relaxed whitespace-pre font-mono">
            <code>{getActiveCode()}</code>
          </pre>
        </div>

        {/* Footer Note */}
        <div className="px-5 py-2.5 bg-neutral-50 dark:bg-[#1A1A1A] border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs font-mono text-neutral-500">
          <span>
            {activeTab === 'singlefile'
              ? 'Código independiente sin dependencias externas obligatorias.'
              : 'Columnas adaptativas: 1 móvil, 2 tablet, 4 escritorio.'}
          </span>
          <span className="font-semibold text-[11px]">
            {getActiveCode().split('\n').length} LÍNEAS
          </span>
        </div>
      </div>
    </div>
  );
};
