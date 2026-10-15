// ============================================
// UI HELPERS — toast, modal, loading, sidebar mobile
// ============================================
const UI = {
  toast(message, type = 'success') {
    const wrap = document.getElementById('toast-wrap');
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.textContent = message;
    wrap.appendChild(el);
    setTimeout(() => el.remove(), 3500);
  },

  toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
  },

  skeletonRows(cols, rows = 4) {
    let html = '';
    for (let r = 0; r < rows; r++) {
      html += '<tr>' + Array.from({ length: cols }).map(() =>
        `<td><div class="skeleton" style="height:14px;width:80%"></div></td>`).join('') + '</tr>';
    }
    return html;
  },

  emptyState(icon, text) {
    return `<div class="empty-state"><span class="material-symbols-outlined">${icon}</span><p>${text}</p></div>`;
  },

  modal({ title, bodyHtml, footHtml }) {
    const root = document.getElementById('modal-root');
    root.innerHTML = `
      <div class="modal-overlay" onclick="if(event.target===this) UI.closeModal()">
        <div class="modal-box">
          <div class="modal-head"><h3>${title}</h3>
            <button class="btn btn-sm btn-ghost" onclick="UI.closeModal()">
              <span class="material-symbols-outlined" style="font-size:16px">close</span>
            </button>
          </div>
          <div class="modal-body">${bodyHtml}</div>
          <div class="modal-foot">${footHtml || ''}</div>
        </div>
      </div>`;
  },

  closeModal() {
    document.getElementById('modal-root').innerHTML = '';
  },

  badgeForStatus(status) {
    const map = {
      Aktif: 'success', Enrolled: 'success', Lulus: 'success', Valid: 'success',
      Mutasi: 'warning', Pending: 'warning', 'Tidak Naik': 'warning',
      Berhenti: 'danger', Dropped: 'danger',
      Pindah: 'neutral', Alumni: 'neutral'
    };
    const cls = map[status] || 'neutral';
    return `<span class="badge badge-${cls}">${status || '-'}</span>`;
  },

  debounce(fn, delay = 300) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
  }
};
