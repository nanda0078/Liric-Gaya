import React, { useState } from 'react';
import { LyricResult } from '../types';
import { Copy, Check, Trash2 } from 'lucide-react';

interface ResultCardProps {
  result: LyricResult;
  onDelete: (id: string) => void;
}

const ColumnCopyButton = ({ text }: { text?: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      disabled={!text}
      className={`p-1.5 rounded-md transition-colors ${
        copied 
          ? 'text-emerald-600 bg-emerald-50' 
          : 'text-slate-300 hover:text-indigo-600 hover:bg-slate-100'
      }`}
      title="Salin kolom ini"
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
};

const ResultCard: React.FC<ResultCardProps> = ({ result, onDelete }) => {
  const [copiedGlobal, setCopiedGlobal] = useState(false);

  const handleCopyGlobal = () => {
    navigator.clipboard.writeText(`${result.title}\n\n${result.modified}`);
    setCopiedGlobal(true);
    setTimeout(() => setCopiedGlobal(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-12 animate-fade-in-up">
      {/* Header Section */}
      <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start gap-4">
        <div className="flex-1">
          <div className="inline-flex items-center justify-center px-2.5 py-1 mb-3 rounded bg-indigo-50 text-indigo-600">
             <span className="text-[10px] font-bold tracking-widest uppercase">HASIL MODIFIKASI</span>
          </div>
          <h3 className="text-3xl md:text-4xl font-serif italic text-slate-800 leading-tight mb-2">
            "{result.title}"
          </h3>
          <p className="text-xs text-slate-400 font-sans">
            Dibuat pada {new Date(result.createdAt).toLocaleString('id-ID')}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyGlobal}
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="Salin Judul & Lirik Modifikasi"
          >
            {copiedGlobal ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          </button>
          <button
            onClick={() => onDelete(result.id)}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Hapus"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Grid Layout for Content: 5 Equal Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
        
        {/* Column 1: Prompt Style */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-sans">
              Prompt Style
            </h4>
            <ColumnCopyButton text={result.style} />
          </div>
          <p className="text-sm text-slate-700 leading-relaxed font-medium font-sans whitespace-pre-line">
            {result.style}
          </p>
        </div>

        {/* Column 2: Original Lyrics */}
        <div className="p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-sans">
              Lirik Original
            </h4>
            <ColumnCopyButton text={result.original} />
          </div>
          {/* Blue Border Box */}
          <div className="border-2 border-blue-500 p-5 rounded-sm flex-1 text-sm text-slate-600 leading-relaxed whitespace-pre-wrap font-sans">
            {result.original}
          </div>
        </div>

        {/* Column 3: Modified Lyrics */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-widest font-sans">
              Lirik Modifikasi
            </h4>
            <ColumnCopyButton text={result.modified} />
          </div>
          <div className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-sans">
            {result.modified}
          </div>
        </div>

        {/* Column 4: English Lyrics */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-widest font-sans">
              Modifikasi (English)
            </h4>
            <ColumnCopyButton text={result.english} />
          </div>
          <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-sans italic">
            {result.english ? result.english : <span className="text-slate-300 not-italic text-xs">(Terjemahan tidak tersedia)</span>}
          </div>
        </div>

        {/* Column 5: Javanese Lyrics */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xs font-bold text-amber-600 uppercase tracking-widest font-sans">
              Modifikasi (Jawa)
            </h4>
            <ColumnCopyButton text={result.javanese} />
          </div>
          <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-sans italic">
            {result.javanese ? result.javanese : <span className="text-slate-300 not-italic text-xs">(Terjemahan tidak tersedia)</span>}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResultCard;