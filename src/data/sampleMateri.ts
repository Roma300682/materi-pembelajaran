import { StructuredMateri } from '../types/materi';

export const INITIAL_MATERI_LIST: StructuredMateri[] = [
  {
    id: 'sample-jurnal-penyesuaian-v2',
    topicInput: 'Jurnal Penyesuaian Akuntansi',
    educationLevel: 'SMA / MA (Kelas 10–12)',
    presentationStyle: 'Sederhana & Mudah Dipahami Siswa',
    createdAt: '2026-11-11T08:00:00.000Z',
    title: 'Jurnal Penyesuaian Akuntansi',
    subjectArea: 'Ekonomi / Akuntansi',
    estimatedReadingMinutes: 6,
    pengantar: {
      hookParagraph:
        'Pada akhir bulan atau akhir tahun, catatan angka di Neraca Saldo sering kali belum sama dengan keadaan sebenarnya di lapangan. Misalnya, kertas dan tinta di kantor sudah dipakai sebagian, tetapi di catatan masih tertulis utuh seperti saat pertama kali dibeli.',
      scopeParagraph:
        'Agar laporan keuangan menampilkan angka yang jujur dan sesuai kondisi nyata, kita perlu membuat Jurnal Penyesuaian. Materi ini membahas pengertian, akun apa saja yang perlu disesuaikan, rumus sederhananya, hingga contoh cara menghitungnya.',
    },
    pengertian: {
      mainDefinition:
        'Jurnal Penyesuaian adalah jurnal yang dibuat pada akhir periode akuntansi untuk mengubah saldo akun-akun tertentu agar nilainya sesuai dengan keadaan yang sebenarnya sebelum menyusun Laporan Keuangan.',
      terminologyBreakdown:
        'Gambaran Sederhananya: Bayangkan kamu membeli paket kuota internet Rp100.000 di awal bulan. Di akhir bulan, kuota itu sudah terpakai Rp70.000 dan tersisa Rp30.000. Mencatat bahwa Rp70.000 sudah berubah menjadi "beban pemakaian" dan sisa kuotamu tinggal Rp30.000 itulah yang disebut penyesuaian.',
      fundamentalEssence:
        'Tujuan Utama: Memisahkan mana yang masih menjadi Harta/Utang perusahaan dan mana yang sudah berubah menjadi Pendapatan/Beban pada periode tersebut.',
    },
    poinKunci: [
      {
        subTitle: '1. Kapan Jurnal Penyesuaian Dibuat?',
        explanation:
          'Selalu dibuat pada akhir periode akuntansi (biasanya tanggal 31 Desember atau akhir bulan) setelah Neraca Saldo selesai disusun, tetapi sebelum membuat Laporan Keuangan.',
        keyTakeaway:
          'Urutannya: Neraca Saldo → Jurnal Penyesuaian → Kertas Kerja → Laporan Keuangan.',
      },
      {
        subTitle: '2. Akun Apa Saja yang Perlu Disesuaikan?',
        explanation:
          'Ada 5 transaksi utama yang paling sering disesuaikan di tingkat sekolah: (1) Pemakaian Perlengkapan, (2) Beban Dibayar di Muka, (3) Pendapatan Diterima di Muka, (4) Beban/Pendapatan yang belum dibayar atau belum diterima (Utang Gaji / Piutang), dan (5) Penyusutan Peralatan/Gedung.',
        keyTakeaway:
          'Jurnal penyesuaian pada dasarnya tidak pernah mengubah akun Kas (uang tunai).',
      },
      {
        subTitle: '3. Kunci Penting: Mencari Nilai "Yang Sudah Terpakai"',
        explanation:
          'Dalam pencatatan standar (metode harta), angka yang dimasukkan ke jurnal penyesuaian adalah nilai yang SUDAH TERPAKAI atau waktu yang SUDAH TERLEWATI hingga akhir tahun, bukan nilai sisanya.',
        keyTakeaway:
          'Jika diketahui nilai sisa di gudang, kurangkan dulu: Saldo Awal dikurangi Sisa Akhir = Jumlah Terpakai.',
      },
      {
        subTitle: '4. Pasangan Akun Selalu Tetap',
        explanation:
          'Setiap jenis penyesuaian sudah memiliki pasangan akun Debit dan Kredit yang baku, sehingga kamu cukup menghafal pola pasangannya lalu menghitung angkanya.',
        keyTakeaway:
          'Beban bertambah selalu di posisi Debit (D), sedangkan Harta berkurang atau Utang bertambah selalu di posisi Kredit (K).',
      },
    ],
    uraianMendalam: [
      {
        heading: 'A. Penyesuaian Perlengkapan & Beban Dibayar di Muka',
        narrativeParagraphs: [
          'Perlengkapan adalah barang habis pakai seperti kertas, pulpen, dan tinta. Saat dibeli dicatat sebagai Harta. Di akhir tahun, kita hitung sisa barang di lemari. Selisih antara catatan awal dengan sisa barang adalah jumlah yang sudah terpakai menjadi Beban Perlengkapan.',
          'Beban Dibayar di Muka adalah biaya yang dibayar sekaligus di awal untuk beberapa bulan ke depan, misalnya Sewa Ruko 1 tahun atau Asuransi 1 tahun. Jika saat awal dicatat sebagai Harta (Sewa Dibayar di Muka), maka di akhir tahun kita hitung berapa bulan sewa yang sudah dijalani.',
        ],
        structuredStepsOrBullets: [
          'Pemakaian Perlengkapan: (D) Beban Perlengkapan | (K) Perlengkapan — sebesar nilai yang SUDAH TERPAKAI.',
          'Sewa Dibayar di Muka (dicatat sebagai Harta): (D) Beban Sewa | (K) Sewa Dibayar di Muka — sebesar bulan yang SUDAH TERLEWATI.',
          'Catatan Metode Beban: Jika di Neraca Saldo tertulis sebagai "Beban Sewa", maka jurnalnya dibalik: (D) Sewa Dibayar di Muka | (K) Beban Sewa — sebesar bulan yang BELUM TERLEWATI (sisanya).',
        ],
        formulaOrRuleBox:
          'Perlengkapan Terpakai = Saldo Awal Perlengkapan − Sisa Perlengkapan Akhir Tahun',
      },
      {
        heading: 'B. Penyesuaian Utang Beban, Piutang Pendapatan, & Penyusutan',
        narrativeParagraphs: [
          'Kadang ada biaya yang sudah kita gunakan di bulan Desember tetapi uangnya baru dibayar bulan Januari tahun depan, seperti gaji karyawan atau tagihan listrik. Biaya ini tetap harus dicatat sebagai beban tahun ini dan memunculkan Utang Beban.',
          'Selain itu, barang jangka panjang seperti Peralatan, Mesin, dan Gedung nilainya berkurang karena aus dipakai. Pengurangan nilai ini disebut Penyusutan (Depresiasi) dan dicatat ke akun Akumulasi Penyusutan.',
        ],
        structuredStepsOrBullets: [
          'Beban yang Belum Dibayar (Utang Gaji/Listrik): (D) Beban Gaji | (K) Utang Gaji — sebesar gaji yang belum dibayar.',
          'Pendapatan yang Belum Diterima (Piutang): (D) Piutang Usaha | (K) Pendapatan Jasa — sebesar pekerjaan yang sudah selesai tapi belum dibayar pelanggan.',
          'Penyusutan Aset Tetap: (D) Beban Penyusutan Peralatan | (K) Akumulasi Penyusutan Peralatan — sebesar persentase penyusutan tahun tersebut.',
        ],
        formulaOrRuleBox:
          'Beban Sewa per Periode = (Jumlah Bulan Terpakai ÷ Total Bulan Sewa) × Total Harga Sewa',
      },
    ],
    tabelReferensi: {
      tableTitle: 'Tabel Ringkas Pasangan Jurnal Penyesuaian',
      tableCaption:
        'Panduan cepat menentukan akun Debit, Kredit, dan angka yang dimasukkan ke dalam jurnal.',
      headers: [
        'Transaksi yang Disesuaikan',
        'Akun di Debit (D)',
        'Akun di Kredit (K)',
        'Angka yang Dicatat',
      ],
      rows: [
        [
          'Pemakaian Perlengkapan',
          'Beban Perlengkapan',
          'Perlengkapan',
          'Nilai yang sudah terpakai (Awal − Sisa)',
        ],
        [
          'Sewa Dibayar di Muka (Metode Harta)',
          'Beban Sewa',
          'Sewa Dibayar di Muka',
          'Nilai bulan yang sudah dijalani',
        ],
        [
          'Sewa Dibayar di Muka (Metode Beban)',
          'Sewa Dibayar di Muka',
          'Beban Sewa',
          'Nilai bulan yang masih tersisa',
        ],
        [
          'Pendapatan Diterima di Muka (Utang)',
          'Pendapatan Diterima di Muka',
          'Pendapatan Jasa',
          'Nilai pekerjaan yang sudah diselesaikan',
        ],
        [
          'Gaji / Listrik Belum Dibayar',
          'Beban Gaji / Listrik',
          'Utang Gaji / Listrik',
          'Tagihan yang belum dibayar sampai akhir periode',
        ],
        [
          'Penyusutan Peralatan / Gedung',
          'Beban Penyusutan ...',
          'Akumulasi Penyusutan ...',
          'Nilai penyusutan periode berjalan',
        ],
      ],
    },
    contohKonkret: [
      {
        title: 'Contoh 1: Menghitung Perlengkapan dan Sewa Dibayar di Muka',
        contextScenario:
          'Di Neraca Saldo Salon Cantika per 31 Desember 2026 tertulis: Perlengkapan Rp5.000.000 dan Sewa Dibayar di Muka Rp12.000.000. Data akhir tahun menunjukkan: (a) Perlengkapan yang masih tersisa di lemari tinggal Rp2.000.000; (b) Sewa ruko dibayar tanggal 1 September 2026 untuk masa 1 tahun (12 bulan).',
        stepByStepAnalysis: [
          '1. Hitung perlengkapan yang terpakai: Rp5.000.000 (awal) − Rp2.000.000 (sisa) = Rp3.000.000.',
          '2. Hitung bulan sewa yang sudah terpakai dari 1 September sampai 31 Desember (September, Oktober, November, Desember) = 4 bulan.',
          '3. Hitung nilai sewa 4 bulan: (4 ÷ 12) × Rp12.000.000 = Rp4.000.000.',
        ],
        conclusionResult:
          'Jurnal Penyesuaian (31 Desember 2026):\n1) (D) Beban Perlengkapan Rp3.000.000 | (K) Perlengkapan Rp3.000.000\n2) (D) Beban Sewa Rp4.000.000 | (K) Sewa Dibayar di Muka Rp4.000.000',
      },
      {
        title: 'Contoh 2: Gaji Belum Dibayar dan Penyusutan Peralatan',
        contextScenario:
          'Pada akhir Desember 2026, Bengkel Maju belum membayar gaji 2 orang mekanik untuk bulan Desember sebesar Rp3.500.000. Selain itu, Peralatan Bengkel seharga Rp20.000.000 ditetapkan menyusut 10% per tahun.',
        stepByStepAnalysis: [
          '1. Gaji yang belum dibayar sebesar Rp3.500.000 langsung dicatat sebagai tambahan Beban Gaji dan memunculkan Utang Gaji.',
          '2. Hitung penyusutan peralatan 1 tahun: 10% × Rp20.000.000 = Rp2.000.000.',
        ],
        conclusionResult:
          'Jurnal Penyesuaian (31 Desember 2026):\n1) (D) Beban Gaji Rp3.500.000 | (K) Utang Gaji Rp3.500.000\n2) (D) Beban Penyusutan Peralatan Rp2.000.000 | (K) Akumulasi Penyusutan Peralatan Rp2.000.000',
      },
    ],
    kesalahanUmum: [
      {
        misconception:
          'Langsung menulis angka "sisa perlengkapan" (Rp2.000.000) ke dalam jurnal penyesuaian.',
        correction:
          'Yang ditulis di jurnal penyesuaian perlengkapan adalah jumlah yang TERPAKAI (Rp3.000.000), bukan sisanya.',
      },
      {
        misconception:
          'Menghitung penyusutan langsung mengurangi akun Peralatan di sisi Kredit.',
        correction:
          'Bagian Kredit untuk penyusutan harus selalu menggunakan akun "Akumulasi Penyusutan Peralatan", bukan akun Peralatan langsung.',
      },
    ],
    glosarium: [
      {
        term: 'Periode Akuntansi',
        definition:
          'Rentang waktu pencatatan laporan keuangan, biasanya 1 bulan atau 1 tahun (1 Januari – 31 Desember).',
      },
      {
        term: 'Perlengkapan (Supplies)',
        definition:
          'Barang habis pakai untuk kegiatan usaha (seperti kertas, nota, tinta) yang umurnya kurang dari 1 tahun.',
      },
      {
        term: 'Penyusutan (Depresiasi)',
        definition:
          'Berkurangnya nilai manfaat barang jangka panjang (seperti mesin, kendaraan, gedung) karena dipakai terus-menerus.',
      },
      {
        term: 'Akumulasi Penyusutan',
        definition:
          'Akun penampung total penyusutan aset tetap dari tahun ke tahun.',
      },
    ],
    rangkuman: [
      'Jurnal penyesuaian dibuat di akhir periode agar saldo akun mencerminkan keadaan sebenarnya sebelum menyusun laporan keuangan.',
      'Pemakaian perlengkapan selalu dicatat sebesar nilai yang SUDAH TERPAKAI (Saldo Awal dikurangi Sisa Akhir).',
      'Beban dibayar di muka (metode harta) disesuaikan sebesar jumlah bulan yang sudah dijalani hingga tanggal 31 Desember.',
      'Biaya yang sudah terjadi tetapi belum dibayar dicatat dengan mendebit Beban dan mengkredit Utang.',
      'Penyusutan aset tetap selalu dicatat dengan mendebit Beban Penyusutan dan mengkredit Akumulasi Penyusutan.',
    ],
  },
  {
    id: 'sample-fotosintesis-v2',
    topicInput: 'Fotosintesis',
    educationLevel: 'SMP / MTs (Kelas 7–9)',
    presentationStyle: 'Sederhana & Mudah Dipahami Siswa',
    createdAt: '2026-11-11T08:15:00.000Z',
    title: 'Fotosintesis: Cara Tumbuhan Memasak Makanannya Sendiri',
    subjectArea: 'Ilmu Pengetahuan Alam (Biologi)',
    estimatedReadingMinutes: 5,
    pengantar: {
      hookParagraph:
        'Berbeda dengan manusia dan hewan yang harus mencari makanan dari luar, tumbuhan hijau mampu membuat makanannya sendiri. Hanya dengan bermodalkan air dari tanah, udara di sekitar, dan sinar matahari, daun tumbuhan bekerja layaknya "dapur alami".',
      scopeParagraph:
        'Materi ini membahas secara ringkas dan jelas apa itu fotosintesis, bahan-bahan yang diperlukan, dua tahapan prosesnya di dalam daun, serta contoh percobaan sederhana untuk membuktikannya.',
    },
    pengertian: {
      mainDefinition:
        'Fotosintesis adalah proses pembuatan makanan (glukosa/zat gula) oleh tumbuhan hijau menggunakan bahan dasar air (H₂O) dan karbon dioksida (CO₂) dengan bantuan cahaya matahari serta zat hijau daun (klorofil).',
      terminologyBreakdown:
        'Gambaran Sederhananya: Kata "foto" artinya cahaya, dan "sintesis" artinya menyusun/membuat. Jadi, fotosintesis berarti membuat makanan dengan bantuan energi cahaya. Selain menghasilkan makanan bagi tumbuhan, proses ini juga mengeluarkan gas oksigen (O₂) yang kita hirup setiap hari.',
      fundamentalEssence:
        'Inti Konsep: Mengubah energi cahaya matahari menjadi energi kimia berupa zat gula (makanan) sekaligus menghasilkan oksigen bagi makhluk hidup.',
    },
    poinKunci: [
      {
        subTitle: '1. Empat Syarat Utama Fotosintesis',
        explanation:
          'Agar fotosintesis bisa berjalan, tumbuhan memerlukan 4 komponen: (1) Air (H₂O) yang diserap akar dari tanah, (2) Gas Karbon Dioksida (CO₂) dari udara yang masuk lewat mulut daun (stomata), (3) Klorofil (zat hijau daun) sebagai penangkap cahaya, dan (4) Cahaya matahari sebagai sumber energi.',
        keyTakeaway:
          'Bahan bakunya adalah Air + Karbon Dioksida, sedangkan hasilnya adalah Glukosa (makanan) + Oksigen.',
      },
      {
        subTitle: '2. Berlangsung di Kloroplas Daun',
        explanation:
          'Di dalam sel daun terdapat bagian kecil bernama kloroplas yang berisi klorofil. Kloroplas inilah "dapur" tempat terjadinya fotosintesis.',
        keyTakeaway:
          'Bagian daun yang paling banyak mengandung kloroplas adalah jaringan tiang (palisade).',
      },
      {
        subTitle: '3. Terbagi Menjadi 2 Tahap: Reaksi Terang dan Reaksi Gelap',
        explanation:
          'Tahap pertama adalah Reaksi Terang (memecah air dengan sinar matahari dan mengeluarkan oksigen). Tahap kedua adalah Reaksi Gelap/Siklus Calvin (mengolah karbon dioksida menjadi zat gula/glukosa).',
        keyTakeaway:
          'Oksigen dihasilkan pada Reaksi Terang, sedangkan Glukosa (makanan) dihasilkan pada Reaksi Gelap.',
      },
      {
        subTitle: '4. Kelebihan Makanan Disimpan sebagai Amilum (Pati)',
        explanation:
          'Glukosa hasil fotosintesis dipakai tumbuhan untuk tumbuh. Sisanya diubah menjadi amilum (pati) dan disimpan sebagai cadangan makanan di daun, umbi (seperti singkong/kentang), batang (seperti tebu), atau buah.',
        keyTakeaway:
          'Keberadaan amilum pada daun membuktikan bahwa daun tersebut telah melakukan fotosintesis.',
      },
    ],
    uraianMendalam: [
      {
        heading: 'A. Perjalanan Bahan Baku Menuju Daun dan Rumus Fotosintesis',
        narrativeParagraphs: [
          'Akar tumbuhan menyerap air dari dalam tanah, lalu mengirimkannya naik ke daun melalui pembuluh kayu (xilem). Di saat yang sama, mulut daun (stomata) membuka untuk menyerap gas karbon dioksida (CO₂) dari udara.',
          'Setelah air dan karbon dioksida berkumpul di kloroplas daun, klorofil menangkap energi sinar matahari untuk menggabungkan kedua bahan tersebut menjadi glukosa (C₆H₁₂O₆) dan oksigen (O₂). Glukosa lalu diedarkan ke seluruh tubuh tumbuhan melalui pembuluh tapis (floem), sedangkan oksigen dilepaskan ke udara lewat stomata.',
        ],
        structuredStepsOrBullets: [
          'Pembuluh Xilem (Kayu): Mengangkut air dari akar menuju daun.',
          'Stomata (Mulut Daun): Pintu masuknya gas CO₂ dan pintu keluarnya gas O₂.',
          'Pembuluh Floem (Tapis): Mengedarkan makanan hasil fotosintesis dari daun ke seluruh bagian tumbuhan.',
        ],
        formulaOrRuleBox:
          '6 CO₂ (Karbon Dioksida) + 6 H₂O (Air) —[Cahaya & Klorofil]→ C₆H₁₂O₆ (Glukosa) + 6 O₂ (Oksigen)',
      },
      {
        heading: 'B. Dua Tahapan Fotosintesis: Reaksi Terang vs Reaksi Gelap',
        narrativeParagraphs: [
          'Proses di dalam kloroplas berjalan dalam 2 langkah berurutan. Langkah pertama adalah Reaksi Terang yang terjadi di bagian grana. Di sini, energi cahaya matahari dipakai untuk memecah air (fotolisis air) sehingga menghasilkan gas oksigen (O₂) dan energi simpanan (ATP).',
          'Langkah kedua adalah Reaksi Gelap (Siklus Calvin) yang terjadi di bagian stroma. Disebut reaksi gelap bukan karena terjadi di malam hari, melainkan karena tahap ini tidak memakai sinar matahari secara langsung. Tahap ini memakai energi dari reaksi terang untuk mengubah gas karbon dioksida (CO₂) menjadi glukosa (zat gula).',
        ],
        structuredStepsOrBullets: [
          'Reaksi Terang: Membutuhkan cahaya + Air (H₂O) → Menghasilkan gas Oksigen (O₂) + Energi kimia.',
          'Reaksi Gelap: Menggunakan energi kimia + Karbon Dioksida (CO₂) → Menghasilkan Glukosa (zat gula/amilum).',
          'Faktor Penentu Kecepatan Fotosintesis: Terangnya cahaya matahari, jumlah air, kadar CO₂ di udara, dan suhu lingkungan yang hangat.',
        ],
        formulaOrRuleBox: '',
      },
    ],
    tabelReferensi: {
      tableTitle: 'Tabel Perbedaan Reaksi Terang dan Reaksi Gelap',
      tableCaption:
        'Ringkasan mudah untuk membedakan kedua tahapan fotosintesis di dalam kloroplas.',
      headers: ['Pembeda', 'Reaksi Terang', 'Reaksi Gelap (Siklus Calvin)'],
      rows: [
        [
          'Tempat Terjadinya',
          'Grana (tumpukan tilakoid di kloroplas)',
          'Stroma (cairan di dalam kloroplas)',
        ],
        [
          'Cahaya Matahari',
          'Wajib membutuhkan cahaya langsung',
          'Tidak memakai cahaya langsung',
        ],
        [
          'Bahan yang Diolah',
          'Air (H₂O)',
          'Karbon dioksida (CO₂) + Energi dari reaksi terang',
        ],
        [
          'Hasil Utama',
          'Gas Oksigen (O₂) dan Energi (ATP)',
          'Glukosa (C₆H₁₂O₆) / Amilum (makanan)',
        ],
      ],
    },
    contohKonkret: [
      {
        title: 'Contoh 1: Percobaan Sachs (Membuktikan Daun Menghasilkan Amilum)',
        contextScenario:
          'Sehelai daun ditutup sebagian tengahnya dengan kertas timah (aluminium foil) sejak pagi, lalu dibiarkan terkena matahari. Sore harinya daun dipetik, direbus di air mendidih, dicelupkan ke alkohol panas, lalu ditetesi cairan iodin (betadine/lugol).',
        stepByStepAnalysis: [
          '1. Menutup daun dengan kertas timah bertujuan agar bagian tersebut tidak terkena sinar matahari.',
          '2. Merebus daun di air mendidih bertujuan mematikan sel daun, sedangkan alkohol panas bertujuan melarutkan warna hijau klorofil agar daun menjadi pucat.',
          '3. Meneteskan cairan iodin berfungsi menguji adanya amilum (zat tepung/makanan).',
        ],
        conclusionResult:
          'Hasil: Bagian daun yang terbuka terkena matahari berubah warna menjadi biru kehitaman (tanda mengandung amilum), sedangkan bagian yang tertutup kertas timah tetap pucat. Artinya, fotosintesis membutuhkan cahaya dan menghasilkan amilum.',
      },
      {
        title: 'Contoh 2: Percobaan Ingenhousz (Membuktikan Fotosintesis Menghasilkan Oksigen)',
        contextScenario:
          'Tanaman air Hydrilla dimasukkan ke dalam corong kaca terbalik di dalam wadah berisi air dan diletakkan di bawah terik matahari.',
        stepByStepAnalysis: [
          '1. Saat terkena sinar matahari, muncul banyak gelembung-gelembung udara kecil yang naik ke tabung reaksi.',
          '2. Jika gelembung semakin banyak saat ditaruh di tempat terang atau saat airnya ditambah soda kue (sumber CO₂), berarti fotosintesis berjalan makin cepat.',
        ],
        conclusionResult:
          'Hasil: Gelembung gas yang keluar dari tanaman air tersebut adalah gas Oksigen (O₂) hasil reaksi terang fotosintesis.',
      },
    ],
    kesalahanUmum: [
      {
        misconception:
          'Mengira gas oksigen (O₂) berasal dari pemecahan karbon dioksida (CO₂).',
        correction:
          'Oksigen yang dikeluarkan tumbuhan berasal dari pemecahan molekul air (H₂O) pada reaksi terang.',
      },
      {
        misconception:
          'Mengira Reaksi Gelap hanya terjadi pada malam hari.',
        correction:
          'Reaksi gelap tetap terjadi di siang hari tepat setelah reaksi terang, hanya saja prosesnya tidak memerlukan sinar matahari langsung.',
      },
    ],
    glosarium: [
      {
        term: 'Klorofil',
        definition:
          'Zat hijau daun yang bertugas menangkap energi cahaya matahari.',
      },
      {
        term: 'Stomata',
        definition:
          'Celah atau mulut daun mikroskopis tempat keluar-masuknya udara (CO₂ dan O₂).',
      },
      {
        term: 'Glukosa & Amilum',
        definition:
          'Zat gula hasil fotosintesis yang kemudian disimpan tumbuhan dalam bentuk zat tepung (amilum/pati).',
      },
      {
        term: 'Fotolisis Air',
        definition:
          'Pemecahan air (H₂O) oleh energi cahaya matahari menjadi gas oksigen pada reaksi terang.',
      },
    ],
    rangkuman: [
      'Fotosintesis adalah proses tumbuhan hijau membuat makanan (glukosa) dari air (H₂O) dan karbon dioksida (CO₂) dengan bantuan cahaya matahari dan klorofil.',
      'Air diangkut dari akar oleh pembuluh xilem, sedangkan makanan hasil fotosintesis diedarkan ke seluruh tumbuhan oleh pembuluh floem.',
      'Fotosintesis terdiri dari 2 tahap: Reaksi Terang di grana (menghasilkan oksigen) dan Reaksi Gelap di stroma (menghasilkan glukosa).',
      'Percobaan Sachs dengan tetesan iodin membuktikan fotosintesis menghasilkan amilum (warna biru kehitaman).',
      'Percobaan Ingenhousz pada tanaman air Hydrilla membuktikan fotosintesis menghasilkan gelembung gas oksigen (O₂).',
    ],
  },
];
