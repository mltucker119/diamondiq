const canvas = document.getElementById('fieldCanvas');
const ctx = canvas.getContext('2d');
const V_SIZE = 1000;
let scale = 1;

// Perfectly Balanced Lineup Grid
const baseDefense = [
    { id: 'P',  x: 500, y: 600, col: 'gold' },   // Pitcher (Exact Center)
    { id: 'C',  x: 500, y: 860, col: 'gold' },   // Catcher (Behind Home)
    { id: '1B', x: 730, y: 630, col: 'blue' },   // 1B (Standard depth near bag)
    { id: '2B', x: 620, y: 480, col: 'blue' },   // 2B (Infield slot)
    { id: '3B', x: 270, y: 630, col: 'blue' },   // 3B (Standard depth near bag)
    { id: 'SS', x: 380, y: 480, col: 'blue' },   // SS (Infield slot)
    { id: 'LF', x: 200, y: 220, col: 'green' },  // LF (Deep grass)
    { id: 'CF', x: 500, y: 130, col: 'green' },  // CF (Deep grass)
    { id: 'RF', x: 800, y: 220, col: 'green' }   // RF (Deep grass)
];

const playbook = [
    {
        title: "Level 1: Ground Ball to Pitcher", situation: "Bases Empty, 0 Outs",
        initialSetup: [ 
            ...baseDefense, 
            {id:'BALL', x:500, y:600, isBall:true}, 
            {id:'BR', x:500, y:800, isRunner:true} 
        ],
        targets: { 
            'P': {x: 500, y: 630, r: 50}, 'C': {x: 680, y: 730, r: 60}, '1B': {x: 700, y: 600, r: 40},
            '2B': {x: 500, y: 400, r: 50}, '3B': {x: 300, y: 600, r: 40}, 'SS': {x: 460, y: 430, r: 50},
            'LF': {x: 230, y: 260, r: 70}, 'CF': {x: 500, y: 220, r: 70}, 'RF': {x: 820, y: 550, r: 60},
            'BALL': {x: 700, y: 600, r: 35}, 'BR': {x: 700, y: 600, r: 45} 
        },
        explanations: { 
            'P': "Fields the ball clean and makes an accurate, controlled throw to First Base.", 
            '1B': "Sprints directly to the bag, squares hips, and anchors foot to receive the throw.", 
            'RF': "Crucial backup! Sprints deep into foul territory behind 1B to catch any wild overthrows.", 
            'C': "Follows the batter-runner down the baseline to act as a secondary backup near 1st.", 
            'BALL': "Must be thrown swiftly into the glove of the First Baseman at the bag.", 
            'BR': "Sprints down the line as fast as possible to beat the throw to First Base." 
        }
    },
    {
        title: "Level 1: Force at Second", situation: "Runner on 1st, 0 Outs",
        initialSetup: [ 
            ...baseDefense, 
            {id:'BALL', x:620, y:480, isBall:true}, 
            {id:'R1', x:700, y:600, isRunner:true}, 
            {id:'BR', x:500, y:800, isRunner:true} 
        ],
        targets: { 
            'P': {x: 500, y: 560, r: 50}, 'C': {x: 500, y: 860, r: 40}, '1B': {x: 700, y: 600, r: 40},
            '2B': {x: 620, y: 480, r: 50}, '3B': {x: 300, y: 600, r: 40}, 'SS': {x: 500, y: 400, r: 40},
            'LF': {x: 320, y: 300, r: 70}, 'CF': {x: 500, y: 240, r: 70}, 'RF': {x: 800, y: 500, r: 70},
            'BALL': {x: 500, y: 400, r: 35}, 'R1': {x: 500, y: 400, r: 45}, 'BR': {x: 700, y: 600, r: 45} 
        },
        explanations: { 
            '2B': "Fields the ground ball clean and delivers a crisp, firm lead feed to the SS.", 
            'SS': "Sprints directly to cover Second Base bag to secure the force-out throw.", 
            'BALL': "Must be accurately tossed/thrown to Second Base for the primary lead force out.", 
            'R1': "Forced to run! Must sprint hard to Second Base before the defensive play arrives." 
        }
    },
    {
        title: "Level 1: Fly Ball to RF", situation: "Bases Empty, 2 Outs",
        initialSetup: [ 
            ...baseDefense, 
            {id:'BALL', x:800, y:220, isBall:true}, 
            {id:'BR', x:500, y:800, isRunner:true} 
        ],
        targets: { 
            'RF': {x: 800, y: 220, r: 40}, 'CF': {x: 680, y: 200, r: 60}, '1B': {x: 700, y: 600, r: 40}, 
            '2B': {x: 700, y: 380, r: 50}, 'SS': {x: 500, y: 400, r: 40}, '3B': {x: 300, y: 600, r: 40}, 
            'P': {x: 550, y: 550, r: 50}, 'C': {x: 500, y: 860, r: 40}, 'LF': {x: 300, y: 250, r: 70}, 
            'BALL': {x: 800, y: 220, r: 35}, 'BR': {x: 620, y: 680, r: 65} 
        },
        explanations: { 
            'RF': "Tracks the flight of the ball, camps underneath it, and calls for the catch.", 
            'CF': "Sprints over behind the Right Fielder to provide dynamic backup tracking.", 
            '2B': "Sprints out toward shallow right field to line up as the cutoff target man.", 
            'BALL': "Stays locked in flight straight into the glove layout of the RF." 
        }
    }
];

