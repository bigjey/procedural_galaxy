const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const size = 100;
const offset = { x: 0, y: 0 };
const panSpeed = 50 / 1000;

const colors = [
  "#FFEC27",
  "#00E436",
  "#FFA300",
  "#29ADFF",
  "#FFCCAA",
  "#AB5236",
  "#83769C",
  "#FF004D",
];

const urlParams = new URLSearchParams(window.location.search);
const seedParam = parseInt(urlParams.get("seed"));

const seed = Number.isNaN(seedParam) ? 0 : seedParam;

let lastTick = Date.now();
window.requestAnimationFrame(function tick() {
  const dt = Date.now() - lastTick;
  lastTick = Date.now();
  update(dt);
  render();
  window.requestAnimationFrame(tick);
});

const keysPressed = {};
document.addEventListener("keydown", (e) => {
  keysPressed[e.key] = true;
});
document.addEventListener("keyup", (e) => {
  keysPressed[e.key] = false;
});

const mousePos = { x: -1, y: -1 };
window.addEventListener("mousemove", function (e) {
  mousePos.x = Math.floor(e.clientX / size);
  mousePos.y = Math.floor(e.clientY / size);
});

function update(dt) {
  if (keysPressed["a"] || keysPressed["ArrowLeft"]) {
    offset.x -= panSpeed * dt;
  }
  if (keysPressed["d"] || keysPressed["ArrowRight"]) {
    offset.x += panSpeed * dt;
  }
  if (keysPressed["w"] || keysPressed["ArrowUp"]) {
    offset.y -= panSpeed * dt;
  }
  if (keysPressed["s"] || keysPressed["ArrowDown"]) {
    offset.y += panSpeed * dt;
  }
}

function render() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const w = window.innerWidth / size;
  const h = window.innerHeight / size;

  ctx.textAlign = "left";
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const star = new Star(x + parseInt(offset.x), y + parseInt(offset.y));

      if (!star.exists) {
        continue;
      }

      drawCircle(
        x * size + size / 2,
        y * size + size / 2,
        star.diameter,
        star.color
      );

      if (mousePos.x === x && mousePos.y === y) {
        drawCircle(
          x * size + size / 2,
          y * size + size / 2,
          50,
          "#fffb",
          false
        );

        ctx.fillStyle = "#fff";
        ctx.font = "20px Monospace";
        ctx.fillText(
          `Star name: ${star.name}, water: ${star.water}%, planets: ${star.planets}`,
          10,
          canvas.height - 30
        );
      }
    }
  }

  ctx.fillStyle = "#fff";
  ctx.font = "20px Monospace";
  ctx.fillText(`x: ${parseInt(offset.x)}, y: ${parseInt(offset.y)}`, 10, 30);

  ctx.textAlign = "right";
  ctx.fillStyle = "#fff";
  ctx.font = "20px Monospace";
  ctx.fillText(`WASD/Arrows - move, hover star - info`, canvas.width - 10, 30);
}

class Star {
  constructor(x, y) {
    const seedValue = (((x + seed) & 0xffff) << 16) | ((y + seed) & 0xffff);
    const rnd = new Math.seedrandom(seedValue.toString());

    this.exists = rnd() * 20 < 1;

    if (!this.exists) return;

    this.name = seedValue;
    this.diameter = Math.floor(rnd() * 40) + 10;
    this.color = colors[Math.floor(rnd() * colors.length)];
    this.water = Math.floor(rnd() * 90);
    this.planets = Math.floor(rnd() * 10) + 1;
  }
}

function drawCircle(x, y, r, c, fill = true) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.closePath();

  if (fill) {
    ctx.fillStyle = c;
    ctx.fill();
  } else {
    ctx.lineWidth = 2;
    ctx.strokeStyle = c;
    ctx.stroke();
  }
}
