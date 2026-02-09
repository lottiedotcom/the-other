// --- INITIALIZATION ---
window.onload = function() {
    updateCelestialClock();
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
// 0. CELESTIAL CLOCK (Moon & Seasons)
// ==========================================
function updateCelestialClock() {
    const now = new Date();
    
    // Season Logic
    const month = now.getMonth(); 
    let season = "Unknown";
    if (month === 11 || month === 0) season = "Deep Winter";
    else if (month === 1 || month === 2) season = "The Thaw";
    else if (month === 3 || month === 4) season = "High Spring";
    else if (month === 5 || month === 6) season = "Sun Height";
    else if (month === 7 || month === 8) season = "Harvest";
    else if (month === 9 || month === 10) season = "The Dying";

    document.getElementById('season-text').innerText = season;

    // Moon Phase Logic (Approx)
    const knownNewMoon = new Date('2024-01-11T11:57:00'); 
    const cycleLength = 29.53059;
    const diffTime = now - knownNewMoon;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    const currentCycleDay = diffDays % cycleLength;

    let moonIcon = "🌑";
    let moonName = "New Moon";
    if (currentCycleDay < 1) { moonIcon = "🌑"; moonName = "New Moon"; }
    else if (currentCycleDay < 7) { moonIcon = "🌒"; moonName = "Waxing Crescent"; }
    else if (currentCycleDay < 9) { moonIcon = "🌓"; moonName = "First Quarter"; }
    else if (currentCycleDay < 14) { moonIcon = "🌔"; moonName = "Waxing Gibbous"; }
    else if (currentCycleDay < 16) { moonIcon = "🌕"; moonName = "Full Moon"; }
    else if (currentCycleDay < 21) { moonIcon = "🌖"; moonName = "Waning Gibbous"; }
    else if (currentCycleDay < 23) { moonIcon = "🌗"; moonName = "Last Quarter"; }
    else { moonIcon = "🌘"; moonName = "Waning Crescent"; }

    document.getElementById('moon-icon').innerText = moonIcon;
    document.getElementById('moon-text').innerText = moonName;
}

// ==========================================
// 1. THE WELL (Divination)
// ==========================================
const castBtn = document.getElementById('cast-btn');
let currentCast = [];
let castTimer;
let isCasting = false;

castBtn.addEventListener('mousedown', startCast);
castBtn.addEventListener('touchstart', startCast);
castBtn.addEventListener('mouseup', endCast);
castBtn.addEventListener('touchend', endCast);

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
// 2. WIGHT WATCHER (Dossier Database)
// ==========================================
function openWightForm(isEdit = false) {
    document.getElementById('wight-form').classList.remove('hidden-form');
    document.getElementById('form-title').innerText = isEdit ? "Edit Record" : "New Entry";
    document.getElementById('wight-list').style.display = 'none';
    document.getElementById('wight-section').scrollTop = 0;
}

function closeWightForm() {
    document.getElementById('wight-form').classList.add('hidden-form');
    document.getElementById('wight-list').style.display = 'block';
    clearWightForm();
}

function clearWightForm() {
    document.getElementById('wight-id').value = '';
    document.getElementById('wight-name').value = '';
    document.getElementById('wight-loc').value = '';
    document.getElementById('wight-likes').value = '';
    document.getElementById('wight-dislikes').value = '';
    document.getElementById('wight-notes').value = '';
    document.getElementById('wight-standing').value = 50;
    updateStandingLabel(50);
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
    const id = document.getElementById('wight-id').value;
    const name = document.getElementById('wight-name').value;
    if(!name) return alert("Name is required.");

    const wightData = {
        id: id ? parseInt(id) : Date.now(),
        name: name,
        class: document.getElementById('wight-class').value,
        location: document.getElementById('wight-loc').value,
        likes: document.getElementById('wight-likes').value,
        dislikes: document.getElementById('wight-dislikes').value,
        notes: document.getElementById('wight-notes').value,
        standing: document.getElementById('wight-standing').value
    };

    let wights = JSON.parse(localStorage.getItem('myWights')) || [];
    if (id) {
        const index = wights.findIndex(w => w.id === parseInt(id));
        if (index > -1) wights[index] = wightData;
    } else {
        wights.push(wightData);
    }

    localStorage.setItem('myWights', JSON.stringify(wights));
    closeWightForm();
    loadWights();
    populateWightSuggestions();
}

function editWight(id) {
    let wights = JSON.parse(localStorage.getItem('myWights')) || [];
    const w = wights.find(item => item.id === id);
    if (!w) return;
    document.getElementById('wight-id').value = w.id;
    document.getElementById('wight-name').value = w.name;
    document.getElementById('wight-class').value = w.class;
    document.getElementById('wight-loc').value = w.location;
    document.getElementById('wight-likes').value = w.likes;
    document.getElementById('wight-dislikes').value = w.dislikes;
    document.getElementById('wight-notes').value = w.notes || ''; 
    document.getElementById('wight-standing').value = w.standing;
    updateStandingLabel(w.standing);
    openWightForm(true);
}

function deleteWight(id) {
    if(!confirm("Banish this record?")) return;
    let wights = JSON.parse(localStorage.getItem('myWights')) || [];
    wights = wights.filter(w => w.id !== id);
    localStorage.setItem('myWights', JSON.stringify(wights));
    loadWights();
    populateWightSuggestions();
}

function loadWights() {
    const list = document.getElementById('wight-list');
    const wights = JSON.parse(localStorage.getItem('myWights')) || [];
    const filter = document.getElementById('wight-search').value.toLowerCase();
    
    wights.sort((a, b) => a.name.localeCompare(b.name));

    list.innerHTML = wights
        .filter(w => w.name.toLowerCase().includes(filter) || w.class.toLowerCase().includes(filter))
        .map(w => {
            let color = w.standing > 75 ? 'var(--friendly)' : (w.standing < 25 ? 'var(--danger)' : '#38bdf8');
            return `
            <div class="wight-card" style="border-left-color: ${color}">
                <div class="wight-header">
                    <h4>${w.name}</h4>
                    <span class="wight-type">${w.class}</span>
                </div>
                <div class="wight-details">
                    ${w.location ? `📍 ${w.location}<br>` : ''}
                    ${w.likes ? `❤️ ${w.likes}` : ''} ${w.dislikes ? ` | 🚫 ${w.dislikes}` : ''}
                </div>
                ${w.notes ? `<div class="wight-gnosis">"${w.notes}"</div>` : ''}
                <div class="status-bar" style="background:rgba(255,255,255,0.1)">
                    <div class="status-fill" style="width:${w.standing}%; background:${color}"></div>
                </div>
                <div class="card-actions">
                    <button class="action-btn edit-btn" onclick="editWight(${w.id})">EDIT</button>
                    <button class="action-btn banish-btn" onclick="deleteWight(${w.id})">BANISH</button>
                </div>
            </div>
        `}).join('');
}

function filterWights() { loadWights(); }

function populateWightSuggestions() {
    const wights = JSON.parse(localStorage.getItem('myWights')) || [];
    const datalist = document.getElementById('wight-suggestions');
    if(datalist) datalist.innerHTML = wights.map(w => `<option value="${w.name}">`).join('');
}

// ==========================================
// 3. THE LEDGER (Offerings)
// ==========================================
function logOffering(type) {
    const target = document.getElementById('offering-target').value || "Unknown";
    const entry = { date: new Date().toLocaleString(), type: type, target: target };
    
    let ledger = JSON.parse(localStorage.getItem('myLedger')) || [];
    ledger.unshift(entry);
    localStorage.setItem('myLedger', JSON.stringify(ledger));
    localStorage.setItem('lastOffering', Date.now());
    
    document.getElementById('custom-offering').value = '';
    loadLedger();
    checkBalance();
}

function logCustomOffering() {
    const type = document.getElementById('custom-offering').value;
    if(type) logOffering(type);
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
// 4. THE OATH RING
// ==========================================
function saveOath() {
    const text = document.getElementById('oath-text').value;
    const witness = document.getElementById('oath-witness').value;
    if(!text) return;
    const oath = { id: Date.now(), text: text, witness: witness || "The Void", status: "active" };
    
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
    oaths.sort((a,b) => (a.status === 'active' ? -1 : 1));

    list.innerHTML = oaths.map(o => {
        if(o.status === 'fulfilled') return ''; 
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

