const text = "> INIT_EFECT_SUITE...";
let i = 0;
const speed = 75; 

const systemLogs = [
    "Bypassing OS latency... OK",
    "Optimizing system registry... OK",
    "Loading macro engine hooks... OK",
    "Establishing secure connection... DONE"
];
let logIndex = 0;

const sound1 = new Audio('sound1.mp3');
const sound2 = new Audio('sound2.mp3');
sound1.volume = 0.6;
sound2.volume = 0.6;

// --- BOOT SPLASH & GYRO LOGIC ---
const initBtn = document.getElementById('init-btn');
const splashScreen = document.getElementById('splash-screen');
const splashTerminal = document.getElementById('splash-terminal');

const bootSequenceLogs = [
    "Mounting EFECT file system...",
    "Initializing hardware monitor...",
    "Injecting Efect Pro Macro core...",
    "Bypassing system latency limits...",
    "Locking CPU cores...",
    "SYSTEM READY."
];

document.addEventListener('DOMContentLoaded', () => {
    if(initBtn) {
        initBtn.addEventListener('click', async () => {
            initBtn.style.display = 'none'; // Hide button immediately
            
            // 1. Request iOS Gyro Permission
            if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
                try {
                    const permissionState = await DeviceOrientationEvent.requestPermission();
                    if (permissionState === 'granted') {
                        window.addEventListener('deviceorientation', handleGyro);
                    }
                } catch (error) {
                    console.error("Gyro denied", error);
                }
            } else {
                // For non-iOS devices
                window.addEventListener('deviceorientation', handleGyro);
            }

            // 2. Run Fake Terminal Boot Sequence
            let bootIdx = 0;
            splashTerminal.innerHTML = "";
            
            const bootInterval = setInterval(() => {
                if (bootIdx < bootSequenceLogs.length) {
                    splashTerminal.innerHTML += `> ${bootSequenceLogs[bootIdx]}<br>`;
                    bootIdx++;
                } else {
                    clearInterval(bootInterval);
                    // Fade out splash screen
                    setTimeout(() => {
                        splashScreen.style.opacity = '0';
                        setTimeout(() => {
                            splashScreen.remove();
                            // Start main app animations
                            typeWriter(); 
                            startTelemetry();
                        }, 500);
                    }, 600);
                }
            }, 250); // Speed of the fake boot log
        });
    }

    // --- EASTER EGG (TAP HEADER 5 TIMES) ---
    let headerClicks = 0;
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

    // --- BUTTON AUDIO & ROUTING ---
    const btnHub = document.getElementById('btn-hub');
    const btnMaps = document.getElementById('btn-maps');

    if(btnHub) {
        btnHub.addEventListener('click', (e) => {
            e.stopPropagation(); 
            sound2.currentTime = 0;
            sound2.play();
            setTimeout(() => { window.open('https://efectmacrosxtweaks.netlify.app/', '_blank'); }, 200);
        });
    }

    if(btnMaps) {
        btnMaps.addEventListener('click', (e) => {
            e.stopPropagation();
            sound1.currentTime = 0;
            sound1.play();
            setTimeout(() => { window.open('https://fortnite.gg/creator/efect.lit', '_blank'); }, 200);
        });
    }
});

// --- GYROSCOPE PARALLAX PHYSICS ---
function handleGyro(event) {
    // event.gamma = left/right tilt, event.beta = front/back tilt
    const x = event.gamma ? event.gamma / 1.5 : 0; 
    // -45 assumes user holds phone tilted up toward their face
    const y = event.beta ? (event.beta - 45) / 1.5 : 0; 

    const grid = document.querySelector('.background-grid');
    if(grid) {
        grid.style.transform = `translate(${x}px, ${y}px)`;
    }
}

function typeWriter() {
    if (i < text.length) {
        document.getElementById("typewriter").innerHTML += text.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
    } else {
        startTerminalLog();
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

function startTelemetry() {
    const pingElement = document.getElementById("live-ping");
    if (!pingElement) return;

    setInterval(() => {
        const fakePing = (Math.random() * 0.8 + 0.1).toFixed(2);
        pingElement.innerText = `Simulated Input: ${fakePing}ms`;
    }, 120); 
}

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
