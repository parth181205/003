/* =====================================================
   SortGarden.js — Where Does It Belong? Sorting Game
   Drag items into the correct category baskets
   ===================================================== */

const SortGarden = (() => {
  let canvas, ctx, W, H;
  let animId = null;
  let onWin  = null;
  let difficulty = 'gentle';

  let items    = [];
  let baskets  = [];
  let dragging = null;
  let dragOX   = 0, dragOY = 0;
  let score    = 0;
  let total    = 0;
  let burst    = [];
  let phase    = 'play'; // play | win
  let message  = '';
  let msgTimer = 0;
  let basketGlow = {}; // basket id → glow 0-1

  const CATEGORIES = [
    {
      id: 'fruit', label: '🍎 Fruits', color: '#FF6B6B', dark: '#C0392B',
      items: [
        {emoji:'🍎',name:'Apple'},{emoji:'🍊',name:'Orange'},
        {emoji:'🍌',name:'Banana'},{emoji:'🍇',name:'Grapes'},
        {emoji:'🍓',name:'Strawberry'},{emoji:'🍑',name:'Peach'},
      ],
    },
    {
      id: 'veggie', label: '🥕 Vegetables', color: '#FFD166', dark: '#D4A017',
      items: [
        {emoji:'🥕',name:'Carrot'},{emoji:'🥦',name:'Broccoli'},
        {emoji:'🧅',name:'Onion'},{emoji:'🥔',name:'Potato'},
        {emoji:'🌽',name:'Corn'},{emoji:'🍆',name:'Brinjal'},
      ],
    },
    {
      id: 'animal', label: '🦋 Animals', color: '#95E1D3', dark: '#2E8B84',
      items: [
        {emoji:'🦋',name:'Butterfly'},{emoji:'🐦',name:'Bird'},
        {emoji:'🐝',name:'Bee'},{emoji:'🐠',name:'Fish'},
        {emoji:'🐸',name:'Frog'},{emoji:'🐇',name:'Rabbit'},
      ],
    },
    {
      id: 'flower', label: '🌸 Flowers', color: '#F9A8D4', dark: '#BE185D',
      items: [
        {emoji:'🌸',name:'Blossom'},{emoji:'🌹',name:'Rose'},
        {emoji:'🌻',name:'Sunflower'},{emoji:'🌷',name:'Tulip'},
        {emoji:'🪷',name:'Lotus'},{emoji:'🌺',name:'Hibiscus'},
      ],
    },
  ];

  const DIFF = {
    gentle:   { cats: 2, itemsPerCat: 3 },
    active:   { cats: 3, itemsPerCat: 3 },
    champion: { cats: 4, itemsPerCat: 4 },
  };

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
    const cfg  = DIFF[difficulty];
    const cats = CATEGORIES.slice(0, cfg.cats);

    // Create baskets
    const bW   = Math.min((W - 40) / cats.length - 10, 160);
    const bH   = 70;
    const bY   = H - bH - 16;
    const totalBW = cats.length * bW + (cats.length-1) * 10;
    const bStartX = (W - totalBW) / 2;

    baskets = cats.map((cat, i) => ({
      id:    cat.id,
      label: cat.label,
      color: cat.color,
      dark:  cat.dark,
      x:     bStartX + i * (bW + 10),
      y:     bY,
      w:     bW,
      h:     bH,
      count: 0,
    }));

    // Create items (shuffle)
    const allItems = [];
    cats.forEach(cat => {
      const chosen = cat.items.slice(0, cfg.itemsPerCat);
      chosen.forEach(item => allItems.push({ ...item, catId: cat.id, color: cat.color }));
    });
    allItems.sort(() => Math.random() - 0.5);

    total = allItems.length;

    // Position items in a tray area (top 2/3 of canvas)
    const cols = Math.ceil(Math.sqrt(total));
    const iSize = Math.min(W / cols - 12, 70);
    const trayH = H - bH - 40;
    const rows  = Math.ceil(total / cols);
    const startY = (trayH - rows * (iSize + 10)) / 2 + 20;
    const startX = (W - cols * (iSize + 10)) / 2;

    items = allItems.map((item, i) => ({
      ...item,
      x:      startX + (i % cols) * (iSize + 10),
      y:      startY + Math.floor(i / cols) * (iSize + 10),
      size:   iSize,
      placed: false,
      float:  Math.random() * Math.PI * 2, // phase for float animation
    }));

    dragging = null;
    score    = 0;
    burst    = [];
    phase    = 'play';
    message  = '';
    basketGlow = {};
    baskets.forEach(b => { basketGlow[b.id] = 0; });
  }

  function bindEvents() {
    canvas.addEventListener('mousedown',  onDown);
    canvas.addEventListener('mousemove',  onMove);
    canvas.addEventListener('mouseup',    onUp);
    canvas.addEventListener('touchstart', onDown, { passive: false });
    canvas.addEventListener('touchmove',  onMove, { passive: false });
    canvas.addEventListener('touchend',   onUp,   { passive: false });
  }

  function onDown(e) {
    e.preventDefault();
    if (phase !== 'play') return;
    const pos = CanvasEngine.getScaledPos(canvas, e);
    for (let i = items.length - 1; i >= 0; i--) {
      const it = items[i];
      if (it.placed) continue;
      if (pos.x >= it.x && pos.x <= it.x + it.size &&
          pos.y >= it.y && pos.y <= it.y + it.size) {
        dragging = it;
        dragOX   = pos.x - it.x;
        dragOY   = pos.y - it.y;
        items.splice(i, 1);
        items.push(it);
        break;
      }
    }
  }

  function onMove(e) {
    e.preventDefault();
    if (!dragging) return;
    const pos = CanvasEngine.getScaledPos(canvas, e);
    dragging.x = pos.x - dragOX;
    dragging.y = pos.y - dragOY;

    // Highlight basket under cursor
    baskets.forEach(b => { basketGlow[b.id] = 0; });
    const basket = getBasketUnder(pos);
    if (basket) basketGlow[basket.id] = 0.6;
  }

  function onUp(e) {
    e.preventDefault();
    if (!dragging) return;
    const pos = CanvasEngine.getScaledPos(canvas, e);
    // Center of dragged item
    const cx = dragging.x + dragging.size/2;
    const cy = dragging.y + dragging.size/2;
    const basket = getBasketUnder({ x: cx, y: cy });

    if (basket) {
      if (basket.id === dragging.catId) {
        // Correct!
        dragging.placed = true;
        basket.count++;
        score++;
        SoundEngine.playDrop();
        SoundEngine.playSuccess();
        basketGlow[basket.id] = 1;
        burst.push(...CanvasEngine.createBurst(ctx,
          basket.x + basket.w/2, basket.y + basket.h/2, 14,
          [basket.color, '#FFD166', '#fff']));
        message = '✓ Correct!';
        msgTimer = 45;

        const unplaced = items.filter(it => !it.placed).length;
        if (unplaced === 0) {
          phase = 'win';
          SoundEngine.playCelebration();
          burst.push(...CanvasEngine.createBurst(ctx, W/2, H/2, 35));
          const stars = 3;
          setTimeout(() => { if (onWin) onWin(stars); }, 1000);
        }
      } else {
        // Wrong basket — bounce back
        SoundEngine.playMiss();
        basketGlow[basket.id] = 0;
        message = '🤔 Try a different basket!';
        msgTimer = 55;
        // Return to original position (random tray spot)
        dragging.x = 20 + Math.random() * (W*0.5 - dragging.size);
        dragging.y = 20 + Math.random() * (H*0.5 - dragging.size);
      }
    } else {
      // Dropped in empty space — stays
    }

    dragging = null;
    Object.keys(basketGlow).forEach(k => { if (!dragging) basketGlow[k] = Math.max(basketGlow[k]-0.1,0); });
  }

  function getBasketUnder(pos) {
    return baskets.find(b =>
      pos.x >= b.x && pos.x <= b.x+b.w &&
      pos.y >= b.y && pos.y <= b.y+b.h
    ) || null;
  }

  function loop() {
    update();
    draw();
    animId = requestAnimationFrame(loop);
  }

  function update() {
    if (msgTimer > 0) msgTimer--;
    // Decay glow
    Object.keys(basketGlow).forEach(k => {
      basketGlow[k] = Math.max(0, basketGlow[k] - 0.02);
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Background
    const bg = ctx.createLinearGradient(0,0,W,H);
    bg.addColorStop(0, '#f0fdf4'); bg.addColorStop(1, '#fefce8');
    ctx.fillStyle = bg; ctx.fillRect(0,0,W,H);

    // Title
    ctx.font = 'bold 18px Nunito, sans-serif';
    ctx.fillStyle = '#2E8B84';
    ctx.textAlign = 'center';
    ctx.fillText('🌿 Sort Garden — Drag to the right basket!', W/2, 22);

    // Baskets
    baskets.forEach(b => {
      const glow = basketGlow[b.id] || 0;
      ctx.save();
      if (glow > 0) {
        ctx.shadowColor = b.color;
        ctx.shadowBlur  = 20 * glow;
      }
      CanvasEngine.fillRoundRect(ctx, b.x, b.y, b.w, b.h, 14,
        `rgba(${hexToRgb(b.color)}, ${0.15 + glow * 0.25})`);
      CanvasEngine.strokeRoundRect(ctx, b.x, b.y, b.w, b.h, 14, b.color, 2.5);
      ctx.shadowBlur = 0;
      ctx.restore();

      // Label
      ctx.font = `bold ${Math.min(13, b.w*0.085)}px Nunito, sans-serif`;
      ctx.fillStyle = b.dark;
      ctx.textAlign = 'center';
      ctx.fillText(b.label, b.x + b.w/2, b.y + b.h/2 + 6);

      // Count badge
      if (b.count > 0) {
        ctx.beginPath();
        ctx.arc(b.x + b.w - 10, b.y + 10, 11, 0, Math.PI*2);
        ctx.fillStyle = b.color;
        ctx.fill();
        ctx.font = 'bold 11px Nunito, sans-serif';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.fillText(b.count, b.x + b.w - 10, b.y + 14);
      }
    });

    // Items (unplaced, non-dragging)
    items.filter(it => !it.placed && it !== dragging).forEach(it => {
      const floatY = Math.sin(Date.now() * 0.0015 + it.float) * 4;
      drawItem(it, it.x, it.y + floatY);
    });
    // Dragging item (on top)
    if (dragging) {
      ctx.save();
      ctx.shadowColor = dragging.color;
      ctx.shadowBlur  = 18;
      drawItem(dragging, dragging.x, dragging.y, 1.08);
      ctx.restore();
    }

    // Burst
    burst = CanvasEngine.updateBurst(burst, ctx);

    // Message
    if (msgTimer > 0 && message) {
      const alpha = Math.min(1, msgTimer / 15);
      ctx.save();
      ctx.globalAlpha = alpha;
      CanvasEngine.fillRoundRect(ctx, W/2-100, H/2-22, 200, 44, 12, 'rgba(46,139,132,0.9)');
      ctx.font = 'bold 17px Nunito, sans-serif';
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.fillText(message, W/2, H/2 + 8);
      ctx.restore();
    }

    // Score
    ctx.font = '600 13px Nunito, sans-serif';
    ctx.fillStyle = 'rgba(46,139,132,0.7)';
    ctx.textAlign = 'right';
    ctx.fillText(`${score} / ${total}`, W-12, H-4);
  }

  function drawItem(it, x, y, scale = 1) {
    ctx.save();
    ctx.translate(x + it.size/2, y + it.size/2);
    ctx.scale(scale, scale);
    // Card
    CanvasEngine.fillRoundRect(ctx, -it.size/2, -it.size/2, it.size, it.size, 12, 'rgba(255,255,255,0.92)');
    CanvasEngine.strokeRoundRect(ctx, -it.size/2, -it.size/2, it.size, it.size, 12,
      it.color + '99', 2);
    // Emoji
    ctx.font = `${it.size * 0.5}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(it.emoji, 0, -it.size*0.06);
    // Name
    ctx.font = `bold ${it.size * 0.13}px Nunito, sans-serif`;
    ctx.fillStyle = '#555';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(it.name, 0, it.size*0.38);
    ctx.restore();
  }

  function hexToRgb(hex) {
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    return `${r},${g},${b}`;
  }

  function destroy() {
    if (animId) cancelAnimationFrame(animId);
    canvas.removeEventListener('mousedown',  onDown);
    canvas.removeEventListener('mousemove',  onMove);
    canvas.removeEventListener('mouseup',    onUp);
    canvas.removeEventListener('touchstart', onDown);
    canvas.removeEventListener('touchmove',  onMove);
    canvas.removeEventListener('touchend',   onUp);
  }

  function restart() { buildGame(); }

  return { init, destroy, restart };
})();
