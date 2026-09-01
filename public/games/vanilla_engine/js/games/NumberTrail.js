/* =====================================================
   NumberTrail.js — Number Sequence Recall Game
   Numbers appear one by one → remember their positions → tap in order
   Classic visual-spatial working memory training
   Inspired by: Counting sequence/number recall YouTube videos
   Videos: RNbDfVsY4zU, oyD_HjJ_Q38
   ===================================================== */

const NumberTrail = (() => {
  let canvas, ctx, W, H;
  let animId = null;
  let onWin  = null;
  let difficulty = 'gentle';

  // Game state
  let numbers   = []; // { n, x, y, r, shown, tapped, tapOrder, glowT, wrongT }
  let phase     = 'showing';  // showing | recall | done
  let showIdx   = 0;
  let showTimer = 0;
  let tapOrder  = 0;
  let round     = 1;
  let score     = 0;
  let errors    = 0;
  let burst     = [];
  let message   = '';
  let msgTimer  = 0;
  let bgStars   = []; // background decoration

  const DIFF_CFG = {
    gentle:   { count: 5,  rounds: 3, showDur: 70 },  // 5 numbers, show each ~1.2s
    active:   { count: 8,  rounds: 4, showDur: 55 },
    champion: { count: 12, rounds: 5, showDur: 40 },
  };

  function init(canvasEl, diff, winCallback) {
    canvas = canvasEl;
    ctx    = canvas.getContext('2d');
    difficulty = diff || 'gentle';
    onWin  = winCallback;
    CanvasEngine.fitCanvas(canvas, canvas.parentElement);
    W = canvas.width; H = canvas.height;
    bgStars = Array.from({length:25},()=>({
      x: Math.random()*W, y: Math.random()*H,
      r: Math.random()*3+1, alpha: Math.random()*0.3+0.05
    }));
    buildRound();
    bindEvents();
    if (animId) cancelAnimationFrame(animId);
    loop();
  }

  function buildRound() {
    const cfg = DIFF_CFG[difficulty];
    burst     = [];
    showIdx   = 0;
    showTimer = 0;
    tapOrder  = 0;
    phase     = 'showing';
    message   = '👀 Watch the numbers!';
    msgTimer  = 999;

    // Generate non-overlapping positions
    const margin = Math.min(W,H) * 0.12;
    const r      = Math.min(W,H) * 0.065;
    numbers = [];
    for (let n=1; n<=cfg.count; n++) {
      let x, y, ok;
      let tries = 0;
      do {
        x = margin + Math.random() * (W - margin*2);
        y = margin*1.5 + Math.random() * (H - margin*3);
        ok = numbers.every(p => {
          const dx=p.x-x, dy=p.y-y;
          return Math.sqrt(dx*dx+dy*dy) >= r*2.5;
        });
        tries++;
      } while (!ok && tries < 100);
      numbers.push({
        n, x, y, r,
        shown:    false,
        tapped:   false,
        tapOrder: -1,
        glowT:    0,
        wrongT:   0,
      });
    }
  }

  function bindEvents() {
    canvas.onclick    = handleTap;
    canvas.ontouchend = (e) => { e.preventDefault(); handleTap(e); };
  }

  function handleTap(e) {
    if (phase !== 'recall') return;
    const pos = CanvasEngine.getScaledPos(canvas, e);
    const next = tapOrder + 1; // next expected number

    let hit = null;
    numbers.forEach(num => {
      if (num.tapped) return;
      const dx = pos.x - num.x, dy = pos.y - num.y;
      if (Math.sqrt(dx*dx+dy*dy) <= num.r + 10) hit = num;
    });

    if (!hit) return;

    if (hit.n === next) {
      // Correct
      hit.tapped   = true;
      hit.tapOrder = tapOrder;
      hit.glowT    = 1;
      tapOrder++;
      SoundEngine.playNote(400 + tapOrder * 30, 0.15, 'sine', 0.4);
      burst.push(...CanvasEngine.createBurst(ctx, hit.x, hit.y, 10,
        ['#FFD166','#4ECDC4','#95E1D3']));

      if (tapOrder >= numbers.length) {
        // Round complete!
        score++;
        SoundEngine.playSuccess();
        message = `✨ Round ${round} complete!`;
        msgTimer = 60;
        const cfg = DIFF_CFG[difficulty];
        if (round >= cfg.rounds) {
          phase = 'done';
          SoundEngine.playCelebration();
          burst.push(...CanvasEngine.createBurst(ctx, W/2, H/2, 30));
          const stars = errors === 0 ? 3 : errors <= 2 ? 2 : 1;
          setTimeout(() => { if (onWin) onWin(stars); }, 1200);
        } else {
          phase = 'idle';
          setTimeout(() => {
            round++;
            buildRound();
          }, 1400);
        }
      }
    } else {
      // Wrong order
      hit.wrongT = 40;
      errors++;
      SoundEngine.playMiss();
      message = `Try again — tap ${next} first!`;
      msgTimer = 50;
    }
  }

  function loop() {
    update();
    draw();
    animId = requestAnimationFrame(loop);
  }

  function update() {
    const cfg = DIFF_CFG[difficulty];
    if (phase === 'showing') {
      showTimer++;
      if (showTimer >= cfg.showDur) {
        showTimer = 0;
        if (showIdx < numbers.length) {
          numbers[showIdx].shown = true;
          numbers[showIdx].glowT = 1;
          SoundEngine.playNote(350 + showIdx * 25, 0.12, 'triangle', 0.3);
          showIdx++;
        } else {
          // All shown — pause then hide
          setTimeout(() => {
            message  = '🎯 Now tap 1, 2, 3... in order!';
            msgTimer = 999;
            numbers.forEach(n => { n.shown = false; }); // hide numbers
            phase    = 'recall';
          }, 600);
          phase = 'waiting';
        }
      }
    }

    // Animate glow
    numbers.forEach(n => {
      if (n.glowT > 0) n.glowT -= 0.04;
      if (n.wrongT > 0) n.wrongT--;
    });
    if (msgTimer > 0) msgTimer--;
  }

  function draw() {
    ctx.clearRect(0,0,W,H);

    // Dark starry background for drama
    const bg = ctx.createRadialGradient(W/2,H/2,50,W/2,H/2,Math.max(W,H)*0.7);
    bg.addColorStop(0,'#1a1a3e'); bg.addColorStop(1,'#0a0a20');
    ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);

    // Bg stars
    bgStars.forEach(s => {
      ctx.globalAlpha = s.alpha + Math.sin(Date.now()*0.001 + s.x)*0.08;
      ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctx.fillStyle='#fff'; ctx.fill();
    });
    ctx.globalAlpha=1;

    // Soft grid dots (visual guide)
    if (phase === 'showing' || phase === 'waiting') {
      numbers.filter(n => !n.shown).forEach(n => {
        ctx.beginPath(); ctx.arc(n.x,n.y,n.r*0.25,0,Math.PI*2);
        ctx.fillStyle='rgba(255,255,255,0.05)'; ctx.fill();
      });
    }

    // Draw number circles
    numbers.forEach(n => {
      if (!n.shown && phase === 'showing') return;
      if (!n.shown && phase === 'waiting') return;
      const isRecall = phase === 'recall' || phase === 'done';
      const isTapped = n.tapped;
      const isWrong  = n.wrongT > 0;

      ctx.save();
      ctx.translate(n.x, n.y);

      // Glow
      if (n.glowT > 0) {
        ctx.shadowColor = isTapped ? '#FFD166' : '#4ECDC4';
        ctx.shadowBlur  = 30 * n.glowT;
      }

      // Circle background
      const grad = ctx.createRadialGradient(-n.r*0.3,-n.r*0.3,0, 0,0,n.r);
      if (isWrong) {
        grad.addColorStop(0,'#FF8080'); grad.addColorStop(1,'#C0392B');
      } else if (isTapped) {
        grad.addColorStop(0,'#FFE44D'); grad.addColorStop(1,'#F0A500');
      } else if (isRecall) {
        // Hidden — show as mystery bubble
        grad.addColorStop(0,'rgba(78,205,196,0.35)'); grad.addColorStop(1,'rgba(46,139,132,0.2)');
      } else {
        grad.addColorStop(0,'#4ECDC4'); grad.addColorStop(1,'#2E8B84');
      }
      ctx.beginPath(); ctx.arc(0,0,n.r,0,Math.PI*2);
      ctx.fillStyle=grad; ctx.fill();
      ctx.strokeStyle= isTapped?'#FFD166':isWrong?'#FF0000':'rgba(255,255,255,0.3)';
      ctx.lineWidth=2.5; ctx.stroke();
      ctx.shadowBlur=0;

      // Number text
      ctx.font = `bold ${n.r*0.85}px Nunito, sans-serif`;
      ctx.fillStyle = isRecall && !isTapped ? 'rgba(255,255,255,0.1)' : '#fff';
      ctx.textAlign='center'; ctx.textBaseline='middle';
      if (!isRecall || isTapped) ctx.fillText(n.n, 0, 1);
      else if (isRecall) {
        // Show "?" for unvisited in recall
        ctx.fillStyle='rgba(255,255,255,0.2)';
        ctx.fillText('?', 0, 1);
      }
      ctx.textBaseline='alphabetic';
      ctx.restore();

      // Tap order badge (shown after tapping)
      if (isTapped) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(n.x+n.r*0.7, n.y-n.r*0.7, n.r*0.3, 0, Math.PI*2);
        ctx.fillStyle='#fff'; ctx.fill();
        ctx.font=`bold ${n.r*0.35}px Nunito, sans-serif`;
        ctx.fillStyle='#F0A500'; ctx.textAlign='center'; ctx.textBaseline='middle';
        ctx.fillText(n.tapOrder+1, n.x+n.r*0.7, n.y-n.r*0.7);
        ctx.textBaseline='alphabetic';
        ctx.restore();
      }
    });

    // Burst particles
    burst = CanvasEngine.updateBurst(burst, ctx);

    // Top HUD
    CanvasEngine.fillRoundRect(ctx,0,0,W,50,0,'rgba(0,0,0,0.4)');

    // Round indicator
    const cfg = DIFF_CFG[difficulty];
    ctx.font=`bold ${W*0.037}px Nunito, sans-serif`;
    ctx.fillStyle='#4ECDC4'; ctx.textAlign='left';
    ctx.fillText(`Round ${round}/${cfg.rounds}`, 14, 33);

    // Phase indicator
    ctx.textAlign='center';
    ctx.fillStyle='rgba(255,255,255,0.7)';
    ctx.fillText(
      phase==='showing'||phase==='waiting' ? '👀 Memorize!' :
      phase==='recall'  ? '👆 Tap in order!' :
      phase==='done'    ? '🏆 Done!' : '',
      W/2, 33
    );

    // Progress (tapped count)
    ctx.textAlign='right'; ctx.fillStyle='#FFD166';
    ctx.fillText(`${tapOrder}/${numbers.length} ✓`, W-14, 33);

    // Message bar
    if (msgTimer > 0 && message) {
      const alpha = Math.min(1, msgTimer/20);
      ctx.save();
      ctx.globalAlpha=alpha;
      ctx.font=`600 ${W*0.035}px Nunito, sans-serif`;
      ctx.fillStyle='rgba(255,255,255,0.9)';
      ctx.textAlign='center';
      ctx.fillText(message, W/2, H-16);
      ctx.restore();
    }

    // Progress dots bottom
    const dotY=H-38, dotR=5, dotGap=14;
    const numNums = numbers.length;
    const dotsStart=W/2-(numNums*(dotR*2+dotGap))/2;
    for(let i=0;i<numNums;i++){
      ctx.beginPath();
      ctx.arc(dotsStart+i*(dotR*2+dotGap), dotY, dotR, 0, Math.PI*2);
      ctx.fillStyle = i<tapOrder ? '#FFD166' : 'rgba(255,255,255,0.15)';
      ctx.fill();
    }
  }

  function destroy() {
    if (animId) cancelAnimationFrame(animId);
    canvas.onclick    = null;
    canvas.ontouchend = null;
  }

  function restart() {
    round  = 1;
    score  = 0;
    errors = 0;
    buildRound();
  }

  return { init, destroy, restart };
})();
