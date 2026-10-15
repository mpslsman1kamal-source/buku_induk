// ============================================
// FORM SISWA BARU — F2: formulir bertahap 10 Bagian (A-J) + foto & berkas,
// mengikuti struktur Buku Induk standar Permendikbud (lihat desain Stitch
// "05_form_siswa_baru_kelas_10") dan skema data PRD §4.1 (sheet Siswa +
// OrangTua_Wali, kolom Jenis: Bapak/Ibu/Wali).
// ============================================
Pages.formSiswaBaru = {
  step: 0,
  draftKey: 'bid_draft_siswa_baru',

  steps: [
    { id: 'A', label: 'A. Keterangan Diri', fields: [
      ['nama', 'Nama Lengkap (sesuai Ijazah/Akta)', 'text', true],
      ['namaPanggilan', 'Nama Panggilan', 'text', false],
      ['nis', 'NIS', 'text', true], ['nisn', 'NISN (10 digit)', 'text', true],
      ['nik', 'NIK (16 digit)', 'text', true],
      ['jk', 'Jenis Kelamin', 'select:Laki-laki,Perempuan', true],
      ['tempatLahir', 'Tempat Lahir', 'text', true], ['tanggalLahir', 'Tanggal Lahir', 'date', true],
      ['agama', 'Agama', 'text', true], ['kewarganegaraan', 'Kewarganegaraan', 'text', false],
      ['anakKe', 'Anak ke-', 'number', false], ['noHp', 'No. HP/WhatsApp Siswa', 'text', false]
    ]},
    { id: 'B', label: 'B. Tempat Tinggal', fields: [
      ['alamat', 'Alamat Lengkap (Jalan/Gang/No.)', 'text', true],
      ['rtRw', 'RT / RW', 'text', false], ['kodePos', 'Kode Pos', 'text', false],
      ['kelurahan', 'Kelurahan / Desa', 'text', false], ['kecamatan', 'Kecamatan', 'text', false],
      ['kabupaten', 'Kabupaten / Kota', 'text', false], ['provinsi', 'Provinsi', 'text', false],
      ['tinggalBersama', 'Tinggal Bersama Siapa', 'select:Orang Tua Kandung,Wali,Asrama/Kos,Lainnya', false],
      ['jarakSekolah', 'Jarak Tempat Tinggal ke Sekolah', 'text', false]
    ]},
    { id: 'C', label: 'C. Kesehatan', fields: [
      ['tinggiBadan', 'Tinggi Badan (cm)', 'number', false], ['beratBadan', 'Berat Badan (kg)', 'number', false],
      ['golonganDarah', 'Golongan Darah', 'text', false], ['riwayatPenyakit', 'Riwayat Penyakit (jika ada)', 'text', false]
    ]},
    { id: 'D', label: 'D. Pendidikan Asal', fields: [
      ['asalSekolah', 'Asal Sekolah (SMP/MTs)', 'text', true], ['noIjazahSmp', 'No. Ijazah SMP', 'text', false],
      ['tanggalMasuk', 'Tanggal Masuk SMAN 1 Kamal', 'date', true], ['kelasAwal', 'Kelas Awal (mis. X-1)', 'text', true]
    ]},
    { id: 'E', label: 'E. Data Ayah', fields: ortuFields('ayah', 'Ayah Kandung') },
    { id: 'F', label: 'F. Data Ibu', fields: ortuFields('ibu', 'Ibu Kandung') },
    { id: 'G', label: 'G. Data Wali', fields: ortuFields('wali', 'Wali (jika ada, selain orang tua)'), optional: true,
      note: 'Lewati bagian ini jika siswa tinggal bersama orang tua kandung.' },
    { id: 'H', label: 'H. Pengembangan Diri', fields: [
      ['minatBakat', 'Minat & Bakat', 'text', false],
      ['bahasaSeharihari', 'Bahasa Sehari-hari di Rumah', 'text', false]
    ]},
    { id: 'I-J', label: 'I–J. Catatan Tambahan', optional: true,
      note: 'Bagian I (Perkembangan/Beasiswa) dan J (Rencana Lanjut) akan dilengkapi otomatis saat proses Kenaikan Kelas, Berhenti, atau Kelulusan. Isi di sini hanya jika siswa sudah menerima beasiswa sejak awal masuk.',
      fields: [['beasiswa', 'Penerima Beasiswa (sebutkan, jika ada)', 'text', false]]
    },
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
      <div class="step-chip ${i === this.step ? 'active' : i < this.step ? 'done' : ''}" onclick="Pages.formSiswaBaru.jumpTo(${i})" style="cursor:pointer">
        <span class="material-symbols-outlined" style="font-size:14px">${i < this.step ? 'check_circle' : 'radio_button_unchecked'}</span>
        ${s.label}
      </div>`).join('');
  },

  jumpTo(i) { this.saveDraft(); this.step = i; this.renderSteps(); this.renderForm(); },

  renderForm() {
    this.saveDraft(false);
    const s = this.steps[this.step];
    const form = document.getElementById('fsb-form');
    const noteHtml = s.note ? `<p class="field-hint" style="margin-bottom:1rem;background:var(--sky-soft);padding:.6rem .8rem;border-radius:var(--radius-control)">${s.note}</p>` : '';
    form.innerHTML = `<h3 style="margin-bottom:.4rem">Bagian ${s.label}</h3>${noteHtml}<div class="grid grid-2">` +
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
        const monoCls = /nis|nisn|nik|noHp|noHpAyah|noHpIbu|noHpWali/i.test(key) ? 'mono-input' : '';
        return `<div class="field"><label>${label}${required ? ' *' : ''}</label>
          <input class="input ${monoCls}" type="${type}" name="${key}" value="${val}" ${required ? 'required' : ''}/></div>`;
      }).join('') + '</div>';
    document.getElementById('fsb-prev').style.visibility = this.step === 0 ? 'hidden' : 'visible';
    document.getElementById('fsb-next').textContent = this.step === this.steps.length - 1 ? 'Simpan Siswa Baru' : 'Selanjutnya';
  },

  prevStep() { if (this.step > 0) { this.saveDraft(); this.step--; this.renderSteps(); this.renderForm(); } },

  async nextStep() {
    const form = document.getElementById('fsb-form');
    const s = this.steps[this.step];
    // Bagian opsional (G, I-J) boleh dilewati tanpa validasi wajib-isi
    if (!s.optional && !form.reportValidity()) return;
    this.saveDraft();
    if (this.step < this.steps.length - 1) {
      this.step++; this.renderSteps(); this.renderForm();
      return;
    }

    const btn = document.getElementById('fsb-next');
    btn.disabled = true; btn.textContent = 'Menyimpan...';
    const res = await Api.post('createSiswa', this.buildPayload());
    btn.disabled = false; btn.textContent = 'Simpan Siswa Baru';
    if (res.success) {
      UI.toast('Siswa baru berhasil disimpan, termasuk data Orang Tua/Wali.');
      localStorage.removeItem(this.draftKey);
      appState.students = null; // invalidate cache lokal
      Router.go('data-siswa');
    }
  },

  // Rakit payload: field siswa flat + array `ortu` (Bapak/Ibu/Wali) sesuai
  // skema sheet OrangTua_Wali di backend (PRD §4.1).
  buildPayload() {
    const v = this.values;
    const ortu = [];
    const mapOrtu = (prefix, jenis) => {
      if (!v[prefix + 'Nama']) return; // lewati jika kosong (mis. Wali tidak diisi)
      ortu.push({
        jenis,
        nama: v[prefix + 'Nama'], nik: v[prefix + 'Nik'],
        pekerjaan: v[prefix + 'Pekerjaan'], pendidikan: v[prefix + 'Pendidikan'],
        penghasilan: v[prefix + 'Penghasilan'], noHp: v[prefix + 'NoHp']
      });
    };
    mapOrtu('ayah', 'Bapak');
    mapOrtu('ibu', 'Ibu');
    mapOrtu('wali', 'Wali');
    return { ...v, ortu };
  }
};

// Helper: generator field Ayah/Ibu/Wali yang seragam (dipakai E, F, G)
function ortuFields(prefix, defaultLabel) {
  return [
    [prefix + 'Nama', 'Nama ' + defaultLabel, 'text', prefix !== 'wali'],
    [prefix + 'Nik', 'NIK', 'text', false],
    [prefix + 'Pendidikan', 'Pendidikan Terakhir', 'text', false],
    [prefix + 'Pekerjaan', 'Pekerjaan', 'text', false],
    [prefix + 'Penghasilan', 'Penghasilan per Bulan', 'select:< Rp1.000.000,Rp1.000.000 - Rp3.000.000,Rp3.000.000 - Rp5.000.000,> Rp5.000.000', false],
    [prefix + 'NoHp', 'No. HP/WhatsApp', 'text', false]
  ];
}
