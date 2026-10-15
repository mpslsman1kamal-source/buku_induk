// ============================================
// EKSKUL / P5 / ABSENSI — F6
// ============================================
Pages.epa = {
  tab: 'ekskul',
  siswaId: null,

  load() {
    document.getElementById('epa-content').innerHTML = UI.emptyState('person_search', 'Cari siswa untuk mulai mengisi data.');
  },

  switchTab(tab) {
    this.tab = tab;
    document.querySelectorAll('#epa-tabs .tab-btn').forEach((b, i) =>
      b.classList.toggle('active', ['ekskul', 'p5', 'absensi'][i] === tab));
    if (this.siswaId) this.renderForm();
  },

  search: UI.debounce(async function (q) {
    if (!q || q.length < 3) return;
    const res = await Api.get('getSiswa', { ringkas: 1, q });
    const list = res.success ? res.data.slice(0, 6) : [];
    const c = document.getElementById('epa-content');
    c.innerHTML = list.length ? `<div class="table-scroll"><table class="data-table"><thead><tr><th>NISN</th><th>Nama</th><th>Kelas</th><th></th></tr></thead><tbody>
      ${list.map(s => `<tr><td class="mono">${s.nisn}</td><td>${s.nama}</td><td>${s.kelas}</td>
      <td><button class="btn btn-sm btn-ghost" onclick="Pages.epa.select('${s.id}','${s.nama.replace(/'/g, '')}')">Pilih</button></td></tr>`).join('')}
      </tbody></table></div>` : UI.emptyState('search_off', 'Tidak ditemukan.');
  }, 300),

  select(id, nama) {
    this.siswaId = id;
    this.siswaNama = nama;
    this.renderForm();
  },

  async renderForm() {
    const c = document.getElementById('epa-content');
    c.innerHTML = `<p style="margin-bottom:.8rem">Mengisi untuk: <b>${this.siswaNama}</b></p><div class="skeleton" style="height:120px"></div>`;
    const res = await Api.get('getEpaSiswa', { id: this.siswaId, jenis: this.tab });
    const rows = res.success ? res.data : [];
    const fieldsMap = {
      ekskul: ['tahun', 'semester', 'kegiatan', 'predikat'],
      p5: ['tahun', 'tema', 'dimensi', 'capaian'],
      absensi: ['tahun', 'semester', 'sakit', 'izin', 'tanpaKeterangan']
    };
    const fields = fieldsMap[this.tab];
    c.innerHTML = `<p style="margin-bottom:.8rem">Mengisi untuk: <b>${this.siswaNama}</b></p>
      <div id="epa-rows">
        ${(rows.length ? rows : [{}]).map(r => this.rowHtml(fields, r)).join('')}
      </div>
      <button class="btn btn-sm btn-ghost" style="margin-top:.6rem" onclick="Pages.epa.addRow()">+ Tambah Baris</button>
      <div style="margin-top:1rem"><button class="btn btn-primary" onclick="Pages.epa.submit()">Simpan</button></div>`;
    this._fields = fields;
  },

  rowHtml(fields, r) {
    return `<div class="grid grid-${fields.length}" style="margin-bottom:.5rem" data-epa-row>
      ${fields.map(f => `<input class="input" placeholder="${f}" data-f="${f}" value="${r[f] || ''}"/>`).join('')}
    </div>`;
  },

  addRow() {
    document.getElementById('epa-rows').insertAdjacentHTML('beforeend', this.rowHtml(this._fields, {}));
  },

  async submit() {
    const rows = [...document.querySelectorAll('[data-epa-row]')].map(div => {
      const obj = {};
      div.querySelectorAll('[data-f]').forEach(inp => obj[inp.dataset.f] = inp.value);
      return obj;
    }).filter(r => Object.values(r).some(v => v));
    const res = await Api.post('saveEpaBatch', { id: this.siswaId, jenis: this.tab, rows });
    if (res.success) UI.toast('Data tersimpan.');
  }
};
