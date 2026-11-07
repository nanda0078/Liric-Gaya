
// Fix: Use @google/genai guidelines for model interaction and Type usage.
import { GoogleGenAI, Type } from "@google/genai";
import { 
  StyleOption, 
  GenerationResponse, 
  STYLE_LABELS, 
  LanguageOption, 
  LANGUAGE_LABELS, 
  RhymeOption, 
  RHYME_LABELS,
  TRADITIONAL_INSTRUMENTS,
  ARABIC_INSTRUMENTS,
  MODERN_INSTRUMENTS,
  INDIAN_ROMANTIC_INSTRUMENTS,
  INDIAN_MODERN_INSTRUMENTS,
  INDIAN_CLASSICAL_INSTRUMENTS,
  CAMPURSARI_MODERN_INSTRUMENTS,
  ModularPresets,
  MaleVocalType,
  MALE_VOCAL_LABELS,
  FemaleVocalType,
  FEMALE_VOCAL_LABELS,
  VocalFormation,
  VOCAL_FORMATION_LABELS,
  AudioAnalysisResult,
  RemixProfile,
  MultilingualType,
  MULTILINGUAL_TYPE_LABELS,
  EmotionalRapVariant,
  EMOTIONAL_RAP_LABELS,
  EMOTIONAL_RAP_DESCRIPTIONS,
  VocalGender,
  VOCAL_GENDER_LABELS,
  GENRE_REMIX_CATEGORIES
} from "../types";

export const getActiveApiKey = (): string => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('gemini_api_key');
    if (stored && stored.trim()) return stored.trim();
  }
  const envKey = (process.env.API_KEY || process.env.GEMINI_API_KEY || '').trim();
  if (envKey && envKey !== 'PLACEHOLDER_API_KEY') {
    return envKey;
  }
  return '';
};

export const saveApiKey = (key: string): void => {
  if (typeof window !== 'undefined') {
    if (key && key.trim()) {
      localStorage.setItem('gemini_api_key', key.trim());
    } else {
      localStorage.removeItem('gemini_api_key');
    }
  }
};

const getAIClient = (): GoogleGenAI => {
  const apiKey = getActiveApiKey();
  if (!apiKey) {
    throw new Error('API Key Gemini belum diisi. Silakan masukkan API Key Gemini Anda pada kolom input API Key di atas.');
  }
  return new GoogleGenAI({ apiKey });
};

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    songTitle: {
      type: Type.STRING,
      description: "A fresh, unique, and emotionally resonant title. Identify the primary phrase or chant from the chorus that represents the emotional core. CRITICAL: Always create a NEW title and strictly AVOID repeating the original title or any previous version. It should be short, powerful, and memorable.",
    },
    modifiedLyrics: {
      type: Type.STRING,
      description: "The lyrics based on the requested style and language. If modification is requested, rewrite them. If original is requested, use them verbatim.",
    },
    musicPrompt: {
      type: Type.STRING,
      description: "A professional, multi-section narrative prompt for music generation.",
    },
    optimizedPrompt: {
      type: Type.STRING,
      description: "A high-fidelity, cinematic paragraph description blending all technical and emotional elements.",
    },
    musicPromptSummary: {
      type: Type.STRING,
      description: "A condensed version of the musicPrompt, strictly under 1000 characters, maintaining the core technical structure.",
    },
  },
  required: ["songTitle", "modifiedLyrics", "musicPrompt", "optimizedPrompt", "musicPromptSummary"],
};