const colorMap = {
    gold: { top: '#f1c40f', base: '#f39c12' },
    blue: { top: '#3498db', base: '#2980b9' },
    green: { top: '#2ecc71', base: '#27ae60' },
    runner: { top: '#e74c3c', base: '#c0392b' },
    ball: { top: '#ffff00', base: '#d4d400' }
};

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
        ctx.fillStyle = p.isRunner ? "rgba(231, 76, 60, 0.3)" : "rgba(255,255,255,0.25)";
        ctx.fill();

        let tokenRadius = p.isBall ? 15 : (p.isRunner ? 22 : 25);
        let sR = tokenRadius * scale;
        let c = p.isBall ? colorMap.ball : (p.isRunner ? colorMap.runner : colorMap[p.col]);

        if(p.isBall || p.isRunner) {
            ctx.shadowBlur = 15 * scale;
            ctx.shadowColor = p.isBall ? "rgba(255,255,0,0.7)" : "rgba(231, 76, 60, 0.6)";
        } else {
            ctx.shadowBlur = 6 * scale;
            ctx.shadowColor = "rgba(0,0,0,0.5)";
        }

        ctx.beginPath();
        ctx.arc(p.x * scale, p.y * scale, sR, 0, Math.PI * 2);
        ctx.fillStyle = c.base;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.beginPath();
        ctx.arc(p.x * scale, p.y * scale, sR * 0.9, 0, Math.PI * 2);
        let gradient = ctx.createLinearGradient((p.x-sR/2)*scale, (p.y-sR/2)*scale, (p.x+sR/2)*scale, (p.y+sR/2)*scale);
        gradient.addColorStop(0, "rgba(255,255,255,0.2)");
        gradient.addColorStop(0.5, c.top);
        gradient.addColorStop(1, "rgba(0,0,0,0.1)");
        ctx.fillStyle = gradient;
        ctx.fill();

        if(p.isBall) {
            drawBallStitching(p.x * scale, p.y * scale, sR);
        }

        if(!p.isBall) {
            ctx.fillStyle = p.isRunner ? "white" : "black";
            ctx.font = `bold ${13 * scale}px sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(p.id, p.x * scale, p.y * scale);
        }
    });
}

function drawField() {
    // 1. Grass Stripes
    let grassStripes = ctx.createRadialGradient(500*scale, 600*scale, 100*scale, 500*scale, 600*scale, 950*scale);
    grassStripes.addColorStop(0, '#27ae60');
    grassStripes.addColorStop(0.1, '#2ecc71');
    grassStripes.addColorStop(0.2, '#27ae60');
    grassStripes.addColorStop(0.3, '#2ecc71');
    grassStripes.addColorStop(0.4, '#27ae60');
    grassStripes.addColorStop(0.5, '#2ecc71');
    grassStripes.addColorStop(1, '#27ae60');
    
    ctx.fillStyle = grassStripes;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Uniform Infield Dirt Circle (Centered perfectly on the Pitcher)
    ctx.fillStyle = "#d35400";
    ctx.beginPath();
    ctx.arc(500 * scale, 600 * scale, 245 * scale, 0, Math.PI * 2);
    ctx.fill();
    
    // Dirt Texture Grain
    for(let i=0; i<60; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.03)";
        ctx.beginPath();
        let rX = (Math.random()*440 + 280)*scale;
        let rY = (Math.random()*440 + 380)*scale;
        ctx.arc(rX, rY, Math.random()*2.5*scale, 0, Math.PI*2);
        ctx.fill();
    }

    // 3. True Base Paths & Chalk Lines
    ctx.strokeStyle = "rgba(255,255,255,0.75)"; ctx.lineWidth = 4 * scale;
    ctx.setLineDash([10, 2, 8, 3]);
    ctx.beginPath();
    ctx.moveTo(500 * scale, 800 * scale); // Home
    ctx.lineTo(700 * scale, 600 * scale); // 1B
    ctx.lineTo(500 * scale, 400 * scale); // 2B
    ctx.lineTo(300 * scale, 600 * scale); // 3B
    ctx.closePath(); ctx.stroke();
    ctx.setLineDash([]);
    
    // Pitcher's Circle
    ctx.lineWidth = 2.5 * scale; ctx.strokeStyle = "rgba(255,255,255,0.8)";
    ctx.beginPath(); ctx.arc(500 * scale, 600 * scale, 65 * scale, 0, Math.PI*2); ctx.stroke();

    // 4. White Bags Alignment
    const baseSize = 16 * scale;
    ctx.fillStyle = "white"; ctx.shadowBlur = 4*scale; ctx.shadowColor = "rgba(0,0,0,0.3)";
    ctx.fillRect(700 * scale - baseSize/2, 600 * scale - baseSize/2, baseSize, baseSize); // 1B
    ctx.fillRect(500 * scale - baseSize/2, 400 * scale - baseSize/2, baseSize, baseSize); // 2B
    ctx.fillRect(300 * scale - baseSize/2, 600 * scale - baseSize/2, baseSize, baseSize); // 3B
    ctx.shadowBlur = 0;

    // 5. Pentagonal Home Plate
    ctx.beginPath();
    ctx.moveTo(500 * scale, 788 * scale);
    ctx.lineTo(512 * scale, 800 * scale);
    ctx.lineTo(500 * scale, 812 * scale);
    ctx.lineTo(488 * scale, 800 * scale);
    ctx.closePath(); ctx.fillStyle = "white"; ctx.fill();
}

function drawBallStitching(cX, cY, sR) {
    ctx.strokeStyle = "#e74c3c";
    ctx.lineWidth = 2 * scale;
    let rot = Math.PI * -0.25;
    ctx.beginPath();
    ctx.arc(cX + sR*Math.cos(rot)*0.5, cY + sR*Math.sin(rot)*0.5, sR, rot + Math.PI*0.8, rot + Math.PI*1.2);
    ctx.stroke();
    rot = Math.PI * 0.75;
    ctx.beginPath();
    ctx.arc(cX + sR*Math.cos(rot)*0.5, cY + sR*Math.sin(rot)*0.5, sR, rot + Math.PI*0.8, rot + Math.PI*1.2);
    ctx.stroke();
}

function drawArrow(x1, y1, x2, y2, isBall, isRunner) {
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const headlen = 12 * scale;
    ctx.beginPath();
    ctx.setLineDash(isBall ? [4*scale, 4*scale] : [6*scale, 4*scale]);
    ctx.moveTo(x1 * scale, y1 * scale);
    ctx.lineTo(x2 * scale, y2 * scale);
    
    if (isBall) ctx.strokeStyle = "#ffff00";
    else if (isRunner) ctx.strokeStyle = "#ff4757";
    else ctx.strokeStyle = "rgba(255,255,255,0.9)";

    ctx.lineWidth = (isBall ? 4 : 2.5) * scale;
    ctx.stroke();
    ctx.setLineDash([]);
    
    ctx.beginPath();
    ctx.moveTo(x2 * scale, y2 * scale);
    ctx.lineTo((x2 - headlen * Math.cos(angle - Math.PI / 6)) * scale, (y2 - headlen * Math.sin(angle - Math.PI / 6)) * scale);
    ctx.lineTo((x2 - headlen * Math.cos(angle + Math.PI / 6)) * scale, (y2 - headlen * Math.sin(angle + Math.PI / 6)) * scale);
    ctx.closePath();
    ctx.fillStyle = isBall ? "#ffff00" : (isRunner ? "#ff4757" : "rgba(255,255,255,0.9)");
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
