import {
  EducationLevel,
  PresentationStyle,
  StructuredMateri,
} from '../types/materi';
import { INITIAL_MATERI_LIST } from '../data/sampleMateri';

const EXTRA_CURATED_MATERI: Record<string, Omit<StructuredMateri, 'id' | 'createdAt'>> = {
  'hukum newton': {
    topicInput: 'Hukum Newton tentang Gerak',
    educationLevel: 'SMP / MTs (Kelas 7–9)',
    presentationStyle: 'Sederhana & Mudah Dipahami Siswa',
    title: 'Hukum Newton tentang Gerak: Mengapa Benda Diam atau Bergerak?',
    subjectArea: 'Ilmu Pengetahuan Alam (Fisika)',
    estimatedReadingMinutes: 6,
    pengantar: {
      hookParagraph:
        'Pernahkah tubuhmu terdorong ke depan saat mobil atau bus yang kamu tumpangi mengerem mendadak? Atau mengapa mendorong meja kosong terasa jauh lebih ringan daripada mendorong lemari penuh buku?',
      scopeParagraph:
        'Semua kejadian sehari-hari tersebut diatur oleh Hukum Newton tentang Gerak. Materi ini membahas pengertian gaya, bunyi Hukum I, II, dan III Newton, rumus intinya, serta contoh hitungannya dengan cara yang mudah.',
    },
    pengertian: {
      mainDefinition:
        'Hukum Newton tentang Gerak adalah tiga aturan dasar dalam fisika yang ditemukan oleh Sir Isaac Newton untuk menjelaskan hubungan antara gaya (dorongan atau tarikan) yang bekerja pada sebuah benda dengan gerak benda tersebut.',
      terminologyBreakdown:
        'Gambaran Sederhananya: Benda tidak akan berubah geraknya sendiri tanpa ada penyebab. Penyebab benda bergerak, bertambah cepat, melambat, atau berhenti itulah yang disebut Gaya (dilambangkan dengan F dan diukur dalam satuan Newton/N).',
      fundamentalEssence:
        'Inti Konsep: Memahami bagaimana dorongan atau tarikan (Gaya) memengaruhi keadaan diam, percepatan gerak, dan reaksi dari suatu benda.',
    },
    poinKunci: [
      {
        subTitle: '1. Hukum I Newton (Hukum Kelembaman / Inersia)',
        explanation:
          'Benda yang sedang diam akan tetap diam, dan benda yang sedang bergerak lurus beraturan akan tetap bergerak dengan kecepatan tetap, selama tidak ada total gaya luar yang bekerja padanya.',
        keyTakeaway:
          'Rumus: ΣF = 0 (Benda cenderung mempertahankan keadaan awalnya).',
      },
      {
        subTitle: '2. Hukum II Newton (Hubungan Gaya, Massa, dan Percepatan)',
        explanation:
          'Semakin besar gaya dorong yang diberikan pada benda, semakin cepat benda itu bergerak (percepatannya makin besar). Sebaliknya, semakin berat/besar massa benda, semakin sulit benda itu dipercepat.',
        keyTakeaway:
          'Rumus Utama: F = m × a (Gaya = Massa × Percepatan).',
      },
      {
        subTitle: '3. Hukum III Newton (Hukum Aksi - Reaksi)',
        explanation:
          'Jika benda pertama memberikan gaya (aksi) pada benda kedua, maka benda kedua akan membalas dengan gaya (reaksi) yang sama besar tetapi arahnya berlawanan.',
        keyTakeaway:
          'Rumus: F aksi = −F reaksi (Besarnya sama, arahnya berlawanan).',
      },
      {
        subTitle: '4. Satuan yang Wajib Diingat',
        explanation:
          'Dalam perhitungan Hukum Newton, pastikan satuan yang dipakai sudah standar: Gaya (F) dalam Newton (N), Massa benda (m) dalam kilogram (kg), dan Percepatan (a) dalam meter per sekon kuadrat (m/s²).',
        keyTakeaway:
          'Jika massa masih dalam gram (g), ubah dulu menjadi kilogram (kg) dengan dibagi 1.000.',
      },
    ],
    uraianMendalam: [
      {
        heading: 'A. Memahami Hukum I dan Hukum II Newton dalam Kehidupan Sehari-hari',
        narrativeParagraphs: [
          'Pada Hukum I Newton, setiap benda memiliki sifat "malas" untuk berubah gerak yang disebut kelembaman (inersia). Itulah sebabnya ketika bus mengerem mendadak, tubuh penumpang terdorong ke depan karena tubuh kita ingin tetap bergerak maju seperti semula.',
          'Pada Hukum II Newton, ketika sebuah benda didorong dengan gaya tertentu (ΣF), benda tersebut akan mengalami percepatan (a). Jika kamu mendorong troli belanja yang kosong, troli langsung melaju cepat. Namun jika troli diisi penuh beras 50 kg, dengan tenaga dorong yang sama, troli bergerak jauh lebih lambat.',
        ],
        structuredStepsOrBullets: [
          'ΣF (Resultan Gaya): Total gaya yang bekerja pada benda (satuan: Newton / N). Jika dua gaya searah dijumlahkan, jika berlawanan arah dikurangkan.',
          'm (Massa Benda): Ukuran banyaknya zat pada benda (satuan: kg).',
          'a (Percepatan): Perubahan kecepatan benda setiap detik (satuan: m/s²).',
        ],
        formulaOrRuleBox:
          'Rumus Hukum II Newton: ΣF = m × a   atau   a = ΣF ÷ m',
      },
      {
        heading: 'B. Memahami Hukum III Newton (Pasangan Aksi dan Reaksi)',
        narrativeParagraphs: [
          'Hukum III Newton menjelaskan bahwa gaya tidak pernah muncul sendirian, melainkan selalu berpasangan sebagai Aksi dan Reaksi. Contoh paling mudah adalah saat kita mendayung perahu atau saat perenang mendorong dinding kolam.',
          'Ketika tangan kita mendayung dan mendorong air ke arah belakang (Gaya Aksi), air akan mendorong dayung dan perahu bergerak maju ke arah depan (Gaya Reaksi). Demikian pula saat roket menyemburkan gas panas ke bawah (aksi), gas tersebut mendorong tubuh roket meluncur naik ke angkasa (reaksi).',
        ],
        structuredStepsOrBullets: [
          'Gaya Aksi dan Reaksi bekerja pada dua benda yang berbeda (misal: dayung mendorong air, air mendorong dayung).',
          'Besar kedua gaya sama persis, hanya arahnya yang saling berlawanan.',
        ],
        formulaOrRuleBox: 'F aksi = −F reaksi (Tanda minus menunjukkan arah berlawanan)',
      },
    ],
    tabelReferensi: {
      tableTitle: 'Tabel Ringkasan Hukum I, II, dan III Newton',
      tableCaption: 'Perbandingan cepat ketiga Hukum Newton beserta rumus dan contohnya.',
      headers: ['Hukum Newton', 'Rumus Inti', 'Ciri Utama', 'Contoh Sehari-hari'],
      rows: [
        [
          'Hukum I Newton (Kelembaman)',
          'ΣF = 0',
          'Benda diam tetap diam, benda bergerak lurus tetap stabil',
          'Tubuh terdorong ke depan saat mobil direm mendadak',
        ],
        [
          'Hukum II Newton (Percepatan)',
          'ΣF = m × a',
          'Ada gaya dorong/tarik yang membuat benda berubah kecepatannya',
          'Mendorong meja ringan lebih cepat daripada mendorong lemari berat',
        ],
        [
          'Hukum III Newton (Aksi-Reaksi)',
          'F aksi = −F reaksi',
          'Ada gaya aksi dan gaya balasan (reaksi) yang berlawanan arah',
          'Mendayung perahu ke belakang membuat perahu maju ke depan',
        ],
      ],
    },
    contohKonkret: [
      {
        title: 'Contoh 1: Menghitung Percepatan Benda (Hukum II Newton)',
        contextScenario:
          'Sebuah kotak kayu bermassa 5 kg berada di atas lantai licin. Budi mendorong kotak tersebut ke kanan dengan gaya sebesar 20 Newton. Berapakah percepatan gerak kotak tersebut?',
        stepByStepAnalysis: [
          '1. Tulis data yang diketahui: Massa (m) = 5 kg, dan Gaya dorong (F) = 20 N.',
          '2. Gunakan rumus Hukum II Newton: a = F ÷ m.',
          '3. Masukkan angkanya: a = 20 N ÷ 5 kg = 4 m/s².',
        ],
        conclusionResult:
          'Hasil Akhir: Kotak kayu tersebut bergerak ke kanan dengan percepatan 4 m/s².',
      },
      {
        title: 'Contoh 2: Dua Gaya Berlawanan Arah pada Satu Benda',
        contextScenario:
          'Sebuah meja bermassa 10 kg didorong oleh Andi ke kanan dengan gaya 50 N, sementara Riko mendorongnya ke kiri dengan gaya 20 N. Berapa percepatan meja dan ke mana arah geraknya?',
        stepByStepAnalysis: [
          '1. Hitung Resultan Gaya (ΣF) karena arahnya berlawanan: ΣF = 50 N (kanan) − 20 N (kiri) = 30 N ke arah kanan.',
          '2. Hitung percepatan (a) dengan membagi Resultan Gaya terhadap massa meja (10 kg).',
          '3. a = ΣF ÷ m = 30 N ÷ 10 kg = 3 m/s².',
        ],
        conclusionResult:
          'Hasil Akhir: Meja bergerak ke arah kanan dengan percepatan 3 m/s².',
      },
    ],
    kesalahanUmum: [
      {
        misconception:
          'Menyamakan Massa (m) dengan Berat (w), padahal keduanya berbeda.',
        correction:
          'Massa satuannya kilogram (kg) dan nilainya tetap di mana saja, sedangkan Berat adalah gaya tarik gravitasi (w = m × g) yang satuannya Newton (N).',
      },
      {
        misconception:
          'Menjumlahkan dua gaya yang saling berlawanan arah.',
        correction:
          'Jika dua gaya bekerja berlawanan arah (misal satu ke kanan dan satu ke kiri), resultan gayanya harus DIKURANGKAN (Gaya besar dikurangi Gaya kecil).',
      },
    ],
    glosarium: [
      {
        term: 'Gaya (Force)',
        definition:
          'Tarikan atau dorongan yang dapat mengubah kecepatan, arah gerak, atau bentuk suatu benda.',
      },
      {
        term: 'Resultan Gaya (ΣF)',
        definition:
          'Total keseluruhan gaya yang bekerja pada sebuah benda setelah memperhitungkan arahnya.',
      },
      {
        term: 'Inersia (Kelembaman)',
        definition:
          'Kecenderungan alami benda untuk mempertahankan kondisi diam atau gerak lurusnya.',
      },
      {
        term: 'Percepatan (a)',
        definition:
          'Bertambahnya kecepatan gerak benda setiap satu detik (satuan: m/s²).',
      },
    ],
    rangkuman: [
      'Hukum I Newton (ΣF = 0) menyatakan benda akan tetap diam atau bergerak lurus stabil jika tidak ada total gaya luar yang bekerja.',
      'Hukum II Newton (ΣF = m × a) menyatakan percepatan gerak benda sebanding dengan gaya yang diberikan dan berbanding terbalik dengan massa benda.',
      'Hukum III Newton (F aksi = −F reaksi) menyatakan setiap gaya aksi selalu menimbulkan gaya reaksi yang sama besar namun berlawanan arah.',
      'Jika ada dua gaya searah maka gayanya dijumlahkan, sedangkan jika berlawanan arah maka gayanya dikurangkan.',
    ],
  },
  permintaan: {
    topicInput: 'Permintaan, Penawaran, dan Harga Keseimbangan',
    educationLevel: 'SMA / MA (Kelas 10–12)',
    presentationStyle: 'Sederhana & Mudah Dipahami Siswa',
    title: 'Permintaan, Penawaran, dan Terbentuknya Harga Keseimbangan Pasar',
    subjectArea: 'Ekonomi',
    estimatedReadingMinutes: 6,
    pengantar: {
      hookParagraph:
        'Saat musim panen raya mangga, jumlah mangga di pasar sangat melimpah sehingga harganya menjadi murah dan banyak pembeli memborongnya. Sebaliknya, ketika cabai sedang langka, harganya melonjak naik dan pembeli mengurangi belanjanya.',
      scopeParagraph:
        'Tarik-menarik antara kemauan pembeli dan penjual di pasar inilah yang dipelajari dalam materi Permintaan (Demand), Penawaran (Supply), dan Harga Keseimbangan (Equilibrium).',
    },
    pengertian: {
      mainDefinition:
        'Permintaan (Demand) adalah jumlah barang atau jasa yang ingin dan mampu dibeli oleh konsumen pada berbagai tingkat harga. Sedangkan Penawaran (Supply) adalah jumlah barang atau jasa yang disediakan oleh penjual untuk dijual pada berbagai tingkat harga.',
      terminologyBreakdown:
        'Gambaran Sederhananya: Saat membahas Permintaan, posisikan dirimu sebagai PEMBELI (ingin harga murah agar bisa beli banyak). Saat membahas Penawaran, posisikan dirimu sebagai PENJUAL/PRODUSEN (semangat menjual lebih banyak ketika harga barang sedang tinggi agar untung besar).',
      fundamentalEssence:
        'Inti Konsep: Pertemuan antara kesepakatan jumlah barang yang diminta pembeli dan yang ditawarkan penjual akan membentuk Harga Keseimbangan Pasar (Qd = Qs).',
    },
    poinKunci: [
      {
        subTitle: '1. Hukum Permintaan (Sudut Pandang Pembeli)',
        explanation:
          'Jika harga suatu barang naik, maka jumlah barang yang diminta pembeli akan turun. Sebaliknya, jika harga barang turun, maka jumlah barang yang diminta akan naik (asumsi faktor lain tetap/ceteris paribus).',
        keyTakeaway:
          'Hubungan Harga (P) dan Permintaan (Qd) berbanding TERBALIK (bertanda negatif).',
      },
      {
        subTitle: '2. Hukum Penawaran (Sudut Pandang Penjual)',
        explanation:
          'Jika harga suatu barang naik, maka jumlah barang yang ditawarkan penjual akan ikut naik. Sebaliknya, jika harga barang turun, jumlah barang yang ditawarkan penjual ikut turun.',
        keyTakeaway:
          'Hubungan Harga (P) dan Penawaran (Qs) berbanding LURUS (bertanda positif).',
      },
      {
        subTitle: '3. Syarat Ceteris Paribus',
        explanation:
          'Hukum permintaan dan penawaran hanya berlaku jika faktor-faktor lain selain harga barang itu sendiri dianggap tidak berubah (seperti pendapatan pembeli, selera, dan biaya produksi tetap).',
        keyTakeaway:
          'Ceteris Paribus artinya "faktor-faktor lain dianggap tetap".',
      },
      {
        subTitle: '4. Harga Keseimbangan (Equilibrium)',
        explanation:
          'Terjadi ketika jumlah barang yang ingin dibeli konsumen sama persis dengan jumlah barang yang ingin dijual produsen pada tingkat harga tertentu.',
        keyTakeaway:
          'Rumus Keseimbangan Pasar: Qd = Qs atau Pd = Ps.',
      },
    ],
    uraianMendalam: [
      {
        heading: 'A. Faktor-Faktor yang Memengaruhi Permintaan dan Penawaran',
        narrativeParagraphs: [
          'Selain harga barang itu sendiri, keputusan pembeli dalam membeli barang dipengaruhi oleh tingkat pendapatan (gaji), selera masyarakat, jumlah penduduk, serta harga barang pengganti (substitusi) seperti kopi dengan teh.',
          'Di sisi penjual, jumlah barang yang ditawarkan sangat dipengaruhi oleh biaya bahan baku produksi, kemajuan mesin/teknologi yang dipakai, pajak, serta harapan harga di masa depan.',
        ],
        structuredStepsOrBullets: [
          'Barang Substitusi (Pengganti): Barang yang bisa saling menggantikan, contohnya beras dengan jagung, atau daging ayam dengan daging sapi.',
          'Barang Komplementer (Pelengkap): Barang yang dipakai bersama-sama, contohnya motor dengan bensin, atau kompor gas dengan tabung elpiji.',
          'Biaya Produksi: Jika biaya bahan baku naik, penawaran penjual akan berkurang.',
        ],
        formulaOrRuleBox:
          'Bentuk Fungsi Permintaan: Qd = a − bP   |   Bentuk Fungsi Penawaran: Qs = −a + bP',
      },
      {
        heading: 'B. Cara Menghitung Titik Keseimbangan Pasar (Equilibrium)',
        narrativeParagraphs: [
          'Untuk mencari berapa harga kesepakatan (P) dan jumlah barang keseimbangan (Q) di pasar, kita cukup menyamakan rumus fungsi permintaan (Qd) dengan rumus fungsi penawaran (Qs).',
          'Setelah nilai harga (P) ditemukan, masukkan kembali angka P tersebut ke salah satu fungsi (boleh ke Qd atau Qs) untuk mendapatkan jumlah barang keseimbangan (Q).',
        ],
        structuredStepsOrBullets: [
          'Langkah 1: Samakan persamaan Qd = Qs.',
          'Langkah 2: Pindahkan suku yang memiliki huruf P ke ruas kiri dan angka biasa ke ruas kanan untuk menemukan Harga Keseimbangan (Pe).',
          'Langkah 3: Substitusikan nilai Pe ke rumus Qd untuk mendapatkan Jumlah Keseimbangan (Qe).',
        ],
        formulaOrRuleBox: 'Syarat Keseimbangan Pasar: Qd = Qs',
      },
    ],
    tabelReferensi: {
      tableTitle: 'Tabel Perbandingan Permintaan dan Penawaran',
      tableCaption: 'Ringkasan perbedaan utama antara Permintaan (Demand) dan Penawaran (Supply).',
      headers: ['Aspek Pembeda', 'Permintaan (Demand / Qd)', 'Penawaran (Supply / Qs)'],
      rows: [
        [
          'Pelaku Utama',
          'Pembeli / Konsumen',
          'Penjual / Produsen',
        ],
        [
          'Sifat Hubungan dengan Harga',
          'Berbanding terbalik (Harga naik → Permintaan turun)',
          'Berbanding lurus (Harga naik → Penawaran naik)',
        ],
        [
          'Arah Kurva',
          'Menurun dari kiri atas ke kanan bawah (kemiringan negatif)',
          'Menanjak dari kiri bawah ke kanan atas (kemiringan positif)',
        ],
        [
          'Bentuk Persamaan Matematika',
          'Qd = a − bP (angka di depan P bertanda minus)',
          'Qs = −a + bP (angka di depan P bertanda plus)',
        ],
      ],
    },
    contohKonkret: [
      {
        title: 'Contoh 1: Menghitung Harga dan Jumlah Keseimbangan Pasar',
        contextScenario:
          'Di pasar buah, diketahui fungsi permintaan jeruk adalah Qd = 40 − 2P dan fungsi penawarannya adalah Qs = −20 + 4P. Tentukan berapa harga keseimbangan (P) dan jumlah keseimbangan (Q)!',
        stepByStepAnalysis: [
          '1. Gunakan rumus syarat keseimbangan: Qd = Qs.',
          '2. Masukkan kedua fungsi: 40 − 2P = −20 + 4P.',
          '3. Kumpulkan angka di kiri dan huruf P di kanan: 40 + 20 = 4P + 2P → 60 = 6P.',
          '4. Hitung nilai P: P = 60 ÷ 6 = 10.',
          '5. Masukkan P = 10 ke fungsi Qd: Q = 40 − 2(10) = 40 − 20 = 20.',
        ],
        conclusionResult:
          'Hasil Akhir: Harga keseimbangan (Pe) adalah 10 dan jumlah barang keseimbangan (Qe) adalah 20 unit.',
      },
      {
        title: 'Contoh 2: Dampak Kenaikan Harga Barang Pengganti',
        contextScenario:
          'Harga kopi bubuk di pasar tiba-tiba naik dua kali lipat, sedangkan harga teh celup tetap seperti biasa. Apa yang terjadi pada permintaan teh celup?',
        stepByStepAnalysis: [
          '1. Kopi dan teh adalah barang substitusi (saling menggantikan).',
          '2. Karena harga kopi menjadi mahal, sebagian konsumen beralih membeli teh yang harganya lebih terjangkau.',
        ],
        conclusionResult:
          'Hasil Akhir: Permintaan kopi turun, sedangkan permintaan teh celup meningkat meskipun harga teh tidak berubah.',
      },
    ],
    kesalahanUmum: [
      {
        misconception:
          'Tertukar antara sudut pandang pembeli dan penjual saat menghafal hukum penawaran.',
        correction:
          'Ingat selalu: Permintaan = cara berpikir Pembeli (suka harga murah), sedangkan Penawaran = cara berpikir Penjual (semangat jualan saat harga tinggi).',
      },
      {
        misconception:
          'Salah tanda positif/negatif saat memindahkan ruas persamaan Qd = Qs.',
        correction:
          'Saat angka atau variabel pindah melewati tanda sama dengan (=), tandanya wajib berubah (minus menjadi plus, dan plus menjadi minus).',
      },
    ],
    glosarium: [
      {
        term: 'Ceteris Paribus',
        definition:
          'Asumsi bahwa faktor-faktor lain selain harga barang yang sedang dibahas dianggap tetap dan tidak berubah.',
      },
      {
        term: 'Equilibrium (Keseimbangan Pasar)',
        definition:
          'Keadaan saat jumlah barang yang diminta sama dengan jumlah barang yang ditawarkan pada tingkat harga tertentu.',
      },
      {
        term: 'Barang Substitusi',
        definition:
          'Barang pengganti yang memiliki kegunaan serupa (contoh: nasi dengan roti).',
      },
      {
        term: 'Barang Komplementer',
        definition:
          'Barang pelengkap yang harus digunakan bersama barang lain (contoh: sepatu dengan kaus kaki).',
      },
    ],
    rangkuman: [
      'Permintaan dilihat dari sisi pembeli (harga naik → permintaan turun), sedangkan penawaran dilihat dari sisi penjual (harga naik → penawaran naik).',
      'Kurva permintaan bergerak turun dari kiri atas ke kanan bawah, sedangkan kurva penawaran bergerak naik dari kiri bawah ke kanan atas.',
      'Faktor selain harga yang memengaruhi permintaan meliputi pendapatan, selera, jumlah penduduk, dan harga barang lain.',
      'Harga keseimbangan pasar terbentuk pada titik potong kurva permintaan dan penawaran dengan rumus Qd = Qs.',
    ],
  },
};