export const recommendInstruments = async (
  style: string,
  lyrics: string
): Promise<string[]> => {
  const allInstruments = Array.from(new Set([
    ...TRADITIONAL_INSTRUMENTS,
    ...ARABIC_INSTRUMENTS,
    ...MODERN_INSTRUMENTS,
    ...INDIAN_ROMANTIC_INSTRUMENTS,
    ...INDIAN_MODERN_INSTRUMENTS,
    ...INDIAN_CLASSICAL_INSTRUMENTS,
    ...CAMPURSARI_MODERN_INSTRUMENTS
  ]));

  const prompt = `
    Act as a music producer. I have a song with the style "${style}" and these lyrics/theme:
    "${lyrics.substring(0, 300).replace(/\n/g, ' ')}"

    Select the 4-7 most appropriate instruments from the following list to create a rich arrangement for this specific style and mood.
    
    Available Instruments List:
    ${JSON.stringify(allInstruments)}

    Instructions:
    1. Only choose instruments that are present in the list above.
    2. Return ONLY a JSON array of strings.
    3. Do not include markdown formatting like \`\`\`json.
  `;

  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts: [{ text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const text = response.text || "[]";
    const recommended = JSON.parse(text);
    return recommended.filter((i: string) => allInstruments.includes(i));
  } catch (error) {
    console.error("Instrument recommendation error:", error);
    return [];
  }
};

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    tags: { type: Type.ARRAY, items: { type: Type.STRING } },
    genre: { type: Type.STRING },
    key: { type: Type.STRING },
    tempo: { type: Type.STRING },
    timeSignature: { type: Type.STRING },
    feel: { type: Type.STRING },
    structure: { type: Type.STRING },
    vocalArrangement: { type: Type.STRING },
    instrumentDetails: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING }
        },
        required: ["name", "description"]
      }
    },
    dynamicControl: { type: Type.STRING },
    reverbSpace: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          value: { type: Type.STRING }
        },
        required: ["category", "value"]
      }
    },
    config: {
      type: Type.OBJECT,
      properties: {
        instrumental: { type: Type.BOOLEAN },
        reverb_wet: { type: Type.STRING }
      },
      required: ["instrumental", "reverb_wet"]
    },
    lyrics: { type: Type.STRING, description: "Verbatim, accurate transcription of the lyrics from the audio/source." },
    keywords: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING }, 
      description: "Exactly 10 descriptive keywords representing the lyrical theme and emotional core of the song." 
    },
    rawText: { type: Type.STRING, description: "A summarized string of the entire analysis." },
    fullDetailedAnalysis: { type: Type.STRING, description: "The full detailed breakdown as shown in the request example." },
    promptTranslation: { type: Type.STRING, description: "The English translation prompt." },
    maleVocalCharacter: { type: Type.STRING, description: "Describe the specific character of the male voice if present." },
    femaleVocalCharacter: { type: Type.STRING, description: "Describe the specific character of the female voice if present." }
  },
  required: ["tags", "genre", "key", "tempo", "timeSignature", "feel", "structure", "vocalArrangement", "instrumentDetails", "dynamicControl", "reverbSpace", "config", "lyrics", "keywords", "rawText", "fullDetailedAnalysis", "promptTranslation", "maleVocalCharacter", "femaleVocalCharacter"]
};

export const analyzeAudioStyle = async (
  audioData: { data: string; mimeType: string }
): Promise<{ analysis: AudioAnalysisResult; lyrics: string; structure: string }> => {
  const prompt = `
    Analyze the uploaded audio clip to extract detailed musical information and transcribe the lyrics accurately.
    
    1. **LYRICS TRANSCRIPTION (MANDATORY)**:
       - Transcribe the lyrics EXACTLY as heard in the audio.
       - If the audio is instrumental, set lyrics to "Instrumental".

    2. **LYRICAL KEYWORDS**: Extract EXACTLY 10 keywords that capture the story, theme, and emotion of the lyrics.

    3. **VOCAL CHARACTER CAPTURE (CRITICAL)**:
       - Detect all active voices and their genders.
       - For MALE VOCALS: Describe tone, range, and emotional delivery.
       - For FEMALE VOCALS: Describe tone, range, and emotional delivery.

    4. **MUSIC ANALYSIS**: Full breakdown of instrumentation, tempo, key, and structure.

    5. **PROMPT GENERATION**: A professional multi-section music generation prompt in the style of high-end studio analysis.

    Format the response strictly using the provided JSON schema.
  `;

  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { inlineData: { mimeType: audioData.mimeType, data: audioData.data } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema
      }
    });
    
    const json = JSON.parse(response.text || "{}");
    return { 
      analysis: json, 
      lyrics: json.lyrics || "",
      structure: json.structure || ""
    };

  } catch (error) {
    console.error("Audio analysis error:", error);
    throw new Error("Gagal menganalisa audio.");
  }
};

