
export enum StyleOption {
  PUITIS = 'puitis',
  POP = 'pop',
  ROCK = 'rock',
  RAP = 'rap',
  INDIE = 'indie',
  BALADA = 'balada',
  SASTRA = 'sastra',
  SATIR = 'satir',
  CUSTOM = 'custom'
}

export const STYLE_LABELS: Record<StyleOption, string> = {
  [StyleOption.PUITIS]: 'Puitis & Melankolis',
  [StyleOption.POP]: 'Pop Modern (Upbeat)',
  [StyleOption.ROCK]: 'Rock Alternatif',
  [StyleOption.RAP]: 'Rap / Hip Hop',
  [StyleOption.INDIE]: 'Indie Folk',
  [StyleOption.BALADA]: 'Balada Romantis',
  [StyleOption.SASTRA]: 'Sastra Klasik Indonesia',
  [StyleOption.SATIR]: 'Satir / Humor',
  [StyleOption.CUSTOM]: 'Custom...'
};

export enum LanguageOption {
  AUTO = 'auto',
  INDONESIA = 'Indonesian',
  ENGLISH = 'English',
  JAVANESE = 'Javanese',
  JAVANESE_MIXED = 'Javanese (Mixed Ngoko-Krama)',
  MADURESE = 'Madurese',
  SUNDANESE = 'Sundanese',
  KOREAN = 'Korean',
  HINDI = 'Hindi',
  ARABIC = 'Arabic'
}

export const LANGUAGE_LABELS: Record<LanguageOption, string> = {
  [LanguageOption.AUTO]: 'Otomatis (Deteksi Bahasa)',
  [LanguageOption.INDONESIA]: 'Bahasa Indonesia',
  [LanguageOption.ENGLISH]: 'English (Inggris)',
  [LanguageOption.JAVANESE]: 'Bahasa Jawa (Javanese)',
  [LanguageOption.JAVANESE_MIXED]: 'Bahasa Jawa (Ngoko-Krama Campuran)',
  [LanguageOption.MADURESE]: 'Bahasa Madura (Madurese)',
  [LanguageOption.SUNDANESE]: 'Bahasa Sunda (Sundanese)',
  [LanguageOption.KOREAN]: 'Bahasa Korea (Hangul)',
  [LanguageOption.HINDI]: 'Bahasa Hindi (Hindustani)',
  [LanguageOption.ARABIC]: 'Bahasa Arab (Fusha/Klasik)'
};

export enum RhymeOption {
  AABB = 'aabb',
  ABAB = 'abab',
  AAAA = 'aaaa',
  AABA = 'aaba',
  FREE = 'free'
}

export const RHYME_LABELS: Record<RhymeOption, string> = {
  [RhymeOption.AABB]: 'A-A-B-B (Kopel)',
  [RhymeOption.ABAB]: 'A-B-A-B (Silang)',
  [RhymeOption.AAAA]: 'A-A-A-A (Terus)',
  [RhymeOption.AABA]: 'A-A-B-A (Rubaiyat)',
  [RhymeOption.FREE]: 'Bebas (Tanpa Rima)'
};

export enum MultilingualType {
  NORMAL = 'normal',
  RAP = 'rap',
  MELODIC_RAP = 'melodic_rap',
  EMOTIONAL_RAP = 'emotional_rap',
  CONSCIOUS_RAP = 'conscious_rap',
  CHILL_RAP = 'chill_rap',
  POP_RAP = 'pop_rap',
  CLOUD_RAP = 'cloud_rap'
}

export const MULTILINGUAL_TYPE_LABELS: Record<MultilingualType, string> = {
  [MultilingualType.NORMAL]: 'Lagu Biasa (Melodis)',
  [MultilingualType.RAP]: 'Rap Murni (Ritmik)',
  [MultilingualType.MELODIC_RAP]: 'Melodic Rap (Rap + Nyanyi)',
  [MultilingualType.EMOTIONAL_RAP]: 'Emotional Rap (Reflektif)',
  [MultilingualType.CONSCIOUS_RAP]: 'Conscious Rap (Soft)',
  [MultilingualType.CHILL_RAP]: 'Chill Rap (Santai)',
  [MultilingualType.POP_RAP]: 'Pop Rap (Soft)',
  [MultilingualType.CLOUD_RAP]: 'Cloud Rap (Dreamy)'
};

export enum VocalGender {
  MALE = 'male',
  FEMALE = 'female',
  CUSTOM = 'custom'
}

export const VOCAL_GENDER_LABELS: Record<VocalGender, string> = {
  [VocalGender.MALE]: 'Pria (Laki-laki)',
  [VocalGender.FEMALE]: 'Wanita (Perempuan)',
  [VocalGender.CUSTOM]: 'Karakter Suara Custom...'
};

