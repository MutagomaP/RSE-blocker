// ── USER MENU ──
function toggleUserMenu() {
  const dd = document.getElementById('userDropdown');
  if (dd) dd.classList.toggle('open');
}
document.addEventListener('click', (e) => {
  const dd = document.getElementById('userDropdown');
  if (dd && !e.target.closest('.nav-user-menu')) dd.classList.remove('open');
});

// ── MOBILE MENU ──
function toggleMobileMenu() {
  const nav = document.querySelector('.navbar-nav');
  if (nav) nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
}

// ── ORDER FORM TABS ──
function switchOrderTab(side) {
  document.querySelectorAll('.trade-tab').forEach(t => t.classList.remove('active'));
  const tab = document.querySelector(`.trade-tab.${side}`);
  if (tab) tab.classList.add('active');
  const input = document.getElementById('orderSide');
  if (input) input.value = side;
  const submitBtn = document.getElementById('orderSubmitBtn');
  if (submitBtn) {
    submitBtn.className = `btn btn-lg btn-block btn-${side === 'buy' ? 'green' : 'danger'}`;
    submitBtn.textContent = side === 'buy' ? 'Place Buy Order' : 'Place Sell Order';
  }
}

// ── SECURITY SELECTOR IN ORDER FORM ──
function populateSecuritySelect(securitiesJson) {
  try {
    const securities = typeof securitiesJson === 'string' ? JSON.parse(securitiesJson) : securitiesJson;
    const sel = document.getElementById('securitySelect');
    if (!sel || !securities) return;
    sel.innerHTML = '<option value="">Select a security…</option>';
    securities.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.id;
      opt.textContent = `${s.ticker} — ${s.companyName}`;
      opt.dataset.price = s.currentPrice;
      sel.appendChild(opt);
    });
    sel.addEventListener('change', () => {
      const opt = sel.options[sel.selectedIndex];
      const priceEl = document.getElementById('currentPriceHint');
      if (priceEl && opt.dataset.price) {
        priceEl.textContent = `Current price: RWF ${parseFloat(opt.dataset.price).toFixed(2)}`;
      }
    });
  } catch (e) { console.error('Security populate error', e); }
}

// ── PRICE CHART ──
function renderPriceChart(containerId, historyJson) {
  try {
    const history = typeof historyJson === 'string' ? JSON.parse(historyJson) : historyJson;
    const canvas = document.getElementById(containerId);
    if (!canvas || !history || !history.length) return;
    if (typeof Chart === 'undefined') return;

    const labels = history.map(h => h.date);
    const prices = history.map(h => h.close);
    const firstPrice = prices[0];
    const lastPrice = prices[prices.length - 1];
    const isUp = lastPrice >= firstPrice;

    new Chart(canvas, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          data: prices,
          borderColor: isUp ? '#2d6934' : '#c0392b',
          backgroundColor: isUp ? 'rgba(45,105,52,0.06)' : 'rgba(192,57,43,0.06)',
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 4,
          fill: true,
          tension: 0.3,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: {
          callbacks: { label: ctx => `RWF ${ctx.raw.toFixed(2)}` },
        }},
        scales: {
          x: { grid: { display: false }, ticks: { maxTicksLimit: 6, font: { size: 11 } } },
          y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { size: 11 }, callback: v => `RWF ${v.toFixed(0)}` } },
        },
      },
    });
  } catch (e) { console.error('Chart error', e); }
}

// ── AUTO-DISMISS ALERTS ──
document.querySelectorAll('.alert').forEach(el => {
  setTimeout(() => el.style.opacity = '0', 5000);
});

// ── ORDER TYPE TOGGLE ──
const orderTypeSelect = document.getElementById('orderType');
if (orderTypeSelect) {
  orderTypeSelect.addEventListener('change', () => {
    const limitRow = document.getElementById('limitPriceRow');
    if (limitRow) {
      limitRow.style.display = orderTypeSelect.value === 'limit' ? 'block' : 'none';
    }
  });
}

console.log('RSE Platform — Rwanda Stock Exchange v1.0');
