const CARD_W = 400;
const CARD_H = 400 * (1350 / 1080); // = 375

const images = [
  { src: 'assets/images/posts/Instagram/nairanrrawaa-post-19.jpg', label: 'Alpine Serenity', tag: 'landscape' },
  { src: 'assets/images/posts/Instagram/nairanrrawaa-post-21.jpg', label: 'Portrait Study',  tag: 'people'   },
  { src: 'assets/images/posts/Instagram/nairanrrawaa-post-22.jpg', label: 'Urban Texture',   tag: 'city'     },
  { src: 'assets/images/posts/Instagram/nairanrrawaa-post-23.jpg', label: 'Still Waters',    tag: 'nature'   },
  { src: 'assets/images/posts/Instagram/nairanrrawaa-post-24.jpg', label: 'Night Exposure',  tag: 'long exp.'},
  { src: 'assets/images/posts/Instagram/nairanrrawaa-post-25.jpg', label: 'Minimalism',      tag: 'abstract' },
  { src: 'assets/images/posts/Instagram/nairanrrawaa-post-26.jpg', label: 'Minimalism',      tag: 'abstract' },
];

const fanTargets = [
  { x: 28,  y: 30,  rot: -5   },
  { x: 210, y: 14,  rot: -2   },
  { x: 395, y: 20,  rot:  1   },
  { x: 620, y: 16,  rot:  3.5 },
  { x: 80,  y: 340, rot: -3   },
  { x: 580, y: 320, rot:  2.5 },
];

const container  = document.getElementById('container');
const hintBadge  = document.getElementById('hint-badge');
let zCounter = 10;
let fanned   = false;
const frames = [];

function deckStyle(i, total) {
  const cW  = container.offsetWidth  || 960;
  const cH  = container.offsetHeight || 620;
  const cx  = (cW - CARD_W) / 2;
  const cy  = (cH - CARD_H) / 2;
  const mid = (total - 1) / 2;

  return {
    x:   cx + (i - mid) * 4,
    y:   cy + (i - mid) * 3,
    rot: (i - mid) * 2.2,
  };
}

images.forEach((img, i) => {
  const dp = deckStyle(i, images.length);

  const frame = document.createElement('div');
  frame.className = 'img-frame';

  frame.style.width  = CARD_W + 'px';
  frame.style.height = CARD_H + 'px';

  frame.style.left      = dp.x + 'px';
  frame.style.top       = dp.y + 'px';
  frame.style.transform = `rotate(${dp.rot}deg)`;
  frame.style.zIndex    = 10 + i;

  const imgEl = new Image();
  imgEl.alt      = img.label;
  imgEl.loading  = 'lazy';
  imgEl.decoding = 'async';
  imgEl.src      = img.src;


  frame.appendChild(imgEl);
  container.appendChild(frame);

  frames.push({ frame, fan: fanTargets[i], rot: dp.rot });
  makeDraggable(frame, i);
});

function fanOut() {
  if (fanned) return;
  fanned = true;
  hintBadge.textContent = '\u25C6 drag images freely';

  frames.forEach(({ frame, fan }, i) => {
    setTimeout(() => {
      frame.style.left      = fan.x + 'px';
      frame.style.top       = fan.y + 'px';
      frame.style.transform = `rotate(${fan.rot}deg)`;
      frame.style.zIndex    = 10 + i;
    }, i * 70);
  });
}

function makeDraggable(el) {
  let startMX, startMY, startL, startT, baseRot, moved;

  el.addEventListener('mousedown', e => {
    e.preventDefault();
    moved   = false;
    startMX = e.clientX;
    startMY = e.clientY;
    startL  = parseFloat(el.style.left)  || 0;
    startT  = parseFloat(el.style.top)   || 0;

    const mat = new DOMMatrix(getComputedStyle(el).transform);
    baseRot   = Math.atan2(mat.b, mat.a) * (180 / Math.PI);

    el.style.zIndex = ++zCounter;
    el.classList.add('dragging');

    const onMove = e2 => {
      const dx = e2.clientX - startMX;
      const dy = e2.clientY - startMY;

      if (!moved && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
        moved = true;
        fanOut();
      }

      const cW   = container.offsetWidth;
      const cH   = container.offsetHeight;

      const newL = Math.max(0, Math.min(cW - CARD_W, startL + dx));
      const newT = Math.max(0, Math.min(cH - CARD_H, startT + dy));

      el.style.left      = newL + 'px';
      el.style.top       = newT + 'px';
      el.style.transform = `rotate(${baseRot}deg) scale(1.04)`;
    };

    const onUp = () => {
      el.classList.remove('dragging');
      el.style.transform = `rotate(${baseRot}deg)`;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });

}