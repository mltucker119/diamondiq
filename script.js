const canvas = document.getElementById('fieldCanvas');
const ctx = canvas.getContext('2d');
const V_SIZE = 1000;
let scale = 1;

// 1. Playbook Setup containing full configurations & explanations
const playbook = [
    {
        title: "Level 1: Ground Ball to Pitcher",
        situation: "Bases Empty, 0 Outs",
        targets: {
            'P': {x: 500, y: 580, r: 60},
            'C': {x: 750, y: 780, r: 70},
            '1B': {x: 850, y: 650, r: 50},
            '2B': {x: 500, y: 400, r: 60},
            '3B': {x: 150, y: 650, r: 50},
            'SS': {x: 480, y: 380, r: 60},
            'LF': {x: 200, y: 250, r: 80},
            'CF': {x: 500, y: 250, r: 80},
            'RF': {x: 950, y: 580, r: 70},
            'BALL': {x: 850, y: 650, r: 40}
        },
        explanations: {
            'P': "Fields the ball clean and makes an accurate, controlled throw to First Base.",
            '1B': "Sprints directly to the bag, squares hips, and anchors foot to receive the throw.",
            'RF': "Crucial backup! Sprints deep into foul territory behind 1B to catch any wild overthrows.",
            'C': "Follows the batter-runner down the baseline to act as a secondary backup near 1st.",
            '2B': "Moves to cover the Second Base bag in case the play breaks down.",
            'SS': "Glides toward Second Base to back up the 2B position.",
            '3B': "Holds ground at Third Base in case of an absolute baseline emergency.",
            'LF': "Backs up the left side of the infield track.",
            'CF': "Sprints into shallow center field to back up second base tracking lines.",
            'BALL': "Must be thrown swiftly into the glove of the First Baseman at the bag."
        }
    },
    {
        title: "Level 1: Force at Second",
        situation: "Runner on 1st, 0 Outs",
        targets: {
            'P': {x: 500, y: 520, r: 60},
            'C': {x: 500, y: 900, r: 50},
            '1B': {x: 850, y: 650, r: 50},
            '2B': {x: 650, y: 450, r: 60},
            '3B': {x: 150, y: 650, r: 50},
            'SS': {x: 500, y: 400, r: 50},
            'LF': {x: 250, y: 300, r: 80},
            'CF': {x: 500, y: 250, r: 80},
            'RF': {x: 900, y: 550, r: 80},
            'BALL': {x: 500, y: 400, r: 40}
        },
        explanations: {
            'P': "Clears out of the throwing lane to Second Base.",
            'C': "Stays home to protect the plate.",
            '1B': "Holds the base runner at First or stays ready for a double-play return.",
            'SS': "Sprints directly to Second Base to secure the force-out throw.",
            '2B': "Fields the ground ball clean and delivers a firm feed to the SS.",
            '3B': "Guards Third Base bag securely.",
            'LF': "Backs up Second Base tracking behind the Shortstop.",
            'CF': "Backs up the Centerfield track behind second.",
            'RF': "Shifts down-line to back up First Base in case of a snap double-play throw.",
            'BALL': "Must be accurately flipped/thrown to Second Base for the primary force out."
        }
    }
];

let currentScenario = playbook[0];

// 2. Base Coordinates System
let players = [
    { id: 'P',  x: 500, y: 550, startX: 500, startY: 550, color: '#f1c40f' },
    { id: 'C',  x: 500, y: 900, startX: 500, startY: 900, color: '#f1c40f' },
    { id: '1B', x: 800, y: 700, startX: 800, startY: 700, color: '#3498db' },
    { id: '2B', x: 650, y: 450, startX: 650, startY: 450, color: '#3498db' },
    { id: '3B', x: 200, y: 700, startX: 200, startY: 700, color: '#3498db' },
    { id: 'SS', x: 350, y: 450, startX: 350, startY: 450, color: '#3498db' },
    { id: 'LF', x: 150, y: 200, startX: 150, startY: 200, color: '#2ecc71' },
    { id: 'CF', x: 500, y: 100, startX: 500, startY: 100, color: '#2ecc71' },
    { id: 'RF', x: 850, y: 200, startX: 850, startY: 200, color: '#2ecc71' },
    { id: 'BALL', x: 500, y: 550, startX: 500, startY: 550, color: '#ffff00', isBall: true }
];

let isDragging = false;
let activePlayer = null;

function init() {
    resize();
    window.addEventListener('resize', resize);
    canvas.addEventListener('mousedown', startDrag);
    canvas.addEventListener('mousemove', drag);
    canvas.addEventListener('mouseup', endDrag);
    canvas.addEventListener('touchstart', (e) => startDrag(e.touches[0]), {passive: false});
    canvas.addEventListener('touchmove', (e) => { e.preventDefault(); drag(e.touches[0]); }, {passive: false});
    canvas.addEventListener('touchend', endDrag);
    render();
}

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    scale = Math.min(canvas.width, canvas.height) / V_SIZE;
    render();
}

function startDrag(e) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / scale;
    const mouseY = (e.clientY - rect.top) / scale;

    const sortedPlayers = [...players].sort((a, b) => (b.isBall ? 1 : -1));
    
    sortedPlayers.forEach(p => {
        const dist = Math.sqrt(Math.pow(mouseX - p.x, 2) + Math.pow(mouseY - p.y, 2));
        const hitbox = p.isBall ? 35 : 45;
        if (dist < hitbox) { activePlayer = players.find(pl => pl.id === p.id); isDragging = true; }
    });
}

function drag(e) {
    if (!isDragging || !activePlayer) return;
    const rect = canvas.getBoundingClientRect();
    activePlayer.x = (e.clientX - rect.left) / scale;
    activePlayer.y = (e.clientY - rect.top) / scale;
    render();
}

