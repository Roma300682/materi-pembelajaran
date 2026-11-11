export type EducationLevel =
  | 'SD / MI (Kelas 4–6)'
  | 'SMP / MTs (Kelas 7–9)'
  | 'SMA / MA (Kelas 10–12)'
  | 'SMK / Vokasi'
  | 'Perguruan Tinggi / Umum';

export type PresentationStyle =
  | 'Sederhana & Mudah Dipahami Siswa'
  | 'Terstruktur, Mendalam & Sangat Lengkap'
  | 'Ringkas & Fokus Poin Inti'
  | 'Langkah demi Langkah (Hitungan / Proses)'
  | 'Standar Lengkap';

export type DocxFontFamily = 'Calibri' | 'Times New Roman';

export type DocxMarginPreset = 'standar_3_25' | 'rata_254' | 'akademik_3_3';

export type DocxLineSpacing = 1.15 | 1.5;

export interface DocxFormatConfig {
  fontFamily: DocxFontFamily;
  fontSizePt: 11 | 12;
  marginPreset: DocxMarginPreset;
  lineSpacing: DocxLineSpacing;
  includeTableOfContentsHeader: boolean;
  includePageNumbers: boolean;
  justifyText: boolean;
}

export interface KeyPointItem {
  subTitle: string;
  explanation: string;
  keyTakeaway?: string;
}

export interface DeepSectionItem {
  heading: string;
  narrativeParagraphs: string[];
  structuredStepsOrBullets?: string[];
  formulaOrRuleBox?: string;
}

export interface ReferenceTableData {
  tableTitle: string;
  tableCaption: string;
  headers: string[];
  rows: string[][];
}

export interface ConcreteExampleItem {
  title: string;
  contextScenario: string;
  stepByStepAnalysis: string[];
  conclusionResult: string;
}

export interface MisconceptionItem {
  misconception: string;
  correction: string;
}

export interface GlossaryItem {
  term: string;
  definition: string;
}

export interface StructuredMateri {
  id: string;
  topicInput: string;
  educationLevel: EducationLevel;
  presentationStyle: PresentationStyle;
  createdAt: string;
  title: string;
  subjectArea: string;
  estimatedReadingMinutes: number;
  pengantar: {
    hookParagraph: string;
    scopeParagraph: string;
  };
  pengertian: {
    mainDefinition: string;
    terminologyBreakdown: string;
    fundamentalEssence: string;
  };
  poinKunci: KeyPointItem[];
  uraianMendalam: DeepSectionItem[];
  tabelReferensi: ReferenceTableData;
  contohKonkret: ConcreteExampleItem[];
  kesalahanUmum: MisconceptionItem[];
  glosarium: GlossaryItem[];
  rangkuman: string[];
}