export enum EmotionalRapVariant {
  SLOW = 'slow',
  MID_FAST = 'mid_fast',
  FAST_CONFESSIONAL = 'fast_confessional',
  WAVE = 'wave'
}

export const EMOTIONAL_RAP_LABELS: Record<EmotionalRapVariant, string> = {
  [EmotionalRapVariant.SLOW]: 'A. Lambat & Terkendali',
  [EmotionalRapVariant.MID_FAST]: 'B. Emosional Sedang-Cepat ⭐',
  [EmotionalRapVariant.FAST_CONFESSIONAL]: 'C. Pengakuan Cepat (Intens)',
  [EmotionalRapVariant.WAVE]: 'D. Wave Rap (Dinamis)'
};

export const EMOTIONAL_RAP_DESCRIPTIONS: Record<EmotionalRapVariant, string> = {
  [EmotionalRapVariant.SLOW]: 'Gaya bicara, 4–6 suku kata per bar, intim dan seperti pengakuan. Gunakan saat lagu sangat lembut and minimalis.',
  [EmotionalRapVariant.MID_FAST]: 'Cepat tapi terkendali, 7–9 suku kata per bar, halus and melankolis. Keseimbangan terbaik untuk balada + rap (gaya OST).',
  [EmotionalRapVariant.FAST_CONFESSIONAL]: 'Padat tapi singkat, 10–12 suku kata per bar, tertekan secara emosional. Batasi hanya untuk 8–12 bar.',
  [EmotionalRapVariant.WAVE]: 'Mempercepat secara bertahap lalu mereda, alur penceritaan yang alami.'
};

export interface GenerationResponse {
  songTitle: string;
  modifiedLyrics: string;
  musicPrompt: string;
  optimizedPrompt: string;
  musicPromptSummary: string;
}

export interface InstrumentDetail {
  name: string;
  description: string;
}

export interface AudioAnalysisResult {
  tags: string[];
  genre: string;
  key: string;
  tempo: string;
  timeSignature: string;
  feel: string;
  structure: string;
  vocalArrangement: string;
  instrumentDetails: InstrumentDetail[];
  dynamicControl: string;
  reverbSpace: { category: string; value: string }[];
  config: { instrumental: boolean; reverb_wet: string };
  lyrics: string;
  keywords: string[];
  rawText: string;
  promptTranslation: string;
  fullDetailedAnalysis: string;
  maleVocalCharacter?: string;
  femaleVocalCharacter?: string;
}

export interface RemixProfile {
  name: string;
  description: string;
  tags: string[];
  reason?: string;
}

export const TRADITIONAL_INSTRUMENTS = [
  "Suling", "Gamelan (Saron, Bonang, Gong)", "Angklung", "Kecapi Sunda", "Sasando", "Tifa", "Hasapi / Seruling Batak"
];

export const ARABIC_INSTRUMENTS = [
  "Oud (Alat musik petik khas Arab)", "Qanun", "Ney (Suling Arab)", "Darbuka / Doumbek", "Riqq (Rebana Arab)", "Kamanjah (Oriental Violin)", "Mijwiz"
];

export const MODERN_INSTRUMENTS = [
  "Grand Piano",
  "Electric Guitar",
  "Acoustic Guitar",
  "Bass",
  "Synth Pad",
  "Drum Kit",
  "String Section",
  "Electric Piano / Rhodes",
  "Dreamy Electric Guitar",
  "Warm Synth Bass",
  "Soft Electronic Drums",
  "Ambient Texture / Reverb FX",
  "Synth Pad (Dreamy / Warm Pad)",
  "Electric Piano (Warm / Rhodes / DX7)",
  "Grand Piano (Soft & Emotional)",
  "Electric Guitar (Dreamy, Reverb, Delay)",
  "Melodic Synth Lead (Soft)",
  "Bassline (Warm Synth Bass)",
  "Electronic Drums (Soft, Chillwave Style)",
  "Textural Ambience / Noise Layer",
  "Violin Pad / String Ensemble Lembut",
  "Soft Pluck Synth",
  "Subtle Choir Pad (Ooh / Aah)"
];

export const INDIAN_ROMANTIC_INSTRUMENTS = [
  "Bansuri",
  "Tabla",
  "Acoustic Guitar",
  "Soft Pads",
  "String Ensemble",
  "Warm Bass"
];

export const INDIAN_MODERN_INSTRUMENTS = [
  "Synth Leads",
  "Tabla + Electronic Drums",
  "Electric Guitar",
  "Soft Pads",
  "Subtle Bass"
];

