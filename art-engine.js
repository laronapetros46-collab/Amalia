(() => {
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

  function canvasFor(parent) {
    const canvas = document.createElement('canvas');
    canvas.className = 'painted-art';
    parent.prepend(canvas);
    return canvas;
  }

  function fit(canvas) {
    const box = canvas.parentElement.getBoundingClientRect();
    canvas.width = box.width * pixelRatio;
    canvas.height = box.height * pixelRatio;
    const ctx = canvas.getContext('2d');
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    return { ctx, width: box.width, height: box.height };
  }

  function paintForest() {
    const grove = document.querySelector('.grove');
    if (!grove) return;
    const canvas = grove.querySelector('.painted-art') || canvasFor(grove);
    const { ctx, width, height } = fit(canvas);
    const sx = width / 900;
    const sy = height / 590;
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.scale(sx, sy);

    const soil = ctx.createLinearGradient(0, 475, 0, 590);
    soil.addColorStop(0, '#31543a');
    soil.addColorStop(0.12, '#172e20');
    soil.addColorStop(1, '#050d09');
    ctx.fillStyle = soil;
    ctx.beginPath();
    ctx.moveTo(0, 505);
    ctx.bezierCurveTo(160, 482, 290, 502, 450, 488);
    ctx.bezierCurveTo(610, 474, 760, 490, 900, 506);
    ctx.lineTo(900, 590);
    ctx.lineTo(0, 590);
    ctx.fill();
    ctx.strokeStyle = '#88a965';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(0, 505);
    ctx.bezierCurveTo(160, 482, 290, 502, 450, 488);
    ctx.bezierCurveTo(610, 474, 760, 490, 900, 506);
    ctx.stroke();

    ctx.fillStyle = 'rgba(0, 0, 0, .42)';
    ctx.beginPath();
    ctx.ellipse(450, 509, 152, 24, 0, 0, Math.PI * 2);
    ctx.fill();

    const trunk = ctx.createLinearGradient(410, 0, 500, 0);
    trunk.addColorStop(0, '#33231c');
    trunk.addColorStop(0.45, '#b0794f');
    trunk.addColorStop(0.7, '#805338');
    trunk.addColorStop(1, '#35241d');
    ctx.strokeStyle = trunk;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 34;
    ctx.beginPath();
    ctx.moveTo(450, 505);
    ctx.bezierCurveTo(427, 410, 440, 310, 455, 226);
    ctx.bezierCurveTo(464, 168, 458, 118, 442, 78);
    ctx.stroke();

    ctx.lineWidth = 16;
    ctx.beginPath();
    ctx.moveTo(451, 291); ctx.bezierCurveTo(370, 222, 290, 184, 178, 158);
    ctx.moveTo(455, 264); ctx.bezierCurveTo(540, 190, 632, 150, 758, 137);
    ctx.moveTo(449, 350); ctx.bezierCurveTo(350, 309, 256, 302, 144, 325);
    ctx.moveTo(452, 350); ctx.bezierCurveTo(550, 297, 650, 280, 778, 300);
    ctx.stroke();

    ctx.lineWidth = 25;
    ctx.beginPath();
    ctx.moveTo(451, 488); ctx.bezierCurveTo(430, 510, 405, 523, 377, 532);
    ctx.moveTo(452, 488); ctx.bezierCurveTo(475, 510, 503, 523, 533, 532);
    ctx.stroke();
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(415, 516); ctx.bezierCurveTo(350, 513, 300, 524, 238, 546);
    ctx.moveTo(480, 516); ctx.bezierCurveTo(545, 513, 598, 524, 662, 546);
    ctx.moveTo(395, 528); ctx.bezierCurveTo(350, 540, 316, 550, 280, 558);
    ctx.moveTo(505, 528); ctx.bezierCurveTo(550, 540, 585, 550, 622, 558);
    ctx.stroke();

    const crown = (x, y, radius) => {
      const gradient = ctx.createRadialGradient(x - radius * .35, y - radius * .4, 2, x, y, radius);
      gradient.addColorStop(0, '#d1e99a');
      gradient.addColorStop(.34, '#79aa5d');
      gradient.addColorStop(1, '#17382a');
      ctx.fillStyle = gradient;
      ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#8ab267'; ctx.lineWidth = 3; ctx.stroke();
    };
    [[185,155,75],[285,108,100],[420,82,112],[550,96,108],[655,137,88],[725,205,68],[176,235,70],[295,228,100],[430,206,120],[565,214,108],[680,244,74]].forEach(([x,y,r]) => crown(x,y,r));
    ctx.fillStyle = '#e4f6b2';
    [[286,125,4],[424,81,5],[557,143,4],[660,212,3],[351,215,3]].forEach(([x,y,r]) => { ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); });
    ctx.restore();
  }

  function paintOcean() {
    const stage = document.querySelector('.sea-stage');
    const turtle = document.querySelector('.turtle');
    if (!stage || !turtle) return;
    const canvas = stage.querySelector('.painted-art') || canvasFor(stage);
    const { ctx, width, height } = fit(canvas);
    const x = width / 2;
    const y = height * .56;
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(x, y);
    const scale = Math.min(width / 700, 1.2);
    ctx.scale(scale, scale);

    ctx.fillStyle = 'rgba(110, 220, 190, .12)';
    ctx.beginPath(); ctx.ellipse(0, 5, 250, 125, -.08, 0, Math.PI * 2); ctx.fill();

    const flipper = (points) => { ctx.fillStyle = '#5aa892'; ctx.strokeStyle = '#b6e4bb'; ctx.lineWidth = 3; ctx.beginPath(); points.forEach(([px,py], i) => i ? ctx.lineTo(px,py) : ctx.moveTo(px,py)); ctx.closePath(); ctx.fill(); ctx.stroke(); };
    flipper([[-128,-20],[-248,-75],[-267,-54],[-147,15]]);
    flipper([[-112,55],[-224,115],[-235,139],[-92,86]]);
    flipper([[110,-35],[220,-96],[244,-79],[137,12]]);
    flipper([[112,50],[222,92],[242,124],[93,86]]);

    const shell = ctx.createRadialGradient(-35,-35,15,0,0,180);
    shell.addColorStop(0, '#a8dfad'); shell.addColorStop(.4, '#448f82'); shell.addColorStop(1, '#123d4f');
    ctx.fillStyle = shell; ctx.strokeStyle = '#c2edc5'; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.ellipse(0, 0, 174, 108, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.save(); ctx.clip(); ctx.strokeStyle = 'rgba(178,229,174,.68)'; ctx.lineWidth = 4;
    for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(i * 55, -120); ctx.bezierCurveTo(i * 26, -40, i * 26, 40, i * 55, 120); ctx.stroke(); }
    for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.moveTo(-190, i * 55); ctx.bezierCurveTo(-65, i * 34, 65, i * 34, 190, i * 55); ctx.stroke(); }
    ctx.restore();

    ctx.fillStyle = '#69b09d'; ctx.strokeStyle = '#b6e4bb'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.ellipse(207, 23, 70, 48, -.15, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#d8f2c3'; ctx.beginPath(); ctx.arc(235, 10, 6, 0, Math.PI*2); ctx.arc(259, 17, 4, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = '#164d58'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(256, 42, 15, .2, 1.3); ctx.stroke();
    [[-35,-18,22], [34,25,24], [43,-54,20]].forEach(([px,py,r]) => { ctx.fillStyle='#d6ecb6'; ctx.strokeStyle='#6b9e71'; ctx.beginPath(); ctx.arc(px,py,r,0,Math.PI*2); ctx.fill(); ctx.stroke(); });
    ctx.restore();
  }

  function start() {
    if (document.querySelector('.grove')) paintForest();
    if (document.querySelector('.sea-stage')) paintOcean();
    addEventListener('resize', () => { paintForest(); paintOcean(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();