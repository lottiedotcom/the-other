// --- INITIALIZATION ---
window.onload = function() {
    loadHistory();
    loadWights();
    loadLedger();
    checkBalance();
    initCanvas();
};

// --- TAB SWITCHING ---
function switchTab(sectionId) {
    document.querySelectorAll('section').forEach(s => s.classList.remove('active-section'));
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden-section'));
    
    const active = document.getElementById(sectionId);
    active.classList.remove('hidden-section');
    active.classList.add('active-section');

    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    event.currentTarget.classList.add('active');
}

// ==========================================
// 1. THE WELL (Complex Divination)
// ==========================================
const castBtn = document.getElementById('cast-btn');
let currentCast = []; // Stores the current temporary cast

castBtn.addEventListener('mousedown', startCast);
castBtn.addEventListener('touchstart', startCast);
castBtn.addEventListener('mouseup', endCast);
castBtn.addEventListener('touchend', endCast);

let castTimer;
let isCasting = false;

function startCast(e) {
    e.preventDefault();
    isCasting = true;
    castBtn.classList.add('casting');
    castBtn.innerText = "FOCUS...";
    if (navigator.vibrate) navigator.vibrate(50);
    
    castTimer = setTimeout(() => {
        if(isCasting) performCast();
    }, 1500);
}

function endCast() {
    isCasting = false;
    clearTimeout(castTimer);
    castBtn.classList.remove('casting');
    castBtn.innerText = "HOLD TO GAZE";
}

function performCast() {
    isCasting = false;
    castBtn.classList.remove('casting');
    if (navigator.vibrate) navigator.vibrate([50, 50, 50]);

    const spreadType = parseInt(document.getElementById('spread-select').value);
    const allowRev = document.getElementById('reversal-toggle').checked;
    const resultsDiv = document.getElementById('cast-results');
    
    currentCast = []; // Reset
    resultsDiv.innerHTML = '';
    resultsDiv.classList.remove('hidden');
    document.getElementById('save-area').classList.remove('hidden');

    // Generate Runes
    for (let i = 0; i < spreadType; i++) {
        let r = runesData[Math.floor(Math.random() * runesData.length)];
        let rev = allowRev && Math.random() > 0.5;
        
        currentCast.push({ rune: r, reversed: rev });

        // Create UI Card
        let card = document.createElement('div');
        card.className = 'rune-result-card';
        card.innerHTML = `
            <span class="rune-glyph" style="transform: ${rev ? 'rotate(180deg)' : 'none'}">${r.symbol}</span>
            <strong>${r.name} ${rev ? '(Rev)' : ''}</strong><br>
            <small>${rev ? r.meaningRev : r.meaning}</small>
        `;
        resultsDiv.appendChild(card);
    }
}

function saveCast() {
    const query = document.getElementById('query-input').value;
    const notes = document.getElementById('cast-notes').value;
    if(!query && !notes) return alert("Enter a query or notes first.");

    const entry = {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        query: query || "Untitled Cast",
        runes: currentCast.map(c => c.rune.name + (c.reversed ? " (Rev)" : "")).join(", "),
        notes: notes
    };

    let history = JSON.parse(localStorage.getItem('runeHistory')) || [];
    history.unshift(entry);
    localStorage.setItem('runeHistory', JSON.stringify(history));
    
    // Reset UI
    document.getElementById('query-input').value = '';
    document.getElementById('cast-notes').value = '';
    document.getElementById('cast-results').classList.add('hidden');
    document.getElementById('save-area').classList.add('hidden');
    loadHistory();
}

function loadHistory() {
    const list = document.getElementById('cast-history-list');
    const history = JSON.parse(localStorage.getItem('runeHistory')) || [];
    list.innerHTML = history.map(h => `
        <div class="history-item">
            <strong>${h.date}</strong>: ${h.query}<br>
            <span class="tags">${h.runes}</span><br>
            <small><em>"${h.notes}"</em></small>
        </div>
    `).join('');
}

function filterHistory() {
    const term = document.getElementById('search-bar').value.toLowerCase();
    const items = document.querySelectorAll('.history-item');
    items.forEach(item => {
        item.style.display = item.innerText.toLowerCase().includes(term) ? 'block' : 'none';
    });
}

