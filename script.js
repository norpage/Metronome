const bpmInput = document.getElementById('bpm');
const freqInput = document.querySelector('.audioHz');
const noteSelect = document.getElementById('note');
const modeSelect = document.getElementById('mode');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const status = document.getElementById('status');
const beatIndicator = document.getElementById('beatIndicator');

const bpmDecreaseButton = document.getElementById('bpmDecrease');
const bpmIncreaseButton = document.getElementById('bpmIncrease');
const freqDecreaseButton = document.getElementById('freqDecrease');
const freqIncreaseButton = document.getElementById('freqIncrease');

let intervalId = null;
let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let oscillator = null;

function playSound() {
    const mode = modeSelect.value;
    let frequency;

    if (mode === 'hz') {
        frequency = parseFloat(freqInput.value);
    } else if (mode === 'note') {
        frequency = parseFloat(noteSelect.value);
    }

    if (oscillator) {
        oscillator.stop();
        oscillator.disconnect();
    }

    oscillator = audioContext.createOscillator();
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
}

function startMetronome() {
    const bpm = parseInt(bpmInput.value, 10);
    const interval = 60000 / bpm;

    if (intervalId) {
        clearInterval(intervalId);
    }

    intervalId = setInterval(() => {
        playSound();
        beatIndicator.style.display = 'block';
        setTimeout(() => beatIndicator.style.display = 'none', interval / 2);
    }, interval);

    status.textContent = `${bpm} BPM և ${modeSelect.options[modeSelect.selectedIndex].text}`;
    startButton.textContent = 'Թարմացնել';
}

function stopMetronome() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
        status.textContent = 'Կանգնեցված է';
    }
    if (oscillator) {
        oscillator.stop();
        oscillator.disconnect();
    }
    beatIndicator.style.display = 'none';
    startButton.textContent = 'Սկսել';
}

startButton.addEventListener('click', () => {
    if (intervalId) {
        startMetronome();
    } else {
        startMetronome();
    }
});

stopButton.addEventListener('click', stopMetronome);

bpmDecreaseButton.addEventListener('click', () => {
    let bpm = parseInt(bpmInput.value, 10);
    if (bpm > 20) {
        bpmInput.value = bpm - 1;
    }
});

bpmIncreaseButton.addEventListener('click', () => {
    let bpm = parseInt(bpmInput.value, 10);
    if (bpm < 400) {
        bpmInput.value = bpm + 1;
    }
});

freqDecreaseButton.addEventListener('click', () => {
    let frequency = parseFloat(freqInput.value);
    if (frequency > 20) {
        freqInput.value = frequency - 1;
    }
});

freqIncreaseButton.addEventListener('click', () => {
    let frequency = parseFloat(freqInput.value);
    if (frequency < 2000) {
        freqInput.value = frequency + 1;
    }
});

freqInput.addEventListener('input', () => {
    const value = parseFloat(freqInput.value);
    if (isNaN(value) || value < 20 || value > 2000) {
        freqInput.value = Math.min(Math.max(value, 20), 2000);
    }
});

modeSelect.addEventListener('change', () => {
    const mode = modeSelect.value;
    if (mode === 'hz') {
        document.getElementById('hzInputs').style.display = 'block';
        document.getElementById('noteInputs').style.display = 'none';
    } else if (mode === 'note') {
        document.getElementById('hzInputs').style.display = 'none';
        document.getElementById('noteInputs').style.display = 'block';
    }
});

modeSelect.dispatchEvent(new Event('change'));