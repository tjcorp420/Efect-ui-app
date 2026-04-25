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

// --- BOOT SPLASH, GYRO & LOADER LOGIC ---
const initBtn = document.getElementById('init-btn');
const splashScreen = document.getElementById('splash-screen');
const splashTerminal = document.getElementById('splash-terminal');
const loaderWrapper = document.getElementById('loader-wrapper');
const loaderBar = document.getElementById('loader-bar');

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
            // Hide button and show the empty loading bar
            initBtn.style.display = 'none'; 
            loaderWrapper.style.display = 'block';
            
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
                window.addEventListener('deviceorientation', handleGyro);
            }

            // 2. Run Fake Terminal Boot Sequence & Fill Bar
            let bootIdx = 0;
            splashTerminal.innerHTML = "";
            
            const bootInterval = setInterval(() => {
                if (bootIdx < bootSequenceLogs.length) {
                    splashTerminal.innerHTML += `> ${bootSequenceLogs[bootIdx]}<br>`;
                    bootIdx++;
                    
                    // Fill the loading bar dynamically
                    const progress = (bootIdx / bootSequenceLogs.length) * 100;
                    loaderBar.style.width = `${progress}%`;
                    
                } else {
                    clearInterval(bootInterval);
                    setTimeout(() => {
                        splashScreen.style.opacity = '0';
                        setTimeout(() => {
                            splashScreen.remove();
                            typeWriter(); 
                            startTelemetry();
                        }, 500);
                    }, 600);
                }
            }, 350); // Speed of the boot log
        });
    }

    // --- SWIPE DOWN COMMAND CONSOLE LOGIC ---
    let startY = 0;
    const consoleUI = document.getElementById('command-console');
    const cmdInput = document.getElementById('cmd-input');

    // Detect swipe from the top 10% of the screen
    document.addEventListener('touchstart', e => {
        startY = e.touches[0].clientY;
    });

    document.addEventListener('touchend', e => {
        let endY = e.changedTouches[0].clientY;
        // If they start near the top and swipe down more than 60px
        if (startY < 80 && endY > startY + 60) { 
            consoleUI.style.top = '0'; // Slide console down
            cmdInput.focus();
        }
    });

    // Handle Secret Codes
    cmdInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            const code = this.value.toLowerCase().trim();
            
            if (code === 'unlock_fps') {
                // Reveal the hidden FPS booster card
                const secretCard = document.getElementById('secret-fps-card');
                secretCard.style.display = 'flex';
                // Slide console back up
                consoleUI.style.top = '-100px';
                this.value = '';
                this.blur();
                alert("EFECT FPS BOOSTER OVERRIDE ACCEPTED.");
            } else {
                // Wrong code, close console
                consoleUI.style.top = '-100px';
                this.value = '';
                this.blur();
            }
        }
    });

    // --- EASTER EGG (TAP HEADER 5 TIMES) ---
    let headerClicks = 0;
    const header = document.getElementById('typewriter');
    if(header) {
        header.addEventListener('click', () => {
            headerClicks++;
            if (headerClicks === 5) {
                document.documentElement.style.setProperty('--neon-color', '#ff0000');
                const allGreenText = document.querySelectorAll('h1, h2, .neon-btn:not(#secret-fps-card .neon-btn), .icon-wrapper, .terminal-log, #live-ping');
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
    const x = event.gamma ? event.gamma / 1.5 : 0; 
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
    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') return;

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
