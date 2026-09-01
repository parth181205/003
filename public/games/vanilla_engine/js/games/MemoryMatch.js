/* =====================================================
   MemoryMatch.js — Flower Garden Card Flip Game
   Find matching pairs using a smooth 3D-perspective flip animation
   ===================================================== */

const MemoryMatch = (() => {
  let canvas, ctx, W, H;
  let cards = [];
  let flipped = [], matched = [];
  let locked = false;
  let animId = null;
  let burst = [];
  let stars = 0;
  let moves = 0;
  let onWin = null;
  let difficulty = 'gentle';

  // Flower themes: [emoji, hue, label]
  const FLOWER_DATA = [
    { emoji: '🌸', hue: 340, label: 'Cherry Blossom' },
    { emoji: '🌻', hue:  45, label: 'Sunflower' },
    { emoji: '🌹', hue:   0, label: 'Rose' },
    { emoji: '🦋', hue: 270, label: 'Butterfly' },
    { emoji: '🌺', hue:  15, label: 'Hibiscus' },
    { emoji: '🐦', hue: 200, label: 'Bird' },
    { emoji: '🌷', hue: 320, label: 'Tulip' },
    { emoji: '🍀', hue: 120, label: 'Clover' },
  ];

  const DIFF = {
    gentle:   { pairs: 4,  cols: 4, rows: 2 },
    active:   { pairs: 6,  cols: 4, rows: 3 },
    champion: { pairs: 8,  cols: 4, rows: 4 },
  };

  function init(canvasEl, diff, winCallback) {
    canvas = canvasEl;
    ctx    = canvas.getContext('2d');
    difficulty = diff || 'gentle';
    onWin  = winCallback;
    CanvasEngine.fitCanvas(canvas, canvas.parentElement);
    W = canvas.width; H = canvas.height;
    buildCards();
    bindEvents();
    if (animId) cancelAnimationFrame(animId);
    loop();
  }

  function buildCards() {
    const cfg = DIFF[difficulty];
    const chosen = FLOWER_DATA.slice(0, cfg.pairs);
    const deck   = [...chosen, ...chosen]; // pairs
    // Fisher-Yates shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    const { cols, rows } = cfg;
    const pad  = Math.min(W, H) * 0.04;
    const cardW = (W - pad * (cols + 1)) / cols;
    const cardH = (H - pad * (rows + 1)) / rows;
    const startY = (H - (cardH * rows + pad * (rows - 1))) / 2;
    const startX = (W - (cardW * cols + pad * (cols - 1))) / 2;

    cards = deck.map((flower, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      return {
        id:     i,
        flower,
        x:      startX + col * (cardW + pad),
        y:      startY + row * (cardH + pad),
        w:      cardW,
        h:      cardH,
        flip:   0,    // 0=face-down, 1=face-up (animated 0→1)
        target: 0,
        matched: false,
      };
    });

    flipped = [];
    matched = [];
    locked  = false;
    moves   = 0;
    burst   = [];
    stars   = 0;
  }

  function bindEvents() {
    canvas.onclick = handleClick;
    canvas.ontouchend = (e) => { e.preventDefault(); handleClick(e); };
  }

  function handleClick(e) {
    if (locked) return;
    const pos  = CanvasEngine.getScaledPos(canvas, e);
    const card = cards.find(c =>
      !c.matched && c.target === 0 &&
      pos.x >= c.x && pos.x <= c.x + c.w &&
      pos.y >= c.y && pos.y <= c.y + c.h
    );
    if (!card || flipped.includes(card)) return;

    SoundEngine.playFlip();
    card.target = 1;
    flipped.push(card);

    if (flipped.length === 2) {
      locked = true;
      moves++;
      setTimeout(checkMatch, 900);
    }
  }

  function checkMatch() {
    const [a, b] = flipped;
    if (a.flower.emoji === b.flower.emoji) {
      a.matched = b.matched = true;
      matched.push(a, b);
      SoundEngine.playMatch();
      // Particle burst
      const cx = a.x + a.w / 2, cy = a.y + a.h / 2;
      burst.push(...CanvasEngine.createBurst(ctx, cx, cy, 18));
      flipped = [];
      locked  = false;
      if (matched.length === cards.length) {
        setTimeout(handleWin, 400);
      }
    } else {
      SoundEngine.playMiss();
      a.target = b.target = 0;
      flipped = [];
      setTimeout(() => { locked = false; }, 200);
    }
  }

  function handleWin() {
    const total = cards.length / 2;
    if (moves <= total + 2)      stars = 3;
    else if (moves <= total + 6) stars = 2;
    else                          stars = 1;
    SoundEngine.playCelebration();
    if (onWin) onWin(stars);
  }

  function loop() {
    draw();
    animId = requestAnimationFrame(loop);
  }

  function draw() {
    // Clear
    ctx.clearRect(0, 0, W, H);

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, '#e8f5f4');
    grad.addColorStop(1, '#fff8f0');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Animate flips
    cards.forEach(c => {
      const speed = 0.09;
      if (c.flip < c.target) c.flip = Math.min(c.flip + speed, c.target);
      if (c.flip > c.target) c.flip = Math.max(c.flip - speed, c.target);
    });

    // Draw cards
    cards.forEach(drawCard);

    // Burst particles
    burst = CanvasEngine.updateBurst(burst, ctx);

    // Move counter
    ctx.font = '600 14px Nunito, sans-serif';
    ctx.fillStyle = 'rgba(46,139,132,0.7)';
    ctx.textAlign = 'left';
    ctx.fillText(`Moves: ${moves}`, 14, H - 10);

    // Matched counter
    ctx.textAlign = 'right';
    ctx.fillText(`Pairs: ${matched.length/2} / ${cards.length/2}`, W - 14, H - 10);
  }

  function drawCard(c) {
    ctx.save();
    ctx.translate(c.x + c.w / 2, c.y + c.h / 2);

    const scaleX = Math.abs(Math.cos(c.flip * Math.PI));
    ctx.scale(scaleX, 1);

    const half = c.w / 2;

    if (c.flip < 0.5) {
      // Face-down
      CanvasEngine.roundRect(ctx, -half, -c.h/2, c.w, c.h, 12);
      const bg = ctx.createLinearGradient(-half, -c.h/2, half, c.h/2);
      bg.addColorStop(0, '#2E8B84');
      bg.addColorStop(1, '#1A6B65');
      ctx.fillStyle = bg;
      ctx.fill();
      // Pattern
      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      for (let r = 0; r < 3; r++) {
        for (let cc = 0; cc < 3; cc++) {
          ctx.beginPath();
          ctx.arc(-half*0.5 + cc*c.w*0.22, -c.h*0.25 + r*c.h*0.3, 4, 0, Math.PI*2);
          ctx.fill();
        }
      }
      ctx.strokeStyle = 'rgba(255,255,255,0.25)';
      ctx.lineWidth = 1.5;
      CanvasEngine.roundRect(ctx, -half+4, -c.h/2+4, c.w-8, c.h-8, 10);
      ctx.stroke();
    } else {
      // Face-up
      CanvasEngine.roundRect(ctx, -half, -c.h/2, c.w, c.h, 12);
      ctx.fillStyle = c.matched ? `hsl(${c.flower.hue}, 50%, 97%)` : '#fff';
      ctx.fill();
      if (c.matched) {
        ctx.strokeStyle = `hsl(${c.flower.hue}, 60%, 65%)`;
        ctx.lineWidth = 3;
        CanvasEngine.roundRect(ctx, -half, -c.h/2, c.w, c.h, 12);
        ctx.stroke();
      }
      // Flower
      const fs = Math.min(c.w, c.h) * 0.35;
      CanvasEngine.drawMiniFlower(ctx, 0, -fs*0.3, fs, c.flower.hue, 1);
      // Label
      ctx.font = `bold ${Math.min(c.w*0.14, 13)}px Nunito, sans-serif`;
      ctx.fillStyle = `hsl(${c.flower.hue}, 50%, 35%)`;
      ctx.textAlign = 'center';
      ctx.fillText(c.flower.label, 0, c.h/2 - 10);
    }

    // Shadow
    ctx.shadowBlur = 0;
    ctx.restore();

    // Card border
    if (!c.matched) {
      ctx.save();
      ctx.translate(c.x + c.w / 2, c.y + c.h / 2);
      CanvasEngine.roundRect(ctx, -c.w/2, -c.h/2, c.w, c.h, 12);
      ctx.strokeStyle = 'rgba(46,139,132,0.18)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    }
  }

  function destroy() {
    if (animId) cancelAnimationFrame(animId);
    canvas.onclick = null;
    canvas.ontouchend = null;
  }

  function restart() {
    buildCards();
  }

  return { init, destroy, restart };
})();
