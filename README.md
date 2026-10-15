# Buku Induk Digital — SMAN 1 Kamal Bangkalan

Aplikasi web internal untuk mencatat riwayat siswa secara berkelanjutan
(masuk kelas 10 → aktif → naik/tidak naik → lulus/berhenti), sesuai PRD
FINAL dan desain UI/UX hasil sinkronisasi Google Stitch.

## Arsitektur
- **Frontend**: HTML/CSS/JS vanilla (folder ini) — dideploy ke GitHub Pages.
- **Backend**: Google Apps Script sebagai REST API murni (JSON), lihat
  berkas `.gs` yang dikirim terpisah di percakapan (bukan di ZIP ini).
- **Database**: Google Sheets. **Berkas**: Google Drive.

## Sebelum deploy
Isi `js/config.js` dengan URL `/exec` hasil deploy backend GAS Anda:
```js
const GAS_URL = 'https://script.google.com/macros/s/XXXXXXXX/exec';
```

Lihat `PANDUAN-INSTALASI.md` untuk langkah lengkap backend → frontend → tes.

## Struktur folder (root ZIP = root repository)
```
index.html
css/style.css
js/config.js, api.js, ui.js, auth.js, router.js, app.js
js/pages/*.js
```

## Cakupan fitur (PRD F1–F14)
Login & RBAC per peran, Dashboard rekap, Data Siswa (cari/filter/paginasi),
Profil Siswa (tab Biodata A–J, Ortu, Nilai, Ekskul/P5/Absensi, Berkas,
Riwayat), Form Siswa Baru bertahap dengan draf otomatis, Input Nilai per
guru, Ekskul/P5/Absensi, Kenaikan Kelas (batch wizard), Berhenti/Mutasi &
Kelulusan + Ijazah, Cetak PDF (Buku Induk/Laporan Capaian/Ijazah) termasuk
cetak massal, Pengaturan (Pengguna & Master Data), Log Aktivitas.

## Catatan desain
Token warna, tipografi, radius, dan gaya komponen diambil presisi dari
`digital_ledger_system/DESIGN.md` (hasil export Google Stitch) — palet
sky-blue (`#0284C7`), Inter untuk teks UI, JetBrains Mono untuk NIS/NISN/NIK.

## Catatan jujur tentang keterbatasan versi ini
- **Login** memakai pencocokan email ke sheet `Pengguna` + token sesi
  sementara (CacheService), **bukan** OAuth Google penuh — karena frontend
  dan backend berada di domain terpisah (lihat PANDUAN-INSTALASI.md).
  Pemeriksaan peran tetap divalidasi ulang di server pada setiap aksi.
- **Unggah foto & berkas** (F10) disiapkan strukturnya di backend
  (`Berkas.gs`, folder Drive) namun form unggah di frontend saat ini
  mengirim field file sebagai input biasa — hubungkan ke `uploadBerkas()`
  di `Berkas.gs` bila Anda ingin alur unggah langsung dari form siswa baru.
- **Cetak PDF** memakai konversi HTML→PDF bawaan `HtmlService`. Untuk
  kop surat/logo yang lebih presisi secara visual, pertimbangkan beralih
  ke template Google Docs (`DocumentApp`) bila dibutuhkan ke depannya.
