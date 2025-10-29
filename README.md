# Juego_programación_web_I
Juego Snake Game inspirado en el juego de la serpiente de Nokia y el juego de la serpiente de google, creado en HTML,JS y CSS

# 🐍 Snake Game - 3 Niveles de Dificultad

Un juego clásico de la serpiente (Snake) desarrollado con JavaScript vanilla, HTML5 Canvas y CSS3. Incluye 3 niveles progresivos con diferentes mecánicas y desafíos.

## 🎮 Características

- **3 Niveles de Dificultad Progresiva**
  - **Nivel 1 - Modo Clásico**: Velocidad lenta, sin obstáculos (10 manzanas para avanzar)
  - **Nivel 2 - Obstáculos**: Velocidad media con paredes móviles (15 manzanas para avanzar)
  - **Nivel 3 - Portales**: Velocidad rápida con teletransportación (20 manzanas para completar)

- **Sistema de Puntuación**
  - Puntos por cada manzana comida (multiplicador según nivel)
  - Guardado automático del récord personal
  - Persistencia de datos con localStorage

- **Efectos de Sonido**
  - Música de fondo durante el juego
  - Efectos para comer, subir de nivel y game over
  - Control de sonido activable/desactivable

- **Diseño Moderno**
  - Interfaz responsiva adaptable a diferentes pantallas
  - Animaciones suaves y efectos visuales
  - Tema visual dinámico según el nivel

## 🕹️ Controles

- **Flechas del teclado** (↑ ↓ ← →) o **WASD** para mover la serpiente
- Presiona **cualquier tecla** para iniciar el juego
- Presiona **cualquier tecla de dirección** para reiniciar después de Game Over
- Haz clic en el **icono de sonido** (🔊/🔇) para activar/desactivar audio

## 📁 Estructura del Proyecto

```
snake-game/
│
├── index.html          # Estructura HTML principal
├── css/
│   └── styles.css      # Estilos y diseño responsivo
├── js/
│   └── game.js         # Lógica principal del juego
└── audio/
    ├── audio.js        # Sistema de sonidos
    ├── messenger-tono-mensaje-.mp3
    └── good-bad-ugly-ringtones.mp3
```

## 🚀 Instalación y Uso

1. **Clona este repositorio**
   ```bash
   git clone https://github.com/tu-usuario/snake-game.git
   cd snake-game
   ```

2. **Abre el archivo HTML**
   - Simplemente abre `index.html` en tu navegador web favorito
   - No requiere instalación de dependencias ni servidor

3. **¡Juega!**
   - Presiona cualquier tecla para comenzar
   - Evita chocar con los bordes, obstáculos o contigo mismo

## 🎯 Mecánicas del Juego

### Nivel 1: Modo Clásico
- Velocidad: **Lenta** ⚪
- Objetivo: Come 10 manzanas rojas
- Sin obstáculos adicionales
- Perfecto para familiarizarte con los controles

### Nivel 2: Obstáculos
- Velocidad: **Media** 🟡
- Objetivo: Come 15 manzanas rojas
- Aparecen paredes verdes aleatorias
- ¡Evita chocar con ellas!

### Nivel 3: Portales
- Velocidad: **Rápida** 🔴
- Objetivo: Come 20 naranjas
- Portales morados te teletransportan
- El fondo cambia a un tono oscuro espacial

## 🛠️ Tecnologías Utilizadas

- **HTML5 Canvas** - Renderizado del juego
- **JavaScript (ES6)** - Lógica y mecánicas
- **CSS3** - Estilos y animaciones
- **LocalStorage API** - Persistencia de datos
- **Web Audio API** - Efectos de sonido generados

## 📊 Sistema de Puntuación

- **Nivel 1**: 10 puntos por manzana
- **Nivel 2**: 20 puntos por manzana
- **Nivel 3**: 30 puntos por manzana
- El récord se guarda automáticamente al finalizar cada partida

## 🎨 Personalización

El juego está diseñado para ser fácilmente personalizable:

- **Velocidad**: Modifica `gameSpeed` en `game.js`
- **Tamaño del grid**: Cambia la constante `grid` (línea 15)
- **Colores**: Ajusta los valores en `ctx.fillStyle` dentro del loop
- **Dificultad**: Modifica `applesNeeded` para cada nivel

## 📱 Compatibilidad

- ✅ Chrome/Edge (últimas versiones)
- ✅ Firefox (últimas versiones)
- ✅ Safari (últimas versiones)
- ✅ Diseño responsivo para móviles y tablets

## 🐛 Problemas Conocidos

- En algunos navegadores móviles, los controles táctiles no están implementados
- La música de fondo puede no reproducirse automáticamente en Safari (política de autoplay)


## ✨ Autor

Desarrollado por Samantha Betanzo Bolaños

🙏 Agradecimientos

- Inspirado en el clásico juego Snake de Nokia y de Google
- Efectos de sonido y música de dominio público
- Comunidad de desarrolladores web por recursos y tutoriales


🎮 **¡Diviértete jugando, animoo!**
