const text = "> INIT_EFECT_SUITE...";
let i = 0;
const speed = 75; 

// --- AUDIO ---
const bootSound = new Audio('efectboot.mp3');   
const clickSound = new Audio('spckclick.mp3'); 

function triggerClick() {
    clickSound.currentTime = 0;
    clickSound.play().catch(()=>{});
    if (navigator.vibrate) navigator.vibrate(15); 
}

function triggerBoot() {
    bootSound.currentTime = 0;
    bootSound.play().catch(()=>{});
    if (navigator.vibrate) navigator.vibrate([40, 50, 40]); 
}

document.addEventListener('DOMContentLoaded', () => {
    localStorage.removeItem('efect_monitor_unlocked');

    const initBtn = document.getElementById('init-btn');

    if (initBtn) {
        initBtn.onclick = function() {
            triggerBoot();
            initBtn.style.display = 'none';
            document.getElementById('boot-hud').style.display = 'block';
            
            let steps = ["INJECTING_KERNEL...", "BYPASSING_GATES...", "SYSTEM_READY"];
            let idx = 0;
            let timer = setInterval(() => {
                if(idx < steps.length) {
                    document.getElementById('splash-terminal').innerHTML = "> " + steps[idx];
                    const seg = document.getElementById(`seg-${idx + 1}`);
                    if (seg) seg.classList.add('active');
                    idx++;
                } else {
                    clearInterval(timer);
                    setTimeout(() => {
                        document.getElementById('splash-screen').style.opacity = '0';
                        setTimeout(() => { document.getElementById('splash-screen').remove(); initLockScreen(); }, 500);
                    }, 400);
                }
            }, 600);
        };
    }

    function initLockScreen() {
        const ls = document.getElementById('lock-screen');
        ls.style.display = 'flex';
        setTimeout(() => ls.style.opacity = '1', 10);

        document.getElementById('lock-btn').onclick = function() {
            triggerClick();
            ls.style.opacity = '0';
            setTimeout(() => { 
                ls.style.display = 'none'; 
                startTypewriter(); 
                scheduleNextSale();
            }, 400);
        };
    }

    // --- CONSOLE (420) ---
    const consoleUI = document.getElementById('command-console');
    const cmdInput = document.getElementById('cmd-input');
    let startY = 0;
    document.addEventListener('touchstart', e => { startY = e.touches[0].clientY; });
    document.addEventListener('touchend', e => {
        if (startY < 150 && e.changedTouches[0].clientY > startY + 50) {
            consoleUI.style.top = '0'; cmdInput.focus();
        }
    });

    consoleUI.addEventListener('submit', (e) => {
        e.preventDefault();
        if (cmdInput.value === '420') { triggerBoot(); unlockHardwareMonitor(); }
        else if (cmdInput.value === 'efect.lit') { document.getElementById('secret-fps-card').style.display = 'block'; }
        consoleUI.style.top = '-100px'; cmdInput.value = '';
    });

    // --- MODALS ---
    const setupM = (btn, mod) => {
        document.getElementById(btn)?.addEventListener('click', () => {
            triggerClick();
            const m = document.getElementById(mod);
            m.style.display = 'flex'; setTimeout(() => m.style.opacity = '1', 10);
        });
    };
    setupM('btn-preview', 'preview-modal');
    setupM('btn-synergy', 'synergy-modal');
    setupM('btn-hw-monitor', 'telemetry-modal');

    document.querySelectorAll('.close-btn').forEach(b => {
        b.addEventListener('click', (e) => {
            triggerClick();
            const mod = e.target.closest('.modal-overlay');
            mod.style.opacity = '0'; setTimeout(() => mod.style.display = 'none', 300);
        });
    });
});

function unlockHardwareMonitor() {
    const hwCard = document.getElementById('hw-monitor-card');
    const hwBtn = document.getElementById('btn-hw-monitor');
    const hwBadge = document.getElementById('hw-status-badge');
    hwCard.classList.remove('locked');
    hwBadge.innerHTML = 'ONLINE';
    hwBadge.className = 'status online';
    hwBtn.classList.remove('disabled');
    hwBtn.removeAttribute('disabled');
    hwBtn.innerText = 'OPEN TELEMETRY';
}

function startTypewriter() {
    if (i < text.length) {
        document.getElementById("typewriter").innerHTML += text.charAt(i);
        i++; setTimeout(startTypewriter, 75);
    }
}

// --- SALES ENGINE ---
const pds = ["Efect Pro Elite", "Efect Macro Engine", "Efect FPS Booster"];
const locs = ["Texas", "London", "Florida", "California", "France"];

function triggerRandomSale() {
    const toast = document.getElementById('sales-toast');
    if (!toast) return;
    const p = pds[Math.floor(Math.random() * pds.length)];
    const l = locs[Math.floor(Math.random() * locs.length)];
    document.getElementById('sale-desc').innerHTML = `User from <strong>${l}</strong> secured <strong>${p}</strong>`;
    toast.classList.add('show');
    triggerClick();
    setTimeout(() => { toast.classList.remove('show'); scheduleNextSale(); }, 6000); 
}

function scheduleNextSale() {
    setTimeout(triggerRandomSale, 25000);
}
