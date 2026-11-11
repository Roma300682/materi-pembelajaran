import 'dotenv/config';
import dns from 'dns';
import net from 'net';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

// Force IPv4 first to avoid container IPv6 SYN timeouts when calling Google APIs
dns.setDefaultResultOrder('ipv4first');
if (typeof net.setDefaultAutoSelectFamily === 'function') {
  net.setDefaultAutoSelectFamily(false);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getGenAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY belum terkonfigurasi di environment server.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
      timeout: 25000,
    },
  });
}

function cleanJsonString(raw: string): string {
  let cleaned = raw.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  }
  return cleaned.trim();
}

// Fast & reliable generation with automatic fallback across active models
async function generateJsonWithFallback(params: {
  contents: string;
  systemInstruction: string;
  responseSchema?: unknown;
}) {
  const ai = getGenAIClient();
  const candidateModels = [
    'gemini-3.1-flash-lite',
    'gemini-3.8-flash',
    'gemini-flash-latest',
  ];
  let lastError: unknown = null;

  for (const modelName of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: params.contents,
        config: {
          systemInstruction: params.systemInstruction,
          responseMimeType: 'application/json',
          ...(params.responseSchema ? { responseSchema: params.responseSchema } : {}),
        },
      });
      const text = cleanJsonString(response.text ?? '');
      if (text) {
        const parsed = JSON.parse(text);
        return parsed;
      }
    } catch (err: unknown) {
      lastError = err;
      console.warn(`Model ${modelName} gagal, mencoba model berikutnya...`, err);
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error('Layanan penyusun materi sedang sibuk. Silakan coba lagi.');
}

async function generateTextWithFallback(params: {
  contents: string;
  systemInstruction: string;
}) {
  const ai = getGenAIClient();
  const candidateModels = [
    'gemini-3.1-flash-lite',
    'gemini-3.8-flash',
    'gemini-flash-latest',
  ];
  let lastError: unknown = null;

  for (const modelName of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: params.contents,
        config: {
          systemInstruction: params.systemInstruction,
        },
      });
      const text = (response.text ?? '').trim();
      if (text) {
        return text;
      }
    } catch (err: unknown) {
      lastError = err;
      console.warn(`Model ${modelName} gagal pada teks tambahan...`, err);
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error('Gagal menambahkan penjelasan sub-bab.');
}

