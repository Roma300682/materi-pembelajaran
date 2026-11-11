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
    setHeader?: (name: string, value: string) => void;
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
        : 'SMA / MA (Kelas 10–12)';
    const presentationStyle =
      typeof bodyObj.presentationStyle === 'string'
        ? bodyObj.presentationStyle
        : 'Sederhana & Mudah Dipahami Siswa';
    const customFocus =
      typeof bodyObj.customFocus === 'string' ? bodyObj.customFocus : '';

    if (!topic.trim()) {
      res.status(400).json({ error: 'Topik / materi pokok wajib diisi.' });
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

    const isUniversity = educationLevel.includes('Perguruan Tinggi');
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
${customFocus ? `- Catatan Tambahan: "${customFocus.trim()}"` : ''}

Pastikan:
1. Bagian Pengertian memuat definisi yang jelas + gambaran/analogi sederhana sehari-hari.
2. Poin Kunci, Uraian Inti, dan Tabel Ringkasan merangkum aturan/konsep pokok dengan bahasa yang mudah dicerna.
3. Contoh Konkret memberikan kasus nyata dan langkah penyelesaian yang mudah diikuti siswa.
4. Jumlah sel pada setiap baris di tabelReferensi.rows sama persis dengan jumlah kolom pada tabelReferensi.headers.`;

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
          contents: userPrompt,
          config: {
            systemInstruction,
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
        : new Error('Gagal menyusun materi dari layanan AI.');
    }

    res.status(200).json({ materi: parsedMateri });
  } catch (error: unknown) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : 'Terjadi kesalahan saat menyusun uraian materi.';
    res.status(500).json({ error: message });
  }
}