export const analyzeYouTubeLink = async (
  url: string
): Promise<{ analysis: AudioAnalysisResult; lyrics: string; structure: string }> => {
  const prompt = `
    Analyze the song at this YouTube URL: ${url}. 
    Use Google Search to find professional musical analysis, genre, tempo (BPM), key, instruments used, and lyrical content.
    
    1. **LYRICS TRANSCRIPTION**: Find and provide full, accurate lyrics.
    2. **LYRICAL KEYWORDS**: Find 10 keywords representing the theme of the lyrics.
    3. **VOCAL CHARACTER**: Detailed description of the singer's vocal character.
    4. **MUSIC ANALYSIS**: Full technical breakdown.
    5. **PROMPT GENERATION**: Professional multi-section narrative prompt.

    Format the response strictly using the provided JSON schema.
  `;

  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: { parts: [{ text: prompt }] },
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: analysisSchema
      }
    });
    
    const json = JSON.parse(response.text || "{}");
    return { 
      analysis: json, 
      lyrics: json.lyrics || "",
      structure: json.structure || ""
    };

  } catch (error) {
    console.error("YouTube analysis error:", error);
    throw new Error("Gagal menganalisa YouTube link.");
  }
};

export const analyzeGenreRemix = async (
  style: string,
  lyrics: string
): Promise<RemixProfile[]> => {
  const allOptions = GENRE_REMIX_CATEGORIES.flatMap(cat => cat.options);
  
  const prompt = `
    Bertindaklah sebagai kurator musik profesional. Berdasarkan Gaya: "${style}" dan Lirik: "${lyrics.substring(0, 500)}", 
    buatkan 5 profil "Genre Remix" yang berbeda dan kreatif.
    
    Setiap profil HARUS berisi:
    1. Nama yang unik dan kreatif dalam Bahasa Indonesia (misal: "Jiwa Neon Tengah Malam", "Fusi Cyber-Koplo").
    2. Deskripsi singkat dan menarik dalam Bahasa Indonesia yang menjelaskan mengapa remix ini cocok dengan suasana lirik tersebut.
    3. Daftar 4-6 tag yang sesuai, dipilih HANYA dari daftar tag yang tersedia di bawah.
    
    Daftar Tag yang Tersedia:
    ${JSON.stringify(allOptions)}
    
    Kembalikan HANYA array JSON yang berisi 5 objek dengan properti: "name", "description", dan "tags".
  `;

  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts: [{ text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              description: { type: Type.STRING },
              tags: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["name", "description", "tags"]
          }
        }
      }
    });

    const results = JSON.parse(response.text || "[]");
    return results.map((r: any) => ({
      ...r,
      tags: r.tags.filter((tag: string) => allOptions.includes(tag))
    }));
  } catch (error) {
    console.error("Genre remix analysis error:", error);
    return [];
  }
};

export const generateCustomRemixSuggestions = async (
  userRequest: string,
  style: string,
  lyrics: string
): Promise<RemixProfile[]> => {
  const allOptions = GENRE_REMIX_CATEGORIES.flatMap(cat => cat.options);
  
  const prompt = `
    Act as a senior music producer. The user wants to remix a song based on this custom request: "${userRequest}".
    Initial Style: "${style}"
    Lyrics: "${lyrics.substring(0, 500)}"
    
    Provide 3-4 unique and high-quality remix profile suggestions that satisfy the user's request while respecting the emotional core of the lyrics.
    
    For each suggestion, provide:
    1. A creative name.
    2. A short catchy description.
    3. A professional "Reason" (Alasan) in Indonesian explaining WHY this specific combination of elements and tags fits their request and the song's story.
    4. A list of 4-7 tags chosen ONLY from the available list below.
    
    Available Tags List:
    ${JSON.stringify(allOptions)}
    
    Return ONLY a JSON array.
  `;

  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts: [{ text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              description: { type: Type.STRING },
              reason: { type: Type.STRING },
              tags: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["name", "description", "reason", "tags"]
          }
        }
      }
    });

    const results = JSON.parse(response.text || "[]");
    return results.map((r: any) => ({
      ...r,
      tags: r.tags.filter((tag: string) => allOptions.includes(tag))
    }));
  } catch (error) {
    console.error("Custom remix suggestion error:", error);
    return [];
  }
};

