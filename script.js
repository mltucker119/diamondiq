const canvas = document.getElementById('fieldCanvas');
const ctx = canvas.getContext('2d');
const V_SIZE = 1000;
let scale = 1;

// 1. Scenario Data
const targets = {
    'P': { x: 500, y: 550, r: 60, note: "Field the ball!" },
    '1B': { x: 850, y: 650, r: 60, note: "Cover the bag!" }
};

let players = [
    { id: 'P', x: 500, y: 500, startX: 500, startY: 500, color: '#f1c40f' },
    { id: '1B', x: 800, y: 700, startX: 800, startY: 700, color: '#3498db' },
    { id: 'SS', x: 350, y: 350, startX: 350, startY: 350, color: '#3498db' }
];

let isDragging = false;
let activePlayer = null;

// 2. Core Functions
function init() {
    resize();
    window.addEventListener('resize', resize);
    
    // Mouse Events
    canvas.addEventListener('mousedown', startDrag);
    canvas.addEventListener('mousemove', drag);
    canvas.addEventListener('mouseup', endDrag);
    
    // Touch Events
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

// 3. Interaction Logic
function startDrag(e) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / scale;
    const mouseY = (e.clientY - rect.top) / scale;

    players.forEach(p => {
        const dist = Math.sqrt(Math.pow(mouseX - p.x, 2) + Math.pow(mouseY - p.y, 2));
        if (dist < 50) { // Hitbox
            activePlayer = p;
            isDragging = true;
        }
    });
}

function drag(e) {
    if (!isDragging || !activePlayer) return;
    const rect = canvas.getBoundingClientRect();
    activePlayer.x = (e.clientX - rect.left) / scale;
    activePlayer.y = (e.clientY - rect.top) / scale;
    render();
}

function endDrag() {
    isDragging = false;
    activePlayer = null;
    render();
}

// 4. Game Logic
function checkWork() {
    let mistakes = [];
    players.forEach(p => {
        if (targets[p.id]) {
            const d = Math.sqrt(Math.pow(p.x - targets[p.id].x, 2) + Math.pow(p.y - targets[p.id].y, 2));
            if (d > targets[p.id].r) mistakes.push(p.id);
        }
    });

    const modal = document.getElementById('feedback-modal');
    const title = document.getElementById('feedback-title');
    const msg = document.getElementById('feedback-msg');

    modal.classList.remove('hidden');
    if (mistakes.length === 0) {
        title.innerText = "Home Run!";
        msg.innerText = "Everyone is in the perfect position!";
    } else {
        title.innerText = "Strike One...";
        msg.innerText = `Check your ${mistakes.join(' and ')}. Are they in the right spot?`;
    }
}

function resetField() {
    players.forEach(p => {
        p.x = p.startX;
        p.y = p.startY;
    });
    render();
}

function closeModal() {
    document.getElementById('feedback-modal').classList.add('hidden');
}

// 5. Drawing Logic
function drawArrow(x1, y1, x2, y2) {
    const headlen = 15;
    const angle = Math.atan2(y2 - y1, x2 - x1);
    
    ctx.beginPath();
    ctx.setLineDash([5, 5]);
    ctx.moveTo(x1 * scale, y1 * scale);
    ctx.lineTo(x2 * scale, y2 * scale);
    ctx.strokeStyle = "rgba(255,255,255,0.8)";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.beginPath();
    ctx.moveTo(x2 * scale, y2 * scale);
    ctx.lineTo((x2 - headlen * Math.cos(angle - Math.PI / 6)) * scale, (y2 - headlen * Math.sin(angle - Math.PI / 6)) * scale);
    ctx.lineTo((x2 - headlen * Math.cos(angle + Math.PI / 6)) * scale, (y2 - headlen * Math.sin(angle + Math.PI / 6)) * scale);
    ctx.closePath();
    ctx.fillStyle = "white";
    ctx.fill();
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Infield Diamond
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(500 * scale, 900 * scale); // Home
    ctx.lineTo(850 * scale, 650 * scale); // 1st
    ctx.lineTo(500 * scale, 400 * scale); // 2nd
    ctx.lineTo(150 * scale, 650 * scale); // 3rd
    ctx.closePath();
    ctx.stroke();

    players.forEach(p => {
        if (p.x !== p.startX || p.y !== p.startY) {
            drawArrow(p.startX, p.startY, p.x, p.y);
        }

        // Player Icon
        ctx.beginPath();
        ctx.arc(p.x * scale, p.y * scale, 30 * scale, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        ctx.fillStyle = "black";
        ctx.font = `bold ${18 * scale}px Arial`;
        ctx.textAlign = "center";
        ctx.fillText(p.id, p.x * scale, (p.y + 7) * scale);
    });
}

init();
