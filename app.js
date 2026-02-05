// --- TAB SWITCHING ---
function switchTab(sectionId) {
    // Hide all sections
    document.querySelectorAll('section').forEach(sec => {
        sec.classList.remove('active-section');
        sec.classList.add('hidden-section');
    });
    // Show selected section
    const activeSec = document.getElementById(sectionId);
    activeSec.classList.remove('hidden-section');
    activeSec.classList.add('active-section');

    // Update buttons
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

// --- RUNE DIVINATION ---
const castBtn = document.getElementById('cast-btn');
const runeDisplay = document.getElementById('rune-display-area');

let holdTimer;
let isHolding = false;

// Mouse/Touch Down (Start Holding)
function startHold(e) {
    e.preventDefault(); 
    isHolding = true;
    castBtn.classList.add('casting');
    castBtn.innerText = "FOCUSING...";
    
    // Vibrate phone if supported
    if (navigator.vibrate) navigator.vibrate(50);
    
    // Wait 1.5 seconds then cast
    holdTimer = setTimeout(() => {
        if(isHolding) {
            castRune();
            isHolding = false;
            castBtn.classList.remove('casting');
            castBtn.innerText = "HOLD TO FOCUS";
            if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
        }
    }, 1500); // 1.5 seconds hold time
}

// Mouse/Touch Up (Cancel if too fast, or reset)
function endHold(e) {
    if (isHolding) {
        clearTimeout(holdTimer);
        isHolding = false;
        castBtn.classList.remove('casting');
        castBtn.innerText = "HOLD LONGER...";
        setTimeout(() => castBtn.innerText = "HOLD TO FOCUS", 1000);
    }
}

castBtn.addEventListener('mousedown', startHold);
castBtn.addEventListener('touchstart', startHold);
castBtn.addEventListener('mouseup', endHold);
castBtn.addEventListener('touchend', endHold);

function castRune() {
    const allowReverse = document.getElementById('reversal-toggle').checked;
    
    // Pick random Rune
    const randomRune = runesData[Math.floor(Math.random() * runesData.length)];
    
    // Determine orientation (50/50 chance if toggled)
    let isReversed = false;
    if (allowReverse && Math.random() > 0.5) {
        isReversed = true;
    }

    // Display Logic
    runeDisplay.classList.remove('hidden');
    
    const symbolEl = document.getElementById('rune-symbol');
    symbolEl.innerText = randomRune.symbol;
    
    // Rotate symbol if reversed
    if (isReversed) {
        symbolEl.style.transform = "rotate(180deg)";
        document.getElementById('rune-name').innerText = randomRune.name + " (Rev)";
        document.getElementById('rune-meaning').innerText = randomRune.meaningRev;
    } else {
        symbolEl.style.transform = "rotate(0deg)";
        document.getElementById('rune-name').innerText = randomRune.name;
        document.getElementById('rune-meaning').innerText = randomRune.meaning;
    }
    
    document.getElementById('rune-desc').innerText = randomRune.desc;
}

// --- OMEN ARCHIVE ---
const saveOmenBtn = document.getElementById('save-omen-btn');
const omenList = document.getElementById('omen-list');

// Load Omens on startup
window.onload = loadOmens;

saveOmenBtn.addEventListener('click', () => {
    const what = document.getElementById('omen-what').value;
    const meaning = document.getElementById('omen-meaning').value;
    
    if (!what) return;

    const omen = {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        what: what,
        meaning: meaning
    };

    // Save to LocalStorage
    let omens = JSON.parse(localStorage.getItem('myOmens')) || [];
    omens.unshift(omen); // Add to top
    localStorage.setItem('myOmens', JSON.stringify(omens));

    // Clear inputs and reload
    document.getElementById('omen-what').value = '';
    document.getElementById('omen-meaning').value = '';
    renderOmen(omen);
});

function loadOmens() {
    let omens = JSON.parse(localStorage.getItem('myOmens')) || [];
    omens.forEach(renderOmen);
}

function renderOmen(omen) {
    const div = document.createElement('div');
    div.className = 'omen-entry';
    div.innerHTML = `
        <span class="omen-date">${omen.date}</span>
        <span class="omen-text">${omen.what}</span>
        <span class="omen-meaning">${omen.meaning}</span>
    `;
    omenList.prepend(div);
}
