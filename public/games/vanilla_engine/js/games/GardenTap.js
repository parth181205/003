/* =====================================================
   GardenTap.js — Speed of Processing / Reaction Game
   Flowers pop up from the garden — tap ONLY the YELLOW ones!
   Go/No-Go executive function training
   Inspired by: ACTIVE study speed-of-processing training
   Videos: bgXJWotViOY, -5IdyD2wZUA, oyD_HjJ_Q38
   ===================================================== */

const GardenTap = (() => {
  let canvas, ctx, W, H;
  let animId = null;
  let onWin  = null;
  let difficulty = 'gentle';

  // Game state
  let holes     = [];   // grid holes where flowers pop
  let flowers   = [];   // active flower objects
  let score     = 0;
  let misses    = 0;    // wrong taps (red/purple)
  let missed    = 0;    // yellow flowers not tapped in time
  let timeLeft  = 0;
  let gameOver  = false;
  let startTime = 0;
  let burst     = [];
  let comboCount= 0;
  let comboMsg  = '';
  let comboTimer= 0;
  let lastSpawn = 0;

  const DIFF_CFG = {
    gentle:   { duration: 30, spawnRate: 1800, maxFlowers: 3, decoyChance: 0.25, speed: 1.2 },
    active:   { duration: 45, spawnRate: 1200, maxFlowers: 5, decoyChance: 0.35, speed: 1.5 },
    champion: { duration: 60, spawnRate: 800,  maxFlowers: 7, decoyChance: 0.45, speed: 2.0 },
  };

  // Flower types: target = yellow, decoys = red, purple, blue
  const FLOWER_TYPES = [
    { color: '#FFD166', stroke: '#D4A017', name: 'YELLOW', target: true  },
    { color: '#FF6B6B', stroke: '#C0392B', name: 'RED',    target: false },
    { color: '#9B59B6', stroke: '#6C3483', name: 'PURPLE', target: false },
    { color: '#4ECDC4', stroke: '#2E8B84', name: 'BLUE',   target: false },
  ];

  const COMBO_MSGS = ['Nice!', 'Great!', 'Super!', 'Amazing!', 'Brilliant!', 'Superstar!'];

  function init(canvasEl, diff, winCallback) {
    canvas = canvasEl;
    ctx    = canvas.getContext('2d');
    difficulty = diff || 'gentle';
    onWin  = winCallback;
    CanvasEngine.fitCanvas(canvas, canvas.parentElement);
    W = canvas.width; H = canvas.height;
    buildGame();
    bindEvents();
    if (animId) cancelAnimationFrame(animId);
    loop();
  }

  function buildGame() {
    const cfg = DIFF_CFG[difficulty];
    score     = 0;
    misses    = 0;
    missed    = 0;
    gameOver  = false;
    timeLeft  = cfg.duration;
    startTime = Date.now();
    flowers   = [];
    burst     = [];
    comboCount= 0;
    comboMsg  = '';
    comboTimer= 0;
    lastSpawn = 0;

    // Build grid of holes (3 cols × 3 rows)
    const cols = 4, rows = 3;
    const holeR = Math.min(W/cols, H/rows) * 0.18;
    const padX  = (W - cols * holeR*2.8) / 2;
    const padY  = (H*0.72 - rows * holeR*2.8) / 2 + H*0.12;

    holes = [];
    for (let r=0; r<rows; r++) {
      for (let c=0; c<cols; c++) {
        holes.push({
          x: padX + c * holeR*2.8 + holeR,
          y: padY + r * holeR*2.8 + holeR,
          r: holeR,
          occupied: false,
        });
      }
    }
  }

  function bindEvents() {
    canvas.onclick    = handleTap;
    canvas.ontouchend = (e) => { e.preventDefault(); handleTap(e); };
  }

  function handleTap(e) {
    if (gameOver) return;
    const pos = CanvasEngine.getScaledPos(canvas, e);

    let tapped = false;
    flowers.forEach(f => {
      if (!f.visible) return;
      const dx = pos.x - f.x, dy = pos.y - f.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist <= f.r + 8) {
        tapped = true;
        f.visible  = false;
        f.hole.occupied = false;
        if (f.type.target) {
          // Correct tap — yellow flower
          score++;
          comboCount++;
          SoundEngine.playMatch();
          burst.push(...CanvasEngine.createBurst(ctx, f.x, f.y, 14,
            ['#FFD166','#FFB300','#fff']));
          if (comboCount >= 3) {
            comboMsg   = COMBO_MSGS[Math.min(comboCount-3, COMBO_MSGS.length-1)];
            comboTimer = 40;
            if (comboCount % 3 === 0) SoundEngine.playSuccess();
          }
        } else {
          // Wrong tap — decoy flower
          misses++;
          comboCount = 0;
          SoundEngine.playMiss();
          burst.push(...CanvasEngine.createBurst(ctx, f.x, f.y, 8,
            ['#FF6B6B','#fff']));
        }
      }
    });
    flowers = flowers.filter(f => f.visible || f.hiding);
  }

  function spawnFlower() {
    const cfg = DIFF_CFG[difficulty];
    const freeHoles = holes.filter(h => !h.occupied);
    if (freeHoles.length === 0) return;
    const active = flowers.filter(f => f.visible).length;
    if (active >= cfg.maxFlowers) return;

    const hole = freeHoles[Math.floor(Math.random() * freeHoles.length)];
    hole.occupied = true;

    // Pick type
    const isDecoy = Math.random() < cfg.decoyChance;
    const types   = isDecoy
      ? FLOWER_TYPES.filter(t => !t.target)
      : [FLOWER_TYPES[0]]; // yellow
    const type    = types[Math.floor(Math.random() * types.length)];

    flowers.push({
      x:       hole.x,
      y:       hole.y,
      r:       hole.r * 0.85,
      hole,
      type,
      visible: true,
      hiding:  false,
      life:    cfg.duration === 30 ? 2200 : cfg.duration === 45 ? 1600 : 1100,
      born:    Date.now(),
      popT:    0, // 0→1 pop animation
    });
  }

  function loop() {
    update();
    draw();
    animId = requestAnimationFrame(loop);
  }

  function update() {
    if (gameOver) return;
    const cfg = DIFF_CFG[difficulty];
    const elapsed = (Date.now() - startTime) / 1000;
    timeLeft = Math.max(0, cfg.duration - elapsed);

    // Spawn
    const now = Date.now();
    if (now - lastSpawn >= cfg.spawnRate) {
      spawnFlower();
      lastSpawn = now;
    }

    // Animate flowers
    flowers.forEach(f => {
      f.popT = Math.min(f.popT + 0.1, 1);
      const age = Date.now() - f.born;
      if (age > f.life && f.visible) {
        if (f.type.target) missed++;
        f.visible = false;
        f.hole.occupied = false;
      }
    });
    flowers = flowers.filter(f => f.visible);

    if (comboTimer > 0) comboTimer--;

    // Game over
    if (timeLeft <= 0) {
      gameOver = true;
      SoundEngine.playCelebration();
      const total = score + missed;
      const acc   = total > 0 ? score / total : 0;
      const stars = acc >= 0.8 ? 3 : acc >= 0.5 ? 2 : 1;
      setTimeout(() => { if (onWin) onWin(stars); }, 1000);
    }
  }

  function draw() {
    ctx.clearRect(0,0,W,H);

    // Garden background
    const sky = ctx.createLinearGradient(0,0,0,H*0.4);
    sky.addColorStop(0,'#87CEEB'); sky.addColorStop(1,'#c9f0ff');
    ctx.fillStyle=sky; ctx.fillRect(0,0,W,H*0.4);
    const gnd = ctx.createLinearGradient(0,H*0.4,0,H);
    gnd.addColorStop(0,'#6BBF6E'); gnd.addColorStop(1,'#4a7c59');
    ctx.fillStyle=gnd; ctx.fillRect(0,H*0.4,W,H*0.6);

    // Decorative background flowers
    for (let i=0;i<6;i++) {
      CanvasEngine.drawMiniFlower(ctx, W*(0.08+i*0.16), H*0.88, 14, i*55, 0.5);
    }

    // Draw holes
    holes.forEach(h => {
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(h.x, h.y+h.r*0.3, h.r*0.9, h.r*0.35, 0, 0, Math.PI*2);
      ctx.fillStyle='rgba(0,0,0,0.25)';
      ctx.fill();
      ctx.restore();
    });

    // Draw flowers
    flowers.forEach(f => {
      const age    = Date.now() - f.born;
      const ratio  = age / f.life;
      const popScale = Math.min(1, f.popT * 1.2);
      const wiggle = Math.sin(age * 0.005) * 3;

      ctx.save();
      ctx.translate(f.x, f.y);
      ctx.scale(popScale, popScale);

      // Stem
      ctx.beginPath();
      ctx.moveTo(wiggle*0.5, f.r*0.3);
      ctx.lineTo(wiggle, f.r*1.1);
      ctx.strokeStyle='#4a7c59'; ctx.lineWidth=3; ctx.stroke();

      // Petals
      const petals = 6;
      for (let p=0; p<petals; p++) {
        ctx.save();
        ctx.rotate((p/petals)*Math.PI*2);
        ctx.beginPath();
        ctx.ellipse(0, -f.r*0.55, f.r*0.22, f.r*0.42, 0, 0, Math.PI*2);
        ctx.fillStyle = f.type.color;
        ctx.fill();
        ctx.restore();
      }
      // Center
      ctx.beginPath();
      ctx.arc(0, 0, f.r*0.28, 0, Math.PI*2);
      ctx.fillStyle = '#FFF3B0';
      ctx.fill();
      ctx.strokeStyle = f.type.stroke; ctx.lineWidth=2; ctx.stroke();

      // Life timer ring
      ctx.beginPath();
      ctx.arc(0, 0, f.r*0.28, -Math.PI/2, -Math.PI/2 + (1-ratio)*Math.PI*2);
      ctx.strokeStyle = ratio > 0.7 ? '#FF6B6B' : 'rgba(255,255,255,0.6)';
      ctx.lineWidth = 2.5; ctx.stroke();

      ctx.restore();
    });

    // Burst particles
    burst = CanvasEngine.updateBurst(burst, ctx);

    // Combo message
    if (comboTimer > 0 && comboMsg) {
      const alpha = Math.min(1, comboTimer/15);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.font = `bold ${Math.min(28, W*0.06)}px Nunito, sans-serif`;
      ctx.fillStyle = '#FFD166';
      ctx.strokeStyle = '#D4870A';
      ctx.lineWidth = 3;
      ctx.textAlign = 'center';
      ctx.strokeText(comboMsg + (comboCount >= 5 ? ' 🔥' : ''), W/2, H*0.38);
      ctx.fillText(comboMsg + (comboCount >= 5 ? ' 🔥' : ''), W/2, H*0.38);
      ctx.restore();
    }

    // HUD top bar
    const barH = 50;
    CanvasEngine.fillRoundRect(ctx, 0, 0, W, barH, 0, 'rgba(255,255,255,0.88)');

    // Timer
    const timerColor = timeLeft <= 10 ? '#FF6B6B' : '#2E8B84';
    ctx.font = `bold ${W*0.045}px Nunito, sans-serif`;
    ctx.fillStyle = timerColor; ctx.textAlign = 'left';
    ctx.fillText(`⏱ ${Math.ceil(timeLeft)}s`, 14, 34);

    // Score
    ctx.fillStyle = '#2E8B84'; ctx.textAlign = 'center';
    ctx.fillText(`⭐ ${score}`, W/2, 34);

    // Instructions
    ctx.font = `600 ${W*0.03}px Nunito, sans-serif`;
    ctx.fillStyle = '#888'; ctx.textAlign = 'right';
    ctx.fillText('Tap 🌼 YELLOW only!', W-12, 34);

    // Timer bar
    const tRatio = timeLeft / DIFF_CFG[difficulty].duration;
    CanvasEngine.fillRoundRect(ctx, 0, barH-6, W*tRatio, 6, 0,
      tRatio > 0.5 ? '#4ECDC4' : tRatio > 0.25 ? '#FFD166' : '#FF6B6B');
  }

  function destroy() {
    if (animId) cancelAnimationFrame(animId);
    canvas.onclick = null;
    canvas.ontouchend = null;
  }

  function restart() { buildGame(); }

  return { init, destroy, restart };
})();