export const generateLyricsAndPrompt = async (
  originalLyrics: string,
  style: StyleOption,
  language: LanguageOption,
  isImageryOn: boolean,
  isRhymeCheckOn: boolean,
  rhymeScheme: RhymeOption,
  isInstrumentalOn: boolean,
  instruments: string[],
  customStyle?: string,
  audioData?: { data: string; mimeType: string },
  isPureInstrumentalOn: boolean = false,
  isAlapStyleOn: boolean = false,
  isCleanStudioMode: boolean = false,
  isSparseLyricsOn: boolean = false,
  isInterludeOn: boolean = false,
  isSmoothVocalOn: boolean = true,
  isModularPresetOn: boolean = false,
  modularPresets: ModularPresets = { style: [], tempo: '', mainMood: '', supportMood: '', groove: '', atmosphere: '', texture: '' },
  songStructure: string = "",
  isMaleVocalTypeOn: boolean = false,
  maleVocalType: MaleVocalType = MaleVocalType.BARITONE,
  isFemaleVocalTypeOn: boolean = false,
  femaleVocalType: FemaleVocalType = FemaleVocalType.MEZZO_SOPRANO,
  isVocalFormationOn: boolean = false,
  vocalFormation: VocalFormation = VocalFormation.SOLO_MALE,
  isAtmosphericVocalsOn: boolean = false,
  isAmbientCinematicOn: boolean = false,
  isKeepOriginalLyricsOn: boolean = false,
  genreRemixes: string[] = [],
  isMultilingualOn: boolean = false,
  primaryLanguage: LanguageOption = LanguageOption.INDONESIA,
  secondaryLanguages: LanguageOption[] = [],
  isFixedTempoOn: boolean = true,
  multilingualType: MultilingualType = MultilingualType.NORMAL,
  isEmotionalRapOn: boolean = false,
  emotionalRapVariant: EmotionalRapVariant = EmotionalRapVariant.MID_FAST,
  vocalGender?: VocalGender,
  isHarmoniesOn: boolean = false,
  isAdLibsOn: boolean = false,
  isBackingVocalsOn: boolean = false,
  negativePrompt: string = "",
  customMaleVocalType: string = "",
  customFemaleVocalType: string = "",
  isHumanTouchOn: boolean = true,
  isVerseFlowOptimizerOn: boolean = false,
  customVocalGender: string = "",
  isRepetitiveChantOn: boolean = false
): Promise<GenerationResponse> => {
  
  const styleLabel = (style === StyleOption.CUSTOM && customStyle && customStyle.trim()) 
    ? customStyle 
    : STYLE_LABELS[style];
  
  const languageLabel = language === LanguageOption.AUTO 
    ? "Otomatis" 
    : LANGUAGE_LABELS[language];
    
  let userPrompt = `
    Act as a professional music producer and director. Create a high-fidelity music generation prompt based on the following:
    Style: ${styleLabel}
    Language Configuration: ${isMultilingualOn ? 'MULTILINGUAL BLENDING' : languageLabel}
    Instruments: ${instruments.join(', ')}
    Structure: ${songStructure || "Standard Song Structure"}
    Negative Constraints: ${negativePrompt || "None"}
    Remix Flavor: ${genreRemixes.join(', ')}
    
    VOCAL CHARACTERISTICS:
    - Formation: ${isVocalFormationOn ? VOCAL_FORMATION_LABELS[vocalFormation] : 'Solo'}
    - Vocal Gender Selection: ${vocalGender === VocalGender.CUSTOM ? `Custom Character: ${customVocalGender}` : (vocalGender ? VOCAL_GENDER_LABELS[vocalGender] : 'Not specified')}
    ${isMaleVocalTypeOn ? `- Male Vocal Type: ${maleVocalType === MaleVocalType.CUSTOM ? customMaleVocalType : MALE_VOCAL_LABELS[maleVocalType]}` : ""}
    ${isFemaleVocalTypeOn ? `- Female Vocal Type: ${femaleVocalType === FemaleVocalType.CUSTOM ? customFemaleVocalType : FEMALE_VOCAL_LABELS[femaleVocalType]}` : ""}
    - Layering: ${[isHarmoniesOn ? 'Harmonies' : '', isAdLibsOn ? 'Ad-libs' : '', isBackingVocalsOn ? 'Backing Vocals' : ''].filter(Boolean).join(', ') || 'Standard'}
    - Performance Style: ${isSmoothVocalOn ? 'Smooth and stable pitch' : 'Raw and expressive'}
    ${isAtmosphericVocalsOn ? '- Note: Use vocals as atmospheric textures/humming only.' : ''}

    ${isMultilingualOn ? `
    MULTILINGUAL INSTRUCTIONS (CRITICAL):
    - Primary Language: ${LANGUAGE_LABELS[primaryLanguage]}
    - Secondary Language(s): ${secondaryLanguages.map(l => LANGUAGE_LABELS[l]).join(', ')}
    - Delivery Type: ${MULTILINGUAL_TYPE_LABELS[multilingualType]}
    - Stylistic Direction for Vokal/Rap:
      ${multilingualType === MultilingualType.MELODIC_RAP ? 'Blending rap and singing, highly emotional and modern with a strong melodic hook. Code-switch smoothly.' : ''}
      ${multilingualType === MultilingualType.EMOTIONAL_RAP ? 'Focus on deep feelings, reflective and soft delivery. Rap with a fragile or heavy-hearted tone.' : ''}
      ${multilingualType === MultilingualType.CONSCIOUS_RAP ? 'Meaningful lyrics, positive/educational message, calm and clear flow. Focus on lyrical clarity.' : ''}
      ${multilingualType === MultilingualType.CHILL_RAP ? 'Relaxed rap style, cool vibe, medium-slow tempo, effortless flow.' : ''}
      ${multilingualType === MultilingualType.POP_RAP ? 'Catchy and rhythmic pop-style rap, TikTok-friendly, bright and energetic delivery.' : ''}
      ${multilingualType === MultilingualType.CLOUD_RAP ? 'Dreamy and atmospheric rap, airy vocals, heavily processed feel (reverb/delay), ethereal vibe.' : ''}
      ${multilingualType === MultilingualType.RAP ? 'Traditional rhythmic rap flow with aggressive language mixing.' : ''}
      ${multilingualType === MultilingualType.NORMAL ? 'Standard singing delivery with natural language transitions.' : ''}
    ` : ""}

    ${isEmotionalRapOn ? `
    EMOTIONAL RAP SECTION (VERSE 2):
    - Variant: ${EMOTIONAL_RAP_LABELS[emotionalRapVariant]}
    - Details: ${EMOTIONAL_RAP_DESCRIPTIONS[emotionalRapVariant]}
    - Instructions: Ensure Verse 2 is structured as a rhythmic, spoken-word or emotional rap segment synchronized to approximately 72 BPM feel.
    ` : ""}

    ${isModularPresetOn ? `TECHNICAL PRESETS: ${JSON.stringify(modularPresets)}` : ""}

    REQUIRED OUTPUT FIELDS:
    1. 'songTitle': Create a fresh, UNIQUE, and emotionally high-value title. Identify the primary keyword or phrase from the [Chorus] or [Chant] that is repeated most frequently. IMPORTANT: Always generate a NEW title that avoids repeating the original title provided in the input lyrics. Look for a powerful earworm phrase like 'I See You' or a thematic core from the hook. DO NOT use the existing title if one is present in the source text.
    2. 'modifiedLyrics': Polished lyrics with [Verse], [Chorus] tags.
    3. 'musicPrompt': A professional multi-section narrative using technical studio analysis (Genre, Tempo, Key, Sound, Vocals, Arrangement, Mixing).
    4. 'optimizedPrompt' (MANDATORY): Create a cinematic, highly descriptive paragraph that seamlessly blends all elements (genre, tempo, key, mood, instruments, and vocal performance).
    5. 'musicPromptSummary': A condensed technical version under 1000 characters.

    LYRICS WRITING INSTRUCTIONS:
    - ${isKeepOriginalLyricsOn ? "STAY AS CLOSE AS POSSIBLE TO THE ORIGINAL SOURCE. Maintain the original message, key phrases, and tone while applying the requested refinements below. DO NOT completely rewrite if this flag is on." : "Adapt and polish the lyrics for the style."}
    ${isHumanTouchOn ? `
    - HUMAN TOUCH MODE: Focus on grounded, intimate, everyday details. Avoid abstract clichés.
    ` : ""}
    ${isVerseFlowOptimizerOn ? `
    - FLOW OPTIMIZER: Ensure singable line lengths and natural pauses.
    ` : ""}
    ${isRepetitiveChantOn ? `
    - REPETITIVE CHANT MODE: Incorporate repetitive, rhythmic chants or catchy vocal loops into the structure (e.g., in hooks or transitions). Focus on creating an 'earworm' effect with simple, memorable phrases. Use repetitive words strategically.
    ` : ""}
    - Formatting: Include tags like [Verse], [Chorus], [Interlude], and layered vocal tags.
  `;

  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts: [{ text: userPrompt }, { text: `Input Lyrics: ${originalLyrics}` }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        systemInstruction: `You are a world-class music producer. Your task is to generate high-fidelity music prompts and refined lyrics. Strictly ensure that the 'songTitle' is ALWAYS a new, fresh, and unique creative title, avoiding any repetition of the original title or previous suggestions. Focus on the emotional hook of the chorus for the title.`
      },
    });

    return JSON.parse(response.text || "{}") as GenerationResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate content.");
  }
};
