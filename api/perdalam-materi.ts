import dns from 'dns';
import net from 'net';
import { GoogleGenAI } from '@google/genai';

dns.setDefaultResultOrder('ipv4first');
if (typeof net.setDefaultAutoSelectFamily === 'function') {
  net.setDefaultAutoSelectFamily(false);
}

export default async function handler(
  req: { method?: string; body?: unknown },
  res: {
    status: (code: number) => { json: (data: unknown) => void };
  }
) {
  if (req.method && req.method !== 'POST') {
    res.status(405).json({ error: 'Metode harus menggunakan POST.' });
    return;
  }

  try {
    const bodyObj =
      typeof req.body === 'string'
        ? JSON.parse(req.body || '{}')
        : (req.body as Record<string, unknown>) || {};

    const topic = typeof bodyObj.topic === 'string' ? bodyObj.topic : '';
    const educationLevel =
      typeof bodyObj.educationLevel === 'string'
        ? bodyObj.educationLevel
        : 'SMA / MA';
    const sectionHeading =
      typeof bodyObj.sectionHeading === 'string' ? bodyObj.sectionHeading : '';
    const currentParagraphs = Array.isArray(bodyObj.currentParagraphs)
      ? bodyObj.currentParagraphs
      : [];

    if (!topic || !sectionHeading) {
      res.status(400).json({ error: 'Topik dan judul sub-bab diperlukan.' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(503).json({
        error: 'MISSING_API_KEY',
        message: 'GEMINI_API_KEY belum terkonfigurasi di server.',
      });
      return;
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: { 'User-Agent': 'aistudio-build' },
        timeout: 25000,
      },
    });

    const candidateModels = [
      'gemini-3.1-flash-lite',
      'gemini-3.8-flash',
      'gemini-flash-latest',
    ];
    let additionalParagraph = '';
    let lastErr: unknown = null;

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: `Topik Utama: "${topic}" (Tingkat: ${educationLevel})
Sub-bab: "${sectionHeading}"
Isi saat ini:
${currentParagraphs.join('\n\n')}

Berikan 1 paragraf tambahan (3-4 kalimat sederhana) yang memberikan penjelasan tambahan atau contoh ilustrasi sederhana agar siswa makin mudah memahami sub-bab ini. Ingat: gunakan bahasa yang ramah siswa, bukan bahasa mahasiswa, dan murni uraian materi.`,
          config: {
            systemInstruction:
              'Anda adalah guru sekolah yang menjelaskan konsep dengan bahasa sederhana, lugas, dan mudah dipahami siswa. Berikan langsung 1 paragraf tambahan tanpa basa-basi.',
          },
        });
        const text = (response.text ?? '').trim();
        if (text) {
          additionalParagraph = text;
          break;
        }
      } catch (err) {
        lastErr = err;
      }
    }

    if (!additionalParagraph) {
      throw lastErr instanceof Error
        ? lastErr
        : new Error('Gagal menambahkan penjelasan sub-bab.');
    }

    res.status(200).json({ additionalParagraph });
  } catch (error: unknown) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : 'Gagal menambahkan penjelasan sub-bab.';
    res.status(500).json({ error: message });
  }
}
