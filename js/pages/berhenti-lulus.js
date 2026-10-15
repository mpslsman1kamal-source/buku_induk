// ============================================
// BERHENTI / LULUS / MUTASI — F8 & F9
// ============================================
Pages.berhentiLulus = {
  tab: 'lulus',

  load() { this.render(); },

  switchTab(tab) {
    this.tab = tab;
    document.querySelectorAll('#section-berhenti-lulus .tab-btn').forEach((b, i) => b.classList.toggle('active', (tab === 'lulus') === (i === 0)));
    this.render();
  },

  render() {
    const c = document.getElementById('bl-content');
    if (this.tab === 'lulus') {
      c.innerHTML = `
        <div class="field"><label>NISN Siswa Kelas 12</label><input class="input" id="bl-nisn-lulus"/></div>
        <div class="grid grid-3">
          <div class="field" style="margin:0"><label>No. Ijazah</label><input class="input" id="bl-no-ijazah"/></div>
          <div class="field" style="margin:0"><label>Nilai Rata-rata Rapor</label><input class="input mono-input" type="number" id="bl-nilai-rapor"/></div>
          <div class="field" style="margin:0"><label>Nilai Ujian Sekolah</label><input class="input mono-input" type="number" id="bl-nilai-us"/></div>
        </div>
        <div class="field"><label>Rencana Lanjutan (Kuliah/Kerja)</label><input class="input" id="bl-rencana"/></div>
        <button class="btn btn-primary" onclick="Pages.berhentiLulus.submitLulus()">Luluskan Siswa</button>`;
    } else {
      c.innerHTML = `
        <div class="field"><label>NISN Siswa</label><input class="input" id="bl-nisn-berhenti"/></div>
        <div class="grid grid-2">
          <div class="field" style="margin:0"><label>Tanggal Berhenti</label><input class="input" type="date" id="bl-tgl-berhenti"/></div>
          <div class="field" style="margin:0"><label>Status Akhir</label>
            <select class="input" id="bl-status-akhir"><option>Berhenti</option><option>Pindah</option></select></div>
        </div>
        <div class="field"><label>Alasan</label><textarea class="input" id="bl-alasan" rows="3"></textarea></div>
        <button class="btn btn-danger" onclick="Pages.berhentiLulus.submitBerhenti()">Catat & Arsipkan</button>`;
    }
  },

  async submitLulus() {
    const payload = {
      nisn: document.getElementById('bl-nisn-lulus').value,
      noIjazah: document.getElementById('bl-no-ijazah').value,
      nilaiRapor: document.getElementById('bl-nilai-rapor').value,
      nilaiUs: document.getElementById('bl-nilai-us').value,
      rencana: document.getElementById('bl-rencana').value
    };
    const res = await Api.post('prosesLulus', payload);
    if (res.success) { UI.toast('Siswa berhasil diluluskan.'); appState.students = null; this.render(); }
  },

  async submitBerhenti() {
    const payload = {
      nisn: document.getElementById('bl-nisn-berhenti').value,
      tanggal: document.getElementById('bl-tgl-berhenti').value,
      status: document.getElementById('bl-status-akhir').value,
      alasan: document.getElementById('bl-alasan').value
    };
    if (!confirm('Siswa akan dipindah dari daftar aktif namun data tetap tersimpan permanen. Lanjutkan?')) return;
    const res = await Api.post('prosesBerhenti', payload);
    if (res.success) { UI.toast('Status siswa berhasil dicatat.'); appState.students = null; this.render(); }
  }
};