export const INDIAN_CLASSICAL_INSTRUMENTS = [
  "Sitar",
  "Santoor",
  "Bansuri",
  "Tabla",
  "Tanpura (Drone)"
];

export const CAMPURSARI_MODERN_INSTRUMENTS = [
  "Drums (Dangdut Koplo Style)",
  "Kendang Campursari / Kendang Koplo",
  "Bass Guitar",
  "Electric Guitar – Rhythm",
  "Electric Guitar – Lead",
  "Keyboard / Synth Pad",
  "Keyboard / Synth Melody",
  "Suling Jawa",
  "Siter / Kecapi Jawa (Virtual)",
  "Strings Section (Violin / Viola Pad)"
];

export const PRESET_STYLES = [
  "Pop", "Rock", "Jazz", "R&B", "Hip Hop", "EDM", "Cinematic", "Ambient", 
  "Folk", "Indie", "Metal", "Reggae", "Blues", "Funk", "Soul", "Classical",
  "Dangdut", "Koplo", "Keroncong", "Campursari", "Gamelan Fusion", "Lo-fi Pop",
  "Electronic Pop", "Chill Pop", "Romantic", "Dreamy", "Emotional"
];

export const PRESET_TEMPOS = [
  "Very Slow (<60)", "Slow (60-80)", "Mid-Tempo (90-110)", 
  "Upbeat (110-130)", "Fast (130-160)", "Very Fast (>160)", "Free Tempo"
];

export const PRESET_MAIN_MOODS = [
  "Happy", "Sad", "Energetic", "Calm", "Angry", "Fearful", "Romantic", "Epic", "Dark"
];

export const PRESET_SUPPORT_MOODS = [
  "Melancholic", "Nostalgic", "Dreamy", "Hopeful", "Euphoric", "Mysterious", "Sentimental", "Groovy", "Chill"
];

export const PRESET_GROOVES = [
  "Straight 4/4", "Swing", "Shuffle", "Waltz 3/4", "Syncopated", "Tribal", "Four-on-the-floor", "Trap Beat", "Breakbeat"
];

export const PRESET_ATMOSPHERES = [
  "Ethereal", "Spacious", "Intimate", "Lo-fi", "Vintage", "Futuristic", "Dark & Gritty", "Warm & Cozy", "Cold & Icy"
];

export const PRESET_TEXTURES = [
  "Acoustic/Organic", "Electronic/Synthetic", "Hybrid", "Orchestral", "Distorted", "Clean & Polished", "Minimalist", "Wall of Sound"
];

export const REMIX_GUIDE_MAPPING: Record<string, { moods: string[], energy: string[], flavors: string[] }> = {
  "POP": {
    moods: ["Happy Vibes", "Romantic", "Emotional", "Nostalgic", "Chill & Calm", "Confident", "Stylish", "Cool"],
    energy: ["Midtempo Bounce", "Danceable", "Laid-back"],
    flavors: ["Synth-Pop", "Electro Pop", "Acoustic Pop"]
  },
  "EDM": {
    moods: ["Euphoric", "Dreamy", "Emotional", "Urban", "Vibey"],
    energy: ["Uptempo Dance", "High Energy", "Driving Beat"],
    flavors: ["Future Bass", "Progressive House", "Trance Melodic", "EDM Chill"]
  },
  "CHILL": {
    moods: ["Chill & Calm", "Melancholic", "Dreamy", "Nostalgic", "Night Drive", "Laid-Back"],
    energy: ["Slow Groove", "Laid-back"],
    flavors: ["Chillout", "Lo-Fi", "Downtempo", "Late Night Vibes"]
  },
  "ROCK": {
    moods: ["Emotional", "Romantic", "Anthemic", "Confident"],
    energy: ["Midtempo Bounce", "Groovy", "Driving Beat"],
    flavors: ["Pop Rock", "Indie Rock", "Soft Rock", "Alternative"]
  },
  "INDIE": {
    moods: ["Melancholic", "Dreamy", "Dark Atmosphere", "Nostalgic", "Intimate"],
    energy: ["Slow Groove", "Laid-back"],
    flavors: ["Indie Pop", "Indie Rock", "Experimental", "Minimalist"]
  },
  "CINEMATIC": {
    moods: ["Emotional", "Epic", "Dark Atmosphere", "Sensual"],
    energy: ["Slow Groove", "Anthemic"],
    flavors: ["Cinematic", "Orchestral", "Film Score Style", "Soundscape"]
  },
  "DANGDUT": {
    moods: ["Melancholic", "Romantic", "Happy Vibes", "Bounce"],
    energy: ["Slow Groove", "Midtempo Bounce", "Danceable"],
    flavors: ["Slow Dangdut", "Dangdut Modern", "Dangdut Koplo Chill", "Dangdut EDM Fusion"]
  },
  "HYBRID": {
    moods: ["Emotional", "Euphoric", "Dreamy", "Urban"],
    energy: ["Driving Beat", "Danceable"],
    flavors: ["Electro Pop", "Future Bass", "Dangdut EDM Fusion"]
  }
};

