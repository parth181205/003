/* =====================================================
   SpotIt.js — "Find the Differences" Brain Training Game
   Two side-by-side canvas scenes with hidden differences to find
   Inspired by: GREAT DETECTIVE COOKIE YouTube channel (kICPeEVFZCU)
   ===================================================== */

const SpotIt = (() => {
  let canvas, ctx, W, H;
  let animId = null;
  let onWin  = null;
  let difficulty = 'gentle';

  // Scene half dimensions
  let sW, sH, sY, sX1, sX2;
  let differences = []; // { rx, ry, r, found, pulseT, hintT }
  let foundCount  = 0;
  let targetCount = 0;
  let burst       = [];
  let hintUsed    = 0;
  let wrongFlash  = 0; // flash timer for wrong tap
  let wrongPos    = { x: 0, y: 0 };
  let circles     = []; // animated discovery circles

  const DIFF_CFG = {
    gentle:   { diffs: 3 },
    active:   { diffs: 5 },
    champion: { diffs: 7 },
  };

  // ── Scene definitions ─────────────────────────────────────
  // Each difference: { rx, ry } — relative to scene (0-1 coords)
  // The right-side scene will have those spots altered
  const SCENES = [
    {
      name: 'Morning Garden',
      draw: drawGardenScene,
      diffs: [
        { rx: 0.18, ry: 0.22, r: 28, type: 'color',  desc: 'Flower color' },
        { rx: 0.68, ry: 0.35, r: 24, type: 'size',   desc: 'Cloud size' },
        { rx: 0.35, ry: 0.72, r: 22, type: 'missing',desc: 'Missing butterfly' },
        { rx: 0.82, ry: 0.60, r: 26, type: 'color',  desc: 'Tree trunk color' },
        { rx: 0.50, ry: 0.48, r: 20, type: 'size',   desc: 'Sun size' },
        { rx: 0.25, ry: 0.55, r: 22, type: 'color',  desc: 'Grass shade' },
        { rx: 0.75, ry: 0.78, r: 24, type: 'missing',desc: 'Missing flower' },
      ],
    },
    {
      name: 'River Village',
      draw: drawVillageScene,
      diffs: [
        { rx: 0.15, ry: 0.28, r: 26, type: 'color',  desc: 'Roof color' },
        { rx: 0.72, ry: 0.20, r: 22, type: 'size',   desc: 'Bird size' },
        { rx: 0.42, ry: 0.65, r: 24, type: 'missing',desc: 'Missing boat' },
        { rx: 0.85, ry: 0.42, r: 22, type: 'color',  desc: 'Mountain color' },
        { rx: 0.30, ry: 0.80, r: 20, type: 'color',  desc: 'Water color' },
        { rx: 0.60, ry: 0.50, r: 26, type: 'size',   desc: 'Tree height' },
        { rx: 0.55, ry: 0.30, r: 20, type: 'missing',desc: 'Missing cloud' },
      ],
    },
  ];
  let sceneIdx = 0;

  // ── Scene drawing ─────────────────────────────────────────
  function drawGardenScene(ctx, w, h, side, alterations) {
    // Sky
    const sky = ctx.createLinearGradient(0,0,0,h*0.5);
    sky.addColorStop(0, '#87CEEB'); sky.addColorStop(1, '#e0f4ff');
    ctx.fillStyle = sky; ctx.fillRect(0,0,w,h*0.5);

    // Sun — size difference possible
    const sunR = alterations.includes('size-sun') ? h*0.07 : h*0.1;
    ctx.beginPath(); ctx.arc(w*0.5, h*0.14, sunR, 0, Math.PI*2);
    ctx.fillStyle = '#FFD700'; ctx.shadowColor='#FFB300'; ctx.shadowBlur=15; ctx.fill(); ctx.shadowBlur=0;

    // Clouds — size difference possible
    const cloudW = alterations.includes('size-cloud') ? h*0.05 : h*0.07;
    [[0.68,0.14],[0.28,0.1]].forEach(([cx,cy])=>{
      ctx.fillStyle='rgba(255,255,255,0.9)';
      ctx.beginPath(); ctx.arc(w*cx, h*cy, cloudW, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(w*cx+cloudW*0.8, h*cy, cloudW*0.8, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(w*cx-cloudW*0.7, h*cy, cloudW*0.7, 0, Math.PI*2); ctx.fill();
    });

    // Ground
    const gnd = ctx.createLinearGradient(0,h*0.5,0,h);
    const grassColor = alterations.includes('color-grass') ? '#5aaa5a' : '#7BC67E';
    gnd.addColorStop(0, grassColor); gnd.addColorStop(1,'#4a7c59');
    ctx.fillStyle=gnd; ctx.fillRect(0,h*0.5,w,h*0.5);

    // Tree — trunk color difference
    const trunkColor = alterations.includes('color-trunk') ? '#8B5E3C' : '#6B3A2A';
    ctx.fillStyle=trunkColor;
    ctx.fillRect(w*0.8-8, h*0.35, 16, h*0.25);
    ctx.fillStyle='#4a7c59';
    ctx.beginPath(); ctx.arc(w*0.8,h*0.32, h*0.14, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(w*0.8,h*0.22, h*0.1, 0, Math.PI*2); ctx.fill();

    // Flowers — color difference
    const flowerHue = alterations.includes('color-flower') ? 200 : 340;
    [[0.18,0.22],[0.38,0.65],[0.55,0.72]].forEach(([fx,fy],i)=>{
      if (i===2 && alterations.includes('missing-flower')) return;
      CanvasEngine.drawMiniFlower(ctx, w*fx, h*fy, h*0.055, flowerHue + i*40, 1);
    });

    // Butterfly — missing difference
    if (!alterations.includes('missing-butterfly')) {
      ctx.font=`${h*0.07}px serif`; ctx.textAlign='center';
      ctx.fillText('🦋', w*0.35, h*0.72);
    }
  }

  function drawVillageScene(ctx, w, h, side, alterations) {
    // Sky
    ctx.fillStyle='#C9E8FF'; ctx.fillRect(0,0,w,h*0.45);
    // Mountain — color difference
    const mtnColor = alterations.includes('color-mountain') ? '#8A9BAD' : '#6B8E9F';
    ctx.fillStyle=mtnColor;
    ctx.beginPath(); ctx.moveTo(w*0.85,h*0.07); ctx.lineTo(w*0.65,h*0.45); ctx.lineTo(w,h*0.45); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(w*0.6,h*0.12); ctx.lineTo(w*0.38,h*0.45); ctx.lineTo(w*0.82,h*0.45); ctx.closePath(); ctx.fill();
    // Snow caps
    ctx.fillStyle='#fff';
    ctx.beginPath(); ctx.moveTo(w*0.85,h*0.07); ctx.lineTo(w*0.78,h*0.15); ctx.lineTo(w*0.92,h*0.15); ctx.closePath(); ctx.fill();
    // Missing cloud
    if (!alterations.includes('missing-cloud')) {
      ctx.fillStyle='rgba(255,255,255,0.9)';
      ctx.beginPath(); ctx.arc(w*0.55,h*0.12, h*0.06, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(w*0.61,h*0.1, h*0.048, 0, Math.PI*2); ctx.fill();
    }
    // Bird — size difference
    const birdSize = alterations.includes('size-bird') ? h*0.08 : h*0.05;
    ctx.font=`${birdSize}px serif`; ctx.textAlign='center';
    ctx.fillText('🐦', w*0.72, h*0.2);
    // River / water — color difference
    const waterColor = alterations.includes('color-water') ? '#3A9FC0' : '#4ECDC4';
    ctx.fillStyle=waterColor; ctx.fillRect(0,h*0.72,w,h*0.28);
    // House — roof color difference
    const roofColor = alterations.includes('color-roof') ? '#D97706' : '#C0392B';
    ctx.fillStyle='#D2B48C'; ctx.fillRect(w*0.1,h*0.48,w*0.22,h*0.25);
    ctx.fillStyle=roofColor;
    ctx.beginPath(); ctx.moveTo(w*0.07,h*0.48); ctx.lineTo(w*0.21,h*0.32); ctx.lineTo(w*0.35,h*0.48); ctx.closePath(); ctx.fill();
    // Tree — height difference
    const treeH = alterations.includes('size-tree') ? h*0.35 : h*0.25;
    ctx.fillStyle='#6B3A2A'; ctx.fillRect(w*0.58,h*0.72-treeH,10,treeH);
    ctx.fillStyle='#4a7c59';
    ctx.beginPath(); ctx.arc(w*0.585,h*0.72-treeH,h*0.1,0,Math.PI*2); ctx.fill();
    // Boat — missing
    if (!alterations.includes('missing-boat')) {
      ctx.font=`${h*0.07}px serif`;
      ctx.fillText('⛵', w*0.42, h*0.82);
    }
  }

  // ── Build game ────────────────────────────────────────────
  function init(canvasEl, diff, winCallback) {
    canvas = canvasEl;
    ctx    = canvas.getContext('2d');
    difficulty = diff || 'gentle';
    onWin  = winCallback;
    CanvasEngine.fitCanvas(canvas, canvas.parentElement);
    W = canvas.width; H = canvas.height;
    sceneIdx = Math.floor(Math.random() * SCENES.length);
    buildGame();
    bindEvents();
    if (animId) cancelAnimationFrame(animId);
    loop();
  }

  function buildGame() {
    const cfg   = DIFF_CFG[difficulty];
    targetCount = cfg.diffs;
    foundCount  = 0;
    burst       = [];
    circles     = [];
    hintUsed    = 0;
    wrongFlash  = 0;

    // Scene layout
    const pad = 10;
    sH  = Math.floor(H * 0.82);
    sW  = Math.floor((W - pad * 3) / 2);
    sY  = 30;
    sX1 = pad;
    sX2 = sW + pad * 2;

    // Pick which diffs to use
    const scene = SCENES[sceneIdx];
    const chosen = scene.diffs.slice(0, targetCount);
    differences = chosen.map(d => ({
      ...d,
      found:  false,
      pulseT: 0,
      hintT:  0,
    }));
  }

  function buildAlterations() {
    // Build alteration keys for right scene
    const alts = [];
    differences.forEach(d => {
      alts.push(`${d.type}-${d.desc.replace(/\s/g,'-').toLowerCase()}`);
    });
    return alts;
  }

  // Map difference desc to alteration key
  function getAltKey(d) {
    const map = {
      'Flower color':     'color-flower',
      'Cloud size':       'size-cloud',
      'Missing butterfly':'missing-butterfly',
      'Tree trunk color': 'color-trunk',
      'Sun size':         'size-sun',
      'Grass shade':      'color-grass',
      'Missing flower':   'missing-flower',
      'Roof color':       'color-roof',
      'Bird size':        'size-bird',
      'Missing boat':     'missing-boat',
      'Mountain color':   'color-mountain',
      'Water color':      'color-water',
      'Tree height':      'size-tree',
      'Missing cloud':    'missing-cloud',
    };
    return map[d.desc] || '';
  }

  function bindEvents() {
    canvas.onclick    = handleClick;
    canvas.ontouchend = (e) => { e.preventDefault(); handleClick(e); };
    // Hint button drawn on canvas — handled in handleClick
  }

  function handleClick(e) {
    const pos = CanvasEngine.getScaledPos(canvas, e);

    // Check hint button click
    if (pos.x >= W - 100 && pos.x <= W - 10 && pos.y >= H - 44 && pos.y <= H - 8) {
      triggerHint();
      return;
    }

    // Determine if click is in left or right scene
    let relX = -1, relY = -1;
    if (pos.x >= sX1 && pos.x <= sX1+sW && pos.y >= sY && pos.y <= sY+sH) {
      relX = (pos.x - sX1) / sW;
      relY = (pos.y - sY) / sH;
    } else if (pos.x >= sX2 && pos.x <= sX2+sW && pos.y >= sY && pos.y <= sY+sH) {
      relX = (pos.x - sX2) / sW;
      relY = (pos.y - sY) / sH;
    }
    if (relX < 0) return;

    // Check against differences
    let hit = false;
    differences.forEach(d => {
      if (d.found) return;
      const dx = relX - d.rx, dy = relY - d.ry;
      const dist = Math.sqrt(dx*dx + dy*dy) * Math.max(sW, sH);
      if (dist <= d.r + 12) {
        d.found  = true;
        d.pulseT = 1;
        foundCount++;
        SoundEngine.playMatch();
        // Add circles on BOTH sides
        circles.push({ relX: d.rx, relY: d.ry, r: d.r, t: 0 });
        burst.push(...CanvasEngine.createBurst(ctx,
          sX1 + d.rx*sW, sY + d.ry*sH, 12, ['#FFD166','#4ECDC4','#fff']));
        burst.push(...CanvasEngine.createBurst(ctx,
          sX2 + d.rx*sW, sY + d.ry*sH, 12, ['#FFD166','#4ECDC4','#fff']));
        hit = true;
        if (foundCount >= targetCount) {
          SoundEngine.playCelebration();
          const stars = hintUsed === 0 ? 3 : hintUsed <= 1 ? 2 : 1;
          setTimeout(() => { if (onWin) onWin(stars); }, 800);
        }
      }
    });

    if (!hit) {
      wrongFlash = 25;
      wrongPos   = { x: pos.x, y: pos.y };
      SoundEngine.playMiss();
    }
  }

  function triggerHint() {
    hintUsed++;
    const unfound = differences.filter(d => !d.found);
    if (unfound.length === 0) return;
    const target = unfound[0];
    target.hintT = 60;
    SoundEngine.playClick();
  }

  function loop() {
    update();
    draw();
    animId = requestAnimationFrame(loop);
  }

  function update() {
    if (wrongFlash > 0) wrongFlash--;
    differences.forEach(d => { if (d.pulseT > 0) d.pulseT -= 0.03; if (d.hintT > 0) d.hintT--; });
    circles.forEach(c => { c.t += 0.04; });
    circles = circles.filter(c => c.t < 1);
  }

  function draw() {
    ctx.clearRect(0,0,W,H);

    // Background
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0,0,W,H);

    const scene = SCENES[sceneIdx];
    const rightAlts = differences.map(d => getAltKey(d));

    // Draw left scene (original)
    ctx.save();
    ctx.rect(sX1, sY, sW, sH); ctx.clip();
    ctx.translate(sX1, sY);
    scene.draw(ctx, sW, sH, 'left', []);
    ctx.restore();

    // Draw right scene (with differences)
    ctx.save();
    ctx.rect(sX2, sY, sW, sH); ctx.clip();
    ctx.translate(sX2, sY);
    scene.draw(ctx, sW, sH, 'right', rightAlts);
    ctx.restore();

    // Scene borders
    CanvasEngine.strokeRoundRect(ctx, sX1, sY, sW, sH, 10, '#2E8B84', 2.5);
    CanvasEngine.strokeRoundRect(ctx, sX2, sY, sW, sH, 10, '#2E8B84', 2.5);

    // Labels
    ctx.font = 'bold 13px Nunito, sans-serif';
    ctx.fillStyle = '#2E8B84'; ctx.textAlign = 'center';
    ctx.fillText('Original', sX1+sW/2, sY-6);
    ctx.fillText('Spot the Difference →', sX2+sW/2, sY-6);

    // Draw found difference circles on BOTH sides
    differences.filter(d => d.found).forEach(d => {
      [sX1, sX2].forEach(sx => {
        const cx = sx + d.rx*sW, cy = sY + d.ry*sH;
        ctx.beginPath();
        ctx.arc(cx, cy, d.r, 0, Math.PI*2);
        ctx.strokeStyle = '#FFD166';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx, cy, d.r+5, 0, Math.PI*2);
        ctx.strokeStyle = 'rgba(255,209,102,0.3)';
        ctx.lineWidth = 6;
        ctx.stroke();
      });
    });

    // Hint pulses (unfound)
    differences.filter(d => !d.found && d.hintT > 0).forEach(d => {
      const alpha = (d.hintT / 60) * 0.7;
      [sX1, sX2].forEach(sx => {
        const cx = sx + d.rx*sW, cy = sY + d.ry*sH;
        ctx.beginPath();
        ctx.arc(cx, cy, d.r + 10 * (1 - d.hintT/60), 0, Math.PI*2);
        ctx.strokeStyle = `rgba(255, 107, 107, ${alpha})`;
        ctx.lineWidth = 4;
        ctx.stroke();
      });
    });

    // Wrong tap flash
    if (wrongFlash > 0) {
      const alpha = (wrongFlash / 25) * 0.7;
      ctx.beginPath();
      ctx.arc(wrongPos.x, wrongPos.y, 20, 0, Math.PI*2);
      ctx.strokeStyle = `rgba(255,80,80,${alpha})`;
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(wrongPos.x-10, wrongPos.y-10);
      ctx.lineTo(wrongPos.x+10, wrongPos.y+10);
      ctx.moveTo(wrongPos.x+10, wrongPos.y-10);
      ctx.lineTo(wrongPos.x-10, wrongPos.y+10);
      ctx.strokeStyle = `rgba(255,80,80,${alpha})`;
      ctx.lineWidth=2.5; ctx.stroke();
    }

    // Burst particles
    burst = CanvasEngine.updateBurst(burst, ctx);

    // Bottom UI bar
    const barY = sY + sH + 6;
    // Progress dots
    ctx.textAlign = 'left';
    ctx.font = '600 13px Nunito, sans-serif';
    ctx.fillStyle = '#555';
    ctx.fillText(`Found: ${foundCount} / ${targetCount}`, sX1, barY + 18);
    // Progress dots visual
    for (let i=0; i<targetCount; i++) {
      ctx.beginPath();
      ctx.arc(sX1 + 120 + i*22, barY + 12, 8, 0, Math.PI*2);
      ctx.fillStyle = i < foundCount ? '#FFD166' : 'rgba(46,139,132,0.2)';
      ctx.fill();
    }
    // Hint button
    CanvasEngine.fillRoundRect(ctx, W-100, H-44, 90, 36, 10, 'rgba(240,165,0,0.15)');
    CanvasEngine.strokeRoundRect(ctx, W-100, H-44, 90, 36, 10, '#F0A500', 2);
    ctx.font = 'bold 13px Nunito, sans-serif';
    ctx.fillStyle = '#D4870A'; ctx.textAlign = 'center';
    ctx.fillText('💡 Hint', W-55, H-20);

    // Scene name
    ctx.font = 'bold 14px Nunito, sans-serif';
    ctx.fillStyle = '#2E8B84'; ctx.textAlign = 'center';
    ctx.fillText(`🌿 ${scene.name}`, W/2, 20);
  }

  function destroy() {
    if (animId) cancelAnimationFrame(animId);
    canvas.onclick = null;
    canvas.ontouchend = null;
  }

  function restart() {
    sceneIdx = (sceneIdx + 1) % SCENES.length;
    buildGame();
  }

  return { init, destroy, restart };
})();
