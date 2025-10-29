/**
 * 🐍 SNAKE GAME - Juego de la serpiente con 3 niveles de dificultad
 *
 * Características:
 * - 3 niveles (velocidad, obstáculos y portales)
 * - Sistema de puntuación y guardado con localStorage
 * - Efectos de sonido (manejados por audio/audio.js)
 * - Animaciones, colisiones y pantallas de inicio/game over
 * - Controles con teclas de dirección o WASD
 */

// ===== CONFIGURACIÓN DEL CANVAS =====
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const grid = 20; // Tamaño de cada celda
const gridCount = canvas.width / grid; // Cantidad de celdas por fila

// ===== VARIABLES DE ESTADO DEL JUEGO =====
let gameSpeed = 12; // Velocidad general del juego
let count = 0; // Contador de frames
let gameRunning = false; // Si el juego está en curso
let gameStarted = false; // Si el jugador ya inició
let gameOverState = false; // Si el jugador perdió

// ===== SISTEMA DE NIVELES Y PUNTUACIÓN =====
let currentLevel = 1;
let applesEaten = 0; // Manzanas comidas en el nivel actual
let applesNeeded = 10; // Manzanas necesarias para pasar de nivel
let score = 0;
let highscore = 0; // Puntaje máximo guardado

// ===== ELEMENTOS DEL JUEGO =====
let obstacles = []; // Arreglo con obstáculos del nivel 2
let portals = [];   // Arreglo con portales del nivel 3

// ===== CARGAR DATOS GUARDADOS (puntuación más alta) =====
function loadGameData() {
  try {
    const savedData = localStorage.getItem('snakeGameData');
    if (savedData) {
      const data = JSON.parse(savedData);
      highscore = data.highscore || 0;
    } else {
      highscore = 0;
    }
  } catch (e) {
    console.error('Error cargando datos:', e);
    highscore = 0;
  }
  document.getElementById('highscore').textContent = highscore;
}

// Guarda los datos de récord en localStorage
function saveGameData() {
  try {
    localStorage.setItem('snakeGameData', JSON.stringify({
      highscore: highscore,
      lastPlayed: new Date().toISOString()
    }));
  } catch (e) {
    console.error('Error guardando datos:', e);
  }
}

loadGameData(); // Se ejecuta al inicio

highscore = 0;
saveGameData(); // Guarda el 0 como nuevo récord
updateStats();  // Actualiza el panel del juego

// ===== OBJETO SERPIENTE =====
let snake = {
  x: 300, // posición inicial X
  y: 300, // posición inicial Y
  dx: grid, // movimiento inicial en X (derecha)
  dy: 0, // movimiento inicial en Y
  cells: [], // segmentos del cuerpo
  maxCells: 4 // longitud inicial
};

// ===== OBJETO MANZANA =====
let apple = {
  x: getRandomInt(0, gridCount) * grid,
  y: getRandomInt(0, gridCount) * grid
};

// Función auxiliar: genera un número entero aleatorio entre min y max
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * ===== CONFIGURACIÓN DE NIVELES =====
 */
function setupLevel() {
  obstacles = [];
  portals = [];

  switch (currentLevel) {
    case 1: // Nivel clásico
      applesNeeded = 10;
      gameSpeed = 20; //Velocidad de la serpiente , recuerda que el numero más alto es la velocidad ma lenta 
      document.getElementById('levelInfo').innerHTML =
        '<strong>Nivel 1 - Modo Clásico:</strong> Come 10 manzanas para avanzar (Velocidad: Lenta ⚪)';
      break;

    case 2: // Nivel con obstáculos
      applesNeeded = 15;
      gameSpeed = 18;
      document.getElementById('levelInfo').innerHTML =
        '<strong>Nivel 2 - Obstáculos:</strong> Come 15 manzanas. ¡Cuidado con las paredes! (Velocidad: Media 🟡)';

      for (let i = 0; i < 15; i++) {
        let ox = getRandomInt(2, gridCount - 2) * grid;
        let oy = getRandomInt(2, gridCount - 2) * grid;
        if (ox !== snake.x || oy !== snake.y) {
          obstacles.push({ x: ox, y: oy });
        }
      }
      break;

    case 3: // Nivel con portales
      applesNeeded = 20;
      gameSpeed = 15;
      document.getElementById('levelInfo').innerHTML =
        '<strong>Nivel 3 - Portales:</strong> Come 20 naranjas. ¡Los portales te teletransportan! (Velocidad: Rápida 🔴)';

      portals = [           //son posiciones aleatrorias 
        {
          x1: getRandomInt(1, 5) * grid, //getRandomInt(1, 5) elige un número aleatorio entre 1 y 4 y asi para los demas.
          y1: getRandomInt(1, 5) * grid,
          x2: getRandomInt(20, 28) * grid,
          y2: getRandomInt(20, 28) * grid
        },
        {
          x1: getRandomInt(20, 28) * grid,
          y1: getRandomInt(1, 5) * grid,
          x2: getRandomInt(1, 5) * grid,
          y2: getRandomInt(20, 28) * grid
        }
      ];
      break;
  }

  applesEaten = 0;
  updateStats();
}