export const GENRE_REMIX_CATEGORIES = [
  {
    name: "Suasana & Emosi",
    options: [
      "Happy", "Sad", "Emotional", "Chill", "Energetic", "Uplifting", "Romantic", 
      "Melancholic", "Dreamy", "Nostalgic", "Epic", "Dark", "Calm", "Peaceful", 
      "Euphoric", "Festival", "Party", "Hype", "Groovy", "Danceable", "Feel Good", 
      "Club", "Anthem", "Powerful", "Relaxing", "Smooth", "Atmospheric", 
      "Late Night", "Moody", "Soft", "Minimal", "Cinematic", "Dramatic", 
      "Inspiring", "Heroic", "Dark Cinematic", "Spiritual", "Devotional", 
      "Peaceful Worship", "Emotional Worship", "Uplifting Worship",
      "Confident", "Sensual", "Intimate", "Night Drive", "Urban", "Bounce", "Vibey", "Cool", "Stylish", "Laid-Back",
      "Punchy", "Bouncy", "Hard-Hitting", "Trap", "Drill", "Boom Bap", "Funky", "Tribal", "Industrial", "Minimal Beat", "Loopable", "Drop-Oriented"
    ]
  },
  {
    name: "Energi & Ketukan (Groove)",
    options: [
      "Slow Groove", 
      "Laid-back", 
      "Chill Groove", 
      "Midtempo Bounce", 
      "Groovy", 
      "Deep Groove", 
      "Driving Beat", 
      "Danceable", 
      "Uptempo Dance", 
      "High Energy", 
      "Anthemic", 
      "Four-on-the-Floor", 
      "Breakbeat", 
      "Rolling Beat", 
      "Drop-Driven"
    ]
  },
  {
    name: "Gaya & Kategori (Flavor)",
    options: [
      "Synth-Pop", "Electro Pop", "Dance Pop", "Future Pop", "Bedroom Pop", "Dream Pop", "Indie Pop", "Chill Pop", 
      "Tropical House", "Deep House", "Slap House", "Nu-Disco", "Synthwave", "Retrowave",
      "EDM Chill", "Chillout", "Lo-Fi", "Chillhop", "Downtempo", "Late Night Vibes", "Ambient Pop", "Ambient Electronic", "Chillstep", "Atmospheric Pop",
      "Future Bass", "Progressive House", "Electro House", "Bass House", "Tech House", "Big Room", "Festival EDM", "Melodic EDM", "Melodic Trance", "Uplifting Trance",
      "Pop Rock", "Soft Rock", "Indie Rock", "Alternative Rock", "Pop Punk", "Modern Rock", "Adult Contemporary (AC)", "Post-Rock",
      "Acoustic Pop", "Religious Acoustic", "Dangdut Akustik", "Folk Pop", "Singer-Songwriter",
      "Cinematic", "Cinematic Pop", "Orchestral", "Hybrid Orchestral", "Film Score Style", "Trailer Music", "Epic Orchestral", "Emotional Score", "Ambient Score", "Minimal Cinematic", "Soundscape",
      "Experimental", "Art Pop", "Avant-Pop", "Glitch Pop", "Abstract Electronic", "Minimalist", "Minimal Electronic",
      "Slow Dangdut", "Modern Dangdut", "Dangdut Koplo Modern", "Chill Dangdut Koplo", "Dangdut Pop", "Dangdut Remix", "Dangdut House", "Dangdut EDM Fusion", "Dangdut Electro", "Dangdut Chill", "Dangdut Slow Pop",
      "Religious Pop", "Islamic Pop Ballad", "Islamic Pop EDM", "Islamic Pop Remix", "Modern Pop Gambus", "Gambus Pop", "Gambus Modern Fusion", "Gambus Electronic", "Islamic Chill / EDM", "Islamic Chill / Electronic Gambus", "Sholawat Modern", "Sholawat EDM", "Sholawat Chill", "Contemporary Nasyid", "Nasyid Pop Modern", "Nasyid EDM", "Religious Chill Pop", "Spiritual Electronic"
    ]
  }
];

