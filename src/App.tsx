/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  Download,
  BookOpen,
  Sliders,
  Check,
  Copy,
  Printer,
  Trash2,
  PlusCircle,
  Loader2,
  AlertCircle,
  FileDown,
  ChevronRight,
  FolderOpen,
  Feather,
} from 'lucide-react';
import {
  DocxFormatConfig,
  EducationLevel,
  PresentationStyle,
  StructuredMateri,
} from './types/materi';
import { INITIAL_MATERI_LIST } from './data/sampleMateri';
import { exportMateriToDocx } from './utils/docxExport';

const EDUCATION_LEVELS: EducationLevel[] = [
  'SD / MI (Kelas 4–6)',
  'SMP / MTs (Kelas 7–9)',
  'SMA / MA (Kelas 10–12)',
  'SMK / Vokasi',
  'Perguruan Tinggi / Umum',
];

const PRESENTATION_STYLES: PresentationStyle[] = [
  'Sederhana & Mudah Dipahami Siswa',
  'Ringkas & Fokus Poin Inti',
  'Langkah demi Langkah (Hitungan / Proses)',
  'Standar Lengkap',
];

const QUICK_TOPIC_PRESETS: {
  topic: string;
  level: EducationLevel;
  style: PresentationStyle;
}[] = [
  {
    topic: 'Jurnal Penyesuaian Akuntansi',
    level: 'SMA / MA (Kelas 10–12)',
    style: 'Sederhana & Mudah Dipahami Siswa',
  },
  {
    topic: 'Fotosintesis',
    level: 'SMP / MTs (Kelas 7–9)',
    style: 'Sederhana & Mudah Dipahami Siswa',
  },
  {
    topic: 'Hukum Newton tentang Gerak',
    level: 'SMP / MTs (Kelas 7–9)',
    style: 'Langkah demi Langkah (Hitungan / Proses)',
  },
  {
    topic: 'Permintaan, Penawaran, dan Harga Keseimbangan',
    level: 'SMA / MA (Kelas 10–12)',
    style: 'Sederhana & Mudah Dipahami Siswa',
  },
  {
    topic: 'Sistem Peredaran Darah Manusia',
    level: 'SD / MI (Kelas 4–6)',
    style: 'Sederhana & Mudah Dipahami Siswa',
  },
  {
    topic: 'Rekonsiliasi Bank Akuntansi',
    level: 'SMK / Vokasi',
    style: 'Langkah demi Langkah (Hitungan / Proses)',
  },
];

const STORAGE_KEY = 'pustaka_ajar_saved_materi_v2';

