const canvas = document.getElementById('fieldCanvas');
const ctx = canvas.getContext('2d');
const V_SIZE = 1000;
let scale = 1;

// Define Target Zones (Scenario 1)
const targets = {
    'P': { x: 500, y: 550, r: 60 },
    '1B': { x: 850, y: 650, r: 60 }
};

let players = [
    { id: 'P', x: 500, y: 500, startX: 500, startY: 500, color: '#f1c40f' },
    { id: '1B', x: 800, y: 700, startX: 800, startY: 700, color: '#3498db' },
    { id: 'SS', x: 350, y: 350, startX: 350, startY: 350, color: '#3498db' }
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

function closeModal() { document.getElementById('feedback-modal').classList.add('hidden'); }
// ... (Include resize, drawArrow, resetField, and render from previous version) ...
init();
