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

// Sparkle / Particle Generator on Click
document.addEventListener('click', function(e) {
    // Don't spawn particles if clicking a button (keeps things clean)
    if (e.target.tagName === 'BUTTON') return;

    // Generate 8 particles per tap
    for (let j = 0; j < 8; j++) {
        createParticle(e.pageX, e.pageY);
    }
});

function createParticle(x, y) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    document.body.appendChild(particle);

    // Randomize explosion direction and distance
    const angle = Math.random() * Math.PI * 2;
    const velocity = 30 + Math.random() * 50; 
    const tx = Math.cos(angle) * velocity + 'px';
    const ty = Math.sin(angle) * velocity + 'px';

    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.setProperty('--tx', tx);
    particle.style.setProperty('--ty', ty);

    // Delete particle from DOM after animation finishes
    setTimeout(() => {
        particle.remove();
    }, 600);
}

window.onload = typeWriter;
