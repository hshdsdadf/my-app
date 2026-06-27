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
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.fillStyle = '#070707';
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 22px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('Hollow', 24, 24);

    if (!state.paused) {
      ctx.save();
      ctx.fillStyle = '#34d3ff';
      ctx.shadowColor = 'rgba(52, 211, 255, 0.6)';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(game.player.x, game.player.y, game.player.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.font = '400 14px system-ui, sans-serif';
      ctx.fillText('Add this page to your home screen for fullscreen play.', 24, 58);
    } else {
      ctx.fillStyle = 'rgba(255,255,255,0.65)';
      ctx.font = '400 16px system-ui, sans-serif';
      ctx.fillText('Waiting for landscape mode...', 24, 58);
    }
  }
}
