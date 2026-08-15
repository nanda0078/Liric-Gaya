export interface LyricResult {
  id: string;
  style: string;
  original: string;
  modified: string;
  english?: string; // Optional for backward compatibility
  javanese?: string; // Optional for backward compatibility
  title: string;
  createdAt: number;
}

export interface GenerationResponse {
  title: string;
  modifiedLyrics: string;
  englishLyrics: string;
  javaneseLyrics: string;
}

export enum GenerationStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export const PRESET_STYLES = [
  "Puitis & Melankolis",
  "Pop Modern (Upbeat)",
  "Rock Alternatif",
  "Rap / Hip Hop",
  "Indie Folk",
  "Balada Romantis",
  "Sastra Klasik Indonesia",
  "Satir / Humor"
];