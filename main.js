import { Game } from './game.js';
import { Renderer } from './renderer.js';

const canvas = document.getElementById('gameCanvas');
const orientationMessage = document.getElementById('orientationMessage');
const renderer = new Renderer(canvas);
const game = new Game(renderer);

function resizeGame() {
  renderer.resize(window.innerWidth, window.innerHeight);
  game.setViewport(window.innerWidth, window.innerHeight);
}

function updateOrientation() {
  const portrait = window.innerHeight > window.innerWidth;
  orientationMessage.classList.toggle('hidden', !portrait);
  game.setPaused(portrait);
}

function getPointerPosition(event) {
  if (event.touches && event.touches.length) {
    return { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }
  return { x: event.clientX, y: event.clientY };
}

function handleStart(event) {
  event.preventDefault();
  const point = getPointerPosition(event);
  if (point.x < window.innerWidth * 0.5) return;
  game.setInputActive(true, point);
}

function handleMove(event) {
  if (!game.inputActive) return;
  event.preventDefault();
  const point = getPointerPosition(event);
  game.setInputPosition(point);
}

function handleEnd(event) {
  if (!game.inputActive) return;
  event.preventDefault();
  game.setInputActive(false);
}

canvas.addEventListener('touchstart', handleStart, { passive: false });
canvas.addEventListener('touchmove', handleMove, { passive: false });
canvas.addEventListener('touchend', handleEnd, { passive: false });
canvas.addEventListener('touchcancel', handleEnd, { passive: false });
canvas.addEventListener('mousedown', handleStart);
window.addEventListener('mousemove', handleMove);
window.addEventListener('mouseup', handleEnd);

window.addEventListener('resize', () => {
  resizeGame();
  updateOrientation();
});

window.addEventListener('orientationchange', () => {
  setTimeout(() => {
    resizeGame();
    updateOrientation();
  }, 120);
});

resizeGame();
updateOrientation();
game.start();
