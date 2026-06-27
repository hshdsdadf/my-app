export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = 0;
    this.height = 0;
  }

  resize(width, height) {
    const pixelRatio = window.devicePixelRatio || 1;
    this.width = Math.max(1, width);
    this.height = Math.max(1, height);
    this.canvas.width = Math.floor(this.width * pixelRatio);
    this.canvas.height = Math.floor(this.height * pixelRatio);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  }

  render(game, state) {
    const ctx = this.ctx;
    const { width, height } = this;
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = '#5b5b5b';
    ctx.fillRect(0, 0, width, height);

    this.drawGround(ctx, width, height);
    this.drawPlayer(ctx, game);

    if (state.paused) {
      ctx.fillStyle = 'rgba(16, 16, 16, 0.88)';
      ctx.fillRect(0, 0, width, height);
    }
  }

  drawGround(ctx, width, height) {
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#6f6f6f');
    gradient.addColorStop(1, '#4a4a4a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.globalAlpha = 0.08;
    ctx.strokeStyle = '#d1d1d1';
    ctx.lineWidth = 1;
    for (let y = 0; y < height; y += 42) {
      ctx.beginPath();
      ctx.moveTo(0, y + (y % 84 === 0 ? 1 : 0));
      ctx.lineTo(width, y + (y % 84 === 0 ? 1 : 0));
      ctx.stroke();
    }
    ctx.restore();

    ctx.save();
    const patchRadius = Math.max(width, height) * 0.5;
    const sx = width * 0.5;
    const sy = height * 0.7;
    const grd = ctx.createRadialGradient(sx, sy, patchRadius * 0.18, sx, sy, patchRadius);
    grd.addColorStop(0, 'rgba(255, 255, 255, 0.18)');
    grd.addColorStop(1, 'rgba(0, 0, 0, 0.0)');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.ellipse(sx, sy, patchRadius * 0.68, patchRadius * 0.24, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  drawPlayer(ctx, game) {
    const player = game.player;
    const bodyX = player.x;
    const bodyY = player.y - 8 + Math.sin(game.player.walkPhase * 2) * 2 * player.speed;
    const wobble = Math.sin(game.player.walkPhase) * 4 * player.speed;
    const bodyRadiusX = player.radius * 0.8;
    const bodyRadiusY = player.radius * 1.15;

    ctx.save();
    ctx.translate(bodyX, bodyY);
    ctx.rotate(player.angle * 0.15);

    ctx.save();
    ctx.translate(0, bodyRadiusY * 0.55);
    ctx.scale(1, 0.4);
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.beginPath();
    ctx.ellipse(0, 0, bodyRadiusX * 0.9, bodyRadiusX * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    const bodyGradient = ctx.createLinearGradient(-bodyRadiusX, -bodyRadiusY, bodyRadiusX, bodyRadiusY);
    bodyGradient.addColorStop(0, '#e8e5dd');
    bodyGradient.addColorStop(0.5, '#d8d4c7');
    bodyGradient.addColorStop(1, '#f7f3eb');
    ctx.fillStyle = bodyGradient;
    ctx.beginPath();
    ctx.ellipse(0, 0, bodyRadiusX, bodyRadiusY, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.globalAlpha = 0.65;
    ctx.beginPath();
    ctx.ellipse(-bodyRadiusX * 0.4, -bodyRadiusY * 0.5, bodyRadiusX * 0.35, bodyRadiusY * 0.22, -0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.save();
    ctx.fillStyle = '#beb9a8';
    ctx.translate(0, bodyRadiusY * 0.4);
    const step = player.stride * 0.3;
    ctx.fillRect(-bodyRadiusX * 0.48 + step, 0, bodyRadiusX * 0.28, bodyRadiusY * 0.18);
    ctx.fillRect(bodyRadiusX * 0.2 + step, 0, bodyRadiusX * 0.28, bodyRadiusY * 0.18);
    ctx.restore();

    const armAngle = Math.sin(game.player.walkPhase * 2) * 0.18;
    const armSpread = bodyRadiusX + 6;

    this.drawWeaponArm(ctx, -armSpread, -bodyRadiusY * 0.15, -0.18 + armAngle, player.speed, true);
    this.drawWeaponArm(ctx, armSpread, -bodyRadiusY * 0.15, 0.18 - armAngle, player.speed, false);
    ctx.restore();
    ctx.restore();
  }

  drawWeaponArm(ctx, startX, startY, angle, speed, left) {
    ctx.save();
    ctx.translate(startX, startY);
    ctx.rotate(angle);
    ctx.fillStyle = '#38322b';
    ctx.fillRect(0, -8, 40, 14);
    ctx.fillStyle = '#2f2a24';
    ctx.fillRect(40, -6, 18, 10);
    ctx.fillStyle = '#a5a19b';
    ctx.fillRect(56, -4, 12, 6);
    ctx.fillStyle = '#18140f';
    ctx.fillRect(56, -5, 12, 2);
    ctx.fillRect(58, 0, 6, 4);
    ctx.fillStyle = '#dbc77d';
    ctx.beginPath();
    ctx.arc(6, 0, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
