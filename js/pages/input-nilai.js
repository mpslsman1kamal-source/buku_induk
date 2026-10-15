// ============================================
// INPUT NILAI — F5: guru hanya mapel & kelas yang diampu
// ============================================
Pages.inputNilai = {
  async load() {
    const md = appState.masterData || {};
    const mapelSel = document.getElementById('nilai-mapel');
    const kelasSel = document.getElementById('nilai-kelas');
    const mapelList = md.mapelDiampu || md.mapel || [];
    mapelSel.innerHTML = mapelList.map(m => `<option>${m}</option>`).join('');
    kelasSel.innerHTML = (md.kelas || []).map(k => `<option>${k}</option>`).join('');
    this.loadSiswa();
  },

  async loadSiswa() {
    const mapel = document.getElementById('nilai-mapel').value;
    const kelas = document.getElementById('nilai-kelas').value;
    const tbody = document.querySelector('#nilai-table tbody');
    tbody.innerHTML = UI.skeletonRows(6, 5);
    const res = await Api.get('getSiswaUntukNilai', { mapel, kelas });
    const rows = res.success ? res.data : [];
    tbody.innerHTML = rows.length ? rows.map((s, i) => `
      <tr data-id="${s.id}">
        <td>${i + 1}</td><td class="mono">${s.nisn}</td><td>${s.nama}</td>
        <td><input class="input" data-field="capaian" value="${s.capaian || ''}" placeholder="mis. Sudah Tercapai"/></td>
        <td><input class="input mono-input" type="number" min="0" max="100" data-field="nilai" value="${s.nilai ?? ''}"/></td>
        <td><input class="input" data-field="keterangan" value="${s.keterangan || ''}"/></td>
      </tr>`).join('') : `<tr><td colspan="6">${UI.emptyState('school', 'Tidak ada siswa untuk kelas/mapel ini.')}</td></tr>`;
  },

  async submit() {
    const mapel = document.getElementById('nilai-mapel').value;
    const kelas = document.getElementById('nilai-kelas').value;
    const semester = document.getElementById('nilai-semester').value;
    const rows = [...document.querySelectorAll('#nilai-table tbody tr[data-id]')].map(tr => ({
      id: tr.dataset.id,
      capaian: tr.querySelector('[data-field=capaian]').value,
      nilai: tr.querySelector('[data-field=nilai]').value,
      keterangan: tr.querySelector('[data-field=keterangan]').value
    }));
    if (!rows.length) return;
    const res = await Api.post('saveNilaiBatch', { mapel, kelas, semester, rows }); // Prinsip 4: batch, 1 panggilan
    if (res.success) UI.toast(`Nilai ${rows.length} siswa berhasil disimpan.`);
  }
};
