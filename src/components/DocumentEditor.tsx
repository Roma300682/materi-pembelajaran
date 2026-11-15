import React from 'react';
import {
  Check,
  Download,
  Plus,
  RotateCcw,
  Trash2,
  X,
} from 'lucide-react';
import {
  EducationLevel,
  StructuredMateri,
} from '../types/materi';

interface DocumentEditorProps {
  draft: StructuredMateri;
  educationLevels: EducationLevel[];
  activeDocChapter: string;
  marginPaddingClass: string;
  a4PaperStyle: React.CSSProperties;
  isExportingDocx: boolean;
  onChange: (updated: StructuredMateri) => void;
  onSave: () => void;
  onSaveAndDownload: () => void;
  onCancel: () => void;
  onResetDraft: () => void;
}

const inputClass =
  'w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent';

const textareaClass =
  'w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent leading-relaxed resize-y';

export const DocumentEditor: React.FC<DocumentEditorProps> = ({
  draft,
  educationLevels,
  activeDocChapter,
  marginPaddingClass,
  a4PaperStyle,
  isExportingDocx,
  onChange,
  onSave,
  onSaveAndDownload,
  onCancel,
  onResetDraft,
}) => {
  const updateField = <K extends keyof StructuredMateri>(
    key: K,
    value: StructuredMateri[K]
  ) => {
    onChange({
      ...draft,
      [key]: value,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Editor Sticky Control Bar */}
      <div className="bg-blue-50/90 border border-blue-200 rounded-xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
        <div>
          <div className="text-sm font-bold text-slate-900">
            Mode Edit Dokumen Aktif
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Ubah teks, tambah/hapus poin, atau sesuaikan isi tabel sebelum
            diunduh ke Word (.docx).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onResetDraft}
            title="Kembalikan isi editor ke versi tersimpan terakhir"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Batal</span>
          </button>

          <button
            type="button"
            onClick={onSave}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Simpan Perubahan</span>
          </button>

          <button
            type="button"
            onClick={onSaveAndDownload}
            disabled={isExportingDocx}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors disabled:opacity-60 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Simpan &amp; Unduh .docx</span>
          </button>
        </div>
      </div>

      {/* Editable A4 Paper Sheet */}
      <article
        style={a4PaperStyle}
        className={`bg-white border border-blue-300 shadow-sm rounded-sm mx-auto w-full max-w-[850px] text-slate-900 ${marginPaddingClass}`}
      >
        {/* Header Metadata Editor */}
        <header className="pb-5 mb-6 border-b-2 border-slate-900 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Bidang Studi / Mata Pelajaran
              </label>
              <input
                type="text"
                value={draft.subjectArea}
                onChange={(e) => updateField('subjectArea', e.target.value)}
                className={inputClass}
                placeholder="Contoh: Ekonomi / Akuntansi"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Topik / Materi Pokok
              </label>
              <input
                type="text"
                value={draft.topicInput}
                onChange={(e) => updateField('topicInput', e.target.value)}
                className={inputClass}
                placeholder="Contoh: Jurnal Penyesuaian Akuntansi"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Judul Utama Dokumen
            </label>
            <input
              type="text"
              value={draft.title}
              onChange={(e) => updateField('title', e.target.value)}
              className={`${inputClass} font-bold text-base`}
              placeholder="Judul dokumen bahan ajar"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Tingkat Pendidikan
              </label>
              <select
                value={draft.educationLevel}
                onChange={(e) =>
                  updateField('educationLevel', e.target.value as EducationLevel)
                }
                className={inputClass}
              >
                {educationLevels.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Estimasi Waktu Baca (Menit)
              </label>
              <input
                type="number"
                min={1}
                max={120}
                value={draft.estimatedReadingMinutes}
                onChange={(e) =>
                  updateField(
                    'estimatedReadingMinutes',
                    Math.max(1, Number(e.target.value) || 1)
                  )
                }
                className={`${inputClass} font-mono-tabular`}
              />
            </div>
          </div>
        </header>

        {/* Pengantar */}
        {activeDocChapter === 'semua' && (
          <section className="mb-7 space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-tight text-slate-950 pb-1.5 border-b border-slate-300">
              Pengantar Materi
            </h3>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Paragraf Pembuka
              </label>
              <textarea
                rows={3}
                value={draft.pengantar.hookParagraph}
                onChange={(e) =>
                  updateField('pengantar', {
                    ...draft.pengantar,
                    hookParagraph: e.target.value,
                  })
                }
                className={textareaClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Cakupan Bahasan
              </label>
              <textarea
                rows={2}
                value={draft.pengantar.scopeParagraph}
                onChange={(e) =>
                  updateField('pengantar', {
                    ...draft.pengantar,
                    scopeParagraph: e.target.value,
                  })
                }
                className={textareaClass}
              />
            </div>
          </section>
        )}

        {/* 1. PENGERTIAN */}
        {(activeDocChapter === 'semua' ||
          activeDocChapter === 'pengertian') && (
          <section className="mb-7 space-y-3">
            <h3 className="text-base sm:text-lg font-bold uppercase tracking-tight text-slate-950 pb-1.5 border-b border-slate-300">
              1. Pengertian
            </h3>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Definisi Utama
              </label>
              <textarea
                rows={3}
                value={draft.pengertian.mainDefinition}
                onChange={(e) =>
                  updateField('pengertian', {
                    ...draft.pengertian,
                    mainDefinition: e.target.value,
                  })
                }
                className={textareaClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Gambaran Sederhana / Analogi
              </label>
              <textarea
                rows={3}
                value={draft.pengertian.terminologyBreakdown}
                onChange={(e) =>
                  updateField('pengertian', {
                    ...draft.pengertian,
                    terminologyBreakdown: e.target.value,
                  })
                }
                className={textareaClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Inti Konsep
              </label>
              <textarea
                rows={2}
                value={draft.pengertian.fundamentalEssence}
                onChange={(e) =>
                  updateField('pengertian', {
                    ...draft.pengertian,
                    fundamentalEssence: e.target.value,
                  })
                }
                className={textareaClass}
              />
            </div>
          </section>
        )}

        {/* 2. POIN-POIN KUNCI */}
        {(activeDocChapter === 'semua' ||
          activeDocChapter === 'poin-kunci') && (
          <section className="mb-7 space-y-4">
            <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-slate-300">
              <h3 className="text-base sm:text-lg font-bold uppercase tracking-tight text-slate-950">
                2. Poin-Poin Kunci
              </h3>
              <button
                type="button"
                onClick={() =>
                  updateField('poinKunci', [
                    ...draft.poinKunci,
                    {
                      subTitle: `${draft.poinKunci.length + 1}. Poin Kunci Baru`,
                      explanation: '',
                      keyTakeaway: '',
                    },
                  ])
                }
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Poin</span>
              </button>
            </div>

            <div className="space-y-4">
              {draft.poinKunci.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-500">
                      Poin #{idx + 1}
                    </span>
                    {draft.poinKunci.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          updateField(
                            'poinKunci',
                            draft.poinKunci.filter((_, i) => i !== idx)
                          )
                        }
                        className="inline-flex items-center gap-1 text-xs text-red-700 hover:text-red-800 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Judul Poin
                    </label>
                    <input
                      type="text"
                      value={item.subTitle}
                      onChange={(e) => {
                        const next = [...draft.poinKunci];
                        next[idx] = { ...next[idx], subTitle: e.target.value };
                        updateField('poinKunci', next);
                      }}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Penjelasan
                    </label>
                    <textarea
                      rows={3}
                      value={item.explanation}
                      onChange={(e) => {
                        const next = [...draft.poinKunci];
                        next[idx] = {
                          ...next[idx],
                          explanation: e.target.value,
                        };
                        updateField('poinKunci', next);
                      }}
                      className={textareaClass}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Kata Kunci (Opsional)
                    </label>
                    <input
                      type="text"
                      value={item.keyTakeaway || ''}
                      onChange={(e) => {
                        const next = [...draft.poinKunci];
                        next[idx] = {
                          ...next[idx],
                          keyTakeaway: e.target.value,
                        };
                        updateField('poinKunci', next);
                      }}
                      className={inputClass}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 3. PENJELASAN INTI MATERI & TABEL RINGKASAN */}
        {(activeDocChapter === 'semua' || activeDocChapter === 'uraian') && (
          <section className="mb-7 space-y-5">
            <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-slate-300">
              <h3 className="text-base sm:text-lg font-bold uppercase tracking-tight text-slate-950">
                3. Penjelasan Inti Materi
              </h3>
              <button
                type="button"
                onClick={() =>
                  updateField('uraianMendalam', [
                    ...draft.uraianMendalam,
                    {
                      heading: `Sub-Bab Baru`,
                      narrativeParagraphs: [''],
                      structuredStepsOrBullets: [''],
                      formulaOrRuleBox: '',
                    },
                  ])
                }
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Sub-Bab</span>
              </button>
            </div>

            {draft.uraianMendalam.map((sec, sIdx) => (
              <div
                key={sIdx}
                className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-500">
                    Sub-Bab #{sIdx + 1}
                  </span>
                  {draft.uraianMendalam.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        updateField(
                          'uraianMendalam',
                          draft.uraianMendalam.filter((_, i) => i !== sIdx)
                        )
                      }
                      className="inline-flex items-center gap-1 text-xs text-red-700 hover:text-red-800 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus Sub-Bab</span>
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Judul Sub-Bab
                  </label>
                  <input
                    type="text"
                    value={sec.heading}
                    onChange={(e) => {
                      const next = [...draft.uraianMendalam];
                      next[sIdx] = { ...next[sIdx], heading: e.target.value };
                      updateField('uraianMendalam', next);
                    }}
                    className={`${inputClass} font-semibold`}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-600">
                      Paragraf Penjelasan
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const next = [...draft.uraianMendalam];
                        next[sIdx] = {
                          ...next[sIdx],
                          narrativeParagraphs: [
                            ...next[sIdx].narrativeParagraphs,
                            '',
                          ],
                        };
                        updateField('uraianMendalam', next);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 hover:text-blue-800 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Tambah Paragraf</span>
                    </button>
                  </div>

                  {sec.narrativeParagraphs.map((para, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-2">
                      <textarea
                        rows={3}
                        value={para}
                        onChange={(e) => {
                          const next = [...draft.uraianMendalam];
                          const paras = [...next[sIdx].narrativeParagraphs];
                          paras[pIdx] = e.target.value;
                          next[sIdx] = {
                            ...next[sIdx],
                            narrativeParagraphs: paras,
                          };
                          updateField('uraianMendalam', next);
                        }}
                        className={textareaClass}
                      />
                      {sec.narrativeParagraphs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const next = [...draft.uraianMendalam];
                            next[sIdx] = {
                              ...next[sIdx],
                              narrativeParagraphs: next[
                                sIdx
                              ].narrativeParagraphs.filter(
                                (_, i) => i !== pIdx
                              ),
                            };
                            updateField('uraianMendalam', next);
                          }}
                          title="Hapus paragraf"
                          className="p-2 text-slate-400 hover:text-red-600 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-600">
                      Butir Rincian / Tahapan
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const next = [...draft.uraianMendalam];
                        const bullets = next[sIdx].structuredStepsOrBullets || [];
                        next[sIdx] = {
                          ...next[sIdx],
                          structuredStepsOrBullets: [...bullets, ''],
                        };
                        updateField('uraianMendalam', next);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 hover:text-blue-800 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Tambah Butir</span>
                    </button>
                  </div>

                  {(sec.structuredStepsOrBullets || []).map((bullet, bIdx) => (
                    <div key={bIdx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={bullet}
                        onChange={(e) => {
                          const next = [...draft.uraianMendalam];
                          const bullets = [
                            ...(next[sIdx].structuredStepsOrBullets || []),
                          ];
                          bullets[bIdx] = e.target.value;
                          next[sIdx] = {
                            ...next[sIdx],
                            structuredStepsOrBullets: bullets,
                          };
                          updateField('uraianMendalam', next);
                        }}
                        className={inputClass}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const next = [...draft.uraianMendalam];
                          const bullets = (
                            next[sIdx].structuredStepsOrBullets || []
                          ).filter((_, i) => i !== bIdx);
                          next[sIdx] = {
                            ...next[sIdx],
                            structuredStepsOrBullets: bullets,
                          };
                          updateField('uraianMendalam', next);
                        }}
                        title="Hapus butir"
                        className="p-2 text-slate-400 hover:text-red-600 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Rumus / Aturan Penting (Opsional)
                  </label>
                  <input
                    type="text"
                    value={sec.formulaOrRuleBox || ''}
                    onChange={(e) => {
                      const next = [...draft.uraianMendalam];
                      next[sIdx] = {
                        ...next[sIdx],
                        formulaOrRuleBox: e.target.value,
                      };
                      updateField('uraianMendalam', next);
                    }}
                    placeholder="Kosongkan jika tidak ada rumus khusus"
                    className={`${inputClass} font-mono-tabular`}
                  />
                </div>
              </div>
            ))}

            {/* Editable Table */}
            {draft.tabelReferensi && (
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-700 uppercase">
                    Tabel Ringkasan Materi
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const nextHeaders = [
                          ...draft.tabelReferensi.headers,
                          `Kolom ${draft.tabelReferensi.headers.length + 1}`,
                        ];
                        const nextRows = draft.tabelReferensi.rows.map((r) => [
                          ...r,
                          '',
                        ]);
                        updateField('tabelReferensi', {
                          ...draft.tabelReferensi,
                          headers: nextHeaders,
                          rows: nextRows,
                        });
                      }}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Kolom</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const emptyRow = draft.tabelReferensi.headers.map(
                          () => ''
                        );
                        updateField('tabelReferensi', {
                          ...draft.tabelReferensi,
                          rows: [...draft.tabelReferensi.rows, emptyRow],
                        });
                      }}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Baris</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Judul Tabel
                    </label>
                    <input
                      type="text"
                      value={draft.tabelReferensi.tableTitle}
                      onChange={(e) =>
                        updateField('tabelReferensi', {
                          ...draft.tabelReferensi,
                          tableTitle: e.target.value,
                        })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Keterangan Tabel
                    </label>
                    <input
                      type="text"
                      value={draft.tabelReferensi.tableCaption}
                      onChange={(e) =>
                        updateField('tabelReferensi', {
                          ...draft.tabelReferensi,
                          tableCaption: e.target.value,
                        })
                      }
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="overflow-x-auto border border-slate-300 rounded-md bg-white">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-300">
                        {draft.tabelReferensi.headers.map((header, hIdx) => (
                          <th
                            key={hIdx}
                            className="p-2 border-r border-slate-300 last:border-r-0 min-w-[140px]"
                          >
                            <div className="flex items-center gap-1">
                              <input
                                type="text"
                                value={header}
                                onChange={(e) => {
                                  const nextHeaders = [
                                    ...draft.tabelReferensi.headers,
                                  ];
                                  nextHeaders[hIdx] = e.target.value;
                                  updateField('tabelReferensi', {
                                    ...draft.tabelReferensi,
                                    headers: nextHeaders,
                                  });
                                }}
                                className="w-full px-2 py-1 text-xs font-bold bg-white border border-slate-300 rounded text-slate-900"
                              />
                              {draft.tabelReferensi.headers.length > 2 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const nextHeaders =
                                      draft.tabelReferensi.headers.filter(
                                        (_, i) => i !== hIdx
                                      );
                                    const nextRows =
                                      draft.tabelReferensi.rows.map((r) =>
                                        r.filter((_, i) => i !== hIdx)
                                      );
                                    updateField('tabelReferensi', {
                                      ...draft.tabelReferensi,
                                      headers: nextHeaders,
                                      rows: nextRows,
                                    });
                                  }}
                                  title="Hapus kolom"
                                  className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </th>
                        ))}
                        <th className="p-2 w-10 text-center text-slate-500">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {draft.tabelReferensi.rows.map((row, rIdx) => (
                        <tr key={rIdx}>
                          {draft.tabelReferensi.headers.map((_, cIdx) => (
                            <td
                              key={cIdx}
                              className="p-1.5 border-r border-slate-200 align-top"
                            >
                              <textarea
                                rows={2}
                                value={row[cIdx] ?? ''}
                                onChange={(e) => {
                                  const nextRows =
                                    draft.tabelReferensi.rows.map((r, i) => {
                                      if (i !== rIdx) return r;
                                      const updatedRow =
                                        draft.tabelReferensi.headers.map(
                                          (__, colI) =>
                                            colI === cIdx
                                              ? e.target.value
                                              : r[colI] ?? ''
                                        );
                                      return updatedRow;
                                    });
                                  updateField('tabelReferensi', {
                                    ...draft.tabelReferensi,
                                    rows: nextRows,
                                  });
                                }}
                                className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 resize-y"
                              />
                            </td>
                          ))}
                          <td className="p-1.5 text-center align-middle">
                            {draft.tabelReferensi.rows.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const nextRows =
                                    draft.tabelReferensi.rows.filter(
                                      (_, i) => i !== rIdx
                                    );
                                  updateField('tabelReferensi', {
                                    ...draft.tabelReferensi,
                                    rows: nextRows,
                                  });
                                }}
                                title="Hapus baris"
                                className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        )}

        {/* 4. CONTOH KONKRET */}
        {(activeDocChapter === 'semua' || activeDocChapter === 'contoh') && (
          <section className="mb-7 space-y-4">
            <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-slate-300">
              <h3 className="text-base sm:text-lg font-bold uppercase tracking-tight text-slate-950">
                4. Contoh Konkret dan Cara Penyelesaian
              </h3>
              <button
                type="button"
                onClick={() =>
                  updateField('contohKonkret', [
                    ...draft.contohKonkret,
                    {
                      title: `Contoh Kasus ${draft.contohKonkret.length + 1}`,
                      contextScenario: '',
                      stepByStepAnalysis: [''],
                      conclusionResult: '',
                    },
                  ])
                }
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Contoh</span>
              </button>
            </div>

            {draft.contohKonkret.map((ex, eIdx) => (
              <div
                key={eIdx}
                className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-500">
                    Contoh #{eIdx + 1}
                  </span>
                  {draft.contohKonkret.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        updateField(
                          'contohKonkret',
                          draft.contohKonkret.filter((_, i) => i !== eIdx)
                        )
                      }
                      className="inline-flex items-center gap-1 text-xs text-red-700 hover:text-red-800 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus Contoh</span>
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Judul Contoh
                  </label>
                  <input
                    type="text"
                    value={ex.title}
                    onChange={(e) => {
                      const next = [...draft.contohKonkret];
                      next[eIdx] = { ...next[eIdx], title: e.target.value };
                      updateField('contohKonkret', next);
                    }}
                    className={`${inputClass} font-semibold`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Skenario / Soal Kasus
                  </label>
                  <textarea
                    rows={3}
                    value={ex.contextScenario}
                    onChange={(e) => {
                      const next = [...draft.contohKonkret];
                      next[eIdx] = {
                        ...next[eIdx],
                        contextScenario: e.target.value,
                      };
                      updateField('contohKonkret', next);
                    }}
                    className={textareaClass}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-600">
                      Langkah Penyelesaian
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const next = [...draft.contohKonkret];
                        next[eIdx] = {
                          ...next[eIdx],
                          stepByStepAnalysis: [
                            ...next[eIdx].stepByStepAnalysis,
                            '',
                          ],
                        };
                        updateField('contohKonkret', next);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 hover:text-blue-800 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Tambah Langkah</span>
                    </button>
                  </div>

                  {ex.stepByStepAnalysis.map((step, stIdx) => (
                    <div key={stIdx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={step}
                        onChange={(e) => {
                          const next = [...draft.contohKonkret];
                          const steps = [...next[eIdx].stepByStepAnalysis];
                          steps[stIdx] = e.target.value;
                          next[eIdx] = {
                            ...next[eIdx],
                            stepByStepAnalysis: steps,
                          };
                          updateField('contohKonkret', next);
                        }}
                        className={inputClass}
                      />
                      {ex.stepByStepAnalysis.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const next = [...draft.contohKonkret];
                            next[eIdx] = {
                              ...next[eIdx],
                              stepByStepAnalysis: next[
                                eIdx
                              ].stepByStepAnalysis.filter(
                                (_, i) => i !== stIdx
                              ),
                            };
                            updateField('contohKonkret', next);
                          }}
                          className="p-2 text-slate-400 hover:text-red-600 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Hasil Akhir / Kesimpulan
                  </label>
                  <textarea
                    rows={2}
                    value={ex.conclusionResult}
                    onChange={(e) => {
                      const next = [...draft.contohKonkret];
                      next[eIdx] = {
                        ...next[eIdx],
                        conclusionResult: e.target.value,
                      };
                      updateField('contohKonkret', next);
                    }}
                    className={textareaClass}
                  />
                </div>
              </div>
            ))}
          </section>
        )}

        {/* 5. CATATAN PENTING & 6. RANGKUMAN */}
        {(activeDocChapter === 'semua' ||
          activeDocChapter === 'rangkuman') && (
          <>
            <section className="mb-7 space-y-4">
              <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-slate-300">
                <h3 className="text-base sm:text-lg font-bold uppercase tracking-tight text-slate-950">
                  5. Catatan Penting &amp; Istilah Pokok
                </h3>
                <button
                  type="button"
                  onClick={() =>
                    updateField('kesalahanUmum', [
                      ...draft.kesalahanUmum,
                      { misconception: '', correction: '' },
                    ])
                  }
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Catatan</span>
                </button>
              </div>

              <div className="space-y-3">
                {draft.kesalahanUmum.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500">
                        Catatan #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateField(
                            'kesalahanUmum',
                            draft.kesalahanUmum.filter((_, i) => i !== idx)
                          )
                        }
                        className="inline-flex items-center gap-1 text-xs text-red-700 hover:text-red-800 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-red-800 mb-1">
                        Hal yang Sering Keliru
                      </label>
                      <input
                        type="text"
                        value={item.misconception}
                        onChange={(e) => {
                          const next = [...draft.kesalahanUmum];
                          next[idx] = {
                            ...next[idx],
                            misconception: e.target.value,
                          };
                          updateField('kesalahanUmum', next);
                        }}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-emerald-800 mb-1">
                        Yang Benar
                      </label>
                      <input
                        type="text"
                        value={item.correction}
                        onChange={(e) => {
                          const next = [...draft.kesalahanUmum];
                          next[idx] = {
                            ...next[idx],
                            correction: e.target.value,
                          };
                          updateField('kesalahanUmum', next);
                        }}
                        className={inputClass}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Glosarium */}
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">
                    Daftar Istilah Penting
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      updateField('glosarium', [
                        ...draft.glosarium,
                        { term: '', definition: '' },
                      ])
                    }
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Istilah</span>
                  </button>
                </div>

                {draft.glosarium.map((g, gIdx) => (
                  <div
                    key={gIdx}
                    className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-start"
                  >
                    <input
                      type="text"
                      value={g.term}
                      onChange={(e) => {
                        const next = [...draft.glosarium];
                        next[gIdx] = { ...next[gIdx], term: e.target.value };
                        updateField('glosarium', next);
                      }}
                      placeholder="Istilah"
                      className={`${inputClass} sm:col-span-4 font-semibold`}
                    />
                    <input
                      type="text"
                      value={g.definition}
                      onChange={(e) => {
                        const next = [...draft.glosarium];
                        next[gIdx] = {
                          ...next[gIdx],
                          definition: e.target.value,
                        };
                        updateField('glosarium', next);
                      }}
                      placeholder="Arti sederhana"
                      className={`${inputClass} sm:col-span-7`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        updateField(
                          'glosarium',
                          draft.glosarium.filter((_, i) => i !== gIdx)
                        )
                      }
                      className="sm:col-span-1 p-2 text-slate-400 hover:text-red-600 cursor-pointer justify-self-end"
                      title="Hapus istilah"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* 6. Rangkuman Materi */}
            <section className="mb-2 space-y-3">
              <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-slate-300">
                <h3 className="text-base sm:text-lg font-bold uppercase tracking-tight text-slate-950">
                  6. Rangkuman Materi
                </h3>
                <button
                  type="button"
                  onClick={() => updateField('rangkuman', [...draft.rangkuman, ''])}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Poin</span>
                </button>
              </div>

              <div className="space-y-2">
                {draft.rangkuman.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-xs font-mono-tabular font-semibold text-slate-500 pt-2.5 w-5 shrink-0">
                      {idx + 1}.
                    </span>
                    <textarea
                      rows={2}
                      value={point}
                      onChange={(e) => {
                        const next = [...draft.rangkuman];
                        next[idx] = e.target.value;
                        updateField('rangkuman', next);
                      }}
                      className={textareaClass}
                    />
                    {draft.rangkuman.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          updateField(
                            'rangkuman',
                            draft.rangkuman.filter((_, i) => i !== idx)
                          )
                        }
                        title="Hapus poin rangkuman"
                        className="p-2 text-slate-400 hover:text-red-600 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </article>
    </div>
  );
};
