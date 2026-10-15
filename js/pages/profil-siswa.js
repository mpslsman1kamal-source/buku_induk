// ============================================
// PROFIL SISWA — F3/F4: tab A-J, Berkas, Nilai, Ekskul/P5/Absensi, Riwayat
// ============================================
Pages.profilSiswa = {
  currentId: null,
  currentTab: 'biodata',
  data: null,

  async open(id) {
    Router.go('profil-siswa');
    this.currentId = id;
    document.getElementById('profil-header').innerHTML = `<div class="skeleton" style="height:60px"></div>`;
    const res = await Api.get('getSiswaDetail', { id });
    if (!res.success) return;
    this.data = res.data;
    this.renderHeader();
    this.renderTabs();
    this.switchTab('biodata');
  },

  renderHeader() {
    const s = this.data.biodata;
    document.getElementById('profil-header').innerHTML = `
      <div style="display:flex;gap:1rem;align-items:center;flex-wrap:wrap">
        <div style="width:64px;height:64px;border-radius:.6rem;background:var(--sky-deep);display:flex;align-items:center;justify-content:center;color:var(--primary);font-size:26px;overflow:hidden">
          ${s.fotoUrl ? `<img src="${s.fotoUrl}" style="width:100%;height:100%;object-fit:cover"/>` : `<span class="material-symbols-outlined">person</span>`}
        </div>
        <div style="flex:1;min-width:200px">
          <h2 style="font-size:17px;font-weight:700">${s.nama}</h2>
          <p class="field-hint mono">NISN ${s.nisn || '-'} &middot; NIS ${s.nis || '-'} &middot; Kelas ${s.kelas || '-'}</p>
        </div>
        ${UI.badgeForStatus(s.status)}
      </div>`;
  },

  renderTabs() {
    const tabs = [
      ['biodata', 'Biodata A–J'], ['ortu', 'Orang Tua/Wali'], ['nilai', 'Nilai Rapor'],
      ['epa', 'Ekskul/P5/Absensi'], ['berkas', 'Berkas'], ['riwayat', 'Riwayat Kelas']
    ];
    document.getElementById('profil-tabs').innerHTML = tabs.map(([id, label]) =>
      `<button class="tab-btn ${id === this.currentTab ? 'active' : ''}" onclick="Pages.profilSiswa.switchTab('${id}')">${label}</button>`).join('');
  },

  switchTab(tab) {
    this.currentTab = tab;
    this.renderTabs();
    const c = document.getElementById('profil-tab-content');
    const d = this.data;

    if (tab === 'biodata') {
      c.innerHTML = this.kv(d.biodata);
    } else if (tab === 'ortu') {
      c.innerHTML = (d.ortu || []).map(o => `<h4 style="margin-bottom:.5rem">${o.jenis}</h4>${this.kv(o)}<hr style="border-color:var(--border);margin:1rem 0"/>`).join('') || UI.emptyState('family_restroom', 'Belum ada data.');
    } else if (tab === 'nilai') {
      const rows = (d.nilai || []).map(n => `<tr><td>${n.mapel}</td><td class="mono">${n.tahun}</td><td>${n.kelas}</td><td>${n.semester}</td><td>${n.capaian}</td><td class="mono">${n.nilai}</td></tr>`).join('');
      c.innerHTML = `<div class="table-scroll"><table class="data-table"><thead><tr><th>Mapel</th><th>Tahun</th><th>Kelas</th><th>Semester</th><th>Capaian KKTP</th><th>Nilai</th></tr></thead><tbody>${rows || `<tr><td colspan="6">${UI.emptyState('grade','Belum ada nilai.')}</td></tr>`}</tbody></table></div>`;
    } else if (tab === 'epa') {
      c.innerHTML = `
        <h4>Ekstrakurikuler</h4>${this.simpleTable(d.ekskul, ['tahun', 'semester', 'kegiatan', 'predikat'])}
        <h4 style="margin-top:1rem">Projek P5</h4>${this.simpleTable(d.p5, ['tahun', 'tema', 'dimensi', 'capaian'])}
        <h4 style="margin-top:1rem">Ketidakhadiran</h4>${this.simpleTable(d.absensi, ['tahun', 'semester', 'sakit', 'izin', 'tanpaKeterangan'])}`;
    } else if (tab === 'berkas') {
      const files = (d.berkas || []).map(f => `<tr><td>${f.jenis}</td><td class="mono" style="font-size:11px">${f.tanggal}</td><td><a href="${f.url}" target="_blank" class="btn btn-sm btn-ghost">Lihat</a></td></tr>`).join('');
      c.innerHTML = `<div class="table-scroll"><table class="data-table"><thead><tr><th>Jenis Berkas</th><th>Tanggal Unggah</th><th>Aksi</th></tr></thead><tbody>${files || `<tr><td colspan="3">${UI.emptyState('folder_off','Belum ada berkas.')}</td></tr>`}</tbody></table></div>`;
    } else if (tab === 'riwayat') {
      const rows = (d.riwayat || []).map(r => `<tr><td class="mono">${r.tahun}</td><td>${r.kelas}</td><td>${r.program || '-'}</td><td>${UI.badgeForStatus(r.hasil)}</td><td class="mono" style="font-size:11px">${r.tanggal}</td></tr>`).join('');
      c.innerHTML = `<div class="table-scroll"><table class="data-table"><thead><tr><th>Tahun</th><th>Kelas</th><th>Program</th><th>Hasil</th><th>Tanggal</th></tr></thead><tbody>${rows || `<tr><td colspan="5">${UI.emptyState('history','Belum ada riwayat.')}</td></tr>`}</tbody></table></div>`;
    }
  },

  kv(obj) {
    if (!obj) return UI.emptyState('description', 'Tidak ada data.');
    return `<div class="grid grid-2">${Object.entries(obj).filter(([k]) => k !== 'fotoUrl').map(([k, v]) =>
      `<div><label>${k}</label><p style="font-size:13px">${v || '-'}</p></div>`).join('')}</div>`;
  },

  simpleTable(rows, cols) {
    if (!rows || !rows.length) return UI.emptyState('inbox', 'Belum ada data.');
    return `<div class="table-scroll"><table class="data-table"><thead><tr>${cols.map(c => `<th>${c}</th>`).join('')}</tr></thead>
      <tbody>${rows.map(r => `<tr>${cols.map(c => `<td>${r[c] ?? '-'}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  }
};