export const REMIX_DESCRIPTIONS: Record<string, string> = {
  // Moods
  "Happy": "Ceria, ringan, bikin senyum.",
  "Sad": "Sedih, sendu, menyentuh perasaan.",
  "Emotional": "Menguras emosi, bikin terharu.",
  "Chill": "Santai, enak didengar, tidak tegang.",
  "Energetic": "Penuh semangat, bikin bergerak.",
  "Uplifting": "Mengangkat mood, memberi harapan.",
  "Romantic": "Nuansa cinta, hangat, penuh perasaan.",
  "Melancholic": "Sedih lembut, nostalgia, sendu indah.",
  "Dreamy": "Mengawang, seperti mimpi.",
  "Nostalgic": "Membangkitkan kenangan masa lalu yang indah.",
  "Epic": "Megah, besar, terasa heroik.",
  "Dark": "Suram, misterius, berat.",
  "Calm": "Tenang, damai, menenangkan pikiran.",
  "Peaceful": "Damai, cocok untuk refleksi.",
  "Euphoric": "Sangat bahagia, puncak emosi positif.",
  "Festival": "Besar, ramai, cocok untuk panggung besar.",
  "Party": "Seru, untuk suasana pesta.",
  "Hype": "Memicu semangat, bikin excited.",
  "Groovy": "Ritme yang sangat ritmik, enak goyang.",
  "Danceable": "Memiliki ketukan yang mudah diikuti untuk dance.",
  "Feel Good": "Bikin enak hati, mood booster.",
  "Club": "Atmosfer klub malam.",
  "Anthem": "Lagu andalan, terasa besar & sing-along.",
  "Powerful": "Kuat, penuh tenaga.",
  "Relaxing": "Bikin rileks, melepas stres.",
  "Smooth": "Halus, lembut di telinga.",
  "Atmospheric": "Penuh ambience, ruang & suasana.",
  "Late Night": "Cocok didengar malam hari.",
  "Moody": "Emosional, berubah-ubah, penuh rasa.",
  "Soft": "Lembut, tidak agresif.",
  "Minimal": "Sederhana, tidak ramai.",
  "Cinematic": "Aransemen dramatis yang terasa seperti ilustrasi adegan film.",
  "Dramatic": "Penuh ketegangan & emosi.",
  "Inspiring": "Memberi motivasi.",
  "Heroic": "Berani, kemenangan, perjuangan.",
  "Dark Cinematic": "Filmik tapi gelap & intens.",
  "Spiritual": "Religius, terasa rohani.",
  "Devotional": "Penghambaan, ibadah, khusyuk.",
  "Peaceful Worship": "Ibadah yang tenang & damai.",
  "Emotional Worship": "Ibadah penuh perasaan.",
  "Uplifting Worship": "Ibadah yang membangkitkan semangat.",

  // New Moods
  "Confident": "Percaya diri, stylish, modern.",
  "Sensual": "Menggoda secara halus dan dewasa.",
  "Intimate": "Personal, dekat, terasa privat.",
  "Night Drive": "Vibe perjalanan malam yang santai.",
  "Urban": "Rasa kota modern & street culture.",
  "Bounce": "Beat mantul, fun, ringan.",
  "Vibey": "Kuat di rasa dan atmosfer.",
  "Cool": "Santai, trendi, effortless.",
  "Stylish": "Modis, fashionable, kekinian.",
  "Laid-Back": "Santai tapi tetap groovy.",

  // Tambahan Suasana & Emosi (Baru)
  "Punchy": "Beat tegas dan nendang.",
  "Bouncy": "Beat memantul, fun.",
  "Hard-Hitting": "Beat berat, impact kuat.",
  "Trap": "808 dominan, hi-hat cepat.",
  "Drill": "Gelap, agresif, sliding bass.",
  "Boom Bap": "Hip-hop klasik.",
  "Funky": "Groove funk, playful.",
  "Tribal": "Drum etnik, primal.",
  "Industrial": "Beat metalik, kasar.",
  "Minimal Beat": "Sedikit elemen, fokus ritme.",
  "Loopable": "Beat nyaman diulang.",
  "Drop-Oriented": "Fokus momen drop.",
  
  // Energy & Groove
  "Slow Groove": "Lambat & santai, memberikan ruang pada setiap nada.",
  "Laid-back": "Santai, relaxed, tidak terburu-buru.",
  "Chill Groove": "Santai tapi tetap mengalir dengan ritme yang stabil.",
  "Midtempo Bounce": "Tempo sedang & mantul dengan pantulan ritme yang aktif.",
  "Deep Groove": "Dalam dan terasa, menonjolkan tekstur bassline yang tebal.",
  "Driving Beat": "Mendorong dan berenergi, memberikan dorongan maju yang kuat.",
  "Uptempo Dance": "Tempo cepat yang dirancang khusus untuk energi lantai dansa.",
  "High Energy": "Intensitas tinggi, energi tinggi, and sangat bersemangat.",
  "Anthemic": "Kuat, megah, besar & sing-along.",
  "Four-on-the-Floor": "Beat klub konsisten.",
  "Breakbeat": "Groove patah-patah yang dinamis dan tidak konvensional.",
  "Rolling Beat": "Beat yang mengalir terus menerus tanpa putus.",
  "Drop-Driven": "Fokus ke drop, berfokus pada pembangunan menuju klimaks musik.",
  
  // Flavor - Pop / Electronic / Modern
  "Synth-Pop": "Pop dengan dominasi synth retro/modern.",
  "Electro Pop": "Pop elektronik, clean & catchy.",
  "Dance Pop": "Pop untuk dancefloor.",
  "Future Pop": "Pop futuristik, modern sound.",
  "Bedroom Pop": "Pop minimal, intimate.",
  "Dream Pop": "Pop dreamy & atmosferik.",
  "Indie Pop": "Pop alternatif & indie feel.",
  "Chill Pop": "Pop santai & ringan.",
  "Tropical House": "House santai, summer vibes.",
  "Deep House": "House dalam & groovy.",
  "Slap House": "House modern, bass tebal.",
  "Nu-Disco": "Disco modern, fun & retro.",
  "Synthwave": "Retro 80s elektronik.",
  "Retrowave": "Nostalgia synth retro.",

  // Flavor - Chill / Lo-Fi / Downtempo
  "EDM Chill": "EDM santai.",
  "Chillout": "Musik santai untuk relax.",
  "Lo-Fi": "Low fidelity, cozy vibes.",
  "Chillhop": "Hip-hop chill.",
  "Downtempo": "Tempo lambat elektronik.",
  "Late Night Vibes": "Cocok untuk malam hari.",
  "Ambient Pop": "Pop dengan ambience.",
  "Ambient Electronic": "Elektronik atmosferik.",
  "Chillstep": "Dubstep versi chill.",
  "Atmospheric Pop": "Pop penuh ruang & ambience.",

  // Flavor - EDM / Club / Festival
  "Future Bass": "Bass emosional & modern.",
  "Progressive House": "Build-up panjang & melodic.",
  "Electro House": "House agresif & energik.",
  "Bass House": "House dengan bass kuat.",
  "Tech House": "Groove techy & minimal.",
  "Big Room": "EDM festival besar.",
  "Festival EDM": "Sound panggung besar.",
  "Melodic EDM": "EDM bernuansa melodi.",
  "Melodic Trance": "Trance emosional.",
  "Uplifting Trance": "Trance uplifting & euphoric.",

  // Flavor - Rock / Band / Alternative
  "Pop Rock": "Rock ringan & catchy.",
  "Soft Rock": "Rock lembut.",
  "Indie Rock": "Rock alternatif & indie.",
  "Alternative Rock": "Rock modern alternatif.",
  "Pop Punk": "Punk ringan & fun.",
  "Modern Rock": "Rock kontemporer.",
  "Adult Contemporary (AC)": "Pop/rock dewasa & smooth.",
  "Post-Rock": "Rock atmosferik & instrumental.",

  // Flavor - Acoustic / Organic
  "Acoustic Pop": "Pop akustik.",
  "Religious Acoustic": "Religi versi akustik.",
  "Dangdut Akustik": "Dangdut versi akustik.",
  "Folk Pop": "Pop bernuansa folk.",
  "Singer-Songwriter": "Fokus vokal & lirik.",

  // Flavor - Cinematic / Score / Soundscape
  "Cinematic Pop": "Pop dengan rasa film.",
  "Orchestral": "Orkestra klasik.",
  "Hybrid Orchestral": "Orkestra + elektronik.",
  "Film Score Style": "Gaya musik film.",
  "Trailer Music": "Musik trailer epik.",
  "Epic Orchestral": "Orkestra besar & megah.",
  "Emotional Score": "Skor emosional.",
  "Ambient Score": "Skor atmosferik.",
  "Minimal Cinematic": "Cinematic minimal.",
  "Soundscape": "Lanskap suara & ambience.",

  // Flavor - Experimental / Minimal
  "Experimental": "Eksploratif & unik.",
  "Art Pop": "Pop artistik.",
  "Avant-Pop": "Pop eksperimental.",
  "Glitch Pop": "Pop dengan glitch effect.",
  "Abstract Electronic": "Elektronik abstrak.",
  "Minimalist": "Minim elemen, simple.",
  "Minimal Electronic": "Elektronik minimal.",

  // Flavor - Dangdut / Lokal Modern
  "Slow Dangdut": "Dangdut tempo lambat.",
  "Modern Dangdut": "Dangdut versi modern.",
  "Dangdut Koplo Modern": "Koplo modern.",
  "Chill Dangdut Koplo": "Koplo santai.",
  "Dangdut Pop": "Dangdut + pop.",
  "Dangdut Remix": "Dangdut versi remix.",
  "Dangdut House": "Dangdut + house.",
  "Dangdut EDM Fusion": "Dangdut + EDM.",
  "Dangdut Electro": "Dangdut elektronik.",
  "Dangdut Chill": "Dangdut santai.",
  "Dangdut Slow Pop": "Dangdut pop pelan.",

  // Flavor - Religious / Islamic Modern
  "Religious Pop": "Pop religi modern.",
  "Islamic Pop Ballad": "Balada pop islami.",
  "Islamic Pop EDM": "Pop islami + EDM.",
  "Islamic Pop Remix": "Remix pop islami.",
  "Modern Pop Gambus": "Gambus versi pop.",
  "Gambus Pop": "Gambus + pop.",
  "Gambus Modern Fusion": "Gambus fusion modern.",
  "Gambus Electronic": "Gambus + elektronik.",
  "Islamic Chill / EDM": "Islami chill EDM.",
  "Islamic Chill / Electronic Gambus": "Gambus elektronik chill.",
  "Sholawat Modern": "Sholawat modern.",
  "Sholawat EDM": "Sholawat + EDM.",
  "Sholawat Chill": "Sholawat santai.",
  "Contemporary Nasyid": "Nasyid modern.",
  "Nasyid Pop Modern": "Nasyid + pop.",
  "Nasyid EDM": "Nasyid + EDM.",
  "Religious Chill Pop": "Pop religi santai.",
  "Spiritual Electronic": "Religi elektronik modern"
};