export function generateLocalFallbackMateri(params: {
  topic: string;
  educationLevel: EducationLevel;
  presentationStyle: PresentationStyle;
  customFocus?: string;
}): StructuredMateri {
  const cleanTopic = params.topic.trim();
  const lower = cleanTopic.toLowerCase();
  const isDeepComprehensive =
    params.presentationStyle === 'Terstruktur, Mendalam & Sangat Lengkap';

  const enrichForDeepStyle = (base: StructuredMateri): StructuredMateri => {
    if (!isDeepComprehensive) return base;
    return {
      ...base,
      estimatedReadingMinutes: Math.max(base.estimatedReadingMinutes + 4, 10),
      poinKunci: [
        ...base.poinKunci,
        {
          subTitle: `${base.poinKunci.length + 1}. Landasan Teoritis & Keterkaitan Antar-Komponen`,
          explanation: `Pembahasan mendalam ${cleanTopic} menuntut pemahaman menyeluruh mengenai bagaimana setiap unsur saling memengaruhi secara sistematis dari kondisi awal hingga hasil akhir.`,
          keyTakeaway: `Pahami hubungan sebab-akibat antar-komponen secara utuh, bukan terpisah-pisah.`,
        },
        {
          subTitle: `${base.poinKunci.length + 2}. Evaluasi Kritis & Standar Ketepatan Penerapan`,
          explanation: `Dalam penerapan tingkat lanjut pada jenjang ${params.educationLevel}, setiap hasil analisis atau perhitungan wajib diverifikasi kembali terhadap kaidah dasar ${cleanTopic}.`,
          keyTakeaway: `Selalu lakukan pemeriksaan silang (cross-check) antara data awal, proses, dan kesimpulan.`,
        },
      ],
      uraianMendalam: [
        ...base.uraianMendalam,
        {
          heading: `C. Analisis Mendalam, Klasifikasi Lengkap & Kasus Khusus pada ${cleanTopic}`,
          narrativeParagraphs: [
            `Pada kajian yang terstruktur dan mendalam, ${cleanTopic} tidak hanya dilihat dari definisi permukaannya saja, melainkan juga dari struktur klasifikasi serta kondisi-kondisi khusus yang memengaruhi cara kerjanya. Setiap perubahan variabel atau data pada tahap awal akan memberikan dampak langsung terhadap hasil akhir.`,
            `Oleh karena itu, pembelajar pada tingkat ${params.educationLevel} perlu menguasai pemetaan konsep secara menyeluruh${params.customFocus ? ` dengan perhatian khusus pada: ${params.customFocus}` : ''}. Pemetaan ini memastikan tidak ada tahapan analisis yang terlewat ketika menghadapi variasi kasus yang lebih kompleks.`,
          ],
          structuredStepsOrBullets: [
            `Klasifikasi Sistematis: Mengelompokkan elemen-elemen ${cleanTopic} berdasarkan fungsi, sifat, dan urutannya.`,
            `Analisis Variabel Penentu: Mengidentifikasi faktor utama yang menyebabkan perubahan hasil pada ${cleanTopic}.`,
            `Penanganan Kasus Kompleks: Menerapkan prosedur bertahap ketika terdapat lebih dari satu kondisi yang berjalan bersamaan.`,
            `Verifikasi & Validasi Akhir: Menguji kesesuaian hasil akhir dengan prinsip fundamental dan tabel referensi.`,
          ],
          formulaOrRuleBox: `Prinsip Kelengkapan Analisis: Identifikasi Menyeluruh → Klasifikasi Komponen → Penerapan Kaidah Sistematis → Verifikasi Hasil`,
        },
      ],
      rangkuman: [
        ...base.rangkuman,
        `Kajian terstruktur dan mendalam atas ${cleanTopic} menghubungkan landasan konsep, mekanisme teknis, tabel klasifikasi, serta pembuktian melalui studi kasus nyata secara utuh.`,
      ],
    };
  };

  // Check if matches initial sample list
  const matchingInitial = INITIAL_MATERI_LIST.find(
    (m) =>
      lower.includes(m.topicInput.toLowerCase()) ||
      m.topicInput.toLowerCase().includes(lower)
  );
  if (matchingInitial) {
    return enrichForDeepStyle({
      ...matchingInitial,
      id: `materi-${Date.now()}`,
      topicInput: cleanTopic,
      educationLevel: params.educationLevel,
      presentationStyle: params.presentationStyle,
      createdAt: new Date().toISOString(),
    });
  }

  // Check extra curated templates
  for (const [key, template] of Object.entries(EXTRA_CURATED_MATERI)) {
    if (lower.includes(key)) {
      return enrichForDeepStyle({
        ...template,
        id: `materi-${Date.now()}`,
        topicInput: cleanTopic,
        educationLevel: params.educationLevel,
        presentationStyle: params.presentationStyle,
        createdAt: new Date().toISOString(),
      });
    }
  }

  // Dynamic structured student-friendly generator for any custom topic
  const dynamicBase: StructuredMateri = {
    id: `materi-${Date.now()}`,
    topicInput: cleanTopic,
    educationLevel: params.educationLevel,
    presentationStyle: params.presentationStyle,
    createdAt: new Date().toISOString(),
    title: `Uraian Materi Pokok: ${cleanTopic}`,
    subjectArea: `Materi Pembelajaran (${params.educationLevel})`,
    estimatedReadingMinutes: 6,
    pengantar: {
      hookParagraph: `Dalam kehidupan sehari-hari maupun kegiatan belajar di tingkat ${params.educationLevel}, memahami konsep "${cleanTopic}" secara tepat sangat membantu kita melihat bagaimana suatu prinsip bekerja dan diterapkan secara nyata.`,
      scopeParagraph: `Uraian materi ini disusun dengan bahasa yang sederhana dan langsung ke inti, mencakup pengertian dasar, poin-poin kunci, penjelasan tahapan/aturan pokok, tabel ringkasan, contoh konkret, hingga rangkuman.`,
    },
    pengertian: {
      mainDefinition: `${cleanTopic} adalah konsep pokok yang menjelaskan pengertian dasar, prinsip kerja, serta aturan utama yang menjadi landasan dalam memahami dan menyelesaikan permasalahan terkait topik ini pada tingkat ${params.educationLevel}.`,
      terminologyBreakdown: `Gambaran Sederhananya: Agar mudah dipahami, bayangkan ${cleanTopic} sebagai seperangkat aturan atau langkah teratur yang menghubungkan penyebab awal dengan hasil akhirnya secara logis dan berurutan.`,
      fundamentalEssence: `Inti Konsep: Memahami pengertian dasar, ciri utama, dan langkah penerapan ${cleanTopic} secara tepat dalam berbagai contoh kasus.`,
    },
    poinKunci: [
      {
        subTitle: `1. Konsep Dasar ${cleanTopic}`,
        explanation: `Hal pertama yang perlu dipahami dari ${cleanTopic} adalah tujuan utamanya serta kondisi kapan konsep ini digunakan.`,
        keyTakeaway: `Kenali ciri khas dan fungsi utama dari ${cleanTopic} sebelum masuk ke langkah teknis.`,
      },
      {
        subTitle: `2. Komponen & Unsur Utama`,
        explanation: `Setiap pembahasan mengenai ${cleanTopic} selalu terdiri atas unsur-unsur pembentuk yang saling berkaitan satu sama lain.`,
        keyTakeaway: `Memahami fungsi tiap unsur akan memudahkan kita saat mengerjakan contoh kasus.`,
      },
      {
        subTitle: `3. Urutan Cara Kerja / Langkah Pokok`,
        explanation: `Penerapan ${cleanTopic} dilakukan secara bertahap mulai dari mengidentifikasi informasi awal, menerapkan aturan/konsep, hingga menarik kesimpulan.`,
        keyTakeaway: `Ikuti urutan langkah dari awal hingga akhir agar tidak ada bagian yang terlewat.`,
      },
      {
        subTitle: `4. Penerapan dalam Kasus Nyata`,
        explanation: `Konsep ${cleanTopic} tidak hanya dihafalkan, tetapi digunakan langsung untuk memecahkan persoalan praktis sesuai jenjang ${params.educationLevel}.`,
        keyTakeaway: `Latih pemahaman dengan mengamati contoh konkret di sekitar kita.`,
      },
    ],
    uraianMendalam: [
      {
        heading: `A. Penjelasan Inti dan Karakteristik ${cleanTopic}`,
        narrativeParagraphs: [
          `Secara sederhana, ${cleanTopic} bekerja dengan cara mengatur hubungan antara data atau kondisi awal dengan proses yang terjadi di dalamnya. Ketika kita mempelajari topik ini di tingkat ${params.educationLevel}, fokus utamanya adalah mengetahui "apa yang terjadi" dan "mengapa hal tersebut terjadi".`,
          `Dengan memahami karakteristik dasarnya, siswa tidak perlu menghafal kalimat yang panjang, melainkan cukup memegang prinsip utamanya${params.customFocus ? ` (khususnya mengenai: ${params.customFocus})` : ''}.`,
        ],
        structuredStepsOrBullets: [
          `Identifikasi Dasar: Mengenali komponen utama yang ada pada ${cleanTopic}.`,
          `Proses / Aturan Pokok: Menerapkan kaidah yang berlaku secara runtut dan teliti.`,
          `Evaluasi Hasil: Memastikan hasil akhir sudah sesuai dengan prinsip dasar ${cleanTopic}.`,
        ],
        formulaOrRuleBox: `Kaidah Pegangan: Data Awal → Proses / Aturan ${cleanTopic} → Hasil Akhir yang Tepat`,
      },
      {
        heading: `B. Langkah-Langkah Penerapan ${cleanTopic} secara Praktis`,
        narrativeParagraphs: [
          `Agar lebih mudah dipraktikkan, pembahasan ${cleanTopic} dapat dibagi menjadi langkah-langkah kecil yang sederhana. Langkah pertama selalu dimulai dengan membaca informasi atau kasus dengan cermat untuk mengetahui data apa saja yang sudah diketahui.`,
          `Selanjutnya, tentukan aturan atau tahapan mana yang paling sesuai untuk menyelesaikan persoalan tersebut, lalu tuliskan langkah penyelesaiannya secara berurutan.`,
        ],
        structuredStepsOrBullets: [
          `Langkah 1: Catat poin-poin atau data penting yang diketahui dari persoalan.`,
          `Langkah 2: Gunakan aturan atau konsep inti ${cleanTopic} yang sesuai.`,
          `Langkah 3: Tarik kesimpulan akhir dengan jelas dan periksa kembali ketelitiannya.`,
        ],
        formulaOrRuleBox: '',
      },
    ],
    tabelReferensi: {
      tableTitle: `Tabel Ringkasan Konsep ${cleanTopic}`,
      tableCaption: `Panduan ringkas untuk memahami bagian-bagian penting dalam materi ${cleanTopic}.`,
      headers: ['Bagian Konsep', 'Penjelasan Singkat', 'Fokus Pemahaman Siswa'],
      rows: [
        [
          'Pengertian Dasar',
          `Makna dan fungsi utama dari ${cleanTopic}`,
          'Memahami apa itu dan mengapa penting dipelajari',
        ],
        [
          'Unsur / Komponen',
          'Bagian-bagian penting yang menyusun materi',
          'Membedakan peran masing-masing komponen',
        ],
        [
          'Mekanisme / Aturan',
          'Cara kerja atau langkah-langkah berurutan',
          'Mengikuti urutan langkah dengan benar',
        ],
        [
          'Penerapan Kasus',
          'Penggunaan konsep pada contoh nyata',
          'Menyelesaikan persoalan dengan tepat',
        ],
      ],
    },
    contohKonkret: [
      {
        title: `Contoh 1: Penerapan Dasar ${cleanTopic}`,
        contextScenario: `Seorang siswa kelas ${params.educationLevel} mengamati contoh penerapan dasar ${cleanTopic} pada kegiatan sehari-hari dan ingin menentukan langkah penyelesaian yang benar.`,
        stepByStepAnalysis: [
          `1. Mengamati dan mencatat informasi utama yang berkaitan dengan ${cleanTopic}.`,
          `2. Menghubungkan informasi tersebut dengan konsep dasar dan aturan pokok yang telah dipelajari.`,
          `3. Menyusun hasil analisis secara berurutan dari tahap awal hingga akhir.`,
        ],
        conclusionResult: `Hasil Akhir: Dengan mengikuti tahapan dasar secara runtut, persoalan terkait ${cleanTopic} dapat dijelaskan dan diselesaikan dengan tepat.`,
      },
      {
        title: `Contoh 2: Analisis Kasus Terapan ${cleanTopic}`,
        contextScenario: `Diberikan sebuah kasus praktik mengenai ${cleanTopic} yang membutuhkan ketelitian dalam membedakan komponen utama dan langkah pengerjaannya.`,
        stepByStepAnalysis: [
          `1. Memisahkan mana informasi yang menjadi syarat awal dan mana yang menjadi tujuan penyelesaian.`,
          `2. Menerapkan kaidah inti ${cleanTopic} sesuai tabel ringkasan materi.`,
        ],
        conclusionResult: `Hasil Akhir: Diperoleh kesimpulan yang akurat dan sesuai dengan kaidah pokok ${cleanTopic}.`,
      },
    ],
    kesalahanUmum: [
      {
        misconception: `Hanya menghafal istilah pada materi ${cleanTopic} tanpa memahami cara kerjanya.`,
        correction: `Pahami terlebih dahulu gambaran sederhananya dan alur sebab-akibatnya agar lebih mudah diingat.`,
      },
      {
        misconception: `Melewatkan langkah awal saat langsung mengerjakan contoh kasus.`,
        correction: `Selalu tuliskan informasi yang diketahui terlebih dahulu sebelum menerapkan aturan atau rumus.`,
      },
    ],
    glosarium: [
      {
        term: cleanTopic,
        definition: `Pokok bahasan utama yang mencakup konsep dasar, aturan, dan penerapannya.`,
      },
      {
        term: 'Konsep Inti',
        definition:
          'Gagasan paling mendasar yang menjadi pegangan utama dalam memahami keseluruhan materi.',
      },
      {
        term: 'Tahapan Sistematis',
        definition:
          'Urutan langkah pengerjaan yang teratur dari awal hingga memperoleh hasil akhir.',
      },
      {
        term: 'Studi Kasus',
        definition:
          'Contoh persoalan nyata yang digunakan untuk melatih penerapan materi.',
      },
    ],
    rangkuman: [
      `${cleanTopic} merupakan materi penting pada tingkat ${params.educationLevel} yang menjelaskan konsep dasar beserta cara penerapannya.`,
      `Untuk memahami ${cleanTopic} dengan mudah, fokuslah pada pengertian inti, komponen utama, dan urutan cara kerjanya.`,
      `Tabel ringkasan dan langkah-langkah terstruktur membantu membedakan setiap bagian konsep secara cepat.`,
      `Melalui contoh konkret dan latihan bertahap, penguasaan materi ${cleanTopic} menjadi lebih kuat dan tidak mudah terlupa.`,
    ],
  };

  return enrichForDeepStyle(dynamicBase);
}
