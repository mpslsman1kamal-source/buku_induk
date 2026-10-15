# PANDUAN INSTALASI — Buku Induk Digital SMAN 1 Kamal

## === BAGIAN A — BACKEND (Google Apps Script) ===

1. Buka https://script.google.com → **Proyek Baru**.
2. Buat file-file berikut (klik ikon **+** di sebelah "Files"), salin isi
   dari tiap berkas `.gs` yang dikirim terpisah di percakapan ini:
   - `Kode.gs` (ganti isi `Code.gs` bawaan)
   - `Utils.gs`
   - `Auth.gs`
   - `Siswa.gs`
   - `Akademik.gs`
   - `Kelulusan.gs`
   - `Pengaturan.gs`
   - `DocEngine.gs`
3. Klik ikon ⚙️ **Project Settings** → centang **"Show appsscript.json manifest file"**,
   lalu buka `appsscript.json` dan ganti isinya dengan berkas `appsscript.json` yang dikirim.
4. Jalankan `setupAppEnvironment` **HANYA SEKALI**:
   - Dropdown fungsi (atas) → pilih `setupAppEnvironment` → ▶ **Run**.
   - Klik **Review permissions** → izinkan akses Drive & Sheets.
   - Buka **Execution Log** → pastikan muncul "✅ Setup selesai!".
   - Cek Google Drive: folder **📁 Buku Induk Digital SMAN 1 Kamal** sudah terbuat.
   - Cek Google Sheets: file **🗃️ Database** sudah ada dengan semua sheet (Siswa, Pengguna, dst).
5. Buka sheet **Pengguna** di Spreadsheet yang baru dibuat → tambahkan baris
   untuk setiap Admin/Guru/Kepala Sekolah (kolom: email, nama, peran, aktif=TRUE,
   mapelDiampu, kelasDiampu). Baris pertama (akun Anda) sudah otomatis terisi.
6. **Deploy** → **New deployment** → pilih tipe **Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Klik **Deploy** → salin **URL `/exec`**.

## === BAGIAN B — FRONTEND (GitHub Pages) ===

1. Ekstrak ZIP `buku-induk-digital-frontend.zip` yang dikirim di percakapan ini.
2. Buka `js/config.js` di folder hasil ekstrak, ganti `GAS_URL` dengan URL
   `/exec` dari langkah A6 di atas.
3. Masuk ke folder hasil ekstrak itu sendiri (folder ini **adalah** root
   repository — `index.html` harus langsung terlihat di `dir`/`ls`, jangan
   masuk satu level lagi).
4. Ikuti langkah Git standar: `git init` → `git add .` → `git commit` →
   buat repository baru di GitHub (Public) → `git push`.
5. Di repository GitHub: **Settings → Pages → Deploy from branch** → pilih
   branch `main` folder `/ (root)` → **Save**.
6. Buka URL `https://<username>.github.io/<nama-repo>/` setelah beberapa menit.

## === TES ===
1. Buka URL frontend → masukkan email yang sudah terdaftar di sheet `Pengguna`.
2. Pastikan menu menyesuaikan peran (Admin melihat semua menu, Guru hanya
   Dashboard/Data Siswa/Input Nilai/Cetak, dst).
3. Coba tambah siswa baru → cek muncul di Google Sheets `Siswa`.
4. Coba cetak PDF → cek file masuk ke folder **Arsip PDF** di Drive.
5. Buka DevTools → Network → pastikan tidak ada error CORS saat POST.

## Catatan penting
- Jalankan ulang **Deploy → Manage deployments → Edit (pensil) → Deploy**
  setiap kali Anda mengubah kode backend, agar URL `/exec` memakai versi terbaru.
- Pengguna yang `aktif=FALSE` di sheet `Pengguna` akan ditolak saat login.
