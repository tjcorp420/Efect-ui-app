const text = "> INIT_EFECT_SUITE...";
let i = 0;
const speed = 75; 

const systemLogs = [
    "Bypassing latency... OK",
    "Optimizing registry... OK",
    "Loading macro engine... OK",
    "Establishing secure connection... DONE"
];
let logIndex = 0;

// --- AUDIO SETUP ---
const sound1 = new Audio('sound1.mp3');
const sound2 = new Audio('sound2.mp3');
sound1.volume = 0.6;
sound2.volume = 0.6;

function typeWriter() {
    if (i < text.length) {
        document.getElementById("typewriter").innerHTML += text.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
    } else {
        startTerminalLog();
        startTelemetry(); 
    }
}

function startTerminalLog() {
    const logElement = document.getElementById("terminal-log");
    if (!logElement) return;
    
    logElement.innerText = "> " + systemLogs[0];
    logIndex++;

    setInterval(() => {
        logElement.innerText = "> " + systemLogs[logIndex];
        logIndex = (logIndex + 1) % systemLogs.length;
    }, 2000);
}

// --- FAKE TELEMETRY LOOP ---
function startTelemetry() {
    const pingElement = document.getElementById("live-ping");
    if (!pingElement) return;

    setInterval(() => {
        const fakePing = (Math.random() * 0.8 + 0.1).toFixed(2);
        pingElement.innerText = `Simulated Input: ${fakePing}ms`;
    }, 120); 
}

// --- EASTER EGG (TAP HEADER 5 TIMES) ---
let headerClicks = 0;
document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('typewriter');
    if(header) {
        header.addEventListener('click', () => {
            headerClicks++;
            if (headerClicks === 5) {
                document.documentElement.style.setProperty('--neon-color', '#ff0000');
                const allGreenText = document.querySelectorAll('h1, h2, .neon-btn, .icon-wrapper, .terminal-log, #live-ping');
                allGreenText.forEach(el => el.style.color = '#ff0000');
                
                const allCards = document.querySelectorAll('.glass-card');
                allCards.forEach(card => card.style.borderColor = 'rgba(255, 0, 0, 0.4)');
                
                document.getElementById('terminal-log').innerText = "> SYSTEM OVERRIDE INITIATED...";
                alert("ACCESS GRANTED: DEVELOPER MODE UNLOCKED");
            }
        });
    }

    // --- BUTTON AUDIO & ROUTING (SOUNDS SWAPPED) ---
    const btnHub = document.getElementById('btn-hub');
    const btnMaps = document.getElementById('btn-maps');

    if(btnHub) {
        btnHub.addEventListener('click', (e) => {
            e.stopPropagation(); 
            // Swapped to sound2
            sound2.currentTime = 0;
            sound2.play();
            setTimeout(() => { window.open('https://efectmacrosxtweaks.netlify.app/', '_blank'); }, 200);
        });
    }

    if(btnMaps) {
        btnMaps.addEventListener('click', (e) => {
            e.stopPropagation();
            // Swapped to sound1
            sound1.currentTime = 0;
            sound1.play();
            setTimeout(() => { window.open('https://fortnite.gg/creator/efect.lit', '_blank'); }, 200);
        });
    }
});

// --- PARTICLE GENERATOR ---
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'BUTTON') return;

    for (let j = 0; j < 8; j++) {
        createParticle(e.pageX, e.pageY);
    }
});

function createParticle(x, y) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    document.body.appendChild(particle);

    const angle = Math.random() * Math.PI * 2;
    const velocity = 30 + Math.random() * 50; 
    const tx = Math.cos(angle) * velocity + 'px';
    const ty = Math.sin(angle) * velocity + 'px';

    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.setProperty('--tx', tx);
    particle.style.setProperty('--ty', ty);

    setTimeout(() => { particle.remove(); }, 600);
}

window.onload = typeWriter;
