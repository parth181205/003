/* =====================================================
   WordBloom.js — Name That Flower word recall game
   See an illustration → choose the correct word from options
   Letters bloom as you answer correctly!
   ===================================================== */

const WordBloom = (() => {
  let canvas, ctx, W, H;
  let animId = null;
  let onWin  = null;
  let difficulty = 'gentle';

  let currentQ  = 0;
  let score      = 0;
  let questions  = [];
  let chosen     = -1;
  let phase      = 'question'; // question | feedback | done
  let bloom      = 0; // 0→1 bloom animation
  let burst      = [];
  let feedbackTimer = 0;
  let petalAnim  = [];

  const WORDS = [
    { emoji:'🌸', hue:340, word:'Blossom', hint:'Pink spring flower' },
    { emoji:'🌻', hue: 45, word:'Sunflower', hint:'Tall yellow bloom' },
    { emoji:'🌹', hue:  0, word:'Rose', hint:'Classic red flower' },
    { emoji:'🌷', hue:320, word:'Tulip', hint:'Cup-shaped spring flower' },
    { emoji:'🌺', hue: 15, word:'Hibiscus', hint:'Tropical beauty' },
    { emoji:'🍀', hue:120, word:'Clover', hint:'Lucky green plant' },
    { emoji:'🌿', hue:140, word:'Fern', hint:'Green leafy plant' },
    { emoji:'🌾', hue: 50, word:'Wheat', hint:'Golden grain stalk' },
    { emoji:'🍁', hue: 20, word:'Maple Leaf', hint:'Red autumn leaf' },
    { emoji:'🪷', hue:300, word:'Lotus', hint:'Sacred water flower' },
    { emoji:'🌲', hue:140, word:'Pine Tree', hint:'Evergreen tall tree' },
    { emoji:'🌵', hue:130, word:'Cactus', hint:'Desert spiny plant' },
  ];

  const DIFF = {
    gentle:   { options: 2, questions: 5 },
    active:   { options: 3, questions: 8 },
    champion: { options: 4, questions: 10 },
  };

  function init(canvasEl, diff, winCallback) {
    canvas = canvasEl;
    ctx    = canvas.getContext('2d');
    difficulty = diff || 'gentle';
    onWin  = winCallback;
    CanvasEngine.fitCanvas(canvas, canvas.parentElement);
    W = canvas.width; H = canvas.height;
    buildQuestions();
    bindEvents();
    if (animId) cancelAnimationFrame(animId);
    loop();
  }

  function buildQuestions() {
    const cfg = DIFF[difficulty];
    const shuffled = [...WORDS].sort(() => Math.random() - 0.5);
    questions = shuffled.slice(0, cfg.questions).map(correct => {
      const wrong = WORDS.filter(w => w.word !== correct.word)
                         .sort(() => Math.random() - 0.5)
                         .slice(0, cfg.options - 1);
      const all  = [correct, ...wrong].sort(() => Math.random() - 0.5);
      return { correct, options: all };
    });
    currentQ = 0;
    score    = 0;
    chosen   = -1;
    bloom    = 0;
    burst    = [];
    petalAnim = spawnPetals();
    phase    = 'question';
  }

  function spawnPetals() {
    return Array.from({ length: 18 }, () => ({
      x: Math.random() * (W || 600),
      y: Math.random() * (H || 400),
      r: Math.random() * 8 + 4,
      hue: Math.random() * 360,
      speed: Math.random() * 0.4 + 0.1,
      alpha: Math.random() * 0.3 + 0.05,
    }));
  }

  function getOptionRects() {
    const cfg = DIFF[difficulty];
    const count = cfg.options;
    const btnW = Math.min(W * 0.85 / count, 180);
    const btnH = 54;
    const gap  = (W - btnW * count) / (count + 1);
    const y    = H - 80;
    return Array.from({ length: count }, (_, i) => ({
      x: gap + i * (btnW + gap),
      y,
      w: btnW,
      h: btnH,
    }));
  }

  function bindEvents() {
    canvas.onclick = handleClick;
    canvas.ontouchend = (e) => { e.preventDefault(); handleClick(e); };
  }

  function handleClick(e) {
    if (phase !== 'question') return;
    const pos   = CanvasEngine.getScaledPos(canvas, e);
    const rects = getOptionRects();
    const hit   = rects.findIndex(r =>
      pos.x >= r.x && pos.x <= r.x+r.w && pos.y >= r.y && pos.y <= r.y+r.h
    );
    if (hit < 0) return;

    chosen = hit;
    const q = questions[currentQ];
    const correct = q.options[hit].word === q.correct.word;

    if (correct) {
      SoundEngine.playWordCorrect();
      score++;
      burst.push(...CanvasEngine.createBurst(ctx, W/2, H/2 - H*0.05, 16,
        [`hsl(${q.correct.hue},70%,70%)`, '#FFD166', '#fff']));
      bloom = 0;
      phase = 'feedback';
      feedbackTimer = 55;
    } else {
      SoundEngine.playMiss();
      phase = 'feedback';
      feedbackTimer = 55;
    }
  }

  function loop() {
    update();
    draw();
    animId = requestAnimationFrame(loop);
  }

  function update() {
    // Animate petals
    petalAnim.forEach(p => { p.y -= p.speed; if (p.y < -10) p.y = H + 10; });
    // Bloom animation
    if (phase === 'feedback') {
      bloom = Math.min(bloom + 0.05, 1);
      feedbackTimer--;
      if (feedbackTimer <= 0) {
        currentQ++;
        chosen = -1;
        bloom  = 0;
        burst  = [];
        if (currentQ >= questions.length) {
          phase = 'done';
          const stars = score >= questions.length ? 3 : score >= Math.ceil(questions.length * 0.6) ? 2 : 1;
          SoundEngine.playCelebration();
          setTimeout(() => { if (onWin) onWin(stars); }, 800);
        } else {
          phase = 'question';
          petalAnim = spawnPetals();
        }
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Background
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, '#f0fff4');
    grad.addColorStop(1, '#fff8e7');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Background petals
    petalAnim.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.r*0.4, p.r, 0, 0, Math.PI*2);
      ctx.fillStyle = `hsl(${p.hue}, 60%, 75%)`;
      ctx.fill();
      ctx.restore();
    });

    // Progress bar
    const qTotal = questions.length;
    const pBarW  = W * 0.7;
    const pBarX  = (W - pBarW) / 2;
    CanvasEngine.fillRoundRect(ctx, pBarX, 14, pBarW, 10, 5, 'rgba(46,139,132,0.15)');
    CanvasEngine.fillRoundRect(ctx, pBarX, 14, pBarW * (currentQ / qTotal), 10, 5, '#2E8B84');

    // Question number
    ctx.font = '600 13px Nunito, sans-serif';
    ctx.fillStyle = 'rgba(46,139,132,0.6)';
    ctx.textAlign = 'center';
    ctx.fillText(`Question ${Math.min(currentQ+1, qTotal)} of ${qTotal}`, W/2, 40);

    if (phase === 'done') return;

    const q = questions[currentQ];

    // Big flower illustration (emoji drawn via canvas font)
    const flowerY = H * 0.28;
    const flowerSize = Math.min(W, H) * 0.2;

    // Bloom ring
    if (phase === 'feedback' && chosen >= 0 && q.options[chosen].word === q.correct.word) {
      ctx.save();
      ctx.globalAlpha = bloom * 0.3;
      ctx.beginPath();
      ctx.arc(W/2, flowerY, flowerSize * (0.8 + bloom * 0.8), 0, Math.PI*2);
      ctx.fillStyle = `hsl(${q.correct.hue}, 70%, 75%)`;
      ctx.fill();
      ctx.restore();
    }

    CanvasEngine.drawMiniFlower(ctx, W/2, flowerY, flowerSize, q.correct.hue, 1);

    // Hint text
    ctx.font = `600 ${Math.max(14, H*0.04)}px Nunito, sans-serif`;
    ctx.fillStyle = '#777';
    ctx.textAlign = 'center';
    ctx.fillText(q.correct.hint, W/2, flowerY + flowerSize + 22);

    // Option buttons
    const rects = getOptionRects();
    q.options.forEach((opt, i) => {
      const r = rects[i];
      const isCorrect = opt.word === q.correct.word;
      const isChosen  = i === chosen;

      let bgColor = 'rgba(255,255,255,0.9)';
      let textColor = '#333';
      let borderColor = 'rgba(46,139,132,0.25)';
      let borderWidth = 2;

      if (phase === 'feedback') {
        if (isCorrect) {
          bgColor = 'rgba(92,184,92,0.2)';
          borderColor = '#5CB85C';
          textColor = '#2a7a2a';
          borderWidth = 3;
        } else if (isChosen && !isCorrect) {
          bgColor = 'rgba(255,107,107,0.15)';
          borderColor = '#FF6B6B';
          textColor = '#c0392b';
          borderWidth = 3;
        }
      }

      CanvasEngine.fillRoundRect(ctx, r.x, r.y, r.w, r.h, 12, bgColor);
      CanvasEngine.strokeRoundRect(ctx, r.x, r.y, r.w, r.h, 12, borderColor, borderWidth);

      ctx.font = `bold ${Math.min(16, r.w * 0.11)}px Nunito, sans-serif`;
      ctx.fillStyle = textColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(opt.word, r.x + r.w/2, r.y + r.h/2);
      ctx.textBaseline = 'alphabetic';

      // Checkmark / X
      if (phase === 'feedback') {
        if (isCorrect) {
          ctx.font = '16px serif';
          ctx.fillText('✓', r.x + r.w - 18, r.y + r.h/2 + 6);
        } else if (isChosen) {
          ctx.fillText('✗', r.x + r.w - 18, r.y + r.h/2 + 6);
        }
      }
    });

    // Score
    ctx.font = 'bold 14px Nunito, sans-serif';
    ctx.fillStyle = 'rgba(46,139,132,0.7)';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(`✓ ${score}`, W - 16, H - 14);

    // Burst
    burst = CanvasEngine.updateBurst(burst, ctx);
  }

  function destroy() {
    if (animId) cancelAnimationFrame(animId);
    canvas.onclick = null;
    canvas.ontouchend = null;
  }

  function restart() {
    buildQuestions();
  }

  return { init, destroy, restart };
})();