const MATERI_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: 'Judul uraian materi yang jelas, sederhana, dan mudah dipahami sesuai topik.',
    },
    subjectArea: {
      type: Type.STRING,
      description: 'Mata pelajaran terkait (misal: Ekonomi / Akuntansi, IPA Biologi, Fisika, Matematika).',
    },
    estimatedReadingMinutes: {
      type: Type.INTEGER,
      description: 'Estimasi waktu baca dalam menit (antara 5 hingga 10 menit).',
    },
    pengantar: {
      type: Type.OBJECT,
      properties: {
        hookParagraph: {
          type: Type.STRING,
          description: 'Paragraf pembuka singkat (2-3 kalimat) dengan contoh situasi sehari-hari yang dekat dengan kehidupan siswa agar langsung paham mengapa materi ini penting.',
        },
        scopeParagraph: {
          type: Type.STRING,
          description: 'Paragraf singkat (2 kalimat) yang menyebutkan apa saja inti bahasan yang akan dipelajari.',
        },
      },
      required: ['hookParagraph', 'scopeParagraph'],
    },
    pengertian: {
      type: Type.OBJECT,
      properties: {
        mainDefinition: {
          type: Type.STRING,
          description: 'Definisi utama yang jelas, lugas, dan langsung ke inti (2-3 kalimat sederhana, tidak berbelit-belit).',
        },
        terminologyBreakdown: {
          type: Type.STRING,
          description: 'Gambaran sederhana atau analogi sehari-hari agar siswa langsung mengerti maksud konsep tersebut tanpa bingung dengan istilah rumit.',
        },
        fundamentalEssence: {
          type: Type.STRING,
          description: '1 kalimat inti konsep atau tujuan paling utama dari materi ini.',
        },
      },
      required: ['mainDefinition', 'terminologyBreakdown', 'fundamentalEssence'],
    },
    poinKunci: {
      type: Type.ARRAY,
      description: '4 poin kunci terpenting yang wajib dipahami siswa. Ditulis dengan kalimat pendek-menengah yang jelas.',
      items: {
        type: Type.OBJECT,
        properties: {
          subTitle: {
            type: Type.STRING,
            description: 'Judul poin kunci (misal: 1. Kapan Jurnal Penyesuaian Dibuat?).',
          },
          explanation: {
            type: Type.STRING,
            description: 'Penjelasan sederhana dan jelas (2-3 kalimat) yang memuat esensi poin tersebut.',
          },
          keyTakeaway: {
            type: Type.STRING,
            description: '1 kalimat kata kunci / cara cepat mengingat poin ini.',
          },
        },
        required: ['subTitle', 'explanation', 'keyTakeaway'],
      },
    },
    uraianMendalam: {
      type: Type.ARRAY,
      description: '2 hingga 3 sub-bab penjelasan inti yang menerangkan cara kerja, tahapan, atau aturan pokok dengan bahasa yang sederhana namun esensinya utuh.',
      items: {
        type: Type.OBJECT,
        properties: {
          heading: {
            type: Type.STRING,
            description: 'Judul sub-bab (misal: A. Cara Menyesuaikan Perlengkapan & Beban Dibayar di Muka).',
          },
          narrativeParagraphs: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: '2 paragraf penjelasan yang runtut, kalimatnya sederhana, mudah dicerna siswa sekolah, namun konsep intinya lengkap.',
          },
          structuredStepsOrBullets: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: '3-4 butir poin rincian aturan, tahapan, atau komponen penting.',
          },
          formulaOrRuleBox: {
            type: Type.STRING,
            description: 'Rumus inti, persamaan reaksi, atau aturan praktis yang wajib diingat (kosongkan string jika tidak ada).',
          },
        },
        required: ['heading', 'narrativeParagraphs', 'structuredStepsOrBullets', 'formulaOrRuleBox'],
      },
    },
    tabelReferensi: {
      type: Type.OBJECT,
      description: 'Tabel ringkas untuk memudahkan siswa melihat perbandingan atau ringkasan aturan dalam sekali baca.',
      properties: {
        tableTitle: {
          type: Type.STRING,
          description: 'Judul tabel ringkasan.',
        },
        tableCaption: {
          type: Type.STRING,
          description: 'Keterangan singkat fungsi tabel (1 kalimat).',
        },
        headers: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: '3 hingga 4 judul kolom tabel.',
        },
        rows: {
          type: Type.ARRAY,
          items: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          description: '4 hingga 6 baris isi tabel yang ringkas dan jelas. Jumlah sel per baris harus sama persis dengan jumlah headers.',
        },
      },
      required: ['tableTitle', 'tableCaption', 'headers', 'rows'],
    },
    contohKonkret: {
      type: Type.ARRAY,
      description: '2 contoh nyata / contoh kasus beserta langkah penyelesaian yang sangat mudah diikuti siswa.',
      items: {
        type: Type.OBJECT,
        properties: {
          title: {
            type: Type.STRING,
            description: 'Judul contoh konkret.',
          },
          contextScenario: {
            type: Type.STRING,
            description: 'Cerita kasus atau soal penerapan sederhana yang dekat dengan keseharian.',
          },
          stepByStepAnalysis: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Langkah-langkah penyelesaian yang ditulis berurutan dan sangat mudah dipahami.',
          },
          conclusionResult: {
            type: Type.STRING,
            description: 'Hasil akhir atau kesimpulan dari contoh tersebut.',
          },
        },
        required: ['title', 'contextScenario', 'stepByStepAnalysis', 'conclusionResult'],
      },
    },
    kesalahanUmum: {
      type: Type.ARRAY,
      description: '2 kekeliruan yang sering dilakukan siswa saat mempelajari materi ini beserta cara benarnya.',
      items: {
        type: Type.OBJECT,
        properties: {
          misconception: {
            type: Type.STRING,
            description: 'Hal yang sering salah dipahami siswa.',
          },
          correction: {
            type: Type.STRING,
            description: 'Cara memahami yang benar dan sederhana.',
          },
        },
        required: ['misconception', 'correction'],
      },
    },
    glosarium: {
      type: Type.ARRAY,
      description: '4 istilah penting dalam materi yang dijelaskan dengan bahasa sehari-hari.',
      items: {
        type: Type.OBJECT,
        properties: {
          term: {
            type: Type.STRING,
            description: 'Istilah penting.',
          },
          definition: {
            type: Type.STRING,
            description: 'Arti istilah dengan bahasa sederhana (1 kalimat).',
          },
        },
        required: ['term', 'definition'],
      },
    },
    rangkuman: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '4 hingga 5 poin rangkuman singkat dan padat yang merangkum seluruh esensi materi.',
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

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '2mb' }));

  const handleSusunMateri: express.RequestHandler = async (req, res) => {
    try {
      const {
        topic,
        educationLevel = 'SMA / MA (Kelas 10–12)',
        presentationStyle = 'Sederhana & Mudah Dipahami Siswa',
        customFocus = '',
      } = req.body || {};

      if (!topic || typeof topic !== 'string' || !topic.trim()) {
        res.status(400).json({
          error: 'Topik / materi pokok wajib diisi.',
        });
        return;
      }

      const isUniversity = String(educationLevel).includes('Perguruan Tinggi');

      const systemInstruction = `Anda adalah Guru & Penyusun Bahan Ajar Terbaik di Indonesia yang ahli menjelaskan materi rumit menjadi SEDERHANA, JERNIH, dan MUDAH DIPAHAMI SISWA tanpa mengurangi esensi keilmuannya.

PRINSIP UTAMA PENYUSUNAN MATERI:
1. BAHASA SEDERHANA & TIDAK SEPERTI DIKTAT MAHASISWA:
   ${
     isUniversity
       ? '- Karena tingkat pendidikan adalah Perguruan Tinggi, gunakan bahasa akademik yang tetap lugas dan jelas.'
       : `- Target pembaca adalah siswa sekolah (${educationLevel}). JANGAN gunakan bahasa diktat dosen/mahasiswa yang kaku, berbelit-belit, atau penuh jargon ilmiah berat.
   - Gunakan kalimat pendek-menengah yang langsung ke inti (to-the-point).
   - Jika ada istilah teknis baru, jelaskan artinya secara sederhana di dalam tanda kurung atau gunakan perumpamaan/analogi sehari-hari.`
   }
2. ESENSI MATERI TETAP UTUH 100%:
   - Meskipun bahasanya disederhanakan, JANGAN menghilangkan konsep kunci, rumus penting, aturan dasar, tabel ringkasan, maupun contoh penyelesaian langkah demi langkah. Siswa harus tetap mendapatkan seluruh inti materi secara utuh.
3. FOKUS MURNI URAIAN MATERI (BUKAN MODUL AJAR / RPP):
   - DILARANG KERAS menyertakan Identitas Modul, Nama Penyusun, Alokasi Waktu, Profil Pelajar Pancasila, Capaian Pembelajaran (CP), Tujuan Pembelajaran (TP), Pertanyaan Pemantik, Langkah Kegiatan Guru, ataupun Soal Evaluasi/Kuis.
   - Hasilkan 100% murni teks uraian materi pelajaran (Pengantar, Pengertian & Analogi Sederhana, Poin Kunci, Penjelasan Inti, Tabel Ringkas, Contoh Konkret, Catatan Kekeliruan Umum, Kata Kunci, dan Rangkuman).`;

      const userPrompt = `Susun uraian materi pelajaran dengan bahasa yang sederhana, lugas, dan mudah dipahami siswa tanpa mengurangi esensi materi untuk topik berikut:
- Topik / Materi Pokok: "${topic.trim()}"
- Tingkat Pendidikan: "${educationLevel}"
- Gaya Penyajian: "${presentationStyle}"
${customFocus ? `- Catatan Tambahan: "${String(customFocus).trim()}"` : ''}

Pastikan:
1. Bagian Pengertian memuat definisi yang jelas + gambaran/analogi sederhana sehari-hari.
2. Poin Kunci, Uraian Inti, dan Tabel Ringkasan merangkum aturan/konsep pokok dengan bahasa yang mudah dicerna.
3. Contoh Konkret memberikan kasus nyata dan langkah penyelesaian yang mudah diikuti siswa.
4. Jumlah sel pada setiap baris di tabelReferensi.rows sama persis dengan jumlah kolom pada tabelReferensi.headers.`;

      const parsed = await generateJsonWithFallback({
        contents: userPrompt,
        systemInstruction,
        responseSchema: MATERI_RESPONSE_SCHEMA,
      });

      res.json({
        materi: parsed,
      });
    } catch (error: unknown) {
      console.error('Error menyusun materi:', error);
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'Terjadi kesalahan saat menyusun uraian materi.';
      res.status(500).json({
        error: message,
      });
    }
  };

  const handleRingkasMateri: express.RequestHandler = async (req, res) => {
    try {
      const { currentMateri } = req.body || {};
      if (!currentMateri || !currentMateri.topicInput) {
        res.status(400).json({ error: 'Data materi tidak ditemukan.' });
        return;
      }

      const parsed = await generateJsonWithFallback({
        contents: `Berikut adalah materi pelajaran tentang "${currentMateri.topicInput}" untuk tingkat "${currentMateri.educationLevel}":
${JSON.stringify(currentMateri)}

Tolong tulis ulang dan SEDERHANAKAN bahasa pada materi di atas agar jauh lebih mudah dipahami oleh siswa sekolah (${currentMateri.educationLevel}), kalimatnya lebih ringkas, lugas, dan menggunakan perumpamaan sehari-hari, NAMUN TIDAK MENGURANGI ESENSI, RUMUS, TABEL, DAN CONTOH HITUNGAN/KASUSNYA.`,
        systemInstruction:
          'Anda adalah guru ahli yang menyederhanakan bahan ajar tingkat mahasiswa menjadi bahan ajar sekolah yang jernih, ringkas, mudah dipahami siswa, namun seluruh esensi materi, rumus, tabel, dan langkah contohnya tetap utuh 100%.',
        responseSchema: MATERI_RESPONSE_SCHEMA,
      });

      res.json({
        materi: parsed,
      });
    } catch (error: unknown) {
      console.error('Error menyederhanakan materi:', error);
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'Gagal menyederhanakan bahasa materi.';
      res.status(500).json({ error: message });
    }
  };

  const handlePerdalamSubBab: express.RequestHandler = async (req, res) => {
    try {
      const { topic, educationLevel, sectionHeading, currentParagraphs } = req.body || {};
      if (!topic || !sectionHeading) {
        res.status(400).json({ error: 'Topik dan judul sub-bab diperlukan.' });
        return;
      }

      const additionalParagraph = await generateTextWithFallback({
        contents: `Topik Utama: "${topic}" (Tingkat: ${educationLevel || 'SMA / MA'})
Sub-bab: "${sectionHeading}"
Isi saat ini:
${Array.isArray(currentParagraphs) ? currentParagraphs.join('\n\n') : ''}

Berikan 1 paragraf tambahan (3-4 kalimat sederhana) yang memberikan penjelasan tambahan atau contoh ilustrasi sederhana agar siswa makin mudah memahami sub-bab ini. Ingat: gunakan bahasa yang ramah siswa, bukan bahasa mahasiswa, dan murni uraian materi.`,
        systemInstruction:
          'Anda adalah guru sekolah yang menjelaskan konsep dengan bahasa sederhana, lugas, dan mudah dipahami siswa. Berikan langsung 1 paragraf tambahan tanpa basa-basi.',
      });

      res.json({
        additionalParagraph,
      });
    } catch (error: unknown) {
      console.error('Error memperdalam sub-bab:', error);
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'Gagal menambahkan penjelasan sub-bab.';
      res.status(500).json({ error: message });
    }
  };

  // Primary routes (clean Indonesian paths that do not trigger any 'generate' URL regex)
  app.post('/api/penyusun-materi', handleSusunMateri);
  app.post('/api/ringkas-materi', handleRingkasMateri);
  app.post('/api/perdalam-materi', handlePerdalamSubBab);

  // Backward-compatible route aliases
  app.post('/api/generate-materi', handleSusunMateri);
  app.post('/api/simplify-materi', handleRingkasMateri);
  app.post('/api/expand-section', handlePerdalamSubBab);

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server PustakaAjar berjalan pada http://localhost:${PORT}`);
  });
}

startServer();