// ==========================================
// 2. WIGHT WATCHER (Database)
// ==========================================
function toggleForm(id) {
    document.getElementById(id).classList.toggle('hidden-form');
}

function saveWight() {
    const name = document.getElementById('wight-name').value;
    if(!name) return;

    const wight = {
        id: Date.now(),
        name: name,
        class: document.getElementById('wight-class').value,
        location: document.getElementById('wight-loc').value,
        likes: document.getElementById('wight-likes').value,
        dislikes: document.getElementById('wight-dislikes').value,
        standing: document.getElementById('wight-standing').value
    };

    let wights = JSON.parse(localStorage.getItem('myWights')) || [];
    wights.push(wight);
    localStorage.setItem('myWights', JSON.stringify(wights));
    
    toggleForm('wight-form');
    loadWights();
}

function loadWights() {
    const list = document.getElementById('wight-list');
    const wights = JSON.parse(localStorage.getItem('myWights')) || [];
    
    list.innerHTML = wights.map(w => {
        let color = w.standing > 75 ? 'var(--friendly)' : (w.standing < 25 ? 'var(--danger)' : '#38bdf8');
        return `
        <div class="wight-card" style="border-left-color: ${color}">
            <h4>${w.name} <small>(${w.class})</small></h4>
            <div class="tags">📍 ${w.location}</div>
            <div class="tags">❤️ ${w.likes} | 🚫 ${w.dislikes}</div>
            <div class="status-bar"><div class="status-fill" style="width:${w.standing}%; background:${color}"></div></div>
        </div>
    `}).join('');
}

// ==========================================
// 3. THE LEDGER (Reciprocity & Dimming)
// ==========================================
function logOffering(type) {
    const entry = { date: new Date().toLocaleString(), type: type };
    saveLedgerEntry(entry);
}

function logCustomOffering() {
    const type = document.getElementById('custom-offering').value;
    if(type) logOffering(type);
}

function saveLedgerEntry(entry) {
    let ledger = JSON.parse(localStorage.getItem('myLedger')) || [];
    ledger.unshift(entry);
    localStorage.setItem('myLedger', JSON.stringify(ledger));
    localStorage.setItem('lastOffering', Date.now()); // Update timestamp
    loadLedger();
    checkBalance(); // Refresh screen brightness
}

function loadLedger() {
    const list = document.getElementById('ledger-list');
    const ledger = JSON.parse(localStorage.getItem('myLedger')) || [];
    list.innerHTML = ledger.slice(0, 10).map(l => `
        <div class="ledger-item">
            <span>Given: <strong>${l.type}</strong></span><br>
            <small>${l.date}</small>
        </div>
    `).join('');
}

function checkBalance() {
    const last = localStorage.getItem('lastOffering');
    const statusEl = document.getElementById('balance-status');
    const main = document.getElementById('main-world');
    
    if(!last) {
        statusEl.innerText = "No offerings recorded.";
        return;
    }

    const diff = Date.now() - parseInt(last);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days >= 3) {
        document.body.classList.add('dimmed-world');
        statusEl.innerText = `Balance: LOW. Last offering ${days} days ago.`;
        statusEl.style.color = "var(--danger)";
    } else {
        document.body.classList.remove('dimmed-world');
        statusEl.innerText = "Balance: Healthy.";
        statusEl.style.color = "var(--friendly)";
    }
}

// ==========================================
// 4. BINDRUNE CANVAS
// ==========================================
let canvas, ctx, painting = false;

function initCanvas() {
    canvas = document.getElementById('rune-canvas');
    ctx = canvas.getContext('2d');
    
    // Fix resolution for phones
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'black'; // Drawing on white canvas

    // Events
    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mouseup', endDraw);
    canvas.addEventListener('mousemove', draw);
    
    canvas.addEventListener('touchstart', (e) => startDraw(e.touches[0]));
    canvas.addEventListener('touchend', endDraw);
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        draw(e.touches[0]);
    });
}

function startDraw(e) {
    painting = true;
    draw(e);
}
function endDraw() {
    painting = false;
    ctx.beginPath();
}
function draw(e) {
    if(!painting) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function saveCanvas() {
    const link = document.createElement('a');
    link.download = 'bindrune.png';
    link.href = canvas.toDataURL();
    link.click();
}