/**
 * ===== FUNCIÓN PARA CREAR MANZANAS =====
 */
function spawnApple() {
  let validPosition = false;
  let attempts = 0;
  const maxAttempts = 100;

  while (!validPosition && attempts < maxAttempts) {
    apple.x = getRandomInt(0, gridCount) * grid;
    apple.y = getRandomInt(0, gridCount) * grid;
    validPosition = true;

    for (let obs of obstacles) {
      if (apple.x === obs.x && apple.y === obs.y) {
        validPosition = false;
        break;
      }
    }

    if (validPosition) {
      for (let cell of snake.cells) {
        if (apple.x === cell.x && apple.y === cell.y) {
          validPosition = false;
          break;
        }
      }
    }
    attempts++;
  }
}

// ===== ACTUALIZA LOS DATOS DEL PANEL DE ESTADÍSTICAS =====
function updateStats() {
  document.getElementById('level').textContent = currentLevel;
  document.getElementById('apples').textContent = `${applesEaten}/${applesNeeded}`;
  document.getElementById('score').textContent = score;
  document.getElementById('highscore').textContent = highscore;
}

/**
 * ===== CAMBIO DE NIVEL =====
 */
function nextLevel() {
  currentLevel++;
  if (currentLevel > 3) {
    alert('🎉 ¡Felicidades! Completaste los 3 niveles.\n\nPuntaje Final: ' + score);
    currentLevel = 1;
  }
  playSound('levelup');
  setupLevel();
  resetSnake();
}

/**
 * ===== REINICIO DE LA SERPIENTE =====
 * posicion de la anaconda jaja
 */
function resetSnake() {
  snake.x = 300;    
  snake.y = 300;
  snake.cells = [];
  snake.maxCells = 4;
  snake.dx = -grid;
  snake.dy = 0;
}

/**
 * ===== FUNCIÓN DE GAME OVER =====
 */
function gameOver() {
  gameRunning = false;
  gameOverState = true;
  playSound('gameover');

  if (score > highscore) {
    highscore = score;
    saveGameData();
    updateStats();
  }

  document.getElementById('finalScore').textContent = score;
  document.getElementById('finalLevel').textContent = currentLevel;
  document.getElementById('gameOver').classList.add('active');
}

/**
 * ===== REINICIO COMPLETO DEL JUEGO =====
 */
function restartGame() {
  document.getElementById('gameOver').classList.remove('active');
  gameOverState = false;
  currentLevel = 1;
  score = 0;
  gameRunning = true;
  setupLevel();
  resetSnake();
  spawnApple();
  updateStats();
  playSound('start');
}

/**
 * ===== PORTALES (NIVEL 3) =====
 */
function checkPortalCollision() {
  for (let portal of portals) {
    if (snake.x === portal.x1 && snake.y === portal.y1) {
      snake.x = portal.x2;
      snake.y = portal.y2;
      playSound('portal');
      return true;
    } else if (snake.x === portal.x2 && snake.y === portal.y2) {
      snake.x = portal.x1;
      snake.y = portal.y1;
      playSound('portal');
      return true;
    }
  }
  return false;
}

/**
 * ===== BUCLE PRINCIPAL DEL JUEGO =====
 */
