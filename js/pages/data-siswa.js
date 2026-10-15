// ============================================
// DATA SISWA — F3 (cari & daftar) dengan filter lokal instan (Prinsip 2/3)
// ============================================
Pages.dataSiswa = {
  async load() {
    if (!appState.students) {
      document.querySelector('#ds-table tbody').innerHTML = UI.skeletonRows(6, 5);
      const res = await Api.get('getSiswa', { ringkas: 1 });
      appState.students = res.success ? res.data : [];
      this.populateFilterKelas();
    }
    appState.studentsFiltered = appState.students;
    appState.dsPage = 1;
    this.render();
  },

  populateFilterKelas() {
    const sel = document.getElementById('ds-filter-kelas');
    const kelasList = [...new Set(appState.students.map(s => s.kelas).filter(Boolean))].sort();
    sel.innerHTML = '<option value="">Semua</option>' + kelasList.map(k => `<option>${k}</option>`).join('');
  },

  onSearchInput: UI.debounce(function (q) {
    document.getElementById('ds-search').value = q;
    Pages.dataSiswa.applyFilters();
  }, 250),

  applyFilters() {
    const q = (document.getElementById('ds-search').value || '').toLowerCase();
    const kelas = document.getElementById('ds-filter-kelas').value;
    const status = document.getElementById('ds-filter-status').value;
    appState.studentsFiltered = (appState.students || []).filter(s => {
      const matchQ = !q || s.nama.toLowerCase().includes(q) || String(s.nis).includes(q) || String(s.nisn).includes(q);
      const matchKelas = !kelas || s.kelas === kelas;
      const matchStatus = !status || s.status === status;
      return matchQ && matchKelas && matchStatus;
    });
    appState.dsPage = 1;
    this.render();
  },

  render() {
    const pageSize = appState.dsPageSize;
    const data = appState.studentsFiltered || [];
    const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
    appState.dsPage = Math.min(appState.dsPage, totalPages);
    const start = (appState.dsPage - 1) * pageSize;
    const pageData = data.slice(start, start + pageSize);

    const tbody = document.querySelector('#ds-table tbody');
    tbody.innerHTML = pageData.length ? pageData.map(s => `
      <tr>
        <td class="mono">${s.nisn || '-'}</td>
        <td>${s.nama}</td>
        <td class="mono">${s.kelas || '-'}</td>
        <td>${s.jk || '-'}</td>
        <td>${UI.badgeForStatus(s.status)}</td>
        <td><button class="btn btn-sm btn-ghost" onclick="Pages.profilSiswa.open('${s.id}')">Buka Profil</button></td>
      </tr>`).join('') : `<tr><td colspan="6">${UI.emptyState('search_off', 'Tidak ada siswa yang cocok.')}</td></tr>`;

    document.getElementById('ds-pag-info').textContent = `${data.length} data ditemukan`;
    const pag = document.getElementById('ds-pagination');
    let btns = '';
    for (let p = 1; p <= totalPages; p++) {
      btns += `<button class="btn btn-sm ${p === appState.dsPage ? 'btn-primary' : 'btn-ghost'}" onclick="Pages.dataSiswa.goPage(${p})">${p}</button>`;
    }
    pag.innerHTML = btns;
  },

  goPage(p) { appState.dsPage = p; this.render(); }
};