export const getRecommendedRemixOptions = (detectedGenre: string) => {
  const genre = detectedGenre.toUpperCase();
  let matchKey = "";

  if (genre.includes("POP") || genre.includes("MODERN POP") || genre.includes("INDONESIA")) matchKey = "POP";
  else if (genre.includes("EDM") || genre.includes("ELECTRONIC") || genre.includes("ELEKTRONIK")) matchKey = "EDM";
  else if (genre.includes("CHILL") || genre.includes("LO-FI") || genre.includes("LOFI") || genre.includes("NIGHT")) matchKey = "CHILL";
  else if (genre.includes("ROCK") || genre.includes("BAND")) matchKey = "ROCK";
  else if (genre.includes("INDIE") || genre.includes("ALTERNATIVE") || genre.includes("ALTERNATIF")) matchKey = "INDIE";
  else if (genre.includes("CINEMATIC") || genre.includes("ORCHESTRAL") || genre.includes("SINEMATIK") || genre.includes("FILM")) matchKey = "CINEMATIC";
  else if (genre.includes("DANGDUT") || genre.includes("KOPLO") || genre.includes("LOKAL") || genre.includes("NUSANTARA") || genre.includes("CAMPURSARI")) matchKey = "DANGDUT";
  else if (genre.includes("HYBRID") || genre.includes("+") || genre.includes("FUSION")) matchKey = "HYBRID";

  return matchKey ? { key: matchKey, ...REMIX_GUIDE_MAPPING[matchKey] } : null;
};

