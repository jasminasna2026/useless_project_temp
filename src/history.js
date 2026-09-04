/* ==========================================================================
   TOSS THE UNSURE — Flip History & Analytics Logger
   ========================================================================== */

class HistoryTracker {
  constructor() {
    this.flips = [];
    this.totalCount = 0;
    this.unsureCount = 0;
    this.edgeCount = 0;

    this.statTotalEl = document.getElementById('stat-total-flips');
    this.statUnsureEl = document.getElementById('stat-unsure');
    this.statEdgeEl = document.getElementById('stat-edge');
    this.statResolutionEl = document.getElementById('stat-resolution');
    this.historyListEl = document.getElementById('history-list');
  }

  addRecord(mode, detail = null) {
    this.totalCount++;
    this.unsureCount++;
    this.edgeCount++;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const record = {
      id: this.totalCount,
      timestamp,
      mode,
      detail,
      result: 'UNSURE',
      landing: 'VERTICAL EDGE'
    };

    this.flips.unshift(record);
    this.updateUI();
  }

  updateUI() {
    if (this.statTotalEl) this.statTotalEl.textContent = this.totalCount;
    if (this.statUnsureEl) this.statUnsureEl.textContent = `${this.unsureCount} (100%)`;
    if (this.statEdgeEl) this.statEdgeEl.textContent = `${this.edgeCount} (100%)`;
    if (this.statResolutionEl) this.statResolutionEl.textContent = '0.0%';

    if (!this.historyListEl) return;

    if (this.flips.length === 0) {
      this.historyListEl.innerHTML = `<div class="empty-history">No tosses recorded yet.</div>`;
      return;
    }

    this.historyListEl.innerHTML = this.flips.map(f => `
      <div class="history-item">
        <div class="history-item-header">
          <span>#${f.id} — ${f.result}</span>
          <span style="font-size:10px; color:var(--text-muted);">${f.timestamp}</span>
        </div>
        <div class="history-item-sub">
          Mode: ${f.mode} &bull; Landing: ${f.landing}
          ${f.detail ? `<br>Context: ${f.detail}` : ''}
        </div>
      </div>
    `).join('');
  }
}

const historyTracker = new HistoryTracker();
