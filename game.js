export class Game {
  constructor(renderer) {
    this.renderer = renderer;
    this.lastTime = performance.now();
    this.paused = false;
    this.player = {
      x: 0,
      y: 0,
      radius: 32,
    };
    this.angle = 0;
  }

  setPaused(paused) {
    this.paused = paused;
  }

  start() {
    this.lastTime = performance.now();
    requestAnimationFrame(this.loop.bind(this));
  }

  loop(timestamp) {
    const delta = Math.min((timestamp - this.lastTime) / 1000, 0.033);
    this.lastTime = timestamp;

    if (!this.paused) {
      this.update(delta);
    }

    this.renderer.render(this, { paused: this.paused });
    requestAnimationFrame(this.loop.bind(this));
  }

  update(delta) {
    const minSize = Math.min(this.renderer.width, this.renderer.height);
    this.angle += delta * 1.2;
    this.player.radius = Math.max(18, minSize * 0.05);
    this.player.x = this.renderer.width * 0.5 + Math.cos(this.angle) * minSize * 0.18;
    this.player.y = this.renderer.height * 0.5 + Math.sin(this.angle) * minSize * 0.18;
  }
}