export enum MaleVocalType {
  BASS = 'bass',
  BARITONE = 'baritone',
  TENOR = 'tenor',
  COUNTERTENOR = 'countertenor',
  CUSTOM = 'custom'
}

export const MALE_VOCAL_LABELS: Record<MaleVocalType, string> = {
  [MaleVocalType.BASS]: 'Bass (Suara rendah dan berat)',
  [MaleVocalType.BARITONE]: 'Baritone (Suara tengah)',
  [MaleVocalType.TENOR]: 'Tenor (Suara tinggi dan terang)',
  [MaleVocalType.COUNTERTENOR]: 'Countertenor (Suara sangat tinggi/falsetto)',
  [MaleVocalType.CUSTOM]: 'Custom...'
};

export enum FemaleVocalType {
  ALTO = 'alto',
  MEZZO_SOPRANO = 'mezzo_soprano',
  SOPRANO = 'soprano',
  CUSTOM = 'custom'
}

export const FEMALE_VOCAL_LABELS: Record<FemaleVocalType, string> = {
  [FemaleVocalType.ALTO]: 'Alto (Suara rendah dan hangat)',
  [FemaleVocalType.MEZZO_SOPRANO]: 'Mezzo-Soprano (Suara sedang dan seimbang)',
  [FemaleVocalType.SOPRANO]: 'Soprano (Suara tinggi dan terang)',
  [FemaleVocalType.CUSTOM]: 'Custom...'
};

