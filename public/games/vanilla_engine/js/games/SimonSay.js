/* =====================================================
   SimonSay.js — Rainbow Drumbeat (Simon memory sequence game)
   Watch the color sequence, then repeat it!
   ===================================================== */

const SimonSay = (() => {
  let canvas, ctx, W, H;
  let animId = null;
  let sequence = [];
  let playerSeq = [];
  let phase = 'idle'; // idle | showing | player | win | lose
  let showIdx = 0;
  let showTimer = 0;
  let burst = [];
  let onWin = null;
  let difficulty = 'gentle';
  let round = 0;
  let message = '';
  let msgTimer = 0;
  let litPad = -1;
  let litTimer = 0;

  const DIFF = {
    gentle:   { target: 3, speed: 900 },
    active:   { target: 5, speed: 650 },
    champion: { target: 8, speed: 450 },
  };

  const PADS = [
    { color: '#FF6B6B', dark: '#C0392B', name: 'red',    label: '🌹 Red'    },
    { color: '#4ECDC4', dark: '#2E8B84', name: 'blue',   label: '🌊 Blue'   },
    { color: '#FFD166', dark: '#D4A017', name: 'yellow', label: '☀️ Yellow' },
    { color: '#95E1D3', dark: '#5CB8A5', name: 'green',  label: '🍀 Green'  },
  ];

  function init(canvasEl, diff, winCallback) {
    canvas = canvasEl;
    ctx    = canvas.getContext('2d');
    difficulty = diff || 'gentle';
    onWin  = winCallback;
    CanvasEngine.fitCanvas(canvas, canvas.parentElement);
    W = canvas.width; H = canvas.height;
    reset();
    bindEvents();
    if (animId) cancelAnimationFrame(animId);
    loop();
    setTimeout(nextRound, 800);
  }

  function reset() {
    sequence = [];
    playerSeq = [];
    phase = 'idle';
    showIdx = 0;
    burst = [];
    round = 0;
    message = 'Watch the pattern!';
    msgTimer = 80;
    litPad = -1;
    litTimer = 0;
  }

  function nextRound() {
    round++;
    playerSeq = [];
    const next = Math.floor(Math.random() * 4);
    sequence.push(next);
    phase = 'showing';
    showIdx = 0;
    showTimer = 0;
    message = '👀 Watch carefully...';
    msgTimer = 999;
  }

  function bindEvents() {
    canvas.onclick = handleClick;
    canvas.ontouchend = (e) => { e.preventDefault(); handleClick(e); };
  }

  function getPadRects() {
    const size = Math.min(W, H) * 0.38;
    const gap  = size * 0.06;
    const ox   = (W - size * 2 - gap) / 2;
    const oy   = (H - size * 2 - gap) / 2 - H * 0.04;
    return [
      { x: ox,         y: oy,         w: size, h: size }, // red   TL
      { x: ox+size+gap,y: oy,         w: size, h: size }, // blue  TR
      { x: ox,         y: oy+size+gap,w: size, h: size }, // yellow BL
      { x: ox+size+gap,y: oy+size+gap,w: size, h: size }, // green  BR
    ];
  }

  function handleClick(e) {
    if (phase !== 'player') return;
    const pos   = CanvasEngine.getScaledPos(canvas, e);
    const rects = getPadRects();
    const hit   = rects.findIndex(r =>
      pos.x >= r.x && pos.x <= r.x+r.w && pos.y >= r.y && pos.y <= r.y+r.h
    );
    if (hit < 0) return;

    SoundEngine.playSimonTone(PADS[hit].name, 0.35);
    litPad = hit;
    litTimer = 18;

    playerSeq.push(hit);
    const idx = playerSeq.length - 1;

    if (playerSeq[idx] !== sequence[idx]) {
      // Wrong!
      phase = 'lose';
      SoundEngine.playMiss();
      message = '😊 Oops! Let\'s try again!';
      msgTimer = 999;
      setTimeout(() => {
        sequence = [];
        playerSeq = [];
        round = 0;
        setTimeout(nextRound, 1200);
      }, 1800);
      return;
    }

    if (playerSeq.length === sequence.length) {
      // Correct round
      SoundEngine.playMatch();
      const cfg = DIFF[difficulty];
      if (sequence.length >= cfg.target) {
        // WIN
        phase = 'win';
        const stars = round >= cfg.target ? 3 : round >= Math.ceil(cfg.target*0.66) ? 2 : 1;
        message = '🏆 Brilliant! You did it!';
        msgTimer = 999;
        const cx = W/2, cy = H/2;
        burst.push(...CanvasEngine.createBurst(ctx, cx, cy, 30));
        SoundEngine.playCelebration();
        setTimeout(() => { if (onWin) onWin(stars); }, 1600);
      } else {
        message = '⭐ Perfect! Next round...';
        msgTimer = 50;
        phase = 'idle';
        setTimeout(nextRound, 1200);
      }
    }
  }

  function loop() {
    update();
    draw();
    animId = requestAnimationFrame(loop);
  }

  function update() {
    // Animate showing sequence
    if (phase === 'showing') {
      showTimer++;
      const cfg = DIFF[difficulty];
      const stepDur = Math.floor(cfg.speed / 16.67);
      if (showTimer >= stepDur) {
        showTimer = 0;
        if (showIdx < sequence.length) {
          litPad = sequence[showIdx];
          litTimer = Math.floor(stepDur * 0.55);
          SoundEngine.playSimonTone(PADS[litPad].name, cfg.speed/1000 * 0.6);
          showIdx++;
        } else {
          phase = 'player';
          litPad = -1;
          message = '🎵 Now you try!';
          msgTimer = 60;
        }
      }
    }
    if (litTimer > 0) litTimer--;
    else litPad = -1;
    if (msgTimer > 0) msgTimer--;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Dark background for drama
    const grad = ctx.createRadialGradient(W/2,H/2,20, W/2,H/2,Math.max(W,H)*0.7);
    grad.addColorStop(0, '#1a1a2e');
    grad.addColorStop(1, '#0d0d1f');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Draw pads
    const rects = getPadRects();
    rects.forEach((r, i) => {
      const pad   = PADS[i];
      const isLit = litPad === i;
      ctx.save();
      CanvasEngine.roundRect(ctx, r.x, r.y, r.w, r.h, 18);
      ctx.fillStyle = isLit ? pad.color : pad.dark + '55';
      ctx.fill();
      if (isLit) {
        ctx.shadowColor = pad.color;
        ctx.shadowBlur  = 40;
        CanvasEngine.roundRect(ctx, r.x, r.y, r.w, r.h, 18);
        ctx.fillStyle = pad.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      // Label
      ctx.font = `bold ${r.w*0.13}px Nunito, sans-serif`;
      ctx.fillStyle = isLit ? '#fff' : 'rgba(255,255,255,0.4)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(pad.label, r.x + r.w/2, r.y + r.h/2);
      ctx.textBaseline = 'alphabetic';
      ctx.restore();
    });

    // Center circle with round indicator
    const cx = W/2, cy = getPadRects()[0].y + getPadRects()[0].h + (getPadRects()[2].y - getPadRects()[0].y - getPadRects()[0].h)/2;
    ctx.beginPath();
    ctx.arc(cx, cy, 30, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.fill();
    ctx.font = 'bold 16px Nunito, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${sequence.length}`, cx, cy);
    ctx.textBaseline = 'alphabetic';

    // Message bar
    if (message) {
      const barY = H - 54;
      CanvasEngine.fillRoundRect(ctx, W*0.05, barY, W*0.9, 40, 12, 'rgba(255,255,255,0.1)');
      ctx.font = 'bold 17px Nunito, sans-serif';
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.fillText(message, W/2, barY + 26);
    }

    // Sequence dots (progress)
    const dotY = 24, dotR = 6, dotGap = 18;
    const totalDots = sequence.length;
    const dotsStart = W/2 - (totalDots * (dotR*2+dotGap))/2;
    for (let i=0; i<totalDots; i++) {
      ctx.beginPath();
      ctx.arc(dotsStart + i*(dotR*2+dotGap), dotY, dotR, 0, Math.PI*2);
      ctx.fillStyle = i < playerSeq.length ? '#FFD166' : 'rgba(255,255,255,0.2)';
      ctx.fill();
    }

    // Burst particles
    burst = CanvasEngine.updateBurst(burst, ctx);
  }

  function destroy() {
    if (animId) cancelAnimationFrame(animId);
    canvas.onclick = null;
    canvas.ontouchend = null;
  }

  function restart() {
    reset();
    setTimeout(nextRound, 600);
  }

  return { init, destroy, restart };
})();
