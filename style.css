const canvas = document.getElementById('fieldCanvas');
const ctx = canvas.getContext('2d');
const V_SIZE = 1000;
let scale = 1;

const baseDefense = [
    { id: 'P',  x: 500, y: 550, color: '#f1c40f' },
    { id: 'C',  x: 500, y: 900, color: '#f1c40f' },
    { id: '1B', x: 800, y: 700, color: '#3498db' },
    { id: '2B', x: 650, y: 450, color: '#3498db' },
    { id: '3B', x: 200, y: 700, color: '#3498db' },
    { id: 'SS', x: 350, y: 450, color: '#3498db' },
    { id: 'LF', x: 150, y: 200, color: '#2ecc71' },
    { id: 'CF', x: 500, y: 100, color: '#2ecc71' },
    { id: 'RF', x: 850, y: 200, color: '#2ecc71' }
];

const playbook = [
    {
        title: "Level 1: Ground Ball to Pitcher",
        situation: "Bases Empty, 0 Outs",
        initialSetup: [
            ...baseDefense,
            { id: 'BALL', x: 500, y: 550, color: '#ffff00', isBall: true },
            { id: 'BR', x: 500, y: 900, color: '#e74c3c', isRunner: true }
        ],
        targets: {
            'P': {x: 500, y: 580, r: 60}, 'C': {x: 750, y: 780, r: 70}, '1B': {x: 850, y: 650, r: 50},
            '2B': {x: 500, y: 400, r: 60}, '3B': {x: 150, y: 650, r: 50}, 'SS': {x: 480, y: 380, r: 60},
            'LF': {x: 200, y: 250, r: 80}, 'CF': {x: 500, y: 250, r: 80}, 'RF': {x: 950, y: 580, r: 70},
            'BALL': {x: 850, y: 650, r: 40}, 'BR': {x: 850, y: 650, r: 55}
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
            'BALL': "Must be thrown swiftly into the glove of the First Baseman at the bag.",
            'BR': "Sprints down the line as fast as possible to beat the throw to First Base."
        }
    },
    {
        title: "Level 1: Force at Second",
        situation: "Runner on 1st, 0 Outs",
        initialSetup: [
            ...baseDefense,
            { id: 'BALL', x: 650, y: 450, color: '#ffff00', isBall: true },
            { id: 'R1', x: 850, y: 650, color: '#e74c3c', isRunner: true },
            { id: 'BR', x: 500, y: 900, color: '#e74c3c', isRunner: true }
        ],
        targets: {
            'P': {x: 500, y: 520, r: 60}, 'C': {x: 500, y: 900, r: 50}, '1B': {x: 850, y: 650, r: 50},
            '2B': {x: 650, y: 450, r: 60}, '3B': {x: 150, y: 650, r: 50}, 'SS': {x: 500, y: 400, r: 50},
            'LF': {x: 250, y: 300, r: 80}, 'CF': {x: 500, y: 250, r: 80}, 'RF': {x: 900, y: 550, r: 80},
            'BALL': {x: 500, y: 400, r: 40}, 'R1': {x: 500, y: 400, r: 55}, 'BR': {x: 850, y: 650, r: 55}
        },
        explanations: {
            '2B': "Fields the ground ball clean and delivers a crisp, firm lead feed to the SS.",
            'SS': "Sprints directly to cover Second Base bag to secure the force-out throw.",
            'BALL': "Must be accurately tossed/thrown to Second Base for the primary lead force out.",
            'R1': "Forced to run! Must sprint hard to Second Base before the defensive play arrives.",
            'BR': "Sprints down the first base line to try and avoid a potential double play turn."
        }
    },
    {
        title: "Level 1: Fly Ball to RF",
        situation: "Bases Empty, 2 Outs",
        initialSetup: [
            ...baseDefense,
            { id: 'BALL', x: 850, y: 200, color: '#ffff00', isBall: true }, // Ball starts in deep Right Field
            { id: 'BR', x: 500, y: 900, color: '#e74c3c', isRunner: true }
        ],
        targets: {
            'RF': {x: 850, y: 200, r: 50},
            'CF': {x: 720, y: 170, r: 70}, // CF backing up RF track
            '1B': {x: 850, y: 650, r: 50},
            '2B': {x: 750, y: 400, r: 60}, // 2B goes out as shallow cutoff support
            'SS': {x: 500, y: 400, r: 50}, // SS covers 2nd bag
            '3B': {x: 150, y: 650, r: 50},
            'P': {x: 580, y: 520, r: 60},
            'C': {x: 500, y: 900, r: 50},
            'LF': {x: 300, y: 200, r: 80},
            'BALL': {x: 850, y: 200, r: 40}, // Ball caught by RF
            'BR': {x: 650, y: 770, r: 70}  // BR runs down the line but is out on the catch
        },
        explanations: {
            'RF': "Tracks the flight of the ball, camps underneath it, and calls for the catch.",
            'CF': "Sprints over behind the Right Fielder to provide dynamic backup tracking in case of an outfield drop.",
            '2B': "Sprints out toward shallow right field to line up as the cutoff target man.",
            'SS': "Sprints over to cover the Second Base bag in case the ball drops.",
            '1B': "Stays home to guard First Base and monitor the turn of the batter-runner.",
            'BALL': "Stays locked in flight straight into the glove layout of the RF.",
            'BR': "Must run hard down the line, but stops/slows when the ball is safely caught for out number 3."
        }
    }
];