export enum VocalFormation {
  SOLO_MALE = 'solo_male',
  SOLO_FEMALE = 'solo_female',
  DUET_MIXED = 'duet_mixed',
  DUET_MALE = 'duet_male',
  DUET_FEMALE = 'duet_female'
}

export const VOCAL_FORMATION_LABELS: Record<VocalFormation, string> = {
  [VocalFormation.SOLO_MALE]: 'Solo (Pria)',
  [VocalFormation.SOLO_FEMALE]: 'Solo (Wanita)',
  [VocalFormation.DUET_MIXED]: 'Duet (Pria & Wanita)',
  [VocalFormation.DUET_MALE]: 'Duet (Pria & Pria)',
  [VocalFormation.DUET_FEMALE]: 'Duet (Wanita & Wanita)'
};

export interface ModularPresets {
  style: string[];
  tempo: string;
  mainMood: string;
  supportMood: string;
  groove: string;
  atmosphere: string;
  texture: string;
}

export const getCompatibleOptions = (styles: string[]) => {
  if (!styles || styles.length === 0) return null;
  if (styles.length > 1) return null;

  const style = styles[0];
  const isRockMetal = ["Rock", "Metal", "Punk", "Indie", "Blues"].includes(style);
  const isPopRnb = ["Pop", "R&B", "Soul", "Funk", "Chill Pop"].includes(style);
  const isElectronic = ["Hip Hop", "EDM", "Trap", "Electronic Pop"].includes(style);
  const isAtmospheric = ["Cinematic", "Ambient", "Classical", "Romantic", "Dreamy", "Emotional"].includes(style);
  const isTraditional = ["Folk", "Keroncong", "Gamelan Fusion"].includes(style);
  const isDangdutKoplo = ["Dangdut", "Koplo", "Campursari"].includes(style);
  const isJazz = ["Jazz"].includes(style);
  const isReggae = ["Reggae"].includes(style);

  let allowedTempos = PRESET_TEMPOS;
  let allowedGrooves = PRESET_GROOVES;
  let allowedTextures = PRESET_TEXTURES;
  let allowedAtmospheres = PRESET_ATMOSPHERES;

  if (isAtmospheric) {
    allowedTempos = ["Very Slow (<60)", "Slow (60-80)", "Mid-Tempo (90-110)", "Free Tempo"];
    allowedGrooves = ["Straight 4/4", "Waltz 3/4", "Tribal"]; 
    allowedTextures = ["Acoustic/Organic", "Electronic/Synthetic", "Hybrid", "Orchestral", "Minimalist", "Wall of Sound"];
  } else if (isElectronic) {
    allowedTempos = ["Mid-Tempo (90-110)", "Upbeat (110-130)", "Fast (130-160)", "Very Fast (>160)"];
    allowedGrooves = ["Straight 4/4", "Four-on-the-floor", "Trap Beat", "Breakbeat", "Syncopated"];
    allowedTextures = ["Electronic/Synthetic", "Hybrid", "Distorted", "Clean & Polished", "Wall of Sound"];
  } else if (isRockMetal) {
    allowedTempos = ["Slow (60-80)", "Mid-Tempo (90-110)", "Upbeat (110-130)", "Fast (130-160)", "Very Fast (>160)"];
    allowedGrooves = ["Straight 4/4", "Shuffle", "Syncopated", "Tribal"];
    allowedTextures = ["Distorted", "Hybrid", "Wall of Sound", "Acoustic/Organic", "Clean & Polished"];
  } else if (isDangdutKoplo) {
    allowedTempos = ["Mid-Tempo (90-110)", "Upbeat (110-130)", "Fast (130-160)"];
    allowedGrooves = ["Straight 4/4", "Syncopated", "Four-on-the-floor"]; 
    allowedTextures = ["Acoustic/Organic", "Hybrid", "Clean & Polished", "Electronic/Synthetic"];
  } else if (isJazz) {
    allowedGrooves = ["Swing", "Shuffle", "Waltz 3/4", "Syncopated", "Straight 4/4"];
    allowedTextures = ["Acoustic/Organic", "Clean & Polished", "Hybrid", "Minimalist"];
  } else if (isReggae) {
    allowedTempos = ["Slow (60-80)", "Mid-Tempo (90-110)"];
    allowedGrooves = ["Swing", "Shuffle", "Syncopated"];
    allowedTextures = ["Acoustic/Organic", "Clean & Polished", "Hybrid"];
  }

  return {
    tempos: allowedTempos,
    grooves: allowedGrooves,
    atmospheres: allowedAtmospheres,
    textures: allowedTextures
  };
};
