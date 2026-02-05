// --- INITIALIZATION ---
window.onload = function() {
    loadHistory();
    loadWights();
    loadLedger();
    loadOaths();
    checkBalance();
    populateWightSuggestions();
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
// 1. THE WELL (Divination)
// ==========================================
const castBtn = document.getElementById('cast-btn');
let currentCast = [];

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
    castTimer = setTimeout(() => { if(isCasting) performCast(); }, 1500);
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
    
    currentCast = [];
    resultsDiv.innerHTML = '';
    resultsDiv.classList.remove('hidden');
    document.getElementById('save-area').classList.remove('hidden');

    for (let i = 0; i < spreadType; i++) {
        let r = runesData[Math.floor(Math.random() * runesData.length)];
        let rev = allowRev && Math.random() > 0.5;
        currentCast.push({ rune: r, reversed: rev });

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
    document.querySelectorAll('.history-item').forEach(item => {
        item.style.display = item.innerText.toLowerCase().includes(term) ? 'block' : 'none';
    });
}

// ==========================================
// 2. WIGHT WATCHER (Database)
// ==========================================
function toggleForm(id) {
    document.getElementById(id).classList.toggle('hidden-form');
}

function updateStandingLabel(val) {
    const label = document.getElementById('standing-text');
    if (val < 25) { label.innerText = "Hostile"; label.style.color = "#ef4444"; }
    else if (val < 45) { label.innerText = "Wary"; label.style.color = "#fbbf24"; }
    else if (val < 65) { label.innerText = "Neutral"; label.style.color = "#38bdf8"; }
    else if (val < 85) { label.innerText = "Friendly"; label.style.color = "#4ade80"; }
    else { label.innerText = "Ally"; label.style.color = "#22c55e"; }
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
    populateWightSuggestions(); // Refresh autocomplete
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

function populateWightSuggestions() {
    const wights = JSON.parse(localStorage.getItem('myWights')) || [];
    const datalist = document.getElementById('wight-suggestions');
    datalist.innerHTML = wights.map(w => `<option value="${w.name}">`).join('');
}

// ==========================================
// 3. THE LEDGER (Offering Log)
// ==========================================
function logOffering(type) {
    const target = document.getElementById('offering-target').value || "Unknown";
    const entry = { date: new Date().toLocaleString(), type: type, target: target };
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
    localStorage.setItem('lastOffering', Date.now());
    
    // Clear custom input but KEEP the target input (often you give multiple things to same entity)
    document.getElementById('custom-offering').value = '';
    
    loadLedger();
    checkBalance();
}

function loadLedger() {
    const list = document.getElementById('ledger-list');
    const ledger = JSON.parse(localStorage.getItem('myLedger')) || [];
    list.innerHTML = ledger.slice(0, 15).map(l => `
        <div class="ledger-item">
            <span style="color:#94a3b8; font-size:0.8rem;">To: ${l.target || 'Unknown'}</span><br>
            Given: <strong>${l.type}</strong><br>
            <small>${l.date}</small>
        </div>
    `).join('');
}

function checkBalance() {
    const last = localStorage.getItem('lastOffering');
    const statusEl = document.getElementById('balance-status');
    
    if(!last) { statusEl.innerText = "No offerings recorded."; return; }

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
// 4. THE OATH RING (New Module)
// ==========================================
function saveOath() {
    const text = document.getElementById('oath-text').value;
    const witness = document.getElementById('oath-witness').value;
    if(!text) return;

    const oath = {
        id: Date.now(),
        text: text,
        witness: witness || "The Void",
        status: "active"
    };

    let oaths = JSON.parse(localStorage.getItem('myOaths')) || [];
    oaths.push(oath);
    localStorage.setItem('myOaths', JSON.stringify(oaths));

    document.getElementById('oath-text').value = '';
    document.getElementById('oath-witness').value = '';
    loadOaths();
}

function loadOaths() {
    const list = document.getElementById('oath-list');
    let oaths = JSON.parse(localStorage.getItem('myOaths')) || [];
    
    // Show active oaths first
    oaths.sort((a,b) => (a.status === 'active' ? -1 : 1));

    list.innerHTML = oaths.map(o => {
        if(o.status === 'fulfilled') return ''; // Optional: Don't show fulfilled oaths to keep list clean
        
        return `
        <div class="oath-card">
            <button class="fulfill-btn" onclick="fulfillOath(${o.id})">✔ Fulfill</button>
            <span class="oath-witness">Witness: ${o.witness}</span>
            <span class="oath-text">"${o.text}"</span>
        </div>
    `}).join('');
}

function fulfillOath(id) {
    if(!confirm("Have you truly fulfilled this oath?")) return;
    
    let oaths = JSON.parse(localStorage.getItem('myOaths')) || [];
    const index = oaths.findIndex(o => o.id === id);
    if(index > -1) {
        oaths[index].status = 'fulfilled';
        localStorage.setItem('myOaths', JSON.stringify(oaths));
        loadOaths();
    }
}

