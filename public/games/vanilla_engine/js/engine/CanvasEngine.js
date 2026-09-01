/* =====================================================
   CanvasEngine.js — Shared canvas drawing utilities
   Particles, backgrounds, nature illustrations, helpers
   ===================================================== */

const CanvasEngine = (() => {

  // ── Animated background for the hub page ──────────────────
  let bgCtx = null, bgCanvas = null;
  let bgParticles = [];
  let bgAnimId = null;
  let bgFlowers = [];

  function initBackground(canvas) {
    bgCanvas = canvas;
    bgCtx = canvas.getContext('2d');
    resizeBg();
    createBgElements();
    animateBg();
    window.addEventListener('resize', () => { resizeBg(); createBgElements(); });
  }

  function resizeBg() {
    if (!bgCanvas) return;
    bgCanvas.width  = window.innerWidth;
    bgCanvas.height = window.innerHeight;
  }

  function createBgElements() {
    if (!bgCanvas) return;
    // Floating particles (pollen/petals)
    bgParticles = Array.from({ length: 55 }, () => ({
      x:    Math.random() * bgCanvas.width,
      y:    Math.random() * bgCanvas.height,
      r:    Math.random() * 6 + 3,
      vx:   (Math.random() - 0.5) * 0.4,
      vy:   -(Math.random() * 0.5 + 0.2),
      alpha: Math.random() * 0.5 + 0.2,
      hue:  Math.random() * 60 + 140, // teal to green
      rot:  Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.02,
    }));
    // Decorative static flowers
    bgFlowers = Array.from({ length: 12 }, () => ({
      x:     Math.random() * bgCanvas.width,
      y:     Math.random() * bgCanvas.height,
      size:  Math.random() * 30 + 20,
      hue:   [10, 30, 180, 270, 320][Math.floor(Math.random()*5)],
      phase: Math.random() * Math.PI * 2,
    }));
  }

  function animateBg() {
    if (!bgCtx || !bgCanvas) return;
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

    // Gradient sky
    const grad = bgCtx.createLinearGradient(0, 0, bgCanvas.width, bgCanvas.height);
    grad.addColorStop(0,   '#e0f4f3');
    grad.addColorStop(0.5, '#fff8f0');
    grad.addColorStop(1,   '#ffecd2');
    bgCtx.fillStyle = grad;
    bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);

    // Draw flowers
    bgFlowers.forEach(f => {
      drawMiniFlower(bgCtx, f.x, f.y + Math.sin(Date.now()*0.0008 + f.phase)*4, f.size, f.hue, 0.12);
    });

    // Particles
    bgParticles.forEach(p => {
      p.x  += p.vx;
      p.y  += p.vy;
      p.rot += p.rotV;
      if (p.y < -10)  { p.y = bgCanvas.height + 10; p.x = Math.random() * bgCanvas.width; }
      if (p.x < -10)  { p.x = bgCanvas.width + 10; }
      if (p.x > bgCanvas.width + 10) { p.x = -10; }

      bgCtx.save();
      bgCtx.globalAlpha = p.alpha;
      bgCtx.translate(p.x, p.y);
      bgCtx.rotate(p.rot);
      // Petal shape
      bgCtx.beginPath();
      bgCtx.ellipse(0, -p.r, p.r * 0.45, p.r, 0, 0, Math.PI * 2);
      bgCtx.fillStyle = `hsl(${p.hue}, 60%, 70%)`;
      bgCtx.fill();
      bgCtx.restore();
    });

    bgAnimId = requestAnimationFrame(animateBg);
  }

  function stopBackground() {
    if (bgAnimId) { cancelAnimationFrame(bgAnimId); bgAnimId = null; }
  }

  // ── Mini flower drawing primitive ─────────────────────────
  function drawMiniFlower(ctx, x, y, size, hue, alpha = 1) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(x, y);
    // Petals
    const petals = 6;
    for (let i = 0; i < petals; i++) {
      ctx.save();
      ctx.rotate((i / petals) * Math.PI * 2);
      ctx.beginPath();
      ctx.ellipse(0, -size * 0.5, size * 0.22, size * 0.45, 0, 0, Math.PI * 2);
      ctx.fillStyle = `hsl(${hue}, 65%, 75%)`;
      ctx.fill();
      ctx.restore();
    }
    // Center
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.22, 0, Math.PI * 2);
    ctx.fillStyle = `hsl(${hue + 30}, 80%, 88%)`;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.1, 0, Math.PI * 2);
    ctx.fillStyle = `hsl(${hue - 20}, 80%, 55%)`;
    ctx.fill();
    ctx.restore();
  }

  // ── Game tile previews ─────────────────────────────────────
  function drawMemoryPreview(canvas) {
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    // Background gradient
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, '#e8f5f4'); g.addColorStop(1, '#fff3e0');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    // Mini card grid 2x2
    const cards = [{x:30,y:25},{x:80,y:25},{x:130,y:25},{x:30,y:75},{x:80,y:75},{x:130,y:75}];
    cards.forEach((c, i) => {
      const flipped = i < 2;
      roundRect(ctx, c.x, c.y, 42, 52, 8);
      if (flipped) {
        ctx.fillStyle = '#fff';
        ctx.fill();
        drawMiniFlower(ctx, c.x+21, c.y+26, 14, i===0?10:180, 1);
      } else {
        ctx.fillStyle = '#2E8B84';
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        for(let r=0;r<3;r++) for(let cc=0;cc<3;cc++){
          ctx.fillRect(c.x+5+cc*11, c.y+5+r*14, 8, 10);
        }
      }
      ctx.strokeStyle = 'rgba(46,139,132,0.3)'; ctx.lineWidth = 1.5;
      ctx.stroke();
    });
  }

  function drawSimonPreview(canvas) {
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const g = ctx.createLinearGradient(0,0,W,H);
    g.addColorStop(0,'#1a1a2e'); g.addColorStop(1,'#16213e');
    ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
    const pads = [
      {x:40,y:20,w:55,h:45,color:'#FF6B6B',lit:true},
      {x:105,y:20,w:55,h:45,color:'#4ECDC4',lit:false},
      {x:40,y:75,w:55,h:45,color:'#FFD166',lit:false},
      {x:105,y:75,w:55,h:45,color:'#95E1D3',lit:true},
    ];
    pads.forEach(p => {
      roundRect(ctx, p.x, p.y, p.w, p.h, 12);
      ctx.fillStyle = p.lit ? p.color : p.color + '55';
      ctx.fill();
      if (p.lit) {
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 18;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    });
  }

  function drawWordPreview(canvas) {
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const g = ctx.createLinearGradient(0,0,W,H);
    g.addColorStop(0,'#f0fff4'); g.addColorStop(1,'#fff8e7');
    ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
    drawMiniFlower(ctx, W/2, H/2-10, 34, 320, 1);
    ctx.font = 'bold 16px Nunito, sans-serif';
    ctx.fillStyle = '#2E8B84';
    ctx.textAlign = 'center';
    ctx.fillText('R _ S E', W/2, H-18);
  }

  function drawPuzzlePreview(canvas) {
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    ctx.fillStyle = '#e8f5f4'; ctx.fillRect(0,0,W,H);
    // 2x2 puzzle grid
    const pw = 70, ph = 55;
    const ox = (W-pw*2-4)/2, oy = (H-ph*2-4)/2;
    [[0,0,'#4ECDC4'],[1,0,'#FFD166'],[0,1,'#FF6B6B'],[1,1,'#95E1D3']].forEach(([cx,cy,col],i) => {
      const x = ox + cx*(pw+4), y = oy + cy*(ph+4);
      roundRect(ctx, x, y, pw, ph, 8);
      ctx.fillStyle = col + (i===2?'':'bb');
      ctx.fill();
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
    });
    // Missing piece indicator
    const mx = ox, my = oy+ph+4;
    roundRect(ctx, mx, my, pw, ph, 8);
    ctx.fillStyle = 'rgba(0,0,0,0.08)'; ctx.fill();
    ctx.strokeStyle = '#FF6B6B'; ctx.lineWidth = 2.5;
    ctx.setLineDash([5,4]); ctx.stroke(); ctx.setLineDash([]);
  }

  function drawSortPreview(canvas) {
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const g = ctx.createLinearGradient(0,0,W,H);
    g.addColorStop(0,'#f0fdf4'); g.addColorStop(1,'#fefce8');
    ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
    ['🍎','🥕'].forEach((em, i) => {
      const bx = 30 + i*115, by = 70;
      roundRect(ctx, bx, by, 75, 50, 10);
      ctx.fillStyle = i===0 ? 'rgba(255,107,107,0.15)' : 'rgba(255,209,102,0.15)';
      ctx.fill();
      ctx.strokeStyle = i===0 ? '#FF6B6B' : '#FFD166'; ctx.lineWidth=2; ctx.stroke();
      ctx.font='24px serif'; ctx.textAlign='center';
      ctx.fillText(em, bx+37, by+35);
    });
    ['🍌','🥦','🍊'].forEach((em, i) => {
      ctx.font='20px serif';
      ctx.fillText(em, 30 + i*60, 40);
    });
  }

  function drawSpotPreview(canvas) {
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    // Two mini scenes side by side
    const hw = W/2 - 4;
    // Left sky
    ctx.fillStyle='#87CEEB'; ctx.fillRect(2,2,hw,H-4);
    ctx.fillStyle='#7BC67E'; ctx.fillRect(2,H*0.55,hw,H*0.45-2);
    // Right sky (slightly different)
    ctx.fillStyle='#A0D8EF'; ctx.fillRect(W/2+2,2,hw,H-4);
    ctx.fillStyle='#5aaa5a'; ctx.fillRect(W/2+2,H*0.55,hw,H*0.45-2);
    // Divider
    ctx.strokeStyle='#2E8B84'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(W/2,0); ctx.lineTo(W/2,H); ctx.stroke();
    // Sun on left
    ctx.beginPath(); ctx.arc(W*0.22,H*0.22,14,0,Math.PI*2);
    ctx.fillStyle='#FFD700'; ctx.fill();
    // Bigger sun on right (difference!)
    ctx.beginPath(); ctx.arc(W*0.72,H*0.22,20,0,Math.PI*2);
    ctx.fillStyle='#FFD700'; ctx.fill();
    // Flowers
    drawMiniFlower(ctx, W*0.3,H*0.72,12,340,1);
    drawMiniFlower(ctx, W*0.8,H*0.72,12,200,1); // color difference!
    // Search circle
    ctx.beginPath(); ctx.arc(W*0.72,H*0.22,24,0,Math.PI*2);
    ctx.strokeStyle='rgba(255,209,102,0.8)'; ctx.lineWidth=2.5; ctx.stroke();
    // Label
    ctx.font='bold 10px Nunito,sans-serif'; ctx.fillStyle='#2E8B84';
    ctx.textAlign='center'; ctx.fillText('Find differences →', W/2, H-4);
  }

  function drawGardenTapPreview(canvas) {
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    // Garden bg
    ctx.fillStyle='#87CEEB'; ctx.fillRect(0,0,W,H*0.45);
    ctx.fillStyle='#7BC67E'; ctx.fillRect(0,H*0.45,W,H*0.55);
    // Holes with flowers popping
    const flowers = [
      {x:40,y:55,color:'#FFD166',target:true},
      {x:100,y:80,color:'#FF6B6B',target:false},
      {x:165,y:55,color:'#FFD166',target:true},
    ];
    flowers.forEach(f => {
      ctx.beginPath(); ctx.ellipse(f.x,f.y+20,18,8,0,0,Math.PI*2);
      ctx.fillStyle='rgba(0,0,0,0.2)'; ctx.fill();
      // Stem
      ctx.strokeStyle='#4a7c59'; ctx.lineWidth=2;
      ctx.beginPath(); ctx.moveTo(f.x,f.y+15); ctx.lineTo(f.x,f.y+25); ctx.stroke();
      // Petals
      for(let p=0;p<6;p++){
        ctx.save(); ctx.translate(f.x,f.y); ctx.rotate(p/6*Math.PI*2);
        ctx.beginPath(); ctx.ellipse(0,-12,5,10,0,0,Math.PI*2);
        ctx.fillStyle=f.color; ctx.fill(); ctx.restore();
      }
      ctx.beginPath(); ctx.arc(f.x,f.y,6,0,Math.PI*2);
      ctx.fillStyle='#FFF3B0'; ctx.fill();
      if(f.target){
        ctx.beginPath(); ctx.arc(f.x,f.y,16,0,Math.PI*2);
        ctx.strokeStyle='rgba(255,209,102,0.6)'; ctx.lineWidth=2; ctx.stroke();
      }
    });
    ctx.font='bold 10px Nunito,sans-serif'; ctx.fillStyle='#2E8B84';
    ctx.textAlign='center'; ctx.fillText('Tap 🌼 YELLOW only!', W/2, H-4);
  }

  function drawNumberTrailPreview(canvas) {
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    // Dark bg
    ctx.fillStyle='#1a1a3e'; ctx.fillRect(0,0,W,H);
    // Stars
    for(let i=0;i<20;i++){
      ctx.beginPath();
      ctx.arc(Math.random()*W, Math.random()*H, 1, 0, Math.PI*2);
      ctx.fillStyle='rgba(255,255,255,0.4)'; ctx.fill();
    }
    // Number circles
    const positions = [{x:40,y:55,n:1,lit:true},{x:120,y:35,n:2,lit:false},{x:170,y:75,n:3,lit:false},{x:60,y:105,n:4,lit:false},{x:150,y:110,n:5,lit:false}];
    positions.forEach(p => {
      ctx.beginPath(); ctx.arc(p.x,p.y,18,0,Math.PI*2);
      ctx.fillStyle = p.lit ? '#4ECDC4' : 'rgba(78,205,196,0.3)';
      ctx.fill();
      ctx.strokeStyle='rgba(255,255,255,0.3)'; ctx.lineWidth=1.5; ctx.stroke();
      ctx.font='bold 14px Nunito,sans-serif'; ctx.fillStyle='#fff';
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText(p.n, p.x, p.y);
      ctx.textBaseline='alphabetic';
    });
    // Trail line
    ctx.beginPath(); ctx.moveTo(40,55);
    ctx.setLineDash([4,4]);
    ctx.strokeStyle='rgba(255,209,102,0.4)'; ctx.lineWidth=1.5;
    ctx.lineTo(120,35); ctx.lineTo(170,75); ctx.stroke();
    ctx.setLineDash([]);
    ctx.font='bold 10px Nunito,sans-serif'; ctx.fillStyle='#4ECDC4';
    ctx.textAlign='center'; ctx.fillText('Tap 1→2→3... in order', W/2, H-4);
  }

  // ── Health ring (donut chart) ──────────────────────────────
  function drawHealthRing(canvas, percent, color = '#2E8B84') {
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const cx = W/2, cy = H/2, r = Math.min(W,H)*0.42;
    ctx.clearRect(0, 0, W, H);
    // Track
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI*2);
    ctx.strokeStyle = 'rgba(46,139,132,0.12)';
    ctx.lineWidth = 11;
    ctx.stroke();
    // Progress
    if (percent > 0) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, -Math.PI/2, -Math.PI/2 + (percent/100)*Math.PI*2);
      const grad = ctx.createLinearGradient(cx-r, cy, cx+r, cy);
      grad.addColorStop(0, color);
      grad.addColorStop(1, '#4ECDC4');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 11;
      ctx.lineCap = 'round';
      ctx.stroke();
    }
  }

  // ── Weekly chart ───────────────────────────────────────────
  function drawWeeklyChart(canvas, weeklyData) {
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    const maxVal = Math.max(...weeklyData, 1);
    const barW = 50, gap = (W - days.length * barW) / (days.length + 1);

    days.forEach((day, i) => {
      const val = weeklyData[i] || 0;
      const barH = Math.max(4, (val / maxVal) * (H - 50));
      const x = gap + i * (barW + gap);
      const y = H - 30 - barH;

      const grad = ctx.createLinearGradient(x, y, x, y + barH);
      grad.addColorStop(0, '#4ECDC4');
      grad.addColorStop(1, '#2E8B84');
      roundRect(ctx, x, y, barW, barH, 8);
      ctx.fillStyle = val > 0 ? grad : 'rgba(46,139,132,0.1)';
      ctx.fill();

      ctx.font = '600 12px Nunito, sans-serif';
      ctx.fillStyle = '#888';
      ctx.textAlign = 'center';
      ctx.fillText(day, x + barW/2, H - 10);

      if (val > 0) {
        ctx.font = 'bold 13px Nunito, sans-serif';
        ctx.fillStyle = '#2E8B84';
        ctx.fillText(val, x + barW/2, y - 6);
      }
    });
  }

  // ── Particle burst effect ──────────────────────────────────
  function createBurst(ctx, x, y, count = 20, colors = ['#FFD166','#4ECDC4','#FF6B6B','#95E1D3']) {
    const particles = Array.from({ length: count }, () => ({
      x, y,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.8) * 8,
      r:  Math.random() * 6 + 3,
      life: 1,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    return particles;
  }

  function updateBurst(particles, ctx) {
    particles.forEach(p => {
      p.vy += 0.3; // gravity
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.025;
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = p.color;
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    return particles.filter(p => p.life > 0);
  }

  // ── Helpers ────────────────────────────────────────────────
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function fillRoundRect(ctx, x, y, w, h, r, color) {
    roundRect(ctx, x, y, w, h, r);
    ctx.fillStyle = color;
    ctx.fill();
  }

  function strokeRoundRect(ctx, x, y, w, h, r, color, lw = 2) {
    roundRect(ctx, x, y, w, h, r);
    ctx.strokeStyle = color;
    ctx.lineWidth = lw;
    ctx.stroke();
  }

  function fitCanvas(canvas, container) {
    const rect = container.getBoundingClientRect();
    const aspect = 4 / 3;
    let w = rect.width  - 32;
    let h = w / aspect;
    if (h > rect.height - 32) { h = rect.height - 32; w = h * aspect; }
    canvas.width  = Math.floor(w);
    canvas.height = Math.floor(h);
    canvas.style.width  = canvas.width + 'px';
    canvas.style.height = canvas.height + 'px';
    return { w: canvas.width, h: canvas.height };
  }

  function getScaledPos(canvas, e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width  / rect.width;
    const scaleY = canvas.height / rect.height;
    const src = e.touches ? e.touches[0] : e;
    return {
      x: (src.clientX - rect.left) * scaleX,
      y: (src.clientY - rect.top)  * scaleY,
    };
  }

  return {
    initBackground,
    stopBackground,
    drawMiniFlower,
    drawMemoryPreview,
    drawSimonPreview,
    drawWordPreview,
    drawPuzzlePreview,
    drawSortPreview,
    drawSpotPreview,
    drawGardenTapPreview,
    drawNumberTrailPreview,
    drawHealthRing,
    drawWeeklyChart,
    createBurst,
    updateBurst,
    roundRect,
    fillRoundRect,
    strokeRoundRect,
    fitCanvas,
    getScaledPos,
  };
})();
