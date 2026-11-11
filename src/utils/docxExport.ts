import {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  Header,
  HeadingLevel,
  LineRuleType,
  Packer,
  PageNumber,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from 'docx';
import { saveAs } from 'file-saver';
import { DocxFormatConfig, StructuredMateri } from '../types/materi';

// 1 cm = 566.929 twips (~567 twips)
const CM_TO_TWIPS = 567;

// A4 standard dimensions in twips (210mm x 297mm)
const A4_WIDTH_TWIPS = 11906;
const A4_HEIGHT_TWIPS = 16838;

function getMarginsInTwips(preset: DocxFormatConfig['marginPreset']) {
  switch (preset) {
    case 'standar_3_25':
      // Margin Kiri 3 cm, Atas/Kanan/Bawah 2.5 cm
      return {
        top: Math.round(2.5 * CM_TO_TWIPS),
        right: Math.round(2.5 * CM_TO_TWIPS),
        bottom: Math.round(2.5 * CM_TO_TWIPS),
        left: Math.round(3.0 * CM_TO_TWIPS),
      };
    case 'akademik_3_3':
      // Margin Atas & Kiri 3 cm, Kanan & Bawah 2.5 cm
      return {
        top: Math.round(3.0 * CM_TO_TWIPS),
        right: Math.round(2.5 * CM_TO_TWIPS),
        bottom: Math.round(2.5 * CM_TO_TWIPS),
        left: Math.round(3.0 * CM_TO_TWIPS),
      };
    case 'rata_254':
    default:
      // Semua sisi 2.54 cm (1 inch = 1440 twips)
      return {
        top: 1440,
        right: 1440,
        bottom: 1440,
        left: 1440,
      };
  }
}

export async function exportMateriToDocx(
  materi: StructuredMateri,
  config: DocxFormatConfig
): Promise<void> {
  const font = config.fontFamily;
  const bodySizeHalfPt = config.fontSizePt * 2; // 11pt -> 22, 12pt -> 24
  const h1SizeHalfPt = bodySizeHalfPt + 4; // 13pt or 14pt
  const h2SizeHalfPt = bodySizeHalfPt + 2; // 12pt or 13pt
  const titleSizeHalfPt = bodySizeHalfPt + 10; // 16pt or 17pt
  const smallSizeHalfPt = bodySizeHalfPt - 2; // 10pt or 11pt

  // Line spacing in 240ths of a line: 1.15 -> 276, 1.5 -> 360
  const lineSpacingTwips = Math.round(config.lineSpacing * 240);
  const bodyAlignment = config.justifyText
    ? AlignmentType.JUSTIFIED
    : AlignmentType.LEFT;

  const margins = getMarginsInTwips(config.marginPreset);

  const createSectionHeading = (numberStr: string, titleText: string) =>
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: {
        before: 280,
        after: 120,
        line: lineSpacingTwips,
        lineRule: LineRuleType.AUTO,
      },
      border: {
        bottom: {
          color: 'CBD5E1',
          space: 4,
          style: BorderStyle.SINGLE,
          size: 6,
        },
      },
      children: [
        new TextRun({
          text: `${numberStr}. ${titleText.toUpperCase()}`,
          bold: true,
          font,
          size: h1SizeHalfPt,
          color: '0F172A',
        }),
      ],
    });

  const createSubHeading = (text: string) =>
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: {
        before: 200,
        after: 80,
        line: lineSpacingTwips,
        lineRule: LineRuleType.AUTO,
      },
      children: [
        new TextRun({
          text,
          bold: true,
          font,
          size: h2SizeHalfPt,
          color: '1E293B',
        }),
      ],
    });

  const createBodyParagraph = (
    text: string,
    options?: { boldPrefix?: string; italic?: boolean; afterSpacing?: number }
  ) =>
    new Paragraph({
      alignment: bodyAlignment,
      spacing: {
        before: 0,
        after: options?.afterSpacing ?? 120,
        line: lineSpacingTwips,
        lineRule: LineRuleType.AUTO,
      },
      children: [
        ...(options?.boldPrefix
          ? [
              new TextRun({
                text: options.boldPrefix,
                bold: true,
                font,
                size: bodySizeHalfPt,
                color: '0F172A',
              }),
            ]
          : []),
        new TextRun({
          text,
          italics: options?.italic ?? false,
          font,
          size: bodySizeHalfPt,
          color: '1E293B',
        }),
      ],
    });

  const createBulletParagraph = (text: string, boldPrefix?: string) =>
    new Paragraph({
      alignment: bodyAlignment,
      bullet: { level: 0 },
      spacing: {
        before: 30,
        after: 70,
        line: lineSpacingTwips,
        lineRule: LineRuleType.AUTO,
      },
      children: [
        ...(boldPrefix
          ? [
              new TextRun({
                text: `${boldPrefix}: `,
                bold: true,
                font,
                size: bodySizeHalfPt,
                color: '0F172A',
              }),
            ]
          : []),
        new TextRun({
          text,
          font,
          size: bodySizeHalfPt,
          color: '1E293B',
        }),
      ],
    });

  const createCalloutBoxParagraph = (label: string, content: string) =>
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: {
        before: 100,
        after: 140,
        line: lineSpacingTwips,
        lineRule: LineRuleType.AUTO,
      },
      shading: {
        type: ShadingType.CLEAR,
        fill: 'F8FAFC',
      },
      border: {
        top: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1', space: 6 },
        bottom: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1', space: 6 },
        left: { style: BorderStyle.SINGLE, size: 6, color: '1D4ED8', space: 8 },
        right: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1', space: 6 },
      },
      children: [
        new TextRun({
          text: `${label}: `,
          bold: true,
          font,
          size: bodySizeHalfPt,
          color: '1E3A8A',
        }),
        new TextRun({
          text: content,
          font,
          size: bodySizeHalfPt,
          color: '0F172A',
        }),
      ],
    });

  const children: (Paragraph | Table)[] = [];

  // Header Judul Materi (Murni Bahan Ajar)
  children.push(
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { before: 0, after: 40 },
      children: [
        new TextRun({
          text: `RINGKASAN & URAIAN MATERI POKOK  ·  ${materi.subjectArea.toUpperCase()}`,
          bold: true,
          font,
          size: smallSizeHalfPt,
          color: '1D4ED8',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { before: 20, after: 80 },
      children: [
        new TextRun({
          text: materi.title,
          bold: true,
          font,
          size: titleSizeHalfPt,
          color: '0F172A',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { before: 0, after: 200 },
      border: {
        bottom: {
          color: '0F172A',
          space: 6,
          style: BorderStyle.SINGLE,
          size: 10,
        },
      },
      children: [
        new TextRun({
          text: `Tingkat: ${materi.educationLevel}   |   Topik: ${materi.topicInput}`,
          font,
          size: smallSizeHalfPt,
          color: '475569',
        }),
      ],
    })
  );

  // Pengantar Singkat
  children.push(
    createBodyParagraph(materi.pengantar.hookParagraph),
    createBodyParagraph(materi.pengantar.scopeParagraph, { afterSpacing: 160 })
  );

  // 1. Pengertian (Apa Itu?)
  children.push(
    createSectionHeading('1', 'Pengertian'),
    createBodyParagraph(materi.pengertian.mainDefinition, {
      boldPrefix: 'Pengertian: ',
    }),
    createBodyParagraph(materi.pengertian.terminologyBreakdown, {
      boldPrefix: 'Gambaran Sederhana: ',
    }),
    createCalloutBoxParagraph('Inti Konsep', materi.pengertian.fundamentalEssence)
  );

  // 2. Poin-Poin Kunci
  children.push(createSectionHeading('2', 'Poin-Poin Kunci'));
  materi.poinKunci.forEach((item) => {
    children.push(
      createSubHeading(item.subTitle),
      createBodyParagraph(item.explanation),
      ...(item.keyTakeaway
        ? [createCalloutBoxParagraph('Kata Kunci', item.keyTakeaway)]
        : [])
    );
  });

  // 3. Penjelasan Inti & Tabel Ringkasan
  children.push(createSectionHeading('3', 'Penjelasan Inti Materi'));
  materi.uraianMendalam.forEach((sec) => {
    children.push(createSubHeading(sec.heading));
    sec.narrativeParagraphs.forEach((p) => {
      children.push(createBodyParagraph(p));
    });
    if (sec.structuredStepsOrBullets && sec.structuredStepsOrBullets.length > 0) {
      sec.structuredStepsOrBullets.forEach((bullet) => {
        children.push(createBulletParagraph(bullet));
      });
    }
    if (sec.formulaOrRuleBox && sec.formulaOrRuleBox.trim() !== '') {
      children.push(
        createCalloutBoxParagraph('Rumus / Aturan Penting', sec.formulaOrRuleBox)
      );
    }
  });

  // Tabel Ringkasan (di dalam bagian penjelasan inti)
  if (
    materi.tabelReferensi &&
    materi.tabelReferensi.headers &&
    materi.tabelReferensi.headers.length > 0
  ) {
    children.push(
      createSubHeading(materi.tabelReferensi.tableTitle),
      createBodyParagraph(materi.tabelReferensi.tableCaption, {
        italic: true,
        afterSpacing: 100,
      })
    );

    const colCount = materi.tabelReferensi.headers.length;
    const colWidthPct = Math.floor(100 / colCount);

    const headerRow = new TableRow({
      tableHeader: true,
      children: materi.tabelReferensi.headers.map(
        (headerText) =>
          new TableCell({
            width: { size: colWidthPct, type: WidthType.PERCENTAGE },
            shading: {
              type: ShadingType.CLEAR,
              fill: 'E2E8F0',
            },
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
            children: [
              new Paragraph({
                alignment: AlignmentType.LEFT,
                children: [
                  new TextRun({
                    text: headerText,
                    bold: true,
                    font,
                    size: smallSizeHalfPt,
                    color: '0F172A',
                  }),
                ],
              }),
            ],
          })
      ),
    });

    const dataRows = (materi.tabelReferensi.rows || []).map(
      (rowCells, rowIdx) =>
        new TableRow({
          children: materi.tabelReferensi.headers.map((_, colIdx) => {
            const cellText = rowCells[colIdx] ?? '-';
            return new TableCell({
              width: { size: colWidthPct, type: WidthType.PERCENTAGE },
              shading:
                rowIdx % 2 === 1
                  ? { type: ShadingType.CLEAR, fill: 'F8FAFC' }
                  : undefined,
              margins: { top: 80, bottom: 80, left: 100, right: 100 },
              children: [
                new Paragraph({
                  alignment: AlignmentType.LEFT,
                  spacing: {
                    line: lineSpacingTwips,
                    lineRule: LineRuleType.AUTO,
                  },
                  children: [
                    new TextRun({
                      text: cellText,
                      font,
                      size: smallSizeHalfPt,
                      color: '1E293B',
                    }),
                  ],
                }),
              ],
            });
          }),
        })
    );

    children.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [headerRow, ...dataRows],
      }),
      new Paragraph({ spacing: { before: 100, after: 100 }, children: [] })
    );
  }

  // 4. Contoh Konkret & Cara Penyelesaian
  children.push(
    createSectionHeading('4', 'Contoh Konkret dan Cara Penyelesaian')
  );
  materi.contohKonkret.forEach((ex, idx) => {
    children.push(
      createSubHeading(`${idx + 1}. ${ex.title}`),
      createBodyParagraph(ex.contextScenario, {
        boldPrefix: 'Contoh Kasus: ',
      })
    );
    ex.stepByStepAnalysis.forEach((step) => {
      children.push(createBulletParagraph(step));
    });
    children.push(
      createCalloutBoxParagraph('Hasil Akhir', ex.conclusionResult)
    );
  });

  // 5. Catatan Penting (Hal yang Sering Keliru & Istilah Penting)
  if (
    (materi.kesalahanUmum && materi.kesalahanUmum.length > 0) ||
    (materi.glosarium && materi.glosarium.length > 0)
  ) {
    children.push(
      createSectionHeading('5', 'Catatan Penting & Istilah Pokok')
    );

    if (materi.kesalahanUmum && materi.kesalahanUmum.length > 0) {
      materi.kesalahanUmum.forEach((item, idx) => {
        children.push(
          createBodyParagraph(item.misconception, {
            boldPrefix: `Hal yang Sering Keliru ${idx + 1}: `,
            afterSpacing: 40,
          }),
          createBodyParagraph(item.correction, {
            boldPrefix: 'Yang Benar: ',
            afterSpacing: 120,
          })
        );
      });
    }

    if (materi.glosarium && materi.glosarium.length > 0) {
      children.push(createSubHeading('Daftar Istilah Penting'));
      materi.glosarium.forEach((g) => {
        children.push(createBulletParagraph(g.definition, g.term));
      });
    }
  }

  // 6. Rangkuman Materi
  children.push(createSectionHeading('6', 'Rangkuman Materi'));
  materi.rangkuman.forEach((point, idx) => {
    children.push(
      createBodyParagraph(point, {
        boldPrefix: `${idx + 1}. `,
        afterSpacing: 80,
      })
    );
  });

  const doc = new Document({
    creator: 'PustakaAjar — Penyusun Uraian Materi Pokok',
    title: materi.title,
    description: `Uraian Materi: ${materi.topicInput} (${materi.educationLevel})`,
    sections: [
      {
        properties: {
          page: {
            size: {
              width: A4_WIDTH_TWIPS,
              height: A4_HEIGHT_TWIPS,
            },
            margin: margins,
          },
        },
        headers: config.includeTableOfContentsHeader
          ? {
              default: new Header({
                children: [
                  new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    border: {
                      bottom: {
                        color: 'E2E8F0',
                        space: 4,
                        style: BorderStyle.SINGLE,
                        size: 4,
                      },
                    },
                    spacing: { after: 100 },
                    children: [
                      new TextRun({
                        text: `Materi: ${materi.topicInput} (${materi.educationLevel})`,
                        font,
                        size: smallSizeHalfPt - 2,
                        color: '64748B',
                      }),
                    ],
                  }),
                ],
              }),
            }
          : undefined,
        footers: config.includePageNumbers
          ? {
              default: new Footer({
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 100 },
                    children: [
                      new TextRun({
                        text: 'Halaman ',
                        font,
                        size: smallSizeHalfPt - 2,
                        color: '64748B',
                      }),
                      new TextRun({
                        children: [PageNumber.CURRENT],
                        font,
                        size: smallSizeHalfPt - 2,
                        color: '64748B',
                      }),
                      new TextRun({
                        text: ' dari ',
                        font,
                        size: smallSizeHalfPt - 2,
                        color: '64748B',
                      }),
                      new TextRun({
                        children: [PageNumber.TOTAL_PAGES],
                        font,
                        size: smallSizeHalfPt - 2,
                        color: '64748B',
                      }),
                    ],
                  }),
                ],
              }),
            }
          : undefined,
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const safeFilename = materi.topicInput
    .toLowerCase()
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '');
  saveAs(blob, `Materi_${safeFilename || 'Dokumen-A4'}.docx`);
}
