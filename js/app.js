// ============================================
// APP BOOTSTRAP
// ============================================
window.appState = {
  masterData: null,   // cache mapel/kelas/tahun pelajaran (Prinsip 3: cache sisi klien)
  students: null,     // cache daftar siswa untuk pencarian lokal instan
  studentsFiltered: null,
  dsPage: 1,
  dsPageSize: 10
};

const App = {
  async boot() {
    const session = Auth.session();
    if (!session) {
      document.getElementById('view-login').classList.remove('hidden');
      document.getElementById('view-denied').classList.add('hidden');
      document.getElementById('app-shell').classList.add('hidden');
      return;
    }

    document.getElementById('view-login').classList.add('hidden');
    document.getElementById('view-denied').classList.add('hidden');
    document.getElementById('app-shell').classList.remove('hidden');

    document.getElementById('sidebar-user-name').textContent = session.user.nama || session.user.email;
    document.getElementById('sidebar-user-role').textContent = session.role;
    document.getElementById('top-role-text').textContent = session.role;

    Router.renderSidebar();

    // Muat master data sekali (di-cache backend via CacheService + di appState klien)
    const md = await Api.get('getMasterData');
    if (md.success) appState.masterData = md.data;

    Router.go('dashboard');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  App.boot();

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      Router.go('data-siswa');
      document.getElementById('ds-search')?.focus();
    }
  });
});
