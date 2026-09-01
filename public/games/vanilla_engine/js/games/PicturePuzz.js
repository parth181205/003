/* =====================================================
   PicturePuzz.js — Picture Puzzle (Jigsaw drag game)
   Drag pieces into the correct grid positions with snap-to-place
   ===================================================== */

const PicturePuzz = (() => {
  let canvas, ctx, W, H;
  let animId = null;
  let onWin  = null;
  let difficulty = 'gentle';

  let pieces   = [];
  let dragging = null;
  let dragOX   = 0, dragOY = 0;
  let placed   = 0;
  let burst    = [];
  let solved   = false;

  // Each "scene" is drawn procedurally on canvas
  const SCENES = [
    { name: 'Sunrise Garden',  draw: drawSunriseScene },
    { name: 'Mountain River',  draw: drawRiverScene  },
    { name: 'Flower Meadow',   draw: drawMeadowScene },
  ];
  let sceneIdx = 0;
  let offscreenCanvas = null;

  const DIFF = {
    gentle:   { grid: 2 }, // 2x2 = 4 pieces
    active:   { grid: 3 }, // 3x3 = 9 pieces
    champion: { grid: 4 }, // 4x4 = 16 pieces
  };

  function init(canvasEl, diff, winCallback) {
    canvas = canvasEl;
    ctx    = canvas.getContext('2d');
    difficulty = diff || 'gentle';
    onWin  = winCallback;
    CanvasEngine.fitCanvas(canvas, canvas.parentElement);
    W = canvas.width; H = canvas.height;
    sceneIdx = Math.floor(Math.random() * SCENES.length);
    buildPuzzle();
    bindEvents();
    if (animId) cancelAnimationFrame(animId);
    loop();
  }

  // ── Scene drawers ──────────────────────────────────────────
  function drawSunriseScene(ctx, w, h) {
    // Sky gradient
    const sky = ctx.createLinearGradient(0,0,0,h*0.6);
    sky.addColorStop(0,'#FFB347'); sky.addColorStop(0.5,'#FF8C69'); sky.addColorStop(1,'#FFD700');
    ctx.fillStyle = sky; ctx.fillRect(0,0,w,h*0.6);
    // Ground
    const gnd = ctx.createLinearGradient(0,h*0.6,0,h);
    gnd.addColorStop(0,'#4a7c59'); gnd.addColorStop(1,'#2d5a3d');
    ctx.fillStyle = gnd; ctx.fillRect(0,h*0.6,w,h*0.4);
    // Sun
    ctx.beginPath(); ctx.arc(w*0.5,h*0.35,h*0.12,0,Math.PI*2);
    ctx.fillStyle='#FFD700'; ctx.shadowColor='#FF8C00'; ctx.shadowBlur=30; ctx.fill(); ctx.shadowBlur=0;
    // Trees
    [0.15,0.35,0.65,0.85].forEach(tx => {
      ctx.fillStyle='#2d5a3d';
      ctx.beginPath(); ctx.moveTo(w*tx,h*0.6); ctx.lineTo(w*tx-w*0.04,h*0.8); ctx.lineTo(w*tx+w*0.04,h*0.8); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(w*tx,h*0.48); ctx.lineTo(w*tx-w*0.055,h*0.63); ctx.lineTo(w*tx+w*0.055,h*0.63); ctx.closePath(); ctx.fill();
    });
    // Flowers on ground
    for (let i=0;i<8;i++) {
      CanvasEngine.drawMiniFlower(ctx, w*(0.1+i*0.11), h*0.78, h*0.04, i*40, 1);
    }
  }

  function drawRiverScene(ctx, w, h) {
    // Sky
    const sky = ctx.createLinearGradient(0,0,0,h*0.5);
    sky.addColorStop(0,'#87CEEB'); sky.addColorStop(1,'#E0F4FF');
    ctx.fillStyle=sky; ctx.fillRect(0,0,w,h*0.5);
    // Mountains
    [[0.1,0.4,'#6B8E9F'],[0.4,0.35,'#5A7A8A'],[0.7,0.42,'#7A9BAD']].forEach(([mx,my,mc])=>{
      ctx.beginPath(); ctx.moveTo(w*mx,h*my); ctx.lineTo(w*(mx-0.2),h*0.5); ctx.lineTo(w*(mx+0.2),h*0.5); ctx.closePath();
      ctx.fillStyle=mc; ctx.fill();
      // Snow cap
      ctx.beginPath(); ctx.moveTo(w*mx,h*my); ctx.lineTo(w*(mx-0.05),h*(my+0.07)); ctx.lineTo(w*(mx+0.05),h*(my+0.07)); ctx.closePath();
      ctx.fillStyle='#fff'; ctx.fill();
    });
    // River
    const riv = ctx.createLinearGradient(0,h*0.5,0,h);
    riv.addColorStop(0,'#4ECDC4'); riv.addColorStop(1,'#2E8B84');
    ctx.fillStyle=riv; ctx.fillRect(w*0.3,h*0.5,w*0.4,h*0.5);
    // Banks
    ctx.fillStyle='#4a7c59'; ctx.fillRect(0,h*0.5,w*0.3,h*0.5);
    ctx.fillStyle='#4a7c59'; ctx.fillRect(w*0.7,h*0.5,w*0.3,h*0.5);
    // Ripples
    ctx.strokeStyle='rgba(255,255,255,0.3)'; ctx.lineWidth=2;
    [0.55,0.65,0.75,0.85].forEach(ry=>{
      ctx.beginPath(); ctx.moveTo(w*0.35,h*ry); ctx.quadraticCurveTo(w*0.5,h*(ry-0.02),w*0.65,h*ry); ctx.stroke();
    });
  }

  function drawMeadowScene(ctx, w, h) {
    // Sky
    const sky = ctx.createLinearGradient(0,0,0,h*0.55);
    sky.addColorStop(0,'#B5D8F7'); sky.addColorStop(1,'#E8F4FD');
    ctx.fillStyle=sky; ctx.fillRect(0,0,w,h*0.55);
    // Clouds
    [0.2,0.55,0.8].forEach((cx,i)=>{
      ctx.fillStyle='rgba(255,255,255,0.85)';
      ctx.beginPath(); ctx.arc(w*cx,h*0.12,h*0.07,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(w*cx+w*0.06,h*0.1,h*0.055,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(w*cx-w*0.05,h*0.115,h*0.05,0,Math.PI*2); ctx.fill();
    });
    // Meadow
    const mea = ctx.createLinearGradient(0,h*0.55,0,h);
    mea.addColorStop(0,'#7BC67E'); mea.addColorStop(1,'#4a7c59');
    ctx.fillStyle=mea; ctx.fillRect(0,h*0.55,w,h*0.45);
    // Many flowers
    for (let i=0;i<16;i++) {
      CanvasEngine.drawMiniFlower(ctx, w*(0.04+i*0.062), h*(0.62+Math.sin(i)*0.08), h*0.05, i*25, 1);
    }
    // Butterfly
    ctx.font=`${h*0.1}px serif`; ctx.textAlign='center';
    ctx.fillText('🦋', w*0.75, h*0.45);
    ctx.fillText('☀️', w*0.85, h*0.12);
  }

  // ── Build puzzle ───────────────────────────────────────────
  function buildPuzzle() {
    const cfg  = DIFF[difficulty];
    const grid = cfg.grid;

    // Render scene to offscreen canvas
    offscreenCanvas = document.createElement('canvas');
    const imgW = Math.floor(W * 0.55);
    const imgH = Math.floor(H * 0.7);
    offscreenCanvas.width  = imgW;
    offscreenCanvas.height = imgH;
    const oCtx = offscreenCanvas.getContext('2d');
    SCENES[sceneIdx].draw(oCtx, imgW, imgH);

    const pW = Math.floor(imgW / grid);
    const pH = Math.floor(imgH / grid);
    const targetX = (W - imgW) / 2;
    const targetY = (H - imgH) / 2;

    // Create piece list
    pieces = [];
    for (let row = 0; row < grid; row++) {
      for (let col = 0; col < grid; col++) {
        // Random tray position (right side)
        const trayX = W * 0.02 + Math.random() * (W * 0.3 - pW);
        const trayY = H * 0.05 + Math.random() * (H * 0.85 - pH);
        pieces.push({
          id:      row * grid + col,
          row, col,
          srcX:    col * pW,
          srcY:    row * pH,
          pW, pH,
          // Target on canvas
          tx: targetX + col * pW,
          ty: targetY + row * pH,
          // Current position (tray)
          x:  trayX,
          y:  trayY,
          placed: false,
          glowT:  0,
        });
      }
    }

    dragging = null;
    placed   = 0;
    burst    = [];
    solved   = false;
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
    const pos = CanvasEngine.getScaledPos(canvas, e);
    // Pick up top-most unplaced piece
    for (let i = pieces.length - 1; i >= 0; i--) {
      const p = pieces[i];
      if (p.placed) continue;
      if (pos.x >= p.x && pos.x <= p.x+p.pW && pos.y >= p.y && pos.y <= p.y+p.pH) {
        dragging = p;
        dragOX   = pos.x - p.x;
        dragOY   = pos.y - p.y;
        // Bring to top
        pieces.splice(i, 1);
        pieces.push(p);
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
  }

  function onUp(e) {
    e.preventDefault();
    if (!dragging) return;
    // Snap to target?
    const snapDist = Math.min(dragging.pW, dragging.pH) * 0.45;
    const dx = dragging.x - dragging.tx;
    const dy = dragging.y - dragging.ty;
    if (Math.sqrt(dx*dx + dy*dy) < snapDist) {
      dragging.x = dragging.tx;
      dragging.y = dragging.ty;
      if (!dragging.placed) {
        dragging.placed = true;
        dragging.glowT  = 1;
        placed++;
        SoundEngine.playSnap();
        burst.push(...CanvasEngine.createBurst(ctx,
          dragging.tx + dragging.pW/2,
          dragging.ty + dragging.pH/2, 10));

        if (placed === pieces.length) {
          solved = true;
          SoundEngine.playCelebration();
          burst.push(...CanvasEngine.createBurst(ctx, W/2, H/2, 30));
          const stars = 3; // puzzle is always 3 stars (no wrong moves)
          setTimeout(() => { if (onWin) onWin(stars); }, 1200);
        }
      }
    }
    dragging = null;
  }

  function loop() {
    draw();
    animId = requestAnimationFrame(loop);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Warm background
    const bg = ctx.createLinearGradient(0,0,W,H);
    bg.addColorStop(0,'#e8f5f4'); bg.addColorStop(1,'#fff8f0');
    ctx.fillStyle = bg; ctx.fillRect(0,0,W,H);

    // Target grid outline
    if (pieces.length > 0) {
      const p0 = pieces[0];
      const grid = DIFF[difficulty].grid;
      const imgW = p0.pW * grid, imgH = p0.pH * grid;
      const ox = (W - imgW)/2, oy = (H - imgH)/2;
      // Shadow box
      ctx.shadowColor = 'rgba(46,139,132,0.2)';
      ctx.shadowBlur  = 20;
      CanvasEngine.fillRoundRect(ctx, ox-4, oy-4, imgW+8, imgH+8, 10, 'rgba(255,255,255,0.6)');
      ctx.shadowBlur = 0;
      // Grid lines
      for (let r=0; r<=grid; r++) {
        ctx.beginPath();
        ctx.moveTo(ox, oy + r*p0.pH);
        ctx.lineTo(ox + imgW, oy + r*p0.pH);
        ctx.strokeStyle = 'rgba(46,139,132,0.2)'; ctx.lineWidth=1; ctx.stroke();
      }
      for (let c=0; c<=grid; c++) {
        ctx.beginPath();
        ctx.moveTo(ox + c*p0.pW, oy);
        ctx.lineTo(ox + c*p0.pW, oy + imgH);
        ctx.stroke();
      }
    }

    // Draw placed pieces first
    pieces.filter(p => p.placed).forEach(p => drawPiece(p));
    // Draw unplaced non-dragging
    pieces.filter(p => !p.placed && p !== dragging).forEach(p => drawPiece(p));
    // Draw dragging piece on top
    if (dragging) drawPiece(dragging);

    // Burst
    burst = CanvasEngine.updateBurst(burst, ctx);

    // Progress
    ctx.font = '600 14px Nunito, sans-serif';
    ctx.fillStyle = 'rgba(46,139,132,0.7)';
    ctx.textAlign = 'left';
    ctx.fillText(`Pieces: ${placed} / ${pieces.length}`, 12, H-10);
    ctx.textAlign = 'center';
    ctx.fillText(SCENES[sceneIdx].name, W/2, 22);
  }

  function drawPiece(p) {
    ctx.save();
    // Glow for recently placed
    if (p.glowT > 0) {
      ctx.shadowColor = '#4ECDC4';
      ctx.shadowBlur  = 20 * p.glowT;
      p.glowT = Math.max(0, p.glowT - 0.03);
    }
    // Draw image portion
    ctx.drawImage(offscreenCanvas, p.srcX, p.srcY, p.pW, p.pH, p.x, p.y, p.pW, p.pH);
    // Border
    ctx.strokeStyle = p === dragging ? '#4ECDC4' : 'rgba(255,255,255,0.7)';
    ctx.lineWidth = p === dragging ? 3 : 1.5;
    ctx.strokeRect(p.x, p.y, p.pW, p.pH);
    ctx.shadowBlur = 0;
    ctx.restore();
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

  function restart() {
    sceneIdx = (sceneIdx + 1) % SCENES.length;
    buildPuzzle();
  }

  return { init, destroy, restart };
})();
