// ============================================
// FORM SISWA BARU — F2: formulir bertahap A-J + foto & berkas, autosave draf
// ============================================
Pages.formSiswaBaru = {
  step: 0,
  draftKey: 'bid_draft_siswa_baru',
  steps: [
    { id: 'A', label: 'A. Identitas', fields: [
      ['nama', 'Nama Lengkap', 'text', true], ['nis', 'NIS', 'text', true], ['nisn', 'NISN', 'text', true],
      ['nik', 'NIK', 'text', true], ['jk', 'Jenis Kelamin', 'select:Laki-laki,Perempuan', true],
      ['tempatLahir', 'Tempat Lahir', 'text', false], ['tanggalLahir', 'Tanggal Lahir', 'date', false], ['agama', 'Agama', 'text', true]
    ]},
    { id: 'B-D', label: 'B–D. Tempat Tinggal & Kesehatan', fields: [
      ['alamat', 'Alamat Lengkap', 'text', false], ['anakKe', 'Anak ke-', 'number', false],
      ['tinggiBadan', 'Tinggi Badan (cm)', 'number', false], ['beratBadan', 'Berat Badan (kg)', 'number', false],
      ['golonganDarah', 'Golongan Darah', 'text', false], ['riwayatPenyakit', 'Riwayat Penyakit', 'text', false]
    ]},
    { id: 'H-J', label: 'H–J. Pendidikan & Pengembangan Diri', fields: [
      ['asalSekolah', 'Asal Sekolah (SMP)', 'text', false], ['noIjazahSmp', 'No. Ijazah SMP', 'text', false],
      ['minatBakat', 'Minat & Bakat', 'text', false], ['tanggalMasuk', 'Tanggal Masuk', 'date', true],
      ['kelasAwal', 'Kelas Awal (mis. X-1)', 'text', true]
    ]},
    { id: 'berkas', label: 'Foto & Berkas', fields: [
      ['foto', 'Foto 3x4 (JPG/PNG, maks 1MB)', 'file', false],
      ['ijazahSmp', 'Ijazah SMP (JPG/PNG/PDF, maks 5MB)', 'file', false],
      ['kk', 'Kartu Keluarga', 'file', false], ['aktaLahir', 'Akta Lahir', 'file', false], ['kip', 'KIP (opsional)', 'file', false]
    ]}
  ],

  load() {
    this.step = 0;
    this.values = this.restoreDraft();
    this.renderSteps();
    this.renderForm();
  },

  restoreDraft() {
    try { return JSON.parse(localStorage.getItem(this.draftKey) || '{}'); } catch { return {}; }
  },

  saveDraft(notify) {
    const form = document.getElementById('fsb-form');
    const data = new FormData(form);
    const values = this.values || {};
    data.forEach((v, k) => { if (!(v instanceof File)) values[k] = v; });
    this.values = values;
    localStorage.setItem(this.draftKey, JSON.stringify(values)); // Prinsip 2: draf tersimpan lokal instan
    if (notify) UI.toast('Draf tersimpan di perangkat ini.');
  },

  renderSteps() {
    document.getElementById('fsb-steps').innerHTML = this.steps.map((s, i) => `
      <div class="step-chip ${i === this.step ? 'active' : i < this.step ? 'done' : ''}">
        <span class="material-symbols-outlined" style="font-size:14px">${i < this.step ? 'check_circle' : 'radio_button_unchecked'}</span>
        ${s.label}
      </div>`).join('');
  },

  renderForm() {
    this.saveDraft(false);
    const s = this.steps[this.step];
    const form = document.getElementById('fsb-form');
    form.innerHTML = `<h3 style="margin-bottom:1rem">Bagian ${s.label}</h3><div class="grid grid-2">` +
      s.fields.map(([key, label, type, required]) => {
        const val = this.values[key] || '';
        if (type === 'file') {
          return `<div class="field"><label>${label}</label><input type="file" name="${key}" class="input"/></div>`;
        }
        if (type.startsWith('select:')) {
          const opts = type.split(':')[1].split(',');
          return `<div class="field"><label>${label}${required ? ' *' : ''}</label>
            <select name="${key}" class="input" ${required ? 'required' : ''}>
              <option value="">Pilih...</option>${opts.map(o => `<option ${val === o ? 'selected' : ''}>${o}</option>`).join('')}
            </select></div>`;
        }
        const monoCls = ['nis', 'nisn', 'nik'].includes(key) ? 'mono-input' : '';
        return `<div class="field"><label>${label}${required ? ' *' : ''}</label>
          <input class="input ${monoCls}" type="${type}" name="${key}" value="${val}" ${required ? 'required' : ''}/></div>`;
      }).join('') + '</div>';
    document.getElementById('fsb-prev').style.visibility = this.step === 0 ? 'hidden' : 'visible';
    document.getElementById('fsb-next').textContent = this.step === this.steps.length - 1 ? 'Simpan Siswa Baru' : 'Selanjutnya';
  },

  prevStep() { if (this.step > 0) { this.saveDraft(); this.step--; this.renderSteps(); this.renderForm(); } },

  async nextStep() {
    const form = document.getElementById('fsb-form');
    if (!form.reportValidity()) return;
    this.saveDraft();
    if (this.step < this.steps.length - 1) {
      this.step++; this.renderSteps(); this.renderForm();
      return;
    }
    // Submit final — cek duplikasi NIS/NISN/NIK dilakukan di server
    const btn = document.getElementById('fsb-next');
    btn.disabled = true; btn.textContent = 'Menyimpan...';
    const res = await Api.post('createSiswa', this.values);
    btn.disabled = false; btn.textContent = 'Simpan Siswa Baru';
    if (res.success) {
      UI.toast('Siswa baru berhasil disimpan.');
      localStorage.removeItem(this.draftKey);
      appState.students = null; // invalidate cache lokal
      Router.go('data-siswa');
    }
  }
};
