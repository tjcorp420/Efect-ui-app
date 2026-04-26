// --- AUDIO (LOWERCASE) ---
const bootSound = new Audio('efectboot.mp3');
const clickSound = new Audio('spckclick.mp3');

document.addEventListener('DOMContentLoaded', () => {
    const initBtn = document.getElementById('init-btn');
    
    if (initBtn) {
        initBtn.onclick = function() {
            // 1. Audio Wakeup
            try { bootSound.play().catch(()=>{}); } catch(e){}

            // 2. UI Response
            initBtn.style.display = 'none';
            document.getElementById('boot-hud').style.display = 'block';

            // 3. Simple Sequence
            let steps = ["SECURE_LINK...", "BYPASS_OS...", "READY"];
            let i = 0;
            let timer = setInterval(() => {
                if (i < steps.length) {
                    document.getElementById('splash-terminal').innerHTML = "> " + steps[i];
                    const seg = document.getElementById(`seg-${i+1}`);
                    if (seg) seg.classList.add('active');
                    i++;
                } else {
                    clearInterval(timer);
                    document.getElementById('splash-screen').style.display = 'none';
                    // Trigger sales loop later
                    setTimeout(triggerRandomSale, 5000);
                }
            }, 600);
        };
    }
});

// SALES ENGINE
function triggerRandomSale() {
    // We'll re-add the toast logic once you confirm the button is working
    console.log("Sales engine stand-by");
}
