// ============================================
// KENAIKAN KELAS — F7: batch wizard, pratinjau sebelum konfirmasi
// ============================================
Pages.kenaikanKelas = {
  rows: [],

  load() {
    const md = appState.masterData || {};
    document.getElementById('kk-kelas').innerHTML = (md.kelas || []).map(k => `<option>${k}</option>`).join('');
  },

  async loadPreview() {
    const kelas = document.getElementById('kk-kelas').value;
    const tbody = document.querySelector('#kk-table tbody');
    tbody.innerHTML = UI.skeletonRows(3, 6);
    const res = await Api.get('getSiswaUntukKenaikan', { kelas });
    this.rows = res.success ? res.data : [];
    this.render();
  },

  render() {
    const tbody = document.querySelector('#kk-table tbody');
    tbody.innerHTML = this.rows.length ? this.rows.map((s, i) => `
      <tr><td class="mono">${s.nisn}</td><td>${s.nama}</td>
      <td><select class="input" data-idx="${i}" onchange="Pages.kenaikanKelas.rows[${i}].hasil=this.value">
        <option value="Naik" ${s.hasil !== 'Tidak Naik' ? 'selected' : ''}>Naik Kelas</option>
        <option value="Tidak Naik" ${s.hasil === 'Tidak Naik' ? 'selected' : ''}>Tidak Naik</option>
      </select></td></tr>`).join('') : `<tr><td colspan="3">${UI.emptyState('groups', 'Pilih kelas lalu muat pratinjau.')}</td></tr>`;
  },

  setAll(hasil) {
    this.rows = this.rows.map(r => ({ ...r, hasil }));
    this.render();
  },

  async submit() {
    const tahunBaru = document.getElementById('kk-tahun').value.trim();
    if (!tahunBaru) { UI.toast('Isi tahun pelajaran baru terlebih dahulu.', 'error'); return; }
    if (!this.rows.length) return;
    if (!confirm(`Konfirmasi proses kenaikan kelas untuk ${this.rows.length} siswa ke TP ${tahunBaru}?`)) return;
    const res = await Api.post('prosesKenaikanKelas', { rows: this.rows, tahunBaru }); // Prinsip 4: 1 batch call
    if (res.success) {
      UI.toast('Kenaikan kelas berhasil diproses dan riwayat tersimpan.');
      appState.students = null;
      this.rows = []; this.render();
    }
  }
};
