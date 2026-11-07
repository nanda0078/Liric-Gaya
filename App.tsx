
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from './components/Button';
import { Toggle } from './components/Toggle';
import { InstrumentChip } from './components/InstrumentChip';
import { 
  StyleOption, 
  STYLE_LABELS, 
  LanguageOption,
  LANGUAGE_LABELS, 
  RhymeOption, 
  RHYME_LABELS, 
  TRADITIONAL_INSTRUMENTS, 
  ARABIC_INSTRUMENTS,
  MODERN_INSTRUMENTS, 
  GenerationResponse,
  RemixProfile,
  ModularPresets,
  PRESET_STYLES,
  PRESET_TEMPOS,
  PRESET_MAIN_MOODS,
  PRESET_SUPPORT_MOODS,
  PRESET_GROOVES,
  PRESET_ATMOSPHERES,
  PRESET_TEXTURES,
  getCompatibleOptions,
  MaleVocalType,
  MALE_VOCAL_LABELS,
  FemaleVocalType,
  FEMALE_VOCAL_LABELS,
  VocalFormation,
  VOCAL_FORMATION_LABELS,
  GENRE_REMIX_CATEGORIES,
  REMIX_DESCRIPTIONS,
  MultilingualType,
  MULTILINGUAL_TYPE_LABELS,
  EmotionalRapVariant,
  EMOTIONAL_RAP_LABELS,
  EMOTIONAL_RAP_DESCRIPTIONS,
  VocalGender,
  VOCAL_GENDER_LABELS
} from './types';
import { 
  generateLyricsAndPrompt, 
  analyzeAudioStyle, 
  analyzeYouTubeLink, 
  analyzeGenreRemix, 
  generateCustomRemixSuggestions,
  getActiveApiKey,
  saveApiKey
} from './services/geminiService';

