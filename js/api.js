// ============================================
// API — komunikasi dengan backend GAS (REST murni, tanpa google.script.run)
// ============================================
const Api = {
  async get(action, params = {}) {
    const qs = new URLSearchParams({ action, ...params, token: Auth.token() || '' }).toString();
    try {
      const res = await fetch(`${GAS_URL}?${qs}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Gagal memuat data');
      return json;
    } catch (err) {
      UI.toast('Gagal memuat data: ' + err.message, 'error');
      return { success: false, data: null };
    }
  },

  // POST wajib text/plain agar tidak kena CORS preflight yang diblok GAS
  async post(action, data = {}) {
    try {
      const res = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action, token: Auth.token() || '', data })
      });
      const json = await res.json();
      if (!json.success) UI.toast(json.message || 'Operasi gagal', 'error');
      return json;
    } catch (err) {
      UI.toast('Gagal mengirim data: ' + err.message, 'error');
      return { success: false };
    }
  }
};
