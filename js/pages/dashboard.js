// ============================================
// DASHBOARD — F12
// ============================================
const Pages = window.Pages || {};
Pages.dashboard = {
  async load() {
    const statsWrap = document.getElementById('dashboard-stats');
    statsWrap.innerHTML = Array.from({ length: 4 }).map(() =>
      `<div class="card stat-card card-pad"><div class="skeleton" style="height:12px;width:50%"></div><div class="skeleton" style="height:26px;width:70%;margin-top:6px"></div></div>`).join('');

    const res = await Api.get('getDashboard');
    if (!res.success) return;
    const d = res.data;

    statsWrap.innerHTML = `
      <div class="card stat-card card-pad">
        <span class="stat-label">Siswa Aktif Terdaftar</span>
        <span class="stat-value">${d.totalAktif ?? 0}</span>
        <span class="stat-sub">Kapasitas ${d.kapasitasPct ?? '-'}% terisi</span>
      </div>
      <div class="card stat-card card-pad">
        <span class="stat-label">Rombongan Belajar</span>
        <span class="stat-value">${d.totalRombel ?? 0}</span>
        <span class="stat-sub">Rata-rata ${d.rataSiswaPerRombel ?? '-'} / kelas</span>
      </div>
      <div class="card stat-card card-pad">
        <span class="stat-label">Proporsi Gender</span>
        <span class="stat-value">${d.persenL ?? 0}% / ${d.persenP ?? 0}%</span>
        <span class="stat-sub">Laki-laki / Perempuan</span>
      </div>
      <div class="card stat-card card-pad">
        <span class="stat-label">Kelulusan &amp; Arsip</span>
        <span class="stat-value">${d.totalLulus ?? 0}</span>
        <span class="stat-sub">Siswa lulusan tersimpan permanen</span>
      </div>`;

    const recapBody = document.querySelector('#dashboard-recap-table tbody');
    recapBody.innerHTML = (d.recap || []).map(r => `
      <tr><td class="mono">${r.tahun}</td><td>${r.siswaBaru}</td><td>${r.naikKelas}</td>
      <td>${r.lulus}</td><td>${r.berhenti}</td></tr>`).join('') || `<tr><td colspan="5">${UI.emptyState('inbox','Belum ada data rekap.')}</td></tr>`;

    const actWrap = document.getElementById('dashboard-activity');
    const rows = (d.aktivitas || []).map(a => `
      <tr><td class="mono" style="font-size:11px">${a.waktu}</td><td>${a.pengguna}</td><td>${a.aksi}</td><td class="mono">${a.target || '-'}</td></tr>`).join('');
    actWrap.innerHTML = `<table class="data-table"><thead><tr><th>Waktu</th><th>Pengguna</th><th>Aktivitas</th><th>Target</th></tr></thead>
      <tbody>${rows || `<tr><td colspan="4">${UI.emptyState('history','Belum ada aktivitas.')}</td></tr>`}</tbody></table>`;
  }
};
window.Pages = Pages;
