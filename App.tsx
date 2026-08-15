import React, { useState, useEffect } from 'react';
import { LyricResult, GenerationStatus } from './types';
import { generateLyrics } from './services/geminiService';
import LyricForm from './components/LyricForm';
import ResultCard from './components/ResultCard';
import { Music2, Sparkles, AlertCircle } from 'lucide-react';

function App() {
  // State for storing generation history
  const [results, setResults] = useState<LyricResult[]>(() => {
    // Persist to local storage
    const saved = localStorage.getItem('lyric_results');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('lyric_results', JSON.stringify(results));
  }, [results]);

  const handleGenerate = async (original: string, style: string) => {
    setStatus(GenerationStatus.LOADING);
    setErrorMsg(null);

    try {
      const response = await generateLyrics(original, style);
      
      const newResult: LyricResult = {
        id: crypto.randomUUID(),
        style: style,
        original: original,
        modified: response.modifiedLyrics,
        english: response.englishLyrics,
        javanese: response.javaneseLyrics,
        title: response.title,
        createdAt: Date.now(),
      };

      // Add new result to the TOP of the list
      setResults(prev => [newResult, ...prev]);
      setStatus(GenerationStatus.SUCCESS);
      
      // Scroll to result slightly
      setTimeout(() => {
        const resultSection = document.getElementById('results-section');
        if (resultSection) {
          resultSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);

    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Terjadi kesalahan yang tidak diketahui.");
      setStatus(GenerationStatus.ERROR);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus hasil ini?")) {
      setResults(prev => prev.filter(r => r.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      
      {/* Header / Hero */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm/50 backdrop-blur-md bg-white/90">
        <div className="w-full max-w-[1800px] mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Music2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">LirikGaya</h1>
              <p className="text-xs text-slate-500 font-medium">AI Songwriter Assistant</p>
            </div>
          </div>
          <div className="hidden md:block">
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              Powered by Gemini 2.5
            </span>
          </div>
        </div>
      </header>

      <main className="w-full max-w-[1800px] mx-auto px-4 md:px-8 pt-10">
        
        {/* Intro Text */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-serif">
            Ubah Lirikmu Menjadi Karya Seni
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed">
            Berikan lirik kasar, pilih gaya, dan biarkan AI menyusun ulang ritme, rima, dan emosi untuk Anda.
          </p>
        </div>

        {/* Input Form */}
        <div className="max-w-4xl mx-auto">
          <LyricForm onGenerate={handleGenerate} status={status} />
        </div>

        {/* Error Message */}
        {status === GenerationStatus.ERROR && errorMsg && (
          <div className="max-w-4xl mx-auto bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-lg flex items-start gap-3 animate-pulse">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-red-800 font-semibold">Gagal Memproses</h3>
              <p className="text-red-700 text-sm">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Results Section */}
        <div id="results-section" className="space-y-12">
          {results.length > 0 && (
             <div className="flex items-center gap-4 mb-6">
                <div className="h-px bg-slate-200 flex-1"></div>
                <span className="text-slate-400 text-sm font-medium uppercase tracking-widest flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Hasil Kreasi
                </span>
                <div className="h-px bg-slate-200 flex-1"></div>
             </div>
          )}

          {results.map((result) => (
            <ResultCard 
              key={result.id} 
              result={result} 
              onDelete={handleDelete} 
            />
          ))}

          {results.length === 0 && status !== GenerationStatus.LOADING && (
            <div className="text-center py-20 text-slate-400">
              <p>Belum ada lirik yang dibuat. Mulai dengan mengisi form di atas.</p>
            </div>
          )}
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="mt-20 border-t border-slate-200 py-8 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} LirikGaya. Dibuat dengan React & Gemini AI.</p>
      </footer>
    </div>
  );
}

export default App;