export default function App() {
  // State
  const [style, setStyle] = useState<StyleOption>(StyleOption.CUSTOM);
  const [language, setLanguage] = useState<LanguageOption>(LanguageOption.AUTO);
  const [rhymeScheme, setRhymeScheme] = useState<RhymeOption>(RhymeOption.ABAB);
  const [customStyle, setCustomStyle] = useState('');
  const [originalLyrics, setOriginalLyrics] = useState('');
  const [songStructure, setSongStructure] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  
  // Audio Upload State
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [analysisKeywords, setAnalysisKeywords] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Toggles
  const [isImageryOn, setIsImageryOn] = useState(true);
  const [isRhymeCheckOn, setIsRhymeCheckOn] = useState(true);
  const [isHumanTouchOn, setIsHumanTouchOn] = useState(true);
  const [isVerseFlowOptimizerOn, setIsVerseFlowOptimizerOn] = useState(true);
  const [isRepetitiveChantOn, setIsRepetitiveChantOn] = useState(false);
  
  // Modular Preset State
  const [isModularPresetOn, setIsModularPresetOn] = useState(false);
  const [modularPresets, setModularPresets] = useState<ModularPresets>({
    style: [],
    tempo: '',
    mainMood: '',
    supportMood: '',
    groove: '',
    atmosphere: '',
    texture: ''
  });

  // Genre Remix State
  const [isGenreRemixOn, setIsGenreRemixOn] = useState(false);
  const [selectedGenreRemixes, setSelectedGenreRemixes] = useState<string[]>([]);
  const [suggestedProfiles, setSuggestedProfiles] = useState<RemixProfile[]>([]);
  const [isAnalyzingRemix, setIsAnalyzingRemix] = useState(false);
  const [customRemixRequest, setCustomRemixRequest] = useState('');
  const [isCustomRemixOn, setIsCustomRemixOn] = useState(false);

  // Multilingual State
  const [isMultilingualOn, setIsMultilingualOn] = useState(false);
  const [multilingualType, setMultilingualType] = useState<MultilingualType>(MultilingualType.NORMAL);
  const [vocalGender, setVocalGender] = useState<VocalGender | undefined>(undefined);
  const [customVocalGender, setCustomVocalGender] = useState('');
  const [primaryLanguage, setPrimaryLanguage] = useState<LanguageOption>(LanguageOption.INDONESIA);
  const [secondaryLanguages, setSecondaryLanguages] = useState<LanguageOption[]>([]);

  // Emotional Rap State
  const [isEmotionalRapOn, setIsEmotionalRapOn] = useState(false);
  const [emotionalRapVariant, setEmotionalRapVariant] = useState<EmotionalRapVariant>(EmotionalRapVariant.MID_FAST);

  // Vocal Type State
  const [isMaleVocalTypeOn, setIsMaleVocalTypeOn] = useState(false);
  const [selectedMaleVocalType, setSelectedMaleVocalType] = useState<MaleVocalType>(MaleVocalType.BARITONE);
  const [customMaleVocalType, setCustomMaleVocalType] = useState('');
  const [isFemaleVocalTypeOn, setIsFemaleVocalTypeOn] = useState(false);
  const [selectedFemaleVocalType, setSelectedFemaleVocalType] = useState<FemaleVocalType>(FemaleVocalType.MEZZO_SOPRANO);
  const [customFemaleVocalType, setCustomFemaleVocalType] = useState('');
  
  // Vocal Formation State
  const [isVocalFormationOn, setIsVocalFormationOn] = useState(false);
  const [selectedVocalFormation, setSelectedVocalFormation] = useState<VocalFormation>(VocalFormation.SOLO_MALE);

  // Vocal Layering State
  const [isHarmoniesOn, setIsHarmoniesOn] = useState(false);
  const [isAdLibsOn, setIsAdLibsOn] = useState(true);
  const [isBackingVocalsOn, setIsBackingVocalsOn] = useState(true);

  // Instrumental State
  const [isInstrumentalOn, setIsInstrumentalOn] = useState(false);
  
  // Features
  const [isCleanStudioMode, setIsCleanStudioMode] = useState(true);
  const [isAmbientCinematicOn, setIsAmbientCinematicOn] = useState(false);
  const [isInterludeOn, setIsInterludeOn] = useState(true);
  const [isSmoothVocalOn, setIsSmoothVocalOn] = useState(true);
  const [isSparseLyricsOn, setIsSparseLyricsOn] = useState(false);
  const [isKeepOriginalLyricsOn, setIsKeepOriginalLyricsOn] = useState(false);
  const [isFixedTempoOn, setIsFixedTempoOn] = useState(true);
  
  // Additional specialized modes
  const [isPureInstrumentalOn, setIsPureInstrumentalOn] = useState(false);
  const [isAlapStyleOn, setIsAlapStyleOn] = useState(false);
  const [isAtmosphericVocalsOn, setIsAtmosphericVocalsOn] = useState(false);
  
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<GenerationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // API Key State
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isApiKeySaved, setIsApiKeySaved] = useState(false);

  useEffect(() => {
    const currentKey = getActiveApiKey();
    if (currentKey && currentKey !== 'PLACEHOLDER_API_KEY') {
      setApiKey(currentKey);
    }
  }, []);

  const handleSaveApiKey = () => {
    saveApiKey(apiKey);
    setIsApiKeySaved(true);
    setError(null);
    setTimeout(() => setIsApiKeySaved(false), 2000);
  };

  const handleClearApiKey = () => {
    setApiKey('');
    saveApiKey('');
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsShortcutsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handlers
  const handleInstrumentToggle = (instr: string) => {
    setSelectedInstruments(prev => 
      prev.includes(instr) 
        ? prev.filter(i => i !== instr) 
        : [...prev, instr]
    );
  };

  const handleGenreRemixToggle = (remix: string) => {
    setSelectedGenreRemixes(prev => 
      prev.includes(remix) 
        ? prev.filter(r => r !== remix) 
        : [...prev, remix]
    );
  };

  const applyRemixProfile = (profile: RemixProfile) => {
    setSelectedGenreRemixes(profile.tags);
  };

  const handleAnalyzeRemix = async () => {
    if (!originalLyrics.trim()) {
      setError("Isi lirik original terlebih dahulu untuk menganalisa Genre Remix.");
      return;
    }
    const currentStyleStr = style === StyleOption.CUSTOM ? customStyle : STYLE_LABELS[style];
    setIsAnalyzingRemix(true);
    setIsGenreRemixOn(true); // Auto open the section
    try {
      const profiles = await analyzeGenreRemix(currentStyleStr, originalLyrics);
      setSuggestedProfiles(profiles);
      // Auto-apply the first one for better UX
      if (profiles.length > 0) {
        applyRemixProfile(profiles[0]);
      }
    } catch (err: any) {
      console.error("Failed to analyze remix:", err);
    } finally {
      setIsAnalyzingRemix(false);
    }
  };

  const handleCustomRemixSuggestion = async () => {
    if (!customRemixRequest.trim()) {
      setError("Silakan tulis visi remix Anda terlebih dahulu.");
      return;
    }
    const currentStyleStr = style === StyleOption.CUSTOM ? customStyle : STYLE_LABELS[style];
    setIsAnalyzingRemix(true);
    setIsGenreRemixOn(true);
    try {
      const profiles = await generateCustomRemixSuggestions(customRemixRequest, currentStyleStr, originalLyrics);
      setSuggestedProfiles(profiles);
      if (profiles.length > 0) {
        applyRemixProfile(profiles[0]);
      }
    } catch (err: any) {
      console.error("Failed to generate custom suggestions:", err);
    } finally {
      setIsAnalyzingRemix(false);
    }
  };

  const handleSecondaryLanguageToggle = (lang: LanguageOption) => {
    if (lang === LanguageOption.AUTO) return;
    setSecondaryLanguages(prev => 
      prev.includes(lang) 
        ? prev.filter(l => l !== lang) 
        : [...prev, lang]
    );
  };

  const handleModularSelect = (category: keyof ModularPresets, value: string) => {
    setModularPresets(prev => {
      if (category === 'style') {
        const currentStyles = prev.style;
        const newStyles = currentStyles.includes(value)
          ? currentStyles.filter(s => s !== value)
          : [...currentStyles, value];

        const newState = { ...prev, style: newStyles };
        const compatible = getCompatibleOptions(newStyles);
        
        if (compatible) {
           if (newState.tempo && !compatible.tempos.includes(newState.tempo)) newState.tempo = '';
           if (newState.groove && !compatible.grooves.includes(newState.groove)) newState.groove = '';
           if (newState.atmosphere && !compatible.atmospheres.includes(newState.atmosphere)) newState.atmosphere = '';
           if (newState.texture && !compatible.textures.includes(newState.texture)) newState.texture = '';
        }

        return newState;
      }

      return {
        ...prev,
        [category]: prev[category as Exclude<keyof ModularPresets, 'style'>] === value ? '' : value
      };
    });
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = () => reject(new Error("Gagal membaca file."));
      reader.readAsDataURL(file);
    });
  };

  const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        setError("Ukuran file terlalu besar. Maksimum 20MB.");
        return;
      }
      setAudioFile(file);
      setAudioPreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleClearAudio = () => {
    setAudioFile(null);
    if (audioPreview) URL.revokeObjectURL(audioPreview);
    setAudioPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setYoutubeUrl('');
    setAnalysisKeywords([]);
  };

  const handleAnalyzeAudio = async () => {
    if (!audioFile) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const base64Data = await fileToBase64(audioFile);
      const { analysis, lyrics, structure } = await analyzeAudioStyle({ data: base64Data, mimeType: audioFile.type });
      
      if (lyrics) setOriginalLyrics(lyrics);
      if (structure) setSongStructure(structure);
      if (analysis.keywords) setAnalysisKeywords(analysis.keywords);
      
      if (analysis.maleVocalCharacter) {
        setIsMaleVocalTypeOn(true);
        setSelectedMaleVocalType(MaleVocalType.BARITONE); // Reset type before setting custom
        setSelectedMaleVocalType(MaleVocalType.CUSTOM);
        setCustomMaleVocalType(analysis.maleVocalCharacter);
      }

      if (analysis.femaleVocalCharacter) {
        setIsFemaleVocalTypeOn(true);
        setSelectedFemaleVocalType(FemaleVocalType.MEZZO_SOPRANO); // Reset
        setSelectedFemaleVocalType(FemaleVocalType.CUSTOM);
        setCustomFemaleVocalType(analysis.femaleVocalCharacter);
      }

    } catch (err: any) {
      setError(err.message || "Gagal menganalisa audio.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyzeYouTube = async () => {
    if (!youtubeUrl.trim()) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const { analysis, lyrics, structure } = await analyzeYouTubeLink(youtubeUrl);
      
      if (lyrics) setOriginalLyrics(lyrics);
      if (structure) setSongStructure(structure);
      if (analysis.keywords) setAnalysisKeywords(analysis.keywords);

      if (analysis.maleVocalCharacter) {
        setIsMaleVocalTypeOn(true);
        setSelectedMaleVocalType(MaleVocalType.CUSTOM);
        setCustomMaleVocalType(analysis.maleVocalCharacter);
      }

      if (analysis.femaleVocalCharacter) {
        setIsFemaleVocalTypeOn(true);
        setSelectedFemaleVocalType(FemaleVocalType.CUSTOM);
        setCustomFemaleVocalType(analysis.femaleVocalCharacter);
      }

    } catch (err: any) {
      setError(err.message || "Gagal menganalisa YouTube.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerate = async () => {
    if (style === StyleOption.CUSTOM && !customStyle.trim()) {
      setError("Mohon deskripsikan gaya musik spesifik Anda.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);
    let audioData = undefined;
    try {
      if (audioFile) {
        const base64Data = await fileToBase64(audioFile);
        audioData = { data: base64Data, mimeType: audioFile.type };
      }
      const data = await generateLyricsAndPrompt(
        originalLyrics,
        style,
        language,
        isImageryOn,
        isRhymeCheckOn,
        rhymeScheme,
        isInstrumentalOn,
        selectedInstruments,
        customStyle,
        audioData,
        isPureInstrumentalOn,
        isAlapStyleOn,
        isCleanStudioMode,
        isSparseLyricsOn,
        isInterludeOn,
        isSmoothVocalOn,
        isModularPresetOn,
        modularPresets,
        songStructure,
        isMaleVocalTypeOn,
        selectedMaleVocalType,
        isFemaleVocalTypeOn,
        selectedFemaleVocalType,
        isVocalFormationOn,
        selectedVocalFormation,
        isAtmosphericVocalsOn,
        isAmbientCinematicOn,
        isKeepOriginalLyricsOn,
        selectedGenreRemixes,
        isMultilingualOn,
        primaryLanguage,
        secondaryLanguages,
        isFixedTempoOn,
        multilingualType,
        isEmotionalRapOn,
        emotionalRapVariant,
        vocalGender,
        isHarmoniesOn,
        isAdLibsOn,
        isBackingVocalsOn,
        negativePrompt,
        customMaleVocalType,
        customFemaleVocalType,
        isHumanTouchOn,
        isVerseFlowOptimizerOn,
        customVocalGender,
        isRepetitiveChantOn
      );
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat memproses permintaan.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = useCallback(() => {
    setOriginalLyrics('');
    setSongStructure('');
    setNegativePrompt('');
    setResult(null);
    setError(null);
    setSelectedInstruments([]);
    setSelectedGenreRemixes([]);
    setSuggestedProfiles([]);
    setAnalysisKeywords([]);
    setCustomRemixRequest('');
    setIsCustomRemixOn(false);
    setIsInstrumentalOn(false);
    setIsGenreRemixOn(false);
    setIsImageryOn(true);
    setIsRhymeCheckOn(true);
    setIsHumanTouchOn(true);
    setIsVerseFlowOptimizerOn(true);
    setIsRepetitiveChantOn(false);
    setCustomStyle('');
    setLanguage(LanguageOption.AUTO);
    setRhymeScheme(RhymeOption.ABAB);
    setIsPureInstrumentalOn(false);
    setIsAlapStyleOn(false);
    setIsAtmosphericVocalsOn(false);
    setIsCleanStudioMode(true);
    setIsAmbientCinematicOn(false);
    setIsSparseLyricsOn(false);
    setIsInterludeOn(true);
    setIsSmoothVocalOn(true);
    setIsModularPresetOn(false);
    setIsMaleVocalTypeOn(false);
    setSelectedMaleVocalType(MaleVocalType.BARITONE);
    setCustomMaleVocalType('');
    setIsFemaleVocalTypeOn(false);
    setSelectedFemaleVocalType(FemaleVocalType.MEZZO_SOPRANO);
    setCustomFemaleVocalType('');
    setIsVocalFormationOn(false);
    setSelectedVocalFormation(VocalFormation.SOLO_MALE);
    setIsKeepOriginalLyricsOn(false);
    setIsMultilingualOn(false);
    setMultilingualType(MultilingualType.NORMAL);
    setVocalGender(undefined);
    setCustomVocalGender('');
    setPrimaryLanguage(LanguageOption.INDONESIA);
    setSecondaryLanguages([]);
    setIsFixedTempoOn(true);
    setIsEmotionalRapOn(false);
    setEmotionalRapVariant(EmotionalRapVariant.MID_FAST);
    setIsHarmoniesOn(false);
    setIsAdLibsOn(true);
    setIsBackingVocalsOn(true);
    setModularPresets({
      style: [], tempo: '', mainMood: '', supportMood: '', groove: '', atmosphere: '', texture: ''
    });
    handleClearAudio();
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const compatibleOptions = getCompatibleOptions(modularPresets.style);

  const toggleStudioMode = (checked: boolean) => {
    setIsCleanStudioMode(checked);
    if (checked) setIsAmbientCinematicOn(false);
  };

  const toggleAmbientMode = (checked: boolean) => {
    setIsAmbientCinematicOn(checked);
    if (checked) setIsCleanStudioMode(false);
  };

  const shortcuts = [
    { name: 'Suno AI', url: 'https://suno.com/create', icon: '🎵' },
    { name: 'Musicful AI', url: 'https://www.musicful.ai/', icon: '🎵' },    
    { name: 'Chat GPT', url: 'https://chatgpt.com/', icon: '🎹' },
    { name: 'Human Retouch (tiktok Version)', url: 'https://ai.studio/apps/drive/1sdiRnDuLtQpoLc5zh8_kmIqA46FXBBYh?fullscreenApplet=true', icon: '🎹' },    
    { name: 'Style', url: 'https://aistudio.google.com/apps/drive/11K0qWFBhMVsJWINOCONVl2e66IIFZWqa?fullscreenApplet=true&showPreview=true&showAssistant=true', icon: '🗣️' },
    { name: 'Style Master 2', url: 'https://ai.studio/apps/drive/1yxH1CZyQnliCKIBqIM2uXOQkRfD73AAZ?fullscreenApplet=true', icon: '🗣️' },    
    { name: 'Lirik Master', url: 'https://ai.studio/apps/drive/1DWtfLo9eJJxzgfAFvayIX1c3gIIMZPQV?fullscreenApplet=true', icon: '✨' },
    { name: 'Lirik Keyword + Struktur Lagu', url: 'https://ai.studio/apps/b31c3bee-7f97-44f4-827e-ccb14e7b7b8f?fullscreenApplet=true', icon: '💬' },
    { name: 'Remastered', url: 'https://ai.studio/apps/e2718589-1f37-44f3-b4c6-b7b6ba2dadf7?fullscreenApplet=true', icon: '🎼' },
    { name: 'Karakter Suara', url: 'https://ai.studio/apps/drive/1fDD4o7nYq4lDJ334ooImYWAlrS4zEi0K?fullscreenApplet=true', icon: '✂️' },
    { name: 'Judul Lagu', url: 'https://ai.studio/apps/drive/1gPyjPDOBfP0qVttZcuTO1Jh0DirceVlP?fullscreenApplet=true', icon: '✂️' },  
    { name: 'TikTok Viral Hits', url: 'https://ai.studio/apps/drive/1SWE4X32ysXsRHPo3tyVxLnPgoPEymy_j?fullscreenApplet=true', icon: '✂️' },      
    { name: 'Analisa Instrument', url: 'https://ai.studio/apps/drive/1odK5rXilKi9Y8qjkqrLUUt7XLAwZW8W-?fullscreenApplet=true', icon: '✂️' },           
    { name: 'Short/WA Status', url: 'https://ai.studio/apps/drive/19cb8s1ikg2-Q8MFj4fNW2v9OyHg6_kYI?fullscreenApplet=true', icon: '✂️' },               
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-blue-600 flex items-center justify-center shadow-lg shadow-accent/20">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Modul Input Lirik AI</h1>
            <p className="text-xs text-slate-400">Ditenagai oleh Gemini 3 Flash & Pro</p>
          </div>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsShortcutsOpen(!isShortcutsOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-200 hover:bg-white/10 hover:border-white/20 transition-all text-sm font-semibold"
          >
            <svg className={`w-4 h-4 transition-transform duration-300 ${isShortcutsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
            Akses Cepat
          </button>
          
          {isShortcutsOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="p-2 space-y-1">
                <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 mb-1">
                  Alat AI & Musik
                </div>
                {shortcuts.map((shortcut) => (
                  <a 
                    key={shortcut.name}
                    href={shortcut.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsShortcutsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent/20 text-slate-300 hover:text-white transition-colors text-sm group"
                  >
                    <span className="text-lg group-hover:scale-110 transition-transform">{shortcut.icon}</span>
                    <span className="font-medium">{shortcut.name}</span>
                    <svg className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* API Key Configuration Section */}
      <div className="mb-6 bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-5 shadow-xl transition-all">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white">Google Gemini API Key</span>
                {apiKey.trim() ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Tersimpan
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    Belum Diisi
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Kunci API disimpan di browser lokal (localStorage) dan digunakan langsung untuk menjalankan fitur Gemini AI.
              </p>
            </div>
          </div>
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-accent hover:text-accentHover underline decoration-accent/40 hover:decoration-accent transition-colors shrink-0 flex items-center gap-1 font-medium"
          >
            Dapatkan API Key Gratis
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative flex-1">
            <input
              type={showApiKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveApiKey();
              }}
              placeholder="Masukkan Gemini API Key (contoh: AIzaSy...)"
              className="w-full bg-slate-950/60 border border-white/10 text-slate-200 placeholder-slate-500 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all font-mono"
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1"
              title={showApiKey ? "Sembunyikan API Key" : "Tampilkan API Key"}
            >
              {showApiKey ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveApiKey}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                isApiKeySaved 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-accent hover:bg-accentHover text-white shadow-lg shadow-accent/20'
              }`}
            >
              {isApiKeySaved ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Tersimpan!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Simpan Key
                </>
              )}
            </button>

            {apiKey && (
              <button
                onClick={handleClearApiKey}
                className="px-3 py-2.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-white/10 transition-colors text-sm"
                title="Hapus API Key"
              >
                Hapus
              </button>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm flex items-center gap-3">
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
        <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">Pilih Gaya Musik</label>
              <div className="relative">
                <select value={style} onChange={(e) => setStyle(e.target.value as StyleOption)} className="w-full appearance-none bg-slate-900/50 border border-white/10 text-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all">
                  {Object.entries(STYLE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">Pengaturan Bahasa</label>
              <div className="relative">
                <select value={language} onChange={(e) => setLanguage(e.target.value as LanguageOption)} className="w-full appearance-none bg-slate-900/50 border border-white/10 text-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all disabled:opacity-50 disabled:cursor-not-allowed" disabled={isMultilingualOn}>
                  {Object.entries(LANGUAGE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
              {isMultilingualOn && <p className="text-[10px] text-accent mt-1 italic font-medium">Bahasa diatur melalui panel Multilingual di bawah.</p>}
            </div>
          </div>
            
          {style === StyleOption.CUSTOM && (
            <div className="mb-6 animate-in fade-in slide-in-from-top-2">
              <textarea value={customStyle} onChange={(e) => setCustomStyle(e.target.value)} placeholder="Deskripsikan gaya musik spesifik Anda..." className="w-full h-48 bg-slate-900/50 border border-white/10 text-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all placeholder:text-slate-600 text-sm resize-y font-mono" />
            </div>
          )}

          <div className="mb-8 p-5 bg-accent/5 border border-accent/20 rounded-2xl">
             <label className="block text-xs font-bold text-accent mb-4 uppercase tracking-widest flex items-center gap-2">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               Ambil Lirik & Struktur (Otomatis)
             </label>
             
             <div className="space-y-4">
               <div className={`border-2 border-dashed rounded-xl p-4 transition-all duration-300 ${audioFile ? 'bg-slate-900/40 border-accent' : 'bg-slate-900/20 border-white/10'}`}>
                  <div className="relative group">
                    {!audioFile && <input type="file" ref={fileInputRef} accept="audio/*" onChange={handleAudioUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />}
                    {!audioFile ? (
                      <div className="flex flex-col items-center justify-center py-4">
                        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-3 group-hover:bg-slate-700 transition-colors">
                          <svg className="w-6 h-6 text-slate-400 group-hover:text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003 3h-10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                        </div>
                        <span className="text-sm text-slate-300 font-medium">Klik atau Seret Berkas Audio ke Sini</span>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4">
                         <div className="flex items-center gap-4 bg-slate-900/60 p-3 rounded-lg border border-white/5">
                           <div className="w-14 h-14 bg-accent/20 rounded-lg flex items-center justify-center shrink-0 border border-accent/20">
                              <svg className="w-7 h-7 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
                           </div>
                           <div className="text-left flex-1 min-w-0">
                             <p className="text-sm font-bold text-white truncate">{audioFile.name}</p>
                             <p className="text-[11px] text-slate-400 font-mono mt-1">{(audioFile.size / (1024*1024)).toFixed(1)} MB</p>
                           </div>
                           <button onClick={(e) => { e.preventDefault(); handleClearAudio(); }} className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-red-400 transition-colors shrink-0">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                           </button>
                         </div>
                         <Button 
                           variant="primary" 
                           className="w-full !py-3 !text-sm !rounded-xl !bg-accent hover:!bg-accentHover shadow-[0_0_20px_rgba(124,58,237,0.4)]" 
                           onClick={handleAnalyzeAudio} 
                           isLoading={isAnalyzing}
                           disabled={!audioFile}
                         >
                           Ambil Lirik & Struktur dari Berkas
                         </Button>
                      </div>
                    )}
                  </div>
               </div>

               <div className="flex items-center gap-4 px-2">
                 <div className="h-px bg-white/5 flex-1"></div>
                 <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">ATAU</span>
                 <div className="h-px bg-white/5 flex-1"></div>
               </div>

               <div className="flex flex-col gap-3">
                  <div className="relative">
                    <input 
                      type="text" 
                      value={youtubeUrl} 
                      onChange={(e) => setYoutubeUrl(e.target.value)} 
                      placeholder="Tempel tautan YouTube (Lagu/Video)..." 
                      className="w-full bg-slate-900 border border-white/10 text-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all placeholder:text-slate-600"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.826L10.242 9.242m-4.242 4.242l1.393 1.393" /></svg>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    className={`w-full !py-2 !text-xs !rounded-lg border-accent/20 text-accent hover:bg-accent/5 ${!youtubeUrl.trim() && 'opacity-50 grayscale pointer-events-none'}`} 
                    onClick={handleAnalyzeYouTube} 
                    isLoading={isAnalyzing}
                    disabled={!youtubeUrl.trim()}
                  >
                    Cari & Ambil Lirik via YouTube (Gemini Pro)
                  </Button>
               </div>
             </div>
          </div>

          <div className="mb-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Struktur Lagu</label>
              <input 
                value={songStructure} 
                onChange={(e) => setSongStructure(e.target.value)} 
                placeholder="Contoh: Bait 1 -> Chorus -> Bait 2 -> Chorus -> Outro" 
                className="w-full bg-slate-900/50 border border-white/10 text-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-sm font-medium italic" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Hal yang Dihindari (Negative Prompt)</label>
              <input 
                value={negativePrompt} 
                onChange={(e) => setNegativePrompt(e.target.value)} 
                placeholder="Contoh: Tanpa drum, tanpa gitar elektrik, tanpa distorsi, tanpa autotune..." 
                className="w-full bg-slate-900/50 border border-white/10 text-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all text-sm font-medium" 
              />
              <p className="text-[10px] text-slate-500 mt-1 italic px-1">Gunakan fitur ini untuk memberitahu AI elemen musik apa yang benar-benar tidak boleh ada.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Lirik Asli</label>
              <div className="relative rounded-2xl overflow-hidden transition-all duration-300">
                <textarea 
                  value={originalLyrics} 
                  onChange={(e) => setOriginalLyrics(e.target.value)} 
                  placeholder="Tuliskan lirik di sini atau gunakan fitur 'Ambil Lirik' di atas..." 
                  className="w-full h-80 bg-slate-900/50 border border-white/10 text-slate-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all resize-none leading-relaxed font-serif text-lg custom-scrollbar shadow-inner" 
                />
              </div>
            </div>
          </div>

          <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-blue-500/30 to-transparent my-8"></div>

          <div className="mb-6 bg-slate-900/30 rounded-xl p-4 border border-blue-500/20 border-l-4 border-l-blue-500 relative">
            <div className="flex items-center justify-between mb-2">
              <div className="flex flex-col">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-white">Genre Remix</span>
                  <button 
                    onClick={handleAnalyzeRemix}
                    disabled={isAnalyzingRemix || !originalLyrics.trim()}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${isAnalyzingRemix ? 'bg-accent/40 text-white animate-pulse' : 'bg-accent/20 text-accent hover:bg-accent/30 border border-accent/20 shadow-lg shadow-accent/5'}`}
                  >
                    {isAnalyzingRemix ? (
                      <>
                        <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Menganalisa...
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                        Analisa (AI)
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-1">Sesuaikan suasana dan rasa berdasarkan genre lagu Anda.</p>
              </div>
              <Toggle checked={isGenreRemixOn} onChange={setIsGenreRemixOn} />
            </div>
            
            <div className={`transition-all duration-300 ease-in-out overflow-visible ${isGenreRemixOn ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
              <div className="space-y-6 pt-4 border-t border-white/5">
                
                <div className={`p-4 rounded-2xl border transition-all duration-300 mb-6 ${isCustomRemixOn ? 'bg-indigo-500/10 border-indigo-500/40 shadow-lg shadow-indigo-500/5' : 'bg-indigo-500/5 border-indigo-500/20'}`}>
                  <div className="flex items-center justify-between">
                    <label className="block text-[10px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      Permintaan Remix Kustom (Visi Manual)
                    </label>
                    <Toggle checked={isCustomRemixOn} onChange={setIsCustomRemixOn} />
                  </div>
                  
                  <div className={`transition-all duration-300 overflow-hidden ${isCustomRemixOn ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                    <div className="flex flex-col md:flex-row gap-3">
                      <input 
                        type="text" 
                        value={customRemixRequest}
                        onChange={(e) => setCustomRemixRequest(e.target.value)}
                        placeholder="Contoh: Buat versi lofi sedih tapi pakai beat jedag jedug..." 
                        className="flex-1 bg-slate-900/60 border border-white/10 text-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600"
                      />
                      <Button 
                        onClick={handleCustomRemixSuggestion}
                        isLoading={isAnalyzingRemix}
                        className="!bg-indigo-600 hover:!bg-indigo-700 !py-2 !px-4 !text-xs !rounded-xl shadow-lg shadow-indigo-600/20"
                      >
                        Dapatkan Saran AI
                      </Button>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2 italic">Tuliskan konsep remix spesifik yang Anda bayangkan, AI akan mencarikan kombinasi tag dan memberikan alasan artistiknya.</p>
                  </div>
                </div>

                {suggestedProfiles.length > 0 && (
                  <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                    <h4 className="text-xs font-bold text-accent mb-4 uppercase tracking-widest flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 01-.586 1.414l-2.386 2.386a2 2 0 01-1.414.586H11a2 2 0 01-1.414-.586l-2.386-2.386a2 2 0 01-.586-1.414V5l-1-1z" /></svg>
                      Rekomendasi Paket Remix (Pilih Satu)
                    </h4>
                    <div className="flex flex-col gap-3 mb-8">
                      {suggestedProfiles.map((profile, idx) => {
                        const isSelected = profile.tags.every(t => selectedGenreRemixes.includes(t)) && profile.tags.length === selectedGenreRemixes.length;
                        return (
                          <div 
                            key={idx}
                            onClick={() => applyRemixProfile(profile)}
                            className={`group relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${isSelected ? 'bg-accent/20 border-accent shadow-[0_0_30px_rgba(124,58,237,0.15)] ring-1 ring-accent/30' : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'}`}
                          >
                            <div className="flex flex-col md:flex-row md:items-start gap-4">
                              <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center font-bold text-sm border ${isSelected ? 'bg-accent border-accent text-white' : 'bg-white/10 border-white/5 text-slate-500'}`}>
                                {idx + 1}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1.5">
                                  <h5 className="text-base font-bold text-white group-hover:text-accent transition-colors">{profile.name}</h5>
                                  {isSelected && <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>}
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed mb-2">{profile.description}</p>
                                
                                {profile.reason && (
                                  <div className="bg-white/5 p-3 rounded-xl border border-white/5 mb-4">
                                     <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Alasan dari AI:</p>
                                     <p className="text-[11px] text-slate-400 italic leading-snug">{profile.reason}</p>
                                  </div>
                                )}

                                <div className="flex flex-wrap gap-1.5">
                                  {profile.tags.map(tag => (
                                    <span key={tag} className={`text-[10px] px-2 py-0.5 rounded-md font-medium border ${isSelected ? 'bg-accent/30 border-accent/20 text-white' : 'bg-white/5 border-white/10 text-slate-400'}`}>
                                      #{tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {GENRE_REMIX_CATEGORIES.map(category => (
                  <div key={category.name}>
                    <h4 className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">{category.name}</h4>
                    <div className="flex flex-wrap gap-2 overflow-visible">
                      {category.options.map(opt => (
                        <InstrumentChip 
                          key={opt} 
                          label={opt} 
                          selected={selectedGenreRemixes.includes(opt)} 
                          onClick={() => handleGenreRemixToggle(opt)}
                          description={REMIX_DESCRIPTIONS[opt]}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-6 bg-slate-900/30 rounded-xl p-4 border border-white/5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white">Gunakan Lirik Asli (Tanpa Modifikasi)</span>
                <p className="text-xs text-slate-500">Menggunakan lirik input secara utuh tanpa perubahan dari AI.</p>
              </div>
              <Toggle checked={isKeepOriginalLyricsOn} onChange={setIsKeepOriginalLyricsOn} />
            </div>
          </div>

          <div className="mb-6 bg-slate-900/30 rounded-xl p-4 border border-white/5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white">Lirik Minimalis (Sparse Lyrics)</span>
                <p className="text-xs text-slate-500">Mode lirik berdensitas rendah dengan frasa pendek, pengulangan selektif, and ruang instrumen dominan.</p>
              </div>
              <Toggle checked={isSparseLyricsOn} onChange={setIsSparseLyricsOn} />
            </div>
          </div>

          <div className={`mb-6 bg-slate-900/30 rounded-xl p-4 border-2 transition-all duration-300 relative overflow-visible ${isMultilingualOn ? 'border-blue-500/60 shadow-[0_0_20px_rgba(59,130,246,0.2)]' : 'border-white/5'}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">Mode Lirik Multilingual / Bilingual</span>
                  <span className="px-1.5 py-0.5 bg-accent/20 text-accent text-[9px] font-bold rounded uppercase tracking-tighter">Baru</span>
                </div>
                <p className="text-xs text-slate-500">Gabungkan beberapa bahasa secara alami dalam satu lagu.</p>
              </div>
              <Toggle checked={isMultilingualOn} onChange={setIsMultilingualOn} />
            </div>
            
            <div className={`transition-all duration-300 ease-in-out overflow-visible ${isMultilingualOn ? 'max-h-[1800px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
              <div className="space-y-8 pt-6 border-t border-white/5">
                
                {/* 1. SEKSI BAHASA (WHAT) */}
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <h4 className="text-xs font-bold text-accent mb-4 uppercase tracking-widest flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5a18.022 18.022 0 01-3.827-5.802M10.403 6.052a18.01 18.01 0 014.715 5.248M7.75 18.5a18.053 18.053 0 01-3.673-5.5m1.396-3a18.013 18.013 0 015.927 2.181" /></svg>
                    1. Pengaturan Bahasa (Target)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">Bahasa Utama</label>
                      <div className="relative">
                        <select value={primaryLanguage} onChange={(e) => setPrimaryLanguage(e.target.value as LanguageOption)} className="w-full appearance-none bg-slate-900 border border-white/10 text-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all">
                          {Object.entries(LANGUAGE_LABELS).filter(([v]) => v !== LanguageOption.AUTO).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">Bahasa Campuran (Tambahan)</label>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(LANGUAGE_LABELS)
                          .filter(([v]) => v !== LanguageOption.AUTO)
                          .map(([value, label]) => (
                            <InstrumentChip 
                              key={value} 
                              label={label} 
                              selected={secondaryLanguages.includes(value as LanguageOption)} 
                              onClick={() => handleSecondaryLanguageToggle(value as LanguageOption)} 
                            />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. SEKSI GAYA (HOW) */}
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <h4 className="text-xs font-bold text-accent mb-4 uppercase tracking-widest flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                    2. Tipe Penyampaian & Alur Lirik
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Object.entries(MULTILINGUAL_TYPE_LABELS).map(([value, label]) => (
                      <div 
                        key={value}
                        onClick={() => setMultilingualType(value as MultilingualType)}
                        className={`p-3 rounded-xl border transition-all duration-300 cursor-pointer flex items-center gap-3 ${multilingualType === value ? 'bg-accent/20 border-accent shadow-lg' : 'bg-slate-900/50 border-white/5 hover:border-white/20'}`}
                      >
                        <div className={`w-3 h-3 rounded-full shrink-0 ${multilingualType === value ? 'bg-accent shadow-[0_0_10px_rgba(124,58,237,1)]' : 'bg-slate-700'}`}></div>
                        <span className={`text-[11px] font-bold uppercase tracking-tight ${multilingualType === value ? 'text-white' : 'text-slate-400'}`}>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. SEKSI KARAKTER (WHO) */}
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <h4 className="text-xs font-bold text-accent mb-4 uppercase tracking-widest flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    3. Karakter & Intensitas Vokal
                  </h4>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-3 uppercase tracking-widest">Jenis Vokal Dasar</label>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(VOCAL_GENDER_LABELS).map(([value, label]) => (
                          <InstrumentChip 
                            key={value} 
                            label={label} 
                            selected={vocalGender === value} 
                            onClick={() => setVocalGender(vocalGender === value ? undefined : (value as VocalGender))} 
                          />
                        ))}
                      </div>
                      {vocalGender === VocalGender.CUSTOM && (
                        <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                          <textarea 
                            value={customVocalGender} 
                            onChange={(e) => setCustomVocalGender(e.target.value)} 
                            placeholder="Deskripsikan karakter suara khusus (misal: Serak basah, vokal anak-anak, dll)..." 
                            className="w-full h-20 bg-slate-900/50 border border-white/10 text-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50 text-xs resize-none" 
                          />
                        </div>
                      )}
                    </div>

                    <div className="p-4 bg-slate-900/50 rounded-xl border border-blue-500/20">
                      <div className="flex items-center justify-between mb-3">
                         <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-200">Tambahkan Bait Rap Emosional (Versi Pendek)</span>
                            <p className="text-[10px] text-slate-500 italic">Disisipkan pada Bait 2 (BPM 72).</p>
                         </div>
                         <Toggle checked={isEmotionalRapOn} onChange={setIsEmotionalRapOn} />
                      </div>
                      <div className={`transition-all duration-300 overflow-visible ${isEmotionalRapOn ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                         <div className="flex flex-wrap gap-2">
                            {Object.entries(EMOTIONAL_RAP_LABELS).map(([value, label]) => (
                              <InstrumentChip 
                                key={value} 
                                label={label} 
                                selected={emotionalRapVariant === value} 
                                onClick={() => setEmotionalRapVariant(value as EmotionalRapVariant)}
                                description={EMOTIONAL_RAP_DESCRIPTIONS[value as EmotionalRapVariant]}
                              />
                            ))}
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className={`bg-slate-900/30 rounded-xl p-4 border border-white/5 border-l-4 border-l-emerald-500 transition-all duration-300`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">Mode Human Touch</span>
                    <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[9px] font-bold rounded uppercase tracking-tighter">Premium</span>
                  </div>
                  <p className="text-xs text-slate-500 italic">Tulis lirik dengan detail personal yang jujur, intim, & bebas klise.</p>
                </div>
                <Toggle checked={isHumanTouchOn} onChange={setIsHumanTouchOn} />
              </div>
            </div>

            <div className={`bg-slate-900/30 rounded-xl p-4 border border-white/5 border-l-4 border-l-indigo-500 transition-all duration-300`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">Pengoptimal Alur Bait (Verse Flow Optimizer)</span>
                    <span className="px-1.5 py-0.5 bg-indigo-500/20 text-indigo-400 text-[9px] font-bold rounded uppercase tracking-tighter">Baru</span>
                  </div>
                  <p className="text-xs text-slate-500 italic">Sederhanakan bait agar lebih mengalir & mudah dinyanyikan.</p>
                </div>
                <Toggle checked={isVerseFlowOptimizerOn} onChange={setIsVerseFlowOptimizerOn} />
              </div>
            </div>

            <div className={`bg-slate-900/30 rounded-xl p-4 border border-white/5 border-l-4 border-l-amber-500 transition-all duration-300`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">Lirik Repetitif / Chant</span>
                    <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-400 text-[9px] font-bold rounded uppercase tracking-tighter">Catchy</span>
                  </div>
                  <p className="text-xs text-slate-500 italic">Tambahkan frase repetitif yang catchy atau chant ritmik untuk efek "earworm".</p>
                </div>
                <Toggle checked={isRepetitiveChantOn} onChange={setIsRepetitiveChantOn} />
              </div>
            </div>

            <div className={`bg-slate-900/30 rounded-xl p-4 border transition-all duration-300 ${isRhymeCheckOn ? 'border-blue-500/50 ring-2 ring-blue-500/20' : 'border-white/5'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white">Penyesuaian Rima & Ritme</span>
                  <p className="text-xs text-slate-500">Atur pola sajak dengan beberapa pilihan skema rima.</p>
                </div>
                <Toggle checked={isRhymeCheckOn} onChange={setIsRhymeCheckOn} />
              </div>
              <div className={`overflow-visible transition-all duration-300 ${isRhymeCheckOn ? 'max-h-[500px] mt-4 pt-4 border-t border-white/5' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(RHYME_LABELS).map(([value, label]) => (
                    <InstrumentChip 
                      key={value} 
                      label={label} 
                      selected={rhymeScheme === value} 
                      onClick={() => setRhymeScheme(value as RhymeOption)} 
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-slate-900/30 rounded-xl p-4 border border-white/5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-white">Perkaya Pencitraan (Imagery)</span>
                <Toggle checked={isImageryOn} onChange={setIsImageryOn} />
              </div>
            </div>

            <div className="bg-slate-900/30 rounded-xl p-4 border border-white/5 border-l-4 border-l-blue-400">
              <h4 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest">LAPISAN VOKAL & TEKSTUR</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white">Harmoni (Vokal Berlapis)</span>
                    <p className="text-[10px] text-slate-500">Tambahkan harmoni 3 bagian atau lapisan vokal yang tebal.</p>
                  </div>
                  <Toggle checked={isHarmoniesOn} onChange={setIsHarmoniesOn} />
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white">Ad-libs & Flourishes</span>
                    <p className="text-[10px] text-slate-500">Sisipkan ad-libs ekspresif di bagian Chorus/Outro.</p>
                  </div>
                  <Toggle checked={isAdLibsOn} onChange={setIsAdLibsOn} />
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white">Vokal Latar (Background Vocals)</span>
                    <p className="text-[10px] text-slate-500">Lapisan vokal latar untuk penguat melodi utama.</p>
                  </div>
                  <Toggle checked={isBackingVocalsOn} onChange={setIsBackingVocalsOn} />
                </div>
              </div>
            </div>

            <div className={`bg-slate-900/30 rounded-xl p-4 border-2 transition-all duration-300 ${isCleanStudioMode ? 'border-white ring-4 ring-white/10 shadow-[0_0_25px_rgba(255,255,255,0.1)] scale-[1.01]' : 'border-white/5'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white">Mode Studio (Kering / Bersih)</span>
                  <p className="text-xs text-slate-500">Mode Karakter Studio: Mixing kering & bersih, vokal jernih, reverb minimal, suara studio mentah yang profesional.</p>
                </div>
                <Toggle checked={isCleanStudioMode} onChange={toggleStudioMode} />
              </div>
            </div>

            <div className={`bg-slate-900/30 rounded-xl p-4 border-2 transition-all duration-300 ${isFixedTempoOn ? 'border-white ring-4 ring-white/10 shadow-[0_0_25px_rgba(255,255,255,0.1)] scale-[1.01]' : 'border-white/5'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white">Tempo Tetap (Tempo Stabil)</span>
                  <p className="text-xs text-slate-500">Tanpa fluktuasi, perpindahan ketukan, atau ilusi tempo. Ritme stabil di seluruh bagian.</p>
                </div>
                <Toggle checked={isFixedTempoOn} onChange={setIsFixedTempoOn} />
              </div>
            </div>

            <div className="bg-slate-900/30 rounded-xl p-4 border border-white/5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-white">Interlude & Jeda Instrumental</span>
                <Toggle checked={isInterludeOn} onChange={setIsInterludeOn} />
              </div>
            </div>

            <div className="bg-slate-900/30 rounded-xl p-4 border border-white/5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white">Penyampaian Vokal Halus & Stabil</span>
                  <p className="text-xs text-slate-500">Penyampaian halus, tinggi nada stabil, and transisi lancar.</p>
                </div>
                <Toggle checked={isSmoothVocalOn} onChange={setIsSmoothVocalOn} />
              </div>
            </div>

            <div className="bg-slate-900/30 rounded-xl p-4 border border-white/5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white">Formasi Vokal (Solo/Duet)</span>
                  <p className="text-xs text-slate-500">Pilih susunan penyanyi solo atau kolaborasi.</p>
                </div>
                <Toggle checked={isVocalFormationOn} onChange={setIsVocalFormationOn} />
              </div>
              <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isVocalFormationOn ? 'max-h-[300px] mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="pt-3 border-t border-white/5 flex flex-wrap gap-2">
                  {Object.entries(VOCAL_FORMATION_LABELS).map(([value, label]) => (
                    <InstrumentChip key={value} label={label} selected={selectedVocalFormation === value} onClick={() => setSelectedVocalFormation(value as VocalFormation)} />
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-slate-900/30 rounded-xl p-4 border border-white/5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white">Tipe Suara Pria</span>
                  <p className="text-xs text-slate-500">Atur jangkauan dan karakter vokal pria.</p>
                </div>
                <Toggle checked={isMaleVocalTypeOn} onChange={setIsMaleVocalTypeOn} />
              </div>
              <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isMaleVocalTypeOn ? 'max-h-[500px] mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="pt-3 border-t border-white/5 flex flex-wrap gap-2">
                  {Object.entries(MALE_VOCAL_LABELS).map(([value, label]) => (
                    <InstrumentChip key={value} label={label} selected={selectedMaleVocalType === value} onClick={() => setSelectedMaleVocalType(value as MaleVocalType)} />
                  ))}
                </div>
                {selectedMaleVocalType === MaleVocalType.CUSTOM && (
                  <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                    <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest">Deskripsikan Karakter Vokal Pria</label>
                    <textarea 
                      value={customMaleVocalType} 
                      onChange={(e) => setCustomMaleVocalType(e.target.value)} 
                      placeholder="Contoh: Suara pria dewasa, serak, berat, penuh wibawa, atau gaya penyanyi tertentu..." 
                      className="w-full h-24 bg-slate-900/50 border border-white/10 text-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all placeholder:text-slate-600 text-sm resize-none" 
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="bg-slate-900/30 rounded-xl p-4 border border-white/5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white">Tipe Suara Wanita</span>
                  <p className="text-xs text-slate-500">Atur jangkauan dan karakter vokal wanita.</p>
                </div>
                <Toggle checked={isFemaleVocalTypeOn} onChange={setIsFemaleVocalTypeOn} />
              </div>
              <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isFemaleVocalTypeOn ? 'max-h-[500px] mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="pt-3 border-t border-white/5 flex flex-wrap gap-2">
                  {Object.entries(FEMALE_VOCAL_LABELS).map(([value, label]) => (
                    <InstrumentChip key={value} label={label} selected={selectedFemaleVocalType === value} onClick={() => setSelectedFemaleVocalType(value as FemaleVocalType)} />
                  ))}
                </div>
                {selectedFemaleVocalType === FemaleVocalType.CUSTOM && (
                  <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                    <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest">Deskripsikan Karakter Vokal Wanita</label>
                    <textarea 
                      value={customFemaleVocalType} 
                      onChange={(e) => setCustomFemaleVocalType(e.target.value)} 
                      placeholder="Contoh: Suara wanita lembut, serak basah, tinggi melengking (soprano dramatis), atau gaya penyanyi tertentu..." 
                      className="w-full h-24 bg-slate-900/50 border border-white/10 text-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all placeholder:text-slate-600 text-sm resize-none" 
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="bg-slate-900/30 rounded-xl p-4 border border-white/5 border-l-4 border-l-accent">
              <div className="flex items-center justify-between mb-2">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white">Vokal Sebagai Tekstur Atmosferik</span>
                  <p className="text-xs text-slate-500">Vokal hanya berupa gumaman/humming (Atmosferik).</p>
                </div>
                <Toggle checked={isAtmosphericVocalsOn} onChange={setIsAtmosphericVocalsOn} />
              </div>
            </div>

            <div className="bg-slate-900/30 rounded-xl p-4 border border-white/5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white">Mode Ambient / Cinematic</span>
                  <p className="text-xs text-slate-500">Suasana aktif, reverb dengan ekor panjang, sinkronisasi delay, kedalaman luas.</p>
                </div>
                <Toggle checked={isAmbientCinematicOn} onChange={toggleAmbientMode} />
              </div>
            </div>

            <div className="bg-slate-900/30 rounded-xl p-4 border border-white/5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-white">Instrumental Murni</span>
                <Toggle checked={isPureInstrumentalOn} onChange={setIsPureInstrumentalOn} />
              </div>
            </div>

            <div className="bg-slate-900/30 rounded-xl p-4 border border-white/5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-white">Preset Modular</span>
                <Toggle checked={isModularPresetOn} onChange={setIsModularPresetOn} />
              </div>
              <p className="text-xs text-slate-500 mb-4">Rakit gaya musik Anda sendiri dengan menggabungkan modul.</p>
              <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isModularPresetOn ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="space-y-4 pt-2 border-t border-white/5">
                  <div>
                    <h4 className="text-xs text-slate-400 mb-2 font-medium">Gaya / Genre</h4>
                    <div className="flex flex-wrap gap-2">{PRESET_STYLES.map(opt => <InstrumentChip key={opt} label={opt} selected={modularPresets.style.includes(opt)} onClick={() => handleModularSelect('style', opt)} />)}</div>
                  </div>
                  <div>
                    <h4 className="text-xs text-slate-400 mb-2 font-medium">Tempo {compatibleOptions && <span className="text-accent ml-1">(Terfilter)</span>}</h4>
                    <div className="flex flex-wrap gap-2">{(compatibleOptions ? compatibleOptions.tempos : PRESET_TEMPOS).map(opt => <InstrumentChip key={opt} label={opt} selected={modularPresets.tempo === opt} onClick={() => handleModularSelect('tempo', opt)} />)}</div>
                  </div>
                  <div>
                    <h4 className="text-xs text-slate-400 mb-2 font-medium">Suasana Utama</h4>
                    <div className="flex flex-wrap gap-2">{PRESET_MAIN_MOODS.map(opt => <InstrumentChip key={opt} label={opt} selected={modularPresets.mainMood === opt} onClick={() => handleModularSelect('mainMood', opt)} />)}</div>
                  </div>
                  <div>
                    <h4 className="text-xs text-slate-400 mb-2 font-medium">Suasana Pendukung</h4>
                    <div className="flex flex-wrap gap-2">{PRESET_SUPPORT_MOODS.map(opt => <InstrumentChip key={opt} label={opt} selected={modularPresets.supportMood === opt} onClick={() => handleModularSelect('supportMood', opt)} />)}</div>
                  </div>
                  <div>
                    <h4 className="text-xs text-slate-400 mb-2 font-medium">Ketukan / Ritme</h4>
                    <div className="flex flex-wrap gap-2">{(compatibleOptions ? compatibleOptions.grooves : PRESET_GROOVES).map(opt => <InstrumentChip key={opt} label={opt} selected={modularPresets.groove === opt} onClick={() => handleModularSelect('groove', opt)} />)}</div>
                  </div>
                  <div>
                    <h4 className="text-xs text-slate-400 mb-2 font-medium">Atmosfer</h4>
                    <div className="flex flex-wrap gap-2">{(compatibleOptions ? compatibleOptions.atmospheres : PRESET_ATMOSPHERES).map(opt => <InstrumentChip key={opt} label={opt} selected={modularPresets.atmosphere === opt} onClick={() => handleModularSelect('atmosphere', opt)} />)}</div>
                  </div>
                  <div>
                    <h4 className="text-xs text-slate-400 mb-2 font-medium">Tekstur</h4>
                    <div className="flex flex-wrap gap-2">{(compatibleOptions ? compatibleOptions.textures : PRESET_TEXTURES).map(opt => <InstrumentChip key={opt} label={opt} selected={modularPresets.texture === opt} onClick={() => handleModularSelect('texture', opt)} />)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-slate-900/30 rounded-xl p-4 border border-white/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-white">Perkaya Instrumental</span>
              <Toggle checked={isInstrumentalOn} onChange={setIsInstrumentalOn} />
            </div>
            <div className={`grid transition-all duration-300 ${isInstrumentalOn ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'}`}>
              <div className="overflow-hidden space-y-4">
                <div className="flex flex-wrap gap-2">{[...TRADITIONAL_INSTRUMENTS, ...ARABIC_INSTRUMENTS, ...MODERN_INSTRUMENTS].map(instr => <InstrumentChip key={instr} label={instr} selected={selectedInstruments.includes(instr)} onClick={() => handleInstrumentToggle(instr)} />)}</div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 mt-8">
            <Button onClick={handleGenerate} isLoading={isLoading}>Buat Modifikasi</Button>
            <Button variant="ghost" onClick={handleClear} disabled={isLoading}>Bersihkan</Button>
          </div>

          {result && (
            <div className="mt-10 space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-card rounded-2xl p-6 border-2 border-accent/40 shadow-xl">
                <div className="mb-8 pb-6 border-b border-white/5">
                   <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Judul Lagu</h3>
                      <button onClick={() => handleCopy(result.songTitle)} className="text-[11px] text-slate-400 hover:text-white transition-colors bg-white/5 px-2 py-1 rounded border border-white/5">Salin</button>
                   </div>
                   <div className="text-3xl font-bold text-white">{result.songTitle}</div>
                </div>
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Lirik</h3>
                    <button onClick={() => handleCopy(result.modifiedLyrics)} className="text-[11px] text-slate-400 hover:text-white transition-colors bg-white/5 px-2 py-1 rounded border border-white/5">Salin</button>
                  </div>
                  <div className="whitespace-pre-wrap font-serif text-slate-300 text-lg italic leading-relaxed">{result.modifiedLyrics}</div>
                </div>

                <div className="pt-8 border-t border-white/5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Prompt Musik Detail</h3>
                    <button onClick={() => handleCopy(result.musicPrompt)} className="text-[11px] text-slate-400 hover:text-white transition-colors bg-white/5 px-2 py-1 rounded border border-white/5">Salin</button>
                  </div>
                  <div className="p-5 bg-blue-500/5 rounded-2xl border-2 border-blue-500/30 font-mono text-sm leading-relaxed">{result.musicPrompt}</div>
                </div>

                <div className="mb-8 pt-8 border-t border-white/5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold text-violet-400 uppercase tracking-widest">Versi Optimal</h3>
                      <span className="px-1.5 py-0.5 bg-violet-500/20 text-violet-400 text-[9px] font-bold rounded uppercase tracking-tighter">Premium Pitch</span>
                    </div>
                    <button onClick={() => handleCopy(result.optimizedPrompt)} className="text-[11px] text-slate-400 hover:text-white transition-colors bg-white/5 px-2 py-1 rounded border border-white/5">Salin</button>
                  </div>
                  <div className="p-6 bg-violet-500/5 rounded-2xl border-2 border-violet-500/30 text-slate-200 text-base leading-relaxed font-sans shadow-lg shadow-violet-500/5">
                    {result.optimizedPrompt}
                  </div>
                </div>
                
                <div className="pt-8 mt-6 border-t border-white/5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Ringkasan Prompt (Maks. 1000 Karakter)</h3>
                    <button onClick={() => handleCopy(result.musicPromptSummary)} className="text-[11px] text-slate-400 hover:text-white transition-colors bg-white/5 px-2 py-1 rounded border border-white/5">Salin</button>
                  </div>
                  <div className="p-5 bg-emerald-500/5 rounded-2xl border-2 border-emerald-500/30 font-mono text-sm leading-relaxed text-emerald-200 whitespace-pre-wrap">
                    {result.musicPromptSummary}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-6">
          {analysisKeywords.length > 0 && (
            <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900/60 backdrop-blur-md border border-indigo-500/20 rounded-2xl p-6 animate-in slide-in-from-right duration-500">
               <div className="flex items-center justify-between mb-4">
                 <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                   10 Kata Kunci Lirik
                 </h3>
                 <button 
                   onClick={() => handleCopy(analysisKeywords.join(', '))} 
                   className="text-[10px] font-bold text-slate-400 hover:text-white transition-colors bg-white/5 px-2 py-1 rounded border border-white/10 uppercase tracking-tighter"
                 >
                   Salin Semua
                 </button>
               </div>
               <div className="flex flex-wrap gap-2">
                 {analysisKeywords.map((kw, idx) => (
                   <div 
                     key={idx} 
                     className="px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-200 text-xs font-medium hover:bg-indigo-500/20 transition-all cursor-default shadow-sm shadow-indigo-500/5"
                   >
                     {kw}
                   </div>
                 ))}
               </div>
               <p className="text-[10px] text-slate-500 italic mt-4">Kata kunci ini diekstrak secara otomatis untuk merangkum esensi lirik lagu.</p>
            </div>
          )}

          <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Petunjuk
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">Gunakan fitur <b>Ambil Lirik & Struktur</b> untuk secara otomatis mentranskripsi lirik and mendeteksi struktur lagu dari berkas audio atau YouTube.</p>
            <p className="text-xs text-slate-400 mt-3 leading-relaxed">Fitur <b>Versi Optimal</b> memberikan deskripsi naratif sinematik yang menggabungkan semua spesifikasi teknis ke dalam satu pitch berkualitas tinggi.</p>
            <p className="text-xs text-slate-400 mt-3 leading-relaxed">Fitur <b>Mode Human Touch</b> memfokuskan lirik pada detail personal yang intim and menghindari metafora klise.</p>
            <p className="text-xs text-slate-400 mt-3 leading-relaxed">Fitur <b>Flow Optimizer</b> menyederhanakan bait agar lebih mengalir & mudah dinyanyikan dengan ritme yang alami.</p>
            <p className="text-xs text-slate-400 mt-3 leading-relaxed">Fitur <b>Vocal Layering</b> mengontrol kedalaman vokal melalui harmoni, ad-libs, and vokal latar.</p>
            <p className="text-xs text-slate-400 mt-3 leading-relaxed">Fitur <b>Mode Studio</b> menghasilkan vokal jernih dengan suara studio mentah yang profesional.</p>
            <p className="text-xs text-slate-400 mt-3 leading-relaxed">Fitur <b>Fixed Tempo</b> memastikan lagu memiliki ketukan yang solid tanpa perubahan tempo yang tidak diinginkan.</p>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-md border border-white/5 rounded-2xl p-6">
             <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Fitur Terbaru</h3>
             <div className="space-y-4">
                <div className="flex gap-3">
                   <div className="w-8 h-8 rounded-lg bg-emerald-600/20 flex items-center justify-center shrink-0 border border-emerald-600/30">
                      <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                   </div>
                   <div>
                      <p className="text-xs font-bold text-white">Human Touch</p>
                      <p className="text-[10px] text-slate-400 mt-1">Lirik emosional & jujur dengan detail personal yang mendalam.</p>
                   </div>
                </div>
                <div className="flex gap-3">
                   <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center shrink-0 border border-indigo-600/30">
                      <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                   </div>
                   <div>
                      <p className="text-xs font-bold text-white">Flow Optimizer</p>
                      <p className="text-[10px] text-slate-400 mt-1">Aransemen lirik yang lebih mengalir & ritmik.</p>
                   </div>
                </div>
                <div className="flex gap-3">
                   <div className="w-8 h-8 rounded-lg bg-amber-600/20 flex items-center justify-center shrink-0 border border-amber-600/30">
                      <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0l-4-4a4 4 0 015.656-5.656l1.102-1.101m-.758-4.826L10.242 9.242m-4.242 4.242l1.393 1.393" /></svg>
                   </div>
                   <div>
                      <p className="text-xs font-bold text-white">Repetitive Chant</p>
                      <p className="text-[10px] text-slate-400 mt-1">Frase repetitif catchy untuk efek "earworm".</p>
                   </div>
                </div>
             </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