export default function App() {
  const [materiList, setMateriList] = useState<StructuredMateri[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback to initial list
    }
    return INITIAL_MATERI_LIST;
  });

  const [activeMateriId, setActiveMateriId] = useState<string>(
    () => materiList[0]?.id || INITIAL_MATERI_LIST[0].id
  );

  // Generator form state
  const [topicInput, setTopicInput] = useState<string>('Jurnal Penyesuaian Akuntansi');
  const [educationLevel, setEducationLevel] = useState<EducationLevel>(
    'SMA / MA (Kelas 10–12)'
  );
  const [presentationStyle, setPresentationStyle] = useState<PresentationStyle>(
    'Sederhana & Mudah Dipahami Siswa'
  );
  const [customFocus, setCustomFocus] = useState<string>('');

  // Generation & action status
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isSimplifying, setIsSimplifying] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [expandingSectionIdx, setExpandingSectionIdx] = useState<number | null>(null);
  const [isExportingDocx, setIsExportingDocx] = useState<boolean>(false);
  const [copiedPlainText, setCopiedPlainText] = useState<boolean>(false);
  const [activeSidebarTab, setActiveSidebarTab] = useState<'penyusun' | 'format' | 'riwayat'>('penyusun');
  const [activeDocChapter, setActiveDocChapter] = useState<string>('semua');

  // Word (.docx) & A4 Print Formatting State
  const [docxConfig, setDocxConfig] = useState<DocxFormatConfig>({
    fontFamily: 'Calibri',
    fontSizePt: 11,
    marginPreset: 'standar_3_25',
    lineSpacing: 1.15,
    includeTableOfContentsHeader: true,
    includePageNumbers: true,
    justifyText: true,
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(materiList));
    } catch {
      // Ignore storage quota issues
    }
  }, [materiList]);

  const activeMateri = useMemo(() => {
    return (
      materiList.find((m) => m.id === activeMateriId) ||
      materiList[0] ||
      INITIAL_MATERI_LIST[0]
    );
  }, [materiList, activeMateriId]);

  const documentMetrics = useMemo(() => {
    if (!activeMateri) return { wordCount: 0, sectionCount: 6, exampleCount: 0 };
    const allTextParts: string[] = [
      activeMateri.title,
      activeMateri.pengantar.hookParagraph,
      activeMateri.pengantar.scopeParagraph,
      activeMateri.pengertian.mainDefinition,
      activeMateri.pengertian.terminologyBreakdown,
      activeMateri.pengertian.fundamentalEssence,
      ...activeMateri.poinKunci.map((p) => `${p.subTitle} ${p.explanation} ${p.keyTakeaway || ''}`),
      ...activeMateri.uraianMendalam.map(
        (u) =>
          `${u.heading} ${u.narrativeParagraphs.join(' ')} ${(u.structuredStepsOrBullets || []).join(' ')} ${u.formulaOrRuleBox || ''}`
      ),
      ...activeMateri.contohKonkret.map(
        (c) =>
          `${c.title} ${c.contextScenario} ${c.stepByStepAnalysis.join(' ')} ${c.conclusionResult}`
      ),
      ...activeMateri.kesalahanUmum.map((k) => `${k.misconception} ${k.correction}`),
      ...activeMateri.glosarium.map((g) => `${g.term} ${g.definition}`),
      ...activeMateri.rangkuman,
    ];
    const words = allTextParts
      .join(' ')
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
    return {
      wordCount: words,
      sectionCount: 6,
      exampleCount: activeMateri.contohKonkret.length,
    };
  }, [activeMateri]);

  const postJsonApi = async <T,>(url: string, payload: unknown): Promise<T> => {
    for (let attempt = 0; attempt < 2; attempt++) {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const rawText = await response.text();
      const trimmed = rawText.trim();

      if (trimmed.startsWith('<!doctype') || trimmed.startsWith('<html') || trimmed.startsWith('<')) {
        if (attempt === 0) {
          await new Promise((r) => setTimeout(r, 1500));
          continue;
        }
        throw new Error(
          'Server sedang memuat ulang atau sibuk. Silakan klik tombol sekali lagi.'
        );
      }

      let parsed: Record<string, unknown>;
      try {
        parsed = JSON.parse(trimmed);
      } catch {
        throw new Error(
          'Respons server tidak valid. Silakan coba beberapa saat lagi.'
        );
      }

      if (!response.ok) {
        const errMsg =
          typeof parsed.error === 'string'
            ? parsed.error
            : 'Permintaan ke server gagal diproses.';
        throw new Error(errMsg);
      }

      return parsed as T;
    }

    throw new Error('Gagal menghubungi server.');
  };

  const handleGenerateMateri = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTopic = topicInput.trim();
    if (!trimmedTopic) {
      setErrorMessage('Silakan masukkan topik atau materi pokok terlebih dahulu.');
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const data = await postJsonApi<{ materi: StructuredMateri }>(
        '/api/generate-materi',
        {
          topic: trimmedTopic,
          educationLevel,
          presentationStyle,
          customFocus: customFocus.trim(),
        }
      );

      if (!data.materi) {
        throw new Error(
          'Gagal menyusun uraian materi. Silakan coba kembali.'
        );
      }

      const newMateri: StructuredMateri = {
        ...data.materi,
        id: `materi-${Date.now()}`,
        topicInput: trimmedTopic,
        educationLevel,
        presentationStyle,
        createdAt: new Date().toISOString(),
      };

      setMateriList((prev) => [newMateri, ...prev]);
      setActiveMateriId(newMateri.id);
      setActiveDocChapter('semua');
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Terjadi gangguan jaringan saat menyusun materi.';
      setErrorMessage(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSimplifyCurrentMateri = async () => {
    if (!activeMateri || isSimplifying || isGenerating) return;
    setIsSimplifying(true);
    setErrorMessage(null);

    try {
      const data = await postJsonApi<{ materi: StructuredMateri }>(
        '/api/simplify-materi',
        {
          currentMateri: activeMateri,
        }
      );

      if (!data.materi) {
        throw new Error('Gagal menyederhanakan bahasa materi.');
      }

      const simplifiedMateri: StructuredMateri = {
        ...data.materi,
        id: activeMateri.id,
        topicInput: activeMateri.topicInput,
        educationLevel: activeMateri.educationLevel,
        presentationStyle: 'Sederhana & Mudah Dipahami Siswa',
        createdAt: new Date().toISOString(),
      };

      setMateriList((prev) =>
        prev.map((item) => (item.id === activeMateri.id ? simplifiedMateri : item))
      );
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Gagal menyederhanakan bahasa materi.';
      setErrorMessage(msg);
    } finally {
      setIsSimplifying(false);
    }
  };

  const handleExpandSubSection = async (sectionIdx: number) => {
    if (!activeMateri || expandingSectionIdx !== null) return;
    const targetSection = activeMateri.uraianMendalam[sectionIdx];
    if (!targetSection) return;

    setExpandingSectionIdx(sectionIdx);
    setErrorMessage(null);

    try {
      const data = await postJsonApi<{ additionalParagraph: string }>(
        '/api/expand-section',
        {
          topic: activeMateri.topicInput,
          educationLevel: activeMateri.educationLevel,
          sectionHeading: targetSection.heading,
          currentParagraphs: targetSection.narrativeParagraphs,
        }
      );

      if (!data.additionalParagraph) {
        throw new Error('Gagal menambahkan penjelasan.');
      }

      setMateriList((prev) =>
        prev.map((item) => {
          if (item.id !== activeMateri.id) return item;
          const updatedUraian = item.uraianMendalam.map((sec, idx) =>
            idx === sectionIdx
              ? {
                  ...sec,
                  narrativeParagraphs: [
                    ...sec.narrativeParagraphs,
                    data.additionalParagraph,
                  ],
                }
              : sec
          );
          return {
            ...item,
            uraianMendalam: updatedUraian,
          };
        })
      );
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Gagal menambahkan penjelasan sub-bab.';
      setErrorMessage(msg);
    } finally {
      setExpandingSectionIdx(null);
    }
  };

  const handleDownloadWord = async () => {
    if (!activeMateri || isExportingDocx) return;
    setIsExportingDocx(true);
    try {
      await exportMateriToDocx(activeMateri, docxConfig);
    } catch (err: unknown) {
      console.error('Export docx error:', err);
      setErrorMessage('Gagal mengekspor dokumen Word (.docx).');
    } finally {
      setIsExportingDocx(false);
    }
  };

  const handleCopyPlainText = async () => {
    if (!activeMateri) return;
    const lines: string[] = [
      `${activeMateri.title.toUpperCase()}`,
      `Mata Pelajaran: ${activeMateri.subjectArea} | Tingkat: ${activeMateri.educationLevel}`,
      '',
      activeMateri.pengantar.hookParagraph,
      activeMateri.pengantar.scopeParagraph,
      '',
      '1. PENGERTIAN',
      `Pengertian: ${activeMateri.pengertian.mainDefinition}`,
      `Gambaran Sederhana: ${activeMateri.pengertian.terminologyBreakdown}`,
      `Inti Konsep: ${activeMateri.pengertian.fundamentalEssence}`,
      '',
      '2. POIN-POIN KUNCI',
      ...activeMateri.poinKunci.flatMap((p) => [
        `${p.subTitle}`,
        p.explanation,
        p.keyTakeaway ? `Kata Kunci: ${p.keyTakeaway}` : '',
        '',
      ]),
      '3. PENJELASAN INTI MATERI',
      ...activeMateri.uraianMendalam.flatMap((u) => [
        u.heading,
        ...u.narrativeParagraphs,
        ...(u.structuredStepsOrBullets || []).map((b) => `• ${b}`),
        u.formulaOrRuleBox ? `Rumus / Aturan Penting: ${u.formulaOrRuleBox}` : '',
        '',
      ]),
      '4. CONTOH KONKRET DAN CARA PENYELESAIAN',
      ...activeMateri.contohKonkret.flatMap((c, i) => [
        `${i + 1}. ${c.title}`,
        `Contoh Kasus: ${c.contextScenario}`,
        ...c.stepByStepAnalysis.map((s) => `- ${s}`),
        `Hasil Akhir: ${c.conclusionResult}`,
        '',
      ]),
      '5. CATATAN PENTING & ISTILAH POKOK',
      ...activeMateri.kesalahanUmum.flatMap((k, i) => [
        `Hal yang Sering Keliru ${i + 1}: ${k.misconception}`,
        `Yang Benar: ${k.correction}`,
      ]),
      '',
      '6. RANGKUMAN MATERI',
      ...activeMateri.rangkuman.map((r, i) => `${i + 1}. ${r}`),
    ];

    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setCopiedPlainText(true);
      setTimeout(() => setCopiedPlainText(false), 2500);
    } catch {
      // Ignore clipboard failure
    }
  };

  const handleDeleteMateri = (id: string) => {
    if (materiList.length <= 1) return;
    const filtered = materiList.filter((m) => m.id !== id);
    setMateriList(filtered);
    if (activeMateriId === id && filtered[0]) {
      setActiveMateriId(filtered[0].id);
    }
  };

  const handleSelectQuickPreset = (preset: {
    topic: string;
    level: EducationLevel;
    style: PresentationStyle;
  }) => {
    setTopicInput(preset.topic);
    setEducationLevel(preset.level);
    setPresentationStyle(preset.style);
    const existing = materiList.find(
      (m) => m.topicInput.toLowerCase() === preset.topic.toLowerCase()
    );
    if (existing) {
      setActiveMateriId(existing.id);
    }
  };

  const a4PaperStyle: React.CSSProperties = {
    fontFamily:
      docxConfig.fontFamily === 'Times New Roman'
        ? '"Times New Roman", Times, Georgia, serif'
        : 'Calibri, "Plus Jakarta Sans", -apple-system, sans-serif',
    fontSize: docxConfig.fontSizePt === 12 ? '12pt' : '11pt',
    lineHeight: docxConfig.lineSpacing === 1.5 ? '1.5' : '1.15',
  };

  const marginPaddingClass =
    docxConfig.marginPreset === 'standar_3_25'
      ? 'px-8 sm:px-14 lg:pl-[68px] lg:pr-[56px] py-10 lg:py-[56px]'
      : docxConfig.marginPreset === 'akademik_3_3'
        ? 'px-8 sm:px-14 lg:pl-[68px] lg:pr-[56px] py-12 lg:pt-[68px] lg:pb-[56px]'
        : 'px-8 sm:px-12 lg:px-[56px] py-10 lg:py-[56px]';

  const marginDescriptionText =
    docxConfig.marginPreset === 'standar_3_25'
      ? 'Kiri 3.0 cm · Atas/Kanan/Bawah 2.5 cm'
      : docxConfig.marginPreset === 'akademik_3_3'
        ? 'Atas & Kiri 3.0 cm · Kanan & Bawah 2.5 cm'
        : 'Semua Sisi 2.54 cm (1 Inci)';

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900">
      {/* Top Bar Contract: Strictly 3 zones separated by gap-8 */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 px-6 py-3.5 no-print">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setActiveSidebarTab('penyusun');
            }}
            className="text-xl font-bold tracking-tight text-slate-900 font-display whitespace-nowrap shrink-0"
          >
            PustakaAjar
          </a>

          {/* Zone 2: 4 concise single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <button
              type="button"
              onClick={() => setActiveSidebarTab('penyusun')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeSidebarTab === 'penyusun'
                  ? 'border-blue-700 text-slate-900 font-semibold'
                  : 'border-transparent'
              }`}
            >
              Penyusun Materi
            </button>
            <button
              type="button"
              onClick={() => setActiveSidebarTab('format')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeSidebarTab === 'format'
                  ? 'border-blue-700 text-slate-900 font-semibold'
                  : 'border-transparent'
              }`}
            >
              Pengaturan Kertas A4
            </button>
            <button
              type="button"
              onClick={() => setActiveSidebarTab('riwayat')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeSidebarTab === 'riwayat'
                  ? 'border-blue-700 text-slate-900 font-semibold'
                  : 'border-transparent'
              }`}
            >
              Pustaka Materi ({materiList.length})
            </button>
            <a
              href="#pratinjau-kertas"
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent"
            >
              Lembar Pratinjau
            </a>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={handleDownloadWord}
              disabled={isExportingDocx}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-700 rounded-lg hover:bg-blue-800 active:bg-blue-900 transition-colors disabled:opacity-60 whitespace-nowrap shrink-0 cursor-pointer"
            >
              {isExportingDocx ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>Unduh File Word (.docx)</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Two-Column Editorial Workbench Layout */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Configuration & Material Builder Deck */}
        <aside className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6 no-print">
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="text-xs font-medium text-blue-700 mb-1.5">
              Bahasa Ramah Siswa · Esensi Materi Utuh · Tanpa Modul/RPP
            </div>
            <h1
              className="text-xl font-bold text-slate-900 tracking-tight mb-2"
              style={{ textWrap: 'balance' }}
            >
              Penyusun Uraian Materi Sederhana &amp; Terstruktur
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Menyusun bahan ajar dengan bahasa yang lugas, jernih, dan mudah
              dipahami siswa sekolah (SD, SMP, SMA/SMK) tanpa mengurangi inti
              konsep, rumus, tabel, maupun contoh penyelesaiannya.
            </p>

            {/* Interactive Mode Switcher Tabs */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-lg mt-4">
              <button
                type="button"
                onClick={() => setActiveSidebarTab('penyusun')}
                className={`py-2 px-2.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeSidebarTab === 'penyusun'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Input Topik
              </button>
              <button
                type="button"
                onClick={() => setActiveSidebarTab('format')}
                className={`py-2 px-2.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeSidebarTab === 'format'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Format .docx
              </button>
              <button
                type="button"
                onClick={() => setActiveSidebarTab('riwayat')}
                className={`py-2 px-2.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeSidebarTab === 'riwayat'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pustaka ({materiList.length})
              </button>
            </div>
          </div>

          {/* Tab 1: Penyusun Materi Form */}
          {activeSidebarTab === 'penyusun' && (
            <form
              onSubmit={handleGenerateMateri}
              className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-5"
            >
              <div>
                <label
                  htmlFor="topic-input"
                  className="block text-sm font-semibold text-slate-900 mb-1.5"
                >
                  Topik / Materi Pokok
                </label>
                <input
                  id="topic-input"
                  type="text"
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  placeholder='Misal: "Jurnal Penyesuaian Akuntansi" atau "Fotosintesis"'
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  required
                />

                {/* Quick Example Presets */}
                <div className="mt-2.5">
                  <div className="text-xs text-slate-500 mb-1.5">
                    Contoh topik siap pakai (klik untuk memilih):
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_TOPIC_PRESETS.map((preset) => {
                      const isSelected =
                        topicInput.toLowerCase() === preset.topic.toLowerCase();
                      return (
                        <button
                          key={preset.topic}
                          type="button"
                          onClick={() => handleSelectQuickPreset(preset)}
                          className={`text-left text-xs px-2.5 py-1.5 rounded-md border transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-blue-50 border-blue-600 text-blue-800 font-medium'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {preset.topic}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Tingkat Pendidikan Selector */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-1.5">
                  Tingkat Pendidikan
                </label>
                <div className="grid grid-cols-1 gap-1.5">
                  {EDUCATION_LEVELS.map((level) => {
                    const active = educationLevel === level;
                    return (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setEducationLevel(level)}
                        className={`flex items-center justify-between px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border text-left transition-colors cursor-pointer ${
                          active
                            ? 'bg-blue-50/90 border-blue-700 text-blue-950 font-semibold'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="truncate">{level}</span>
                        {active && (
                          <Check className="w-4 h-4 text-blue-700 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Gaya Penyajian Materi */}
              <div>
                <label
                  htmlFor="presentation-style"
                  className="block text-sm font-semibold text-slate-900 mb-1.5"
                >
                  Gaya Bahasa &amp; Penyajian
                </label>
                <select
                  id="presentation-style"
                  value={presentationStyle}
                  onChange={(e) =>
                    setPresentationStyle(e.target.value as PresentationStyle)
                  }
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {PRESENTATION_STYLES.map((style) => (
                    <option key={style} value={style}>
                      {style}
                    </option>
                  ))}
                </select>
              </div>

              {/* Optional Sub-Topic Focus */}
              <div>
                <label
                  htmlFor="custom-focus"
                  className="block text-sm font-semibold text-slate-900 mb-1"
                >
                  Catatan Fokus Tambahan{' '}
                  <span className="font-normal text-slate-500">(Opsional)</span>
                </label>
                <textarea
                  id="custom-focus"
                  rows={2}
                  value={customFocus}
                  onChange={(e) => setCustomFocus(e.target.value)}
                  placeholder="Contoh: Gunakan angka sederhana pada contoh kasus agar siswa cepat paham..."
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {errorMessage && (
                <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div className="flex-1 leading-relaxed">{errorMessage}</div>
                </div>
              )}

              <button
                type="submit"
                disabled={isGenerating || isSimplifying}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60 cursor-pointer whitespace-nowrap shrink-0"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menyusun Materi Sederhana...</span>
                  </>
                ) : (
                  <>
                    <BookOpen className="w-4 h-4" />
                    <span>Susun Uraian Materi</span>
                  </>
                )}
              </button>

              <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 leading-relaxed">
                Struktur Inti: 1. Pengertian &amp; Gambaran Sederhana · 2.
                Poin-Poin Kunci · 3. Penjelasan Inti &amp; Tabel Ringkasan · 4.
                Contoh Konkret · 5. Catatan Penting · 6. Rangkuman.
              </div>
            </form>
          )}

          {/* Tab 2: Pengaturan Format Cetak Word (.docx) */}
          {activeSidebarTab === 'format' && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-5">
              <div>
                <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-blue-700" />
                  <span>Spesifikasi Dokumen Word (.docx)</span>
                </h2>
                <p className="text-xs text-slate-600">
                  Pengaturan ini diterapkan langsung pada pratinjau kertas A4 di
                  sebelah kanan serta pada file Word (.docx) yang diunduh.
                </p>
              </div>

              {/* Font Family & Size */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-2">
                  Font Profesional &amp; Ukuran Huruf
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setDocxConfig((prev) => ({
                        ...prev,
                        fontFamily: 'Calibri',
                        fontSizePt: 11,
                      }))
                    }
                    className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                      docxConfig.fontFamily === 'Calibri'
                        ? 'bg-blue-50/90 border-blue-700 text-blue-950'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-sm font-semibold">Calibri (11 pt)</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Standar Modern &amp; Bersih
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setDocxConfig((prev) => ({
                        ...prev,
                        fontFamily: 'Times New Roman',
                        fontSizePt: 12,
                      }))
                    }
                    className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                      docxConfig.fontFamily === 'Times New Roman'
                        ? 'bg-blue-50/90 border-blue-700 text-blue-950'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div
                      className="text-sm font-semibold"
                      style={{ fontFamily: '"Times New Roman", serif' }}
                    >
                      Times New Roman (12 pt)
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Standar Akademik Klasik
                    </div>
                  </button>
                </div>
              </div>

              {/* Margin Kertas A4 */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-2">
                  Margin Kertas A4 (210 × 297 mm)
                </label>
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setDocxConfig((prev) => ({
                        ...prev,
                        marginPreset: 'standar_3_25',
                      }))
                    }
                    className={`px-3.5 py-2.5 rounded-lg border text-left transition-colors cursor-pointer ${
                      docxConfig.marginPreset === 'standar_3_25'
                        ? 'bg-blue-50/90 border-blue-700 text-blue-950 font-semibold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-xs sm:text-sm">
                      Standar Bahan Ajar (3 cm / 2.5 cm)
                    </div>
                    <div className="text-xs text-slate-500 font-normal mt-0.5 font-mono-tabular">
                      Kiri 3.0 cm · Atas 2.5 cm · Kanan 2.5 cm · Bawah 2.5 cm
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setDocxConfig((prev) => ({
                        ...prev,
                        marginPreset: 'akademik_3_3',
                      }))
                    }
                    className={`px-3.5 py-2.5 rounded-lg border text-left transition-colors cursor-pointer ${
                      docxConfig.marginPreset === 'akademik_3_3'
                        ? 'bg-blue-50/90 border-blue-700 text-blue-950 font-semibold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-xs sm:text-sm">
                      Margin Atas &amp; Kiri 3 cm
                    </div>
                    <div className="text-xs text-slate-500 font-normal mt-0.5 font-mono-tabular">
                      Atas 3.0 cm · Kiri 3.0 cm · Kanan 2.5 cm · Bawah 2.5 cm
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setDocxConfig((prev) => ({
                        ...prev,
                        marginPreset: 'rata_254',
                      }))
                    }
                    className={`px-3.5 py-2.5 rounded-lg border text-left transition-colors cursor-pointer ${
                      docxConfig.marginPreset === 'rata_254'
                        ? 'bg-blue-50/90 border-blue-700 text-blue-950 font-semibold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-xs sm:text-sm">
                      Margin Normal Rata (2.54 cm)
                    </div>
                    <div className="text-xs text-slate-500 font-normal mt-0.5 font-mono-tabular">
                      Semua Sisi 2.54 cm (1.0 Inci)
                    </div>
                  </button>
                </div>
              </div>

              {/* Line Spacing */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-2">
                  Spasi Antarbaris Paragraf
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setDocxConfig((prev) => ({ ...prev, lineSpacing: 1.15 }))
                    }
                    className={`px-3 py-2.5 rounded-lg border text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                      docxConfig.lineSpacing === 1.15
                        ? 'bg-blue-50/90 border-blue-700 text-blue-950 font-semibold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Spasi 1.15 (Standar)
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setDocxConfig((prev) => ({ ...prev, lineSpacing: 1.5 }))
                    }
                    className={`px-3 py-2.5 rounded-lg border text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                      docxConfig.lineSpacing === 1.5
                        ? 'bg-blue-50/90 border-blue-700 text-blue-950 font-semibold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Spasi 1.5 (Renggang)
                  </button>
                </div>
              </div>

              {/* Additional Print Options */}
              <div className="flex flex-col gap-2.5 pt-2 border-t border-slate-200">
                <label className="flex items-center justify-between text-xs sm:text-sm text-slate-700 cursor-pointer">
                  <span>Perataan Teks Rata Kiri-Kanan (Justify)</span>
                  <input
                    type="checkbox"
                    checked={docxConfig.justifyText}
                    onChange={(e) =>
                      setDocxConfig((prev) => ({
                        ...prev,
                        justifyText: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 accent-blue-700 rounded"
                  />
                </label>

                <label className="flex items-center justify-between text-xs sm:text-sm text-slate-700 cursor-pointer">
                  <span>Sertakan Catatan Atas (Running Header)</span>
                  <input
                    type="checkbox"
                    checked={docxConfig.includeTableOfContentsHeader}
                    onChange={(e) =>
                      setDocxConfig((prev) => ({
                        ...prev,
                        includeTableOfContentsHeader: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 accent-blue-700 rounded"
                  />
                </label>

                <label className="flex items-center justify-between text-xs sm:text-sm text-slate-700 cursor-pointer">
                  <span>Sertakan Nomor Halaman Otomatis di Footer</span>
                  <input
                    type="checkbox"
                    checked={docxConfig.includePageNumbers}
                    onChange={(e) =>
                      setDocxConfig((prev) => ({
                        ...prev,
                        includePageNumbers: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 accent-blue-700 rounded"
                  />
                </label>
              </div>

              <button
                type="button"
                onClick={handleDownloadWord}
                disabled={isExportingDocx}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <FileDown className="w-4 h-4" />
                <span>Unduh File Word (.docx) Sekarang</span>
              </button>
            </div>
          )}

          {/* Tab 3: Riwayat / Pustaka Materi Tersimpan */}
          {activeSidebarTab === 'riwayat' && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-blue-700" />
                  <span>Pustaka Uraian Materi</span>
                </h2>
                <span className="text-xs text-slate-500 font-mono-tabular">
                  {materiList.length} dokumen
                </span>
              </div>

              <div className="flex flex-col divide-y divide-slate-200 border border-slate-200 rounded-lg overflow-hidden">
                {materiList.map((item) => {
                  const isActive = item.id === activeMateri.id;
                  return (
                    <div
                      key={item.id}
                      className={`p-3.5 transition-colors flex items-start justify-between gap-3 ${
                        isActive ? 'bg-blue-50/70' : 'bg-white hover:bg-slate-50'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setActiveMateriId(item.id)}
                        className="flex-1 text-left cursor-pointer"
                      >
                        <div className="text-sm font-semibold text-slate-900 leading-snug">
                          {item.topicInput}
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 mt-1">
                          <span>{item.educationLevel}</span>
                          <span aria-hidden="true">·</span>
                          <span>{item.subjectArea}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono-tabular">
                            {item.estimatedReadingMinutes} mnt baca
                          </span>
                        </div>
                      </button>

                      {materiList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteMateri(item.id)}
                          title="Hapus materi dari daftar"
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </aside>

        {/* Right Column: Live A4 Document Workbench & Preview */}
        <section
          id="pratinjau-kertas"
          className="lg:col-span-7 xl:col-span-8 flex flex-col gap-4"
        >
          {/* Document Action & Specification Bar */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
            <div>
              <div className="text-xs font-semibold text-slate-900">
                Pratinjau Dokumen Siap Cetak (Kertas A4 · Bahasa Ramah Siswa)
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-0.5 font-mono-tabular">
                <span>A4 (210 × 297 mm)</span>
                <span aria-hidden="true">·</span>
                <span>
                  {docxConfig.fontFamily} {docxConfig.fontSizePt}pt
                </span>
                <span aria-hidden="true">·</span>
                <span>Spasi {docxConfig.lineSpacing}</span>
                <span aria-hidden="true">·</span>
                <span>{marginDescriptionText}</span>
                <span aria-hidden="true">·</span>
                <span>{documentMetrics.wordCount} kata</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleSimplifyCurrentMateri}
                disabled={isSimplifying || isGenerating}
                title="Buat kalimat lebih ringkas dan mudah dipahami siswa tanpa mengurangi inti materi"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50"
              >
                {isSimplifying ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Menyederhanakan...</span>
                  </>
                ) : (
                  <>
                    <Feather className="w-3.5 h-3.5" />
                    <span>Sederhanakan Bahasa</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleCopyPlainText}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {copiedPlainText ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Teks</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak / PDF</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadWord}
                disabled={isExportingDocx}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors disabled:opacity-60 whitespace-nowrap shrink-0 cursor-pointer"
              >
                {isExportingDocx ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <FileText className="w-3.5 h-3.5" />
                )}
                <span>Unduh File Word (.docx)</span>
              </button>
            </div>
          </div>

          {/* Interactive Section Filter Bar */}
          <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg overflow-x-auto no-print">
            {[
              { id: 'semua', label: 'Semua Bagian (Utuh)' },
              { id: 'pengertian', label: '1. Pengertian' },
              { id: 'poin-kunci', label: '2. Poin Kunci' },
              { id: 'uraian', label: '3. Penjelasan Inti & Tabel' },
              { id: 'contoh', label: '4. Contoh Konkret' },
              { id: 'rangkuman', label: '5. Catatan & Rangkuman' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveDocChapter(tab.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeDocChapter === tab.id
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Loading State when generating or simplifying */}
          {(isGenerating || isSimplifying) && (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
              <Loader2 className="w-8 h-8 text-blue-700 animate-spin mx-auto mb-3" />
              <div className="text-base font-semibold text-slate-900">
                {isSimplifying
                  ? `Menyederhanakan Bahasa Materi "${activeMateri.topicInput}"...`
                  : `Menyusun Materi Sederhana & Lengkap untuk "${topicInput}"...`}
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Menyusun penjelasan dengan kalimat yang lugas, jernih, dan mudah
                dipahami siswa ({educationLevel}) tanpa menghilangkan esensi
                konsep, rumus, tabel, maupun contoh penyelesaiannya.
              </p>
            </div>
          )}

          {/* A4 Paper Sheet Representation */}
          <article
            style={a4PaperStyle}
            className={`a4-print-sheet bg-white border border-slate-300 shadow-sm rounded-sm mx-auto w-full max-w-[850px] text-slate-900 ${marginPaddingClass}`}
          >
            {/* Running Header (if enabled) */}
            {docxConfig.includeTableOfContentsHeader && (
              <div className="flex items-center justify-between pb-2.5 mb-6 border-b border-slate-200 text-xs text-slate-500">
                <span>Ringkasan &amp; Uraian Materi Pokok</span>
                <span>
                  {activeMateri.topicInput} · {activeMateri.educationLevel}
                </span>
              </div>
            )}

            {/* Document Title Header Block */}
            <header className="pb-4 mb-6 border-b-2 border-slate-900">
              <div className="text-xs font-bold tracking-wider uppercase text-blue-800 mb-1">
                URAIAN MATERI POKOK · {activeMateri.subjectArea}
              </div>
              <h2
                className="text-2xl sm:text-[25px] font-bold text-slate-950 leading-snug mb-2.5"
                style={{ fontFamily: 'inherit', textWrap: 'balance' }}
              >
                {activeMateri.title}
              </h2>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                <span>
                  <strong>Tingkat:</strong> {activeMateri.educationLevel}
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  <strong>Topik:</strong> {activeMateri.topicInput}
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono-tabular">
                  <strong>Waktu Baca:</strong> ±{activeMateri.estimatedReadingMinutes} Menit
                </span>
              </div>
            </header>

            {/* Pengantar Singkat */}
            {activeDocChapter === 'semua' && (
              <section className="mb-6 space-y-2.5">
                <p
                  className={
                    docxConfig.justifyText ? 'text-justify' : 'text-left'
                  }
                >
                  {activeMateri.pengantar.hookParagraph}
                </p>
                <p
                  className={
                    docxConfig.justifyText ? 'text-justify' : 'text-left'
                  }
                >
                  {activeMateri.pengantar.scopeParagraph}
                </p>
              </section>
            )}

            {/* 1. PENGERTIAN */}
            {(activeDocChapter === 'semua' ||
              activeDocChapter === 'pengertian') && (
              <section className="mb-7">
                <h3
                  className="text-base sm:text-lg font-bold uppercase tracking-tight text-slate-950 pb-1.5 mb-3 border-b border-slate-300"
                  style={{ fontFamily: 'inherit' }}
                >
                  1. Pengertian
                </h3>
                <div className="space-y-3">
                  <p
                    className={
                      docxConfig.justifyText ? 'text-justify' : 'text-left'
                    }
                  >
                    <strong>Pengertian: </strong>
                    {activeMateri.pengertian.mainDefinition}
                  </p>
                  <p
                    className={
                      docxConfig.justifyText ? 'text-justify' : 'text-left'
                    }
                  >
                    <strong>Gambaran Sederhana: </strong>
                    {activeMateri.pengertian.terminologyBreakdown}
                  </p>
                  <div className="p-3.5 rounded-md bg-slate-50 border border-slate-200 text-slate-900">
                    <span className="font-bold text-blue-900">
                      Inti Konsep:{' '}
                    </span>
                    <span>{activeMateri.pengertian.fundamentalEssence}</span>
                  </div>
                </div>
              </section>
            )}

            {/* 2. POIN-POIN KUNCI */}
            {(activeDocChapter === 'semua' ||
              activeDocChapter === 'poin-kunci') && (
              <section className="mb-7">
                <h3
                  className="text-base sm:text-lg font-bold uppercase tracking-tight text-slate-950 pb-1.5 mb-3.5 border-b border-slate-300"
                  style={{ fontFamily: 'inherit' }}
                >
                  2. Poin-Poin Kunci
                </h3>
                <div className="space-y-4">
                  {activeMateri.poinKunci.map((item, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <h4
                        className="font-bold text-slate-900"
                        style={{ fontFamily: 'inherit' }}
                      >
                        {item.subTitle}
                      </h4>
                      <p
                        className={
                          docxConfig.justifyText ? 'text-justify' : 'text-left'
                        }
                      >
                        {item.explanation}
                      </p>
                      {item.keyTakeaway && (
                        <div className="px-3 py-2 rounded-md bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800">
                          <strong className="text-slate-900">
                            Kata Kunci:{' '}
                          </strong>
                          {item.keyTakeaway}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 3. PENJELASAN INTI MATERI & TABEL RINGKASAN */}
            {(activeDocChapter === 'semua' || activeDocChapter === 'uraian') && (
              <section className="mb-7">
                <h3
                  className="text-base sm:text-lg font-bold uppercase tracking-tight text-slate-950 pb-1.5 mb-3.5 border-b border-slate-300"
                  style={{ fontFamily: 'inherit' }}
                >
                  3. Penjelasan Inti Materi
                </h3>
                <div className="space-y-5">
                  {activeMateri.uraianMendalam.map((sec, idx) => (
                    <div key={idx} className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <h4
                          className="font-bold text-slate-900"
                          style={{ fontFamily: 'inherit' }}
                        >
                          {sec.heading}
                        </h4>
                        <button
                          type="button"
                          onClick={() => handleExpandSubSection(idx)}
                          disabled={expandingSectionIdx !== null}
                          className="no-print inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50"
                        >
                          {expandingSectionIdx === idx ? (
                            <>
                              <Loader2 className="w-3 h-3 animate-spin" />
                              <span>Menambahkan...</span>
                            </>
                          ) : (
                            <>
                              <PlusCircle className="w-3 h-3" />
                              <span>Tambah Penjelasan</span>
                            </>
                          )}
                        </button>
                      </div>

                      {sec.narrativeParagraphs.map((para, pIdx) => (
                        <p
                          key={pIdx}
                          className={
                            docxConfig.justifyText
                              ? 'text-justify'
                              : 'text-left'
                          }
                        >
                          {para}
                        </p>
                      ))}

                      {sec.structuredStepsOrBullets &&
                        sec.structuredStepsOrBullets.length > 0 && (
                          <ul className="list-disc pl-6 space-y-1">
                            {sec.structuredStepsOrBullets.map((b, bIdx) => (
                              <li
                                key={bIdx}
                                className={
                                  docxConfig.justifyText
                                    ? 'text-justify'
                                    : 'text-left'
                                }
                              >
                                {b}
                              </li>
                            ))}
                          </ul>
                        )}

                      {sec.formulaOrRuleBox &&
                        sec.formulaOrRuleBox.trim() !== '' && (
                          <div className="p-3 rounded-md bg-slate-50 border border-slate-300 font-mono-tabular text-xs sm:text-sm text-slate-900">
                            <span className="font-bold text-blue-900">
                              Rumus / Aturan Penting:{' '}
                            </span>
                            <span>{sec.formulaOrRuleBox}</span>
                          </div>
                        )}
                    </div>
                  ))}

                  {/* Tabel Ringkasan Terintegrasi */}
                  {activeMateri.tabelReferensi &&
                    activeMateri.tabelReferensi.headers.length > 0 && (
                      <div className="pt-2">
                        <div className="mb-1 font-bold text-slate-900">
                          {activeMateri.tabelReferensi.tableTitle}
                        </div>
                        <p className="text-xs sm:text-sm italic text-slate-600 mb-2.5">
                          {activeMateri.tabelReferensi.tableCaption}
                        </p>
                        <div className="overflow-x-auto border border-slate-300 rounded-sm">
                          <table className="w-full border-collapse text-left text-xs sm:text-sm">
                            <thead>
                              <tr className="bg-slate-100 border-b border-slate-300">
                                {activeMateri.tabelReferensi.headers.map(
                                  (header, hIdx) => (
                                    <th
                                      key={hIdx}
                                      className="py-2 px-3 font-bold text-slate-900 border-r border-slate-300 last:border-r-0"
                                    >
                                      {header}
                                    </th>
                                  )
                                )}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                              {activeMateri.tabelReferensi.rows.map(
                                (row, rIdx) => (
                                  <tr
                                    key={rIdx}
                                    className={
                                      rIdx % 2 === 1
                                        ? 'bg-slate-50/70'
                                        : 'bg-white'
                                    }
                                  >
                                    {activeMateri.tabelReferensi.headers.map(
                                      (_, cIdx) => (
                                        <td
                                          key={cIdx}
                                          className="py-2 px-3 text-slate-800 border-r border-slate-200 last:border-r-0 align-top"
                                        >
                                          {row[cIdx] ?? '-'}
                                        </td>
                                      )
                                    )}
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                </div>
              </section>
            )}

            {/* 4. CONTOH KONKRET DAN CARA PENYELESAIAN */}
            {(activeDocChapter === 'semua' || activeDocChapter === 'contoh') && (
              <section className="mb-7">
                <h3
                  className="text-base sm:text-lg font-bold uppercase tracking-tight text-slate-950 pb-1.5 mb-3.5 border-b border-slate-300"
                  style={{ fontFamily: 'inherit' }}
                >
                  4. Contoh Konkret dan Cara Penyelesaian
                </h3>
                <div className="space-y-4">
                  {activeMateri.contohKonkret.map((ex, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-md border border-slate-200 bg-white space-y-2.5"
                    >
                      <h4
                        className="font-bold text-slate-950"
                        style={{ fontFamily: 'inherit' }}
                      >
                        {idx + 1}. {ex.title}
                      </h4>
                      <p
                        className={
                          docxConfig.justifyText ? 'text-justify' : 'text-left'
                        }
                      >
                        <strong>Contoh Kasus: </strong>
                        {ex.contextScenario}
                      </p>
                      <div>
                        <div className="font-semibold text-slate-900 mb-1">
                          Cara Penyelesaian:
                        </div>
                        <ul className="list-disc pl-6 space-y-1">
                          {ex.stepByStepAnalysis.map((step, sIdx) => (
                            <li
                              key={sIdx}
                              className={
                                docxConfig.justifyText
                                  ? 'text-justify'
                                  : 'text-left'
                              }
                            >
                              {step}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-3 rounded bg-slate-50 border border-slate-200 whitespace-pre-line">
                        <strong className="text-blue-900">Hasil Akhir: </strong>
                        {ex.conclusionResult}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 5. CATATAN PENTING & 6. RANGKUMAN MATERI */}
            {(activeDocChapter === 'semua' ||
              activeDocChapter === 'rangkuman') && (
              <>
                {((activeMateri.kesalahanUmum &&
                  activeMateri.kesalahanUmum.length > 0) ||
                  (activeMateri.glosarium &&
                    activeMateri.glosarium.length > 0)) && (
                  <section className="mb-7">
                    <h3
                      className="text-base sm:text-lg font-bold uppercase tracking-tight text-slate-950 pb-1.5 mb-3.5 border-b border-slate-300"
                      style={{ fontFamily: 'inherit' }}
                    >
                      5. Catatan Penting &amp; Istilah Pokok
                    </h3>

                    {activeMateri.kesalahanUmum &&
                      activeMateri.kesalahanUmum.length > 0 && (
                        <div className="space-y-3 mb-4">
                          {activeMateri.kesalahanUmum.map((item, idx) => (
                            <div
                              key={idx}
                              className="p-3 rounded-md border border-slate-200 bg-slate-50/60 space-y-1"
                            >
                              <p
                                className={
                                  docxConfig.justifyText
                                    ? 'text-justify'
                                    : 'text-left'
                                }
                              >
                                <strong className="text-red-800">
                                  Hal yang Sering Keliru:{' '}
                                </strong>
                                {item.misconception}
                              </p>
                              <p
                                className={
                                  docxConfig.justifyText
                                    ? 'text-justify'
                                    : 'text-left'
                                }
                              >
                                <strong className="text-emerald-800">
                                  Yang Benar:{' '}
                                </strong>
                                {item.correction}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                    {activeMateri.glosarium &&
                      activeMateri.glosarium.length > 0 && (
                        <div>
                          <div className="font-bold text-slate-900 mb-2">
                            Daftar Istilah Penting:
                          </div>
                          <dl className="space-y-1.5">
                            {activeMateri.glosarium.map((g, idx) => (
                              <div
                                key={idx}
                                className={
                                  docxConfig.justifyText
                                    ? 'text-justify'
                                    : 'text-left'
                                }
                              >
                                <dt className="inline font-bold text-slate-900">
                                  • {g.term}:{' '}
                                </dt>
                                <dd className="inline text-slate-800">
                                  {g.definition}
                                </dd>
                              </div>
                            ))}
                          </dl>
                        </div>
                      )}
                  </section>
                )}

                <section className="mb-4">
                  <h3
                    className="text-base sm:text-lg font-bold uppercase tracking-tight text-slate-950 pb-1.5 mb-3 border-b border-slate-300"
                    style={{ fontFamily: 'inherit' }}
                  >
                    6. Rangkuman Materi
                  </h3>
                  <ol className="list-decimal pl-5 space-y-1.5">
                    {activeMateri.rangkuman.map((point, idx) => (
                      <li
                        key={idx}
                        className={
                          docxConfig.justifyText ? 'text-justify' : 'text-left'
                        }
                      >
                        {point}
                      </li>
                    ))}
                  </ol>
                </section>
              </>
            )}

            {/* Page Footer Simulation */}
            {docxConfig.includePageNumbers && (
              <footer className="mt-10 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <span>
                  Bahan Ajar Murni · Format Kertas A4 Siap Cetak
                </span>
                <span className="font-mono-tabular">Halaman 1</span>
              </footer>
            )}
          </article>

          {/* Bottom Export Callout Strip */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
            <div className="text-xs sm:text-sm text-slate-700">
              Dokumen Word (<strong>.docx</strong>) diformat otomatis dengan
              kertas <strong>A4</strong>, margin{' '}
              <strong>{marginDescriptionText}</strong>, font{' '}
              <strong>
                {docxConfig.fontFamily} ({docxConfig.fontSizePt} pt)
              </strong>
              , dan spasi <strong>{docxConfig.lineSpacing}</strong>.
            </div>
            <button
              type="button"
              onClick={handleDownloadWord}
              disabled={isExportingDocx}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Unduh File Word (.docx)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
