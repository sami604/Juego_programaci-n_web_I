let soundEnabled = true;
let backgroundMusic;

/**
 * Reproduce efectos de sonido o música de fondo
 */
function playSound(type) {
  if (!soundEnabled) return;

  try {
    switch (type) {
      case 'eat': {
        // 🍎 Sonido al comer una manzana
        const eatSound = new Audio('audio/messenger-tono-mensaje-.mp3');
        eatSound.volume = 0.6;
        eatSound.play();
        break;
      }

      case 'start': {
        // 🎵 Música de fondo del juego
        if (!backgroundMusic) {
          backgroundMusic = new Audio('audio/good-bad-ugly-ringtones.mp3');
          backgroundMusic.loop = true; // Que la música se repita
          backgroundMusic.volume = 0.3; // Volumen bajo para que no moleste
        }
        backgroundMusic.play();
        break;
      }

      case 'gameover': {
        // 💀 Detiene la música cuando el juego termina
        if (backgroundMusic) {
          backgroundMusic.pause();
          backgroundMusic.currentTime = 0;
        }
        break;
      }

      case 'levelup': {
        // ⭐ Sonido al subir de nivel (pequeño efecto con AudioContext)
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.type = 'triangle';
        oscillator.frequency.value = 700;
        gainNode.gain.value = 0.15;
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.2);
        break;
      }

      case 'portal': {
        // 🔮 Sonido corto al usar portal
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.type = 'sine';
        oscillator.frequency.value = 600;
        gainNode.gain.value = 0.1;
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.2);
        break;
      }
    }
  } catch (e) {
    console.error('Error reproduciendo sonido:', e);
  }
}

/**
 * Activa o desactiva todos los sonidos y música
 */
function toggleSound() {
  soundEnabled = !soundEnabled;

  // Cambiar ícono en pantalla
  const icon = document.querySelector('.sound-toggle');
  icon.textContent = soundEnabled ? '🔊' : '🔇';

  // Pausar o reanudar la música de fondo
  if (backgroundMusic) {
    if (soundEnabled) backgroundMusic.play();
    else backgroundMusic.pause();
  }

  // Guardar preferencia en localStorage
  try {
    localStorage.setItem('snakeSoundEnabled', soundEnabled);
  } catch (e) {
    console.error('Error guardando preferencia de sonido:', e);
  }
}

/**
 * Cargar preferencia de sonido guardada al iniciar
 */
try {
  const savedSound = localStorage.getItem('snakeSoundEnabled');
  if (savedSound !== null) {
    soundEnabled = savedSound === 'true';
    const icon = document.querySelector('.sound-toggle');
    icon.textContent = soundEnabled ? '🔊' : '🔇';
  }
} catch (e) {
  console.error('Error cargando preferencia de sonido:', e);
}
