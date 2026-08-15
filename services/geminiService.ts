import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GenerationResponse } from "../types";

const SYSTEM_INSTRUCTION = `
Anda adalah asisten penulis lagu profesional dan penyair kelas dunia. 
Tugas Anda adalah memodifikasi lirik lagu yang diberikan pengguna agar sesuai dengan "Prompt Style" tertentu.

Panduan:
1. Pertahankan inti makna dari lirik asli.
2. Ubah gaya bahasa, diksi, dan alur agar sangat sesuai dengan gaya yang diminta.
3. Perbaiki ritme dan rima agar enak dinyanyikan.
4. Sertakan struktur lagu (misalnya: [Verse 1], [Chorus], [Bridge]) dalam hasil modifikasi.
5. FORMATTING: Sangat penting untuk menggunakan karakter newline (\n) untuk memisahkan setiap baris lirik. Berikan dua kali newline (\n\n) antar bait (Verse/Chorus). Jangan gunakan markdown bold (**) untuk header struktur.
6. Buatlah JUDUL yang singkat, puitis, dan sangat merepresentasikan hasil modifikasi tersebut.
7. TERJEMAHAN ENGLISH: Sertakan terjemahan bahasa Inggris dari lirik yang SUDAH DIMODIFIKASI. Pertahankan makna dan nuansa puitisnya.
8. TERJEMAHAN JAWA: Sertakan terjemahan/adaptasi lirik yang SUDAH DIMODIFIKASI ke dalam Bahasa Jawa. Gunakan gaya bahasa campuran: dominan Jawa Ngoko tetapi selipkan kosakata Jawa Kromo (Krama Inggil/Madya) untuk nuansa yang lebih puitis atau sopan di bagian tertentu.
9. Output HARUS berupa JSON valid.
`;

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "Judul lagu yang puitis, singkat, dan relevan.",
    },
    modifiedLyrics: {
      type: Type.STRING,
      description: "Lirik hasil modifikasi (Bahasa Indonesia) dengan formatting baris yang rapi. Gunakan \\n untuk ganti baris dan \\n\\n antar bait.",
    },
    englishLyrics: {
      type: Type.STRING,
      description: "Terjemahan bahasa Inggris dari lirik yang SUDAH DIMODIFIKASI. Gunakan format baris yang sama.",
    },
    javaneseLyrics: {
      type: Type.STRING,
      description: "Adaptasi lirik modifikasi ke Bahasa Jawa (Campuran Ngoko & Kromo). Gunakan format baris yang sama.",
    },
  },
  required: ["title", "modifiedLyrics", "englishLyrics", "javaneseLyrics"],
};

export const generateLyrics = async (original: string, style: string): Promise<GenerationResponse> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key tidak ditemukan. Pastikan environment variable API_KEY tersedia.");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const prompt = `
    Lirik Original:
    "${original}"

    Prompt Style (Gaya yang diinginkan):
    "${style}"

    Ubah lirik original di atas menjadi gaya yang diminta.
    Sertakan terjemahan bahasa Inggrisnya.
    Sertakan juga adaptasi ke Bahasa Jawa (campuran Jawa Ngoko dengan beberapa kosakata Jawa Kromo).
    Pastikan format penulisan rapi: gunakan ganti baris (\\n) untuk setiap kalimat, dan spasi (\\n\\n) antar bait (Verse/Chorus).
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        temperature: 0.7, // Creativity balance
      },
    });

    let text = response.text;
    if (!text) {
      throw new Error("Tidak ada respons dari AI.");
    }

    // Clean up potential markdown formatting (```json ... ```)
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const jsonResponse = JSON.parse(text) as GenerationResponse;
    return jsonResponse;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Gagal membuat lirik. Silakan coba lagi.");
  }
};