let currentScenario = playbook[0];
let players = [];
let isDragging = false;
let activePlayer = null;

function init() {
    loadScenario(0);
    window.addEventListener('resize', resize);
    canvas.addEventListener('mousedown', startDrag);
    canvas.addEventListener('mousemove', drag);
    canvas.addEventListener('mouseup', endDrag);
    canvas.addEventListener('touchstart', (e) => startDrag(e.touches[0]), {passive: false});
    canvas.addEventListener('touchmove', (e) => { e.preventDefault(); drag(e.touches[0]); }, {passive: false});
    canvas.addEventListener('touchend', endDrag);
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

    const sortedPlayers = [...players].sort((a, b) => {
        if (a.isBall) return -1; if (b.isBall) return 1;
        if (a.isRunner) return -1; if (b.isRunner) return 1;
        return 0;
    });
    
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
            drawArrow(p.startX, p.startY, p.x, p.y, p.isBall, p.isRunner);
        }

        ctx.beginPath();
        ctx.arc(p.startX * scale, p.startY * scale, (p.isBall ? 8 : 12) * scale, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.35)";
        ctx.fill();

        ctx.beginPath();
        let tokenRadius = p.isBall ? 14 : (p.isRunner ? 22 : 25);
        ctx.arc(p.x * scale, p.y * scale, tokenRadius * scale, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 6; ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = p.isRunner ? "white" : "black";
        ctx.font = `bold ${p.isBall ? 9 : 13 * scale}px sans-serif`;
        ctx.textAlign = "center";
        ctx.fillText(p.isBall ? "B" : p.id, p.x * scale, (p.y + 5) * scale);
    });
}

function drawField() {
    // 1. Draw Infield Dirt Skin Circle
    ctx.fillStyle = "var(--dirt-clay)";
    ctx.beginPath();
    ctx.arc(500 * scale, 550 * scale, 260 * scale, 0, Math.PI * 2);
    ctx.fill();

    // 2. Clear out Outfield grass background tracking area lines
    ctx.fillStyle = "var(--field-green)";
    ctx.beginPath();
    ctx.moveTo(500 * scale, 900 * scale);
    ctx.arc(500 * scale, 550 * scale, 260 * scale, Math.PI * 0.15, Math.PI * 0.85);
    ctx.closePath();
    ctx.fill();

    // 3. Chalk Lines & Base paths
    ctx.strokeStyle = "white"; ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(500 * scale, 900 * scale); // Home
    ctx.lineTo(850 * scale, 650 * scale); // 1B
    ctx.lineTo(500 * scale, 400 * scale); // 2B
    ctx.lineTo(150 * scale, 650 * scale); // 3B
    ctx.closePath(); ctx.stroke();
    
    // Pitcher Circle Line
    ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(500 * scale, 550 * scale, 75 * scale, 0, Math.PI*2); ctx.stroke();

    // White Bags
    const baseSize = 16 * scale;
    ctx.fillStyle = "white";
    ctx.fillRect(850 * scale - baseSize/2, 650 * scale - baseSize/2, baseSize, baseSize);
    ctx.fillRect(500 * scale - baseSize/2, 400 * scale - baseSize/2, baseSize, baseSize);
    ctx.fillRect(150 * scale - baseSize/2, 650 * scale - baseSize/2, baseSize, baseSize);

    // Home Plate Polygon pentagon shape layout
    ctx.beginPath();
    ctx.moveTo(500 * scale, 888 * scale);
    ctx.lineTo(512 * scale, 900 * scale);
    ctx.lineTo(500 * scale, 912 * scale);
    ctx.lineTo(488 * scale, 900 * scale);
    ctx.closePath(); ctx.fillStyle = "white"; ctx.fill();
}

