// ============================================
// LOG AKTIVITAS — F14
// ============================================
Pages.logAktivitas = {
  async load() {
    document.querySelector('#log-table tbody').innerHTML = UI.skeletonRows(4, 8);
    const res = await Api.get('getLogAktivitas');
    const rows = res.success ? res.data : [];
    document.querySelector('#log-table tbody').innerHTML = rows.length ? rows.map(l => `
      <tr><td class="mono" style="font-size:11px">${l.waktu}</td><td>${l.pengguna}</td><td>${l.aksi}</td><td class="mono">${l.target || '-'}</td></tr>
    `).join('') : `<tr><td colspan="4">${UI.emptyState('history', 'Belum ada aktivitas tercatat.')}</td></tr>`;
  }
};
