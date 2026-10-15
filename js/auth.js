// ============================================
// AUTH — login sederhana berbasis email terdaftar (sheet Pengguna)
// Catatan: arsitektur frontend terpisah (gas-pro-api) tidak punya sesi
// Google OAuth lintas domain, jadi "login" di sini adalah pencocokan
// email + penerbitan token sesi sementara (CacheService di backend).
// Pemeriksaan peran SELALU divalidasi ulang di server pada setiap aksi.
// ============================================
const Auth = {
  _KEY: 'bid_session',

  session() {
    try { return JSON.parse(localStorage.getItem(this._KEY) || 'null'); }
    catch { return null; }
  },

  token() { return this.session()?.token || null; },
  role() { return this.session()?.role || null; },
  user() { return this.session()?.user || null; },

  async login() {
    const email = document.getElementById('login-email').value.trim();
    const msg = document.getElementById('login-msg');
    msg.textContent = '';
    if (!email) { msg.textContent = 'Email wajib diisi.'; return; }

    const btn = event.target.closest('button');
    btn.disabled = true;

    const res = await Api.post('login', { email });
    btn.disabled = false;

    if (res.success && res.data?.token) {
      localStorage.setItem(this._KEY, JSON.stringify(res.data));
      App.boot();
    } else if (res.message === 'AKSES_DITOLAK') {
      document.getElementById('view-login').classList.add('hidden');
      document.getElementById('view-denied').classList.remove('hidden');
    } else {
      msg.textContent = res.message || 'Email tidak ditemukan / tidak aktif.';
    }
  },

  logout() {
    localStorage.removeItem(this._KEY);
    location.reload();
  }
};