function endDrag() { isDragging = false; activePlayer = null; render(); }

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawField();

    players.forEach(p => {
        if (p.x !== p.startX || p.y !== p.startY) {
            drawArrow(p.startX, p.startY, p.x, p.y, p.isBall);
        }

        // Draw Ghost Base Positions
        ctx.beginPath();
        ctx.arc(p.startX * scale, p.startY * scale, (p.isBall ? 8 : 12) * scale, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.25)";
        ctx.fill();

        // Draw Interactive Token
        ctx.beginPath();
        ctx.arc(p.x * scale, p.y * scale, (p.isBall ? 15 : 25) * scale, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 6; ctx.shadowColor = "rgba(0,0,0,0.4)";
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = "black";
        ctx.font = `bold ${p.isBall ? 9 : 14 * scale}px sans-serif`;
        ctx.textAlign = "center";
        ctx.fillText(p.isBall ? "B" : p.id, p.x * scale, (p.y + 5) * scale);
    });
}

function drawField() {
    ctx.strokeStyle = "rgba(255,255,255,0.6)"; ctx.lineWidth = 3;
    
    // Infield Diamond lines
    ctx.beginPath();
    ctx.moveTo(500 * scale, 900 * scale); 
    ctx.lineTo(850 * scale, 650 * scale); 
    ctx.lineTo(500 * scale, 400 * scale); 
    ctx.lineTo(150 * scale, 650 * scale); 
    ctx.closePath(); ctx.stroke();
    
    // Draw Base Bags physically
    const baseSize = 14 * scale;
    ctx.fillStyle = "white";
    ctx.fillRect(850 * scale - baseSize/2, 650 * scale - baseSize/2, baseSize, baseSize); // 1B
    ctx.fillRect(500 * scale - baseSize/2, 400 * scale - baseSize/2, baseSize, baseSize); // 2B
    ctx.fillRect(150 * scale - baseSize/2, 650 * scale - baseSize/2, baseSize, baseSize); // 3B
    
    // Pitcher Circle
    ctx.beginPath(); ctx.arc(500 * scale, 550 * scale, 75 * scale, 0, Math.PI*2); ctx.stroke();
}

function drawArrow(x1, y1, x2, y2, isBall) {
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const headlen = 12;
    ctx.beginPath();
    ctx.setLineDash(isBall ? [4, 4] : [6, 4]);
    ctx.moveTo(x1 * scale, y1 * scale);
    ctx.lineTo(x2 * scale, y2 * scale);
    ctx.strokeStyle = isBall ? "var(--softball-yellow)" : "white";
    ctx.lineWidth = isBall ? 4 : 2.5;
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Arrow Tip
    ctx.beginPath();
    ctx.moveTo(x2 * scale, y2 * scale);
    ctx.lineTo((x2 - headlen * Math.cos(angle - Math.PI / 6)) * scale, (y2 - headlen * Math.sin(angle - Math.PI / 6)) * scale);
    ctx.lineTo((x2 - headlen * Math.cos(angle + Math.PI / 6)) * scale, (y2 - headlen * Math.sin(angle + Math.PI / 6)) * scale);
    ctx.closePath();
    ctx.fillStyle = isBall ? "var(--softball-yellow)" : "white";
    ctx.fill();
}

function loadScenario(val) {
    currentScenario = playbook[val];
    document.getElementById('situation-tag').innerText = currentScenario.situation;
    document.getElementById('scenario-text').innerText = currentScenario.title;
    resetField();
}

function resetField() {
    players.forEach(p => { p.x = p.startX; p.y = p.startY; });
    render();
}

function showSolution() {
    // Instantly snap players & ball to targets
    players.forEach(p => {
        const target = currentScenario.targets[p.id];
        if (target) { p.x = target.x; p.y = target.y; }
    });
    render();

    // Compile dynamic explanations template inside popup box
    const modal = document.getElementById('feedback-modal');
    const title = document.getElementById('feedback-title');
    const msg = document.getElementById('feedback-msg');

    title.innerText = "Master Coach Breakdown";
    let explanationHTML = `<div style="max-height: 280px; overflow-y: auto; padding-right: 5px;">`;
    for (let pos in currentScenario.explanations) {
        explanationHTML += `<div class="explanation-row"><strong>${pos}:</strong> ${currentScenario.explanations[pos]}</div>`;
    }
    explanationHTML += `</div>`;
    
    msg.innerHTML = explanationHTML;
    modal.classList.remove('hidden');
}

function checkWork() {
    let mistakes = [];
    players.forEach(p => {
        const target = currentScenario.targets[p.id];
        if (target) {
            const d = Math.sqrt(Math.pow(p.x - target.x, 2) + Math.pow(p.y - target.y, 2));
            if (d > target.r) mistakes.push(p.isBall ? "Ball Throw" : p.id);
        }
    });
    
    const modal = document.getElementById('feedback-modal');
    modal.classList.remove('hidden');
    
    if (mistakes.length === 0) {
        document.getElementById('feedback-title').innerText = "Perfect Defense! 🌟";
        document.getElementById('feedback-msg').innerHTML = "<p style='text-align:center;'>Incredible assignment accuracy! Every single player executed their backing up and coverage assignments perfectly.</p>";
    } else {
        document.getElementById('feedback-title').innerText = "Field Adjustments Needed";
        document.getElementById('feedback-msg').innerHTML = `<p style='text-align:center;'>Check your movement vectors for: <br><br><strong style="color:#ff4757;">${mistakes.join(", ")}</strong></p>`;
    }
}

function closeModal() { document.getElementById('feedback-modal').classList.add('hidden'); }

init();
