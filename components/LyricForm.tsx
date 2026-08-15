import React, { useState } from 'react';
import { PRESET_STYLES, GenerationStatus } from '../types';
import { Wand2, Loader2 } from 'lucide-react';

interface LyricFormProps {
  onGenerate: (original: string, style: string) => void;
  status: GenerationStatus;
}

const LyricForm: React.FC<LyricFormProps> = ({ onGenerate, status }) => {
  const [original, setOriginal] = useState('');
  const [style, setStyle] = useState('');
  const [isCustomStyle, setIsCustomStyle] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (original.trim() && style.trim()) {
      onGenerate(original, style);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 mb-8">
      <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
        <Wand2 className="w-5 h-5 text-indigo-600" />
        Input Lirik
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Style Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-3">
            1. Pilih Gaya (Prompt Style)
          </label>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {PRESET_STYLES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setStyle(s);
                  setIsCustomStyle(false);
                }}
                className={`px-3 py-1.5 text-sm rounded-full transition-all border ${
                  !isCustomStyle && style === s
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                }`}
              >
                {s}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setStyle('');
                setIsCustomStyle(true);
              }}
              className={`px-3 py-1.5 text-sm rounded-full transition-all border ${
                isCustomStyle
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
              }`}
            >
              Custom...
            </button>
          </div>

          {isCustomStyle && (
            <input
              type="text"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              placeholder="Deskripsikan gaya lirik yang diinginkan (cth: Seperti puisi Chairil Anwar...)"
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              autoFocus
            />
          )}
        </div>

        {/* Original Lyrics Input */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            2. Lirik Original
          </label>
          <textarea
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            placeholder="Tempel atau ketik lirik asli di sini..."
            rows={6}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-y text-slate-700 leading-relaxed"
          />
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={status === GenerationStatus.LOADING || !original.trim() || !style.trim()}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl disabled:shadow-none"
          >
            {status === GenerationStatus.LOADING ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sedang Memproses...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                Buat Modifikasi
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LyricForm;