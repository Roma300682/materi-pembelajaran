import dns from 'dns';
import net from 'net';
import { GoogleGenAI, Type } from '@google/genai';

dns.setDefaultResultOrder('ipv4first');
if (typeof net.setDefaultAutoSelectFamily === 'function') {
  net.setDefaultAutoSelectFamily(false);
}

const MATERI_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    subjectArea: { type: Type.STRING },
    estimatedReadingMinutes: { type: Type.INTEGER },
    pengantar: {
      type: Type.OBJECT,
      properties: {
        hookParagraph: { type: Type.STRING },
        scopeParagraph: { type: Type.STRING },
      },
      required: ['hookParagraph', 'scopeParagraph'],
    },
    pengertian: {
      type: Type.OBJECT,
      properties: {
        mainDefinition: { type: Type.STRING },
        terminologyBreakdown: { type: Type.STRING },
        fundamentalEssence: { type: Type.STRING },
      },
      required: ['mainDefinition', 'terminologyBreakdown', 'fundamentalEssence'],
    },
    poinKunci: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          subTitle: { type: Type.STRING },
          explanation: { type: Type.STRING },
          keyTakeaway: { type: Type.STRING },
        },
        required: ['subTitle', 'explanation', 'keyTakeaway'],
      },
    },
    uraianMendalam: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          heading: { type: Type.STRING },
          narrativeParagraphs: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          structuredStepsOrBullets: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          formulaOrRuleBox: { type: Type.STRING },
        },
        required: [
          'heading',
          'narrativeParagraphs',
          'structuredStepsOrBullets',
          'formulaOrRuleBox',
        ],
      },
    },
    tabelReferensi: {
      type: Type.OBJECT,
      properties: {
        tableTitle: { type: Type.STRING },
        tableCaption: { type: Type.STRING },
        headers: { type: Type.ARRAY, items: { type: Type.STRING } },
        rows: {
          type: Type.ARRAY,
          items: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
      },
      required: ['tableTitle', 'tableCaption', 'headers', 'rows'],
    },
    contohKonkret: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          contextScenario: { type: Type.STRING },
          stepByStepAnalysis: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          conclusionResult: { type: Type.STRING },
        },
        required: [
          'title',
          'contextScenario',
          'stepByStepAnalysis',
          'conclusionResult',
        ],
      },
    },
    kesalahanUmum: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          misconception: { type: Type.STRING },
          correction: { type: Type.STRING },
        },
        required: ['misconception', 'correction'],
      },
    },
    glosarium: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          term: { type: Type.STRING },
          definition: { type: Type.STRING },
        },
        required: ['term', 'definition'],
      },
    },
    rangkuman: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
  },
  required: [
    'title',
    'subjectArea',
    'estimatedReadingMinutes',
    'pengantar',
    'pengertian',
    'poinKunci',
    'uraianMendalam',
    'tabelReferensi',
    'contohKonkret',
    'kesalahanUmum',
    'glosarium',
    'rangkuman',
  ],
};

function cleanJsonString(raw: string): string {
  let cleaned = raw.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  }
  return cleaned.trim();
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

    const currentMateri = bodyObj.currentMateri as
      | { topicInput?: string; educationLevel?: string }
      | undefined;

    if (!currentMateri || !currentMateri.topicInput) {
      res.status(400).json({ error: 'Data materi tidak ditemukan.' });
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
    let parsedMateri: unknown = null;
    let lastErr: unknown = null;

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: `Berikut adalah materi pelajaran tentang "${currentMateri.topicInput}" untuk tingkat "${currentMateri.educationLevel}":
${JSON.stringify(currentMateri)}

Tolong tulis ulang dan SEDERHANAKAN bahasa pada materi di atas agar jauh lebih mudah dipahami oleh siswa sekolah (${currentMateri.educationLevel}), kalimatnya lebih ringkas, lugas, dan menggunakan perumpamaan sehari-hari, NAMUN TIDAK MENGURANGI ESENSI, RUMUS, TABEL, DAN CONTOH HITUNGAN/KASUSNYA.`,
          config: {
            systemInstruction:
              'Anda adalah guru ahli yang menyederhanakan bahan ajar tingkat mahasiswa menjadi bahan ajar sekolah yang jernih, ringkas, mudah dipahami siswa, namun seluruh esensi materi, rumus, tabel, dan langkah contohnya tetap utuh 100%.',
            responseMimeType: 'application/json',
            responseSchema: MATERI_RESPONSE_SCHEMA,
          },
        });
        const text = cleanJsonString(response.text ?? '');
        if (text) {
          parsedMateri = JSON.parse(text);
          break;
        }
      } catch (err) {
        lastErr = err;
      }
    }

    if (!parsedMateri) {
      throw lastErr instanceof Error
        ? lastErr
        : new Error('Gagal menyederhanakan materi.');
    }

    res.status(200).json({ materi: parsedMateri });
  } catch (error: unknown) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : 'Gagal menyederhanakan bahasa materi.';
    res.status(500).json({ error: message });
  }
}