function loop() {
  requestAnimationFrame(loop);
  if (!gameRunning) return;

  if (++count < gameSpeed) return;
  count = 0;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = currentLevel === 3 ? '#2c2c3e' : '#7CB342';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#558B2F';
  for (let obs of obstacles) {
    ctx.fillRect(obs.x, obs.y, grid - 1, grid - 1);
    ctx.strokeStyle = '#33691E';
    ctx.strokeRect(obs.x, obs.y, grid - 1, grid - 1);
  }

  for (let portal of portals) { 
    ctx.save();
    const gradient1 = ctx.createRadialGradient(
      portal.x1 + grid/2, portal.y1 + grid/2, 0,
      portal.x1 + grid/2, portal.y1 + grid/2, grid
    );
    gradient1.addColorStop(0, '#9C27B0');   
    gradient1.addColorStop(1, '#673AB7');
    ctx.fillStyle = gradient1;
    ctx.beginPath();
    ctx.arc(portal.x1 + grid/2, portal.y1 + grid/2, grid * 1.5, 0, Math.PI * 2);
    ctx.fill();

    const gradient2 = ctx.createRadialGradient(
      portal.x2 + grid/2, portal.y2 + grid/2, 0,
      portal.x2 + grid/2, portal.y2 + grid/2, grid
    );
    gradient2.addColorStop(0, '#9C27B0');
    gradient2.addColorStop(1, '#673AB7');
    ctx.fillStyle = gradient2;
    ctx.beginPath();
    ctx.arc(portal.x2 + grid/2, portal.y2 + grid/2, grid * 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  snake.x += snake.dx;
  snake.y += snake.dy;

  if (snake.x < 0 || snake.x >= canvas.width || snake.y < 0 || snake.y >= canvas.height) {
    gameOver();
    return;
  }

  if (currentLevel === 3) checkPortalCollision();

  for (let obs of obstacles) {
    if (snake.x === obs.x && snake.y === obs.y) {
      gameOver();
      return;
    }
  }

  snake.cells.unshift({ x: snake.x, y: snake.y });
  if (snake.cells.length > snake.maxCells) snake.cells.pop();

  //Manzana y naranja
  const isLevel3 = currentLevel === 3;
  const appleColor = isLevel3 ? ['#c7ff4dff', '#e4b30fff'] : ['#F44336', '#C62828']; //la primera es el centro, segunda el borde por asi decirlo
  const stemColor = '#4CAF50';

  const gradient = ctx.createRadialGradient(
    apple.x + grid/2, apple.y + grid/2, 0,
    apple.x + grid/2, apple.y + grid/2, grid/2
  );
  gradient.addColorStop(0, appleColor[0]);
  gradient.addColorStop(1, appleColor[1]);
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(apple.x + grid/2, apple.y + grid/2, grid/2 - 1, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = stemColor;
  ctx.beginPath();
  ctx.arc(apple.x + grid/2 + 3, apple.y + 3, 4, 0, Math.PI * 2);
  ctx.fill();

  snake.cells.forEach(function(cell, index) {
    if (index === 0) {
      ctx.fillStyle = '#2196F3';
      ctx.beginPath();
      ctx.arc(cell.x + grid/2, cell.y + grid/2, grid/2 - 1, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(cell.x + grid/2 - 4, cell.y + grid/2 - 2, 3, 0, Math.PI * 2);
      ctx.arc(cell.x + grid/2 + 4, cell.y + grid/2 - 2, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.arc(cell.x + grid/2 - 4, cell.y + grid/2 - 2, 1.5, 0, Math.PI * 2);
      ctx.arc(cell.x + grid/2 + 4, cell.y + grid/2 - 2, 1.5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = '#2196F3';
      ctx.fillRect(cell.x + 1, cell.y + 1, grid - 2, grid - 2);
    }

    if (cell.x === apple.x && cell.y === apple.y) {
      snake.maxCells++;
      applesEaten++;
      score += 10 * currentLevel;
      playSound('eat');
      updateStats();
      if (applesEaten >= applesNeeded) nextLevel();
      spawnApple();
    }

    for (let i = index + 1; i < snake.cells.length; i++) {
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        gameOver();
        return;
      }
    }
  });
}

/**
 * ===== CONTROLES DEL JUEGO =====
 */
document.addEventListener('keydown', function(e) {
  if (!gameStarted) {
    gameStarted = true;
    gameRunning = true;
    document.getElementById('startScreen').classList.remove('active');
    playSound('start');
    e.preventDefault();
    return;
  }

  if (gameOverState) {
    const validKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'a', 'A', 'd', 'D', 'w', 'W', 's', 'S'];
    if (validKeys.includes(e.key)) {
      restartGame();
      e.preventDefault();
      return;
    }
  }

  if (e.key === 'ArrowLeft' && snake.dx === 0 || e.key.toLowerCase() === 'a' && snake.dx === 0) {
    snake.dx = -grid; snake.dy = 0;
  } else if (e.key === 'ArrowUp' && snake.dy === 0 || e.key.toLowerCase() === 'w' && snake.dy === 0) {
    snake.dy = -grid; snake.dx = 0;
  } else if (e.key === 'ArrowRight' && snake.dx === 0 || e.key.toLowerCase() === 'd' && snake.dx === 0) {
    snake.dx = grid; snake.dy = 0;
  } else if (e.key === 'ArrowDown' && snake.dy === 0 || e.key.toLowerCase() === 's' && snake.dy === 0) {
    snake.dy = grid; snake.dx = 0;
  }
});

// ===== INICIALIZACIÓN =====
setupLevel();
spawnApple();
requestAnimationFrame(loop);