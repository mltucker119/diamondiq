const canvas = document.getElementById('fieldCanvas');
const ctx = canvas.getContext('2d');
const V_SIZE = 1000;
let scale = 1;

// 1. Scenario Database
const playbook = [
    {
        title: "Level 1: The 1-3 Force Play",
        targets: { 'P': {x: 500, y: 600, r: 70}, '1B': {x: 850, y: 650, r: 60}, 'BALL': {x: 850, y: 650, r: 50} }
    },
    {
        title: "Level 1: Force at Second",
        targets: { 'SS': {x: 500, y: 400, r: 70}, '2B': {x: 650, y: 450, r: 60}, 'BALL': {x: 500, y: 400, r: 50} }
    }
];

let currentScenario = playbook[0];

// 2. Player & Ball Setup
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

    // Check ball first so it's easier to grab on top of players
    const sortedPlayers = [...players].sort((a, b) => (b.isBall ? 1 : -1));
    
    sortedPlayers.forEach(p => {
        const dist = Math.sqrt(Math.pow(mouseX - p.x, 2) + Math.pow(mouseY - p.y, 2));
        if (dist < 40) { activePlayer = p; isDragging = true; }
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

        ctx.beginPath();
        ctx.arc(p.x * scale, p.y * scale, (p.isBall ? 15 : 25) * scale, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 5; ctx.shadowColor = "black";
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = "black";
        ctx.font = `bold ${p.isBall ? 10 : 14 * scale}px Arial`;
        ctx.textAlign = "center";
        ctx.fillText(p.isBall ? "" : p.id, p.x * scale, (p.y + 5) * scale);
    });
}

function drawField() {
    ctx.strokeStyle = "white"; ctx.lineWidth = 2;
    // Infield
    ctx.beginPath();
    ctx.moveTo(500 * scale, 900 * scale); ctx.lineTo(850 * scale, 650 * scale);
    ctx.lineTo(500 * scale, 400 * scale); ctx.lineTo(150 * scale, 650 * scale);
    ctx.closePath(); ctx.stroke();
    // Pitcher Circle
    ctx.beginPath(); ctx.arc(500 * scale, 550 * scale, 80 * scale, 0, Math.PI*2); ctx.stroke();
}

function drawArrow(x1, y1, x2, y2, isBall) {
    const angle = Math.atan2(y2 - y1, x2 - x1);
    ctx.beginPath();
    ctx.setLineDash([5, 5]);
    ctx.moveTo(x1 * scale, y1 * scale);
    ctx.lineTo(x2 * scale, y2 * scale);
    ctx.strokeStyle = isBall ? "#ffff00" : "white";
    ctx.lineWidth = isBall ? 4 : 2;
    ctx.stroke();
    ctx.setLineDash([]);
}

function loadScenario(val) {
    currentScenario = playbook[val];
    document.getElementById('scenario-text').innerText = currentScenario.title;
    resetField();
}

function resetField() {
    players.forEach(p => { p.x = p.startX; p.y = p.startY; });
    render();
}

function checkWork() {
    let mistakes = [];
    players.forEach(p => {
        const target = currentScenario.targets[p.id];
        if (target) {
            const d = Math.sqrt(Math.pow(p.x - target.x, 2) + Math.pow(p.y - target.y, 2));
            if (d > target.r) mistakes.push(p.isBall ? "Ball" : p.id);
        }
    });
    const modal = document.getElementById('feedback-modal');
    modal.classList.remove('hidden');
    document.getElementById('feedback-title').innerText = mistakes.length === 0 ? "Perfect!" : "Try Again";
    document.getElementById('feedback-msg').innerText = mistakes.length === 0 ? "Great team movement!" : "Check: " + mistakes.join(", ");
}

function closeModal() { document.getElementById('feedback-modal').classList.add('hidden'); }

init();
