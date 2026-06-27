import { Game } from './game.js';
import { Renderer } from './renderer.js';

const canvas = document.getElementById('gameCanvas');
const orientationMessage = document.getElementById('orientationMessage');
const renderer = new Renderer(canvas);
const game = new Game(renderer);

function resizeGame() {
  renderer.resize(window.innerWidth, window.innerHeight);
}

function updateOrientation() {
  const portrait = window.innerHeight > window.innerWidth;
  orientationMessage.classList.toggle('hidden', !portrait);
  game.setPaused(portrait);
}

window.addEventListener('resize', () => {
  resizeGame();
  updateOrientation();
});

window.addEventListener('orientationchange', () => {
  setTimeout(() => {
    resizeGame();
    updateOrientation();
  }, 100);
});

resizeGame();
updateOrientation();
game.start();
