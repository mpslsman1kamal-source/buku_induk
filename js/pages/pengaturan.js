// ============================================
// PENGATURAN — F13: kelola pengguna & master data (Admin only)
// ============================================
Pages.pengaturan = {
  tab: 'pengguna',

  load() { this.render(); },

  switchTab(tab) {
    this.tab = tab;
    document.querySelectorAll('#section-pengaturan .tab-btn').forEach((b, i) => b.classList.toggle('active', (tab === 'pengguna') === (i === 0)));
    this.render();
  },

  async render() {
    const c = document.getElementById('pengaturan-content');
    c.innerHTML = UI.skeletonRows(4, 4);
    if (this.tab === 'pengguna') {
      const res = await Api.get('getPengguna');
      const rows = res.success ? res.data : [];
      c.innerHTML = `
        <div style="display:flex;justify-content:flex-end;margin-bottom:.8rem">
          <button class="btn btn-primary btn-sm" onclick="Pages.pengaturan.tambahPengguna()">+ Tambah Pengguna</button>
        </div>
        <div class="table-scroll"><table class="data-table"><thead><tr><th>Email</th><th>Nama</th><th>Peran</th><th>Status</th><th>Aksi</th></tr></thead>
        <tbody>${rows.map(p => `<tr><td class="mono">${p.email}</td><td>${p.nama}</td><td>${p.peran}</td>
          <td>${UI.badgeForStatus(p.aktif ? 'Aktif' : 'Berhenti')}</td>
          <td><button class="btn btn-sm btn-ghost" onclick="Pages.pengaturan.toggleAktif('${p.email}', ${!p.aktif})">${p.aktif ? 'Nonaktifkan' : 'Aktifkan'}</button></td></tr>`).join('') ||
          `<tr><td colspan="5">${UI.emptyState('group_off','Belum ada pengguna.')}</td></tr>`}</tbody></table></div>`;
    } else {
      const res = await Api.get('getMasterDataLengkap');
      const d = res.success ? res.data : {};
      c.innerHTML = Object.entries(d).map(([kategori, items]) => `
        <div style="margin-bottom:1rem">
          <h4 style="margin-bottom:.4rem">${kategori}</h4>
          <div style="display:flex;gap:.4rem;flex-wrap:wrap">${(items || []).map(i => `<span class="badge badge-neutral">${i}</span>`).join('')}</div>
        </div>`).join('') || UI.emptyState('tune', 'Belum ada master data.');
    }
  },

  tambahPengguna() {
    UI.modal({
      title: 'Tambah Pengguna',
      bodyHtml: `
        <div class="field"><label>Email Google Sekolah</label><input class="input" id="np-email"/></div>
        <div class="field"><label>Nama</label><input class="input" id="np-nama"/></div>
        <div class="field"><label>Peran</label><select class="input" id="np-peran"><option>Admin</option><option>Guru</option><option>Kepala Sekolah</option></select></div>`,
      footHtml: `<button class="btn btn-ghost" onclick="UI.closeModal()">Batal</button>
        <button class="btn btn-primary" onclick="Pages.pengaturan.simpanPengguna()">Simpan</button>`
    });
  },

  async simpanPengguna() {
    const payload = {
      email: document.getElementById('np-email').value,
      nama: document.getElementById('np-nama').value,
      peran: document.getElementById('np-peran').value
    };
    const res = await Api.post('tambahPengguna', payload);
    if (res.success) { UI.toast('Pengguna ditambahkan.'); UI.closeModal(); this.render(); }
  },

  async toggleAktif(email, aktif) {
    const res = await Api.post('setPenggunaAktif', { email, aktif });
    if (res.success) this.render();
  }
};
