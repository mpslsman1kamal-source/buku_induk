// ============================================
// ROUTER — Client-Side SPA (Prinsip 1 gas-instant-ux): navigasi 0ms,
// semua section sudah dimuat di index.html, tinggal show/hide.
// ============================================
const MENU = [
  { id: 'dashboard',          label: 'Dashboard',            icon: 'dashboard',        roles: ['Admin', 'Guru', 'Kepala Sekolah'], title: 'Dashboard Buku Induk', sub: 'Ringkasan demografi, kapasitas rombel, dan histori arsip siswa.' },
  { id: 'data-siswa',         label: 'Data Siswa',           icon: 'groups',           roles: ['Admin', 'Guru', 'Kepala Sekolah'], title: 'Data Siswa', sub: 'Pencarian dan daftar seluruh siswa.' },
  { id: 'profil-siswa',       label: 'Profil Siswa',         icon: 'badge',            roles: ['Admin', 'Guru', 'Kepala Sekolah'], title: 'Profil Siswa', sub: 'Detail buku induk per siswa.', hidden: true },
  { id: 'form-siswa-baru',    label: 'Tambah Siswa',         icon: 'person_add',       roles: ['Admin'], title: 'Formulir Siswa Baru', sub: 'Bagian A–J, foto, dan berkas pendukung.' },
  { id: 'input-nilai',        label: 'Input Nilai',          icon: 'edit_note',        roles: ['Admin', 'Guru'], title: 'Input Nilai Rapor & KKTP', sub: 'Nilai mata pelajaran yang diampu, per semester.' },
  { id: 'ekskul-p5-absensi',  label: 'Ekskul, P5 & Absensi', icon: 'diversity_3',      roles: ['Admin'], title: 'Ekskul, Projek P5 & Ketidakhadiran', sub: 'Dicatat per siswa per semester.' },
  { id: 'kenaikan-kelas',     label: 'Kenaikan Kelas',       icon: 'trending_up',      roles: ['Admin'], title: 'Proses Kenaikan Kelas', sub: 'Pratinjau dan konfirmasi kenaikan per rombel.' },
  { id: 'berhenti-lulus',     label: 'Berhenti / Lulus',     icon: 'school',           roles: ['Admin'], title: 'Berhenti, Mutasi & Kelulusan', sub: 'Status akhir siswa dan data ijazah.' },
  { id: 'cetak',              label: 'Cetak & Laporan',      icon: 'print',            roles: ['Admin', 'Guru', 'Kepala Sekolah'], title: 'Cetak & Laporan PDF', sub: 'Buku Induk, Laporan Capaian, dan Data Ijazah.' },
  { id: 'pengaturan',         label: 'Pengaturan Sistem',    icon: 'settings',         roles: ['Admin'], title: 'Pengaturan Sistem', sub: 'Kelola pengguna dan data acuan.' },
  { id: 'log-aktivitas',      label: 'Log Aktivitas',        icon: 'history',          roles: ['Admin', 'Kepala Sekolah'], title: 'Log Aktivitas', sub: 'Jejak audit seluruh perubahan data.' }
];

const Router = {
  current: null,

  renderSidebar() {
    const role = Auth.role();
    const nav = document.getElementById('sidebar-nav');
    nav.innerHTML = MENU.filter(m => m.roles.includes(role) && !m.hidden).map(m => `
      <a href="#" class="nav-link" id="nav-${m.id}" onclick="Router.go('${m.id}');return false;">
        <span class="material-symbols-outlined">${m.icon}</span>${m.label}
      </a>`).join('');
  },

  go(sectionId) {
    const item = MENU.find(m => m.id === sectionId);
    if (!item || !item.roles.includes(Auth.role())) {
      UI.toast('Anda tidak memiliki akses ke halaman ini.', 'error');
      return;
    }
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.getElementById(`section-${sectionId}`).classList.add('active');
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.getElementById(`nav-${sectionId}`)?.classList.add('active');

    document.getElementById('page-title').textContent = item.title;
    document.getElementById('page-subtitle').textContent = item.sub;
    document.getElementById('crumb-current').textContent = item.label;
    document.getElementById('sidebar').classList.remove('open');

    this.current = sectionId;
    this.loadSection(sectionId);
  },

  // Lazy-load tiap section hanya saat pertama dibuka (cache di window.appState)
  loadSection(id) {
    // PENTING: dibungkus arrow function agar `this` di dalam load() tetap
    // merujuk ke object Pages.xxx masing-masing (referensi method telanjang
    // seperti `Pages.dataSiswa.load` akan kehilangan binding `this` saat
    // dipanggil lewat loaders[id]()).
    const loaders = {
      'dashboard': () => Pages.dashboard.load(),
      'data-siswa': () => Pages.dataSiswa.load(),
      'form-siswa-baru': () => Pages.formSiswaBaru.load(),
      'input-nilai': () => Pages.inputNilai.load(),
      'ekskul-p5-absensi': () => Pages.epa.load(),
      'kenaikan-kelas': () => Pages.kenaikanKelas.load(),
      'berhenti-lulus': () => Pages.berhentiLulus.load(),
      'cetak': () => Pages.cetak.load(),
      'pengaturan': () => Pages.pengaturan.load(),
      'log-aktivitas': () => Pages.logAktivitas.load()
    };
    loaders[id]?.();
  }
};
