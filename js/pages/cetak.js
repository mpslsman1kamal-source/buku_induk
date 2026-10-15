// ============================================
// CETAK & LAPORAN — F11
// ============================================
Pages.cetak = {
  load() {
    const md = appState.masterData || {};
    document.getElementById('cetak-massal-kelas').innerHTML = (md.kelas || []).map(k => `<option>${k}</option>`).join('');
  },

  async generate(jenis) {
    const idMap = { buku_induk: 'cetak-nisn-induk', rapor: 'cetak-nisn-rapor', ijazah: 'cetak-nisn-ijazah' };
    const nisn = document.getElementById(idMap[jenis]).value.trim();
    if (!nisn) { UI.toast('Isi NISN siswa terlebih dahulu.', 'error'); return; }
    UI.toast('Menyiapkan dokumen PDF di server...', 'warning');
    const res = await Api.post('cetakPdf', { jenis, nisn });
    if (res.success && res.data?.url) {
      UI.toast('PDF siap. Membuka tab unduhan...');
      window.open(res.data.url, '_blank');
    }
  },

  async generateMassal() {
    const kelas = document.getElementById('cetak-massal-kelas').value;
    const jenis = document.getElementById('cetak-massal-jenis').value;
    if (!confirm(`Cetak massal "${jenis}" untuk seluruh siswa kelas ${kelas}? Proses dijalankan per-batch di server dan hasil diarsipkan ke Drive.`)) return;
    UI.toast('Mencetak massal, proses berjalan di latar belakang...', 'warning');
    const res = await Api.post('cetakMassal', { kelas, jenis });
    if (res.success) UI.toast(`${res.data?.jumlah ?? ''} dokumen berhasil diarsipkan ke folder Arsip PDF.`);
  }
};
