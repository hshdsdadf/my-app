export class Game {
  constructor(renderer) {
    this.renderer = renderer;
    this.lastTime = performance.now();
    this.paused = false;
    this.viewport = { width: window.innerWidth, height: window.innerHeight };

    this.inputActive = false;
    this.inputOrigin = { x: 0, y: 0 };
    this.inputPosition = { x: 0, y: 0 };
    this.inputVector = { x: 0, y: 0 };

    this.player = {
      x: this.viewport.width * 0.5,
      y: this.viewport.height * 0.65,
      radius: 44,
      angle: 0,
      speed: 0,
      stride: 0,
      idleTimer: 0,
      walkPhase: 0,
    };
  }

  setViewport(width, height) {
    this.viewport.width = width;
    this.viewport.height = height;
    this.player.x = Math.max(this.player.radius + 32, Math.min(this.player.x, width - this.player.radius - 32));
    this.player.y = Math.max(this.player.radius + 32, Math.min(this.player.y, height - this.player.radius - 32));
  }

  setPaused(paused) {
    this.paused = paused;
  }

  setInputActive(active, point = null) {
    this.inputActive = active;
    if (!active) {
      this.inputVector.x = 0;
      this.inputVector.y = 0;
    }
    if (point) {
      this.inputOrigin = { ...point };
      this.inputPosition = { ...point };
    }
  }

  setInputPosition(point) {
    if (!this.inputActive) return;
    this.inputPosition = { ...point };
    const dx = point.x - this.inputOrigin.x;
    const dy = point.y - this.inputOrigin.y;
    this.inputVector.x = dx;
    this.inputVector.y = dy;
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
    const maxMagnitude = Math.min(this.viewport.width, this.viewport.height) * 0.25;
    const rawMagnitude = Math.hypot(this.inputVector.x, this.inputVector.y);
    const strength = Math.min(rawMagnitude / maxMagnitude, 1);

    let moveX = 0;
    let moveY = 0;
    if (this.inputActive && rawMagnitude > 16) {
      const normalizedX = this.inputVector.x / rawMagnitude;
      const normalizedY = this.inputVector.y / rawMagnitude;
      const maxSpeed = 220;
      moveX = normalizedX * strength * maxSpeed * delta;
      moveY = normalizedY * strength * maxSpeed * delta;
      this.player.speed = Math.max(this.player.speed * 0.88, strength);
      this.player.angle = Math.atan2(normalizedY, normalizedX);
      this.player.walkPhase += delta * (4 + strength * 4);
    } else {
      this.player.speed = Math.max(0, this.player.speed - delta * 1.6);
      this.player.walkPhase += delta * 1.2;
    }

    this.player.x = Math.min(Math.max(this.player.x + moveX, 72), this.viewport.width - 72);
    this.player.y = Math.min(Math.max(this.player.y + moveY, 88), this.viewport.height - 88);

    this.player.idleTimer += delta;
    this.player.stride = Math.sin(this.player.walkPhase) * 8 * this.player.speed;
  }
}