function drawArrow(x1, y1, x2, y2, isBall, isRunner) {
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const headlen = 12;
    ctx.beginPath();
    ctx.setLineDash(isBall ? [4, 4] : [6, 4]);
    ctx.moveTo(x1 * scale, y1 * scale);
    ctx.lineTo(x2 * scale, y2 * scale);
    
    if (isBall) ctx.strokeStyle = "var(--softball-yellow)";
    else if (isRunner) ctx.strokeStyle = "var(--runner-red)";
    else ctx.strokeStyle = "white";

    ctx.lineWidth = isBall ? 4.5 : 2.5;
    ctx.stroke();
    ctx.setLineDash([]);
    
    ctx.beginPath();
    ctx.moveTo(x2 * scale, y2 * scale);
    ctx.lineTo((x2 - headlen * Math.cos(angle - Math.PI / 6)) * scale, (y2 - headlen * Math.sin(angle - Math.PI / 6)) * scale);
    ctx.lineTo((x2 - headlen * Math.cos(angle + Math.PI / 6)) * scale, (y2 - headlen * Math.sin(angle + Math.PI / 6)) * scale);
    ctx.closePath();
    ctx.fillStyle = isBall ? "var(--softball-yellow)" : (isRunner ? "var(--runner-red)" : "white");
    ctx.fill();
}

function loadScenario(val) {
    const selection = document.getElementById('scenario-select');
    selection.value = val;
    currentScenario = playbook[val];
    document.getElementById('situation-tag').innerText = currentScenario.situation;
    document.getElementById('scenario-text').innerText = currentScenario.title;
    
    players = currentScenario.initialSetup.map(p => ({
        ...p,
        startX: p.x,
        startY: p.y
    }));
    resize();
}

function resetField() {
    players.forEach(p => { p.x = p.startX; p.y = p.startY; });
    render();
}

function showSolution() {
    players.forEach(p => {
        const target = currentScenario.targets[p.id];
        if (target) { p.x = target.x; p.y = target.y; }
    });
    render();

    const modal = document.getElementById('feedback-modal');
    const title = document.getElementById('feedback-title');
    const msg = document.getElementById('feedback-msg');

    title.innerText = "Master Coach Breakdown";
    let explanationHTML = `<div style="max-height: 280px; overflow-y: auto; padding-right: 5px;">`;
    for (let pos in currentScenario.explanations) {
        const isRun = players.find(pl => pl.id === pos)?.isRunner;
        const lblClass = isRun ? 'class="runner-label"' : '';
        explanationHTML += `<div class="explanation-row"><strong ${lblClass}>${pos}:</strong> ${currentScenario.explanations[pos]}</div>`;
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
            if (d > target.r) {
                let name = p.id;
                if (p.isBall) name = "Ball Throw";
                if (p.id === "BR") name = "Batter-Runner (BR)";
                if (p.id === "R1") name = "Runner on 1st (R1)";
                mistakes.push(name);
            }
        }
    });
    
    const modal = document.getElementById('feedback-modal');
    modal.classList.remove('hidden');
    
    if (mistakes.length === 0) {
        document.getElementById('feedback-title').innerText = "Perfect Defense! 🌟";
        document.getElementById('feedback-msg').innerHTML = "<p style='text-align:center;'>Incredible assignment accuracy! Every single player and base runner was positioned flawlessly.</p>";
    } else {
        document.getElementById('feedback-title').innerText = "Field Adjustments Needed";
        document.getElementById('feedback-msg').innerHTML = `<p style='text-align:center;'>Check your movement vectors for: <br><br><strong style="color:#ff4757;">${mistakes.join(", ")}</strong></p>`;
    }
}

function closeModal() { document.getElementById('feedback-modal').classList.add('hidden'); }

init();
