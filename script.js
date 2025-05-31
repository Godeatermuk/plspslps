const canvas = document.getElementById('fightCanvas');
const ctx = canvas.getContext('2d');
const dialogue = document.getElementById('dialogue');
const scoreboard = document.getElementById('scoreboard');
const fightBtn = document.getElementById('fightBtn');

let gameStarted = false;

fightBtn.onclick = () => {
  if (gameStarted) return;
  gameStarted = true;
  fightBtn.style.display = 'none';
  startGame();
};

const player = { x: 240, y: 140, size: 20, speed: 6, hp: 100 };
const bones = [];
const keys = {};
let frameCount = 0;
let score = 0;
let difficultyMultiplier = 1;

document.addEventListener('keydown', e => {
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
    e.preventDefault();
    keys[e.key] = true;
  }
});
document.addEventListener('keyup', e => keys[e.key] = false);

function spawnBone() {
  const y = Math.random() * (canvas.height - 80);
  const speed = (3 + Math.random() * 4) * difficultyMultiplier;
  bones.push({ x: -20, y, width: 20, height: 80, speed });
}

function drawHeart(x, y, size) {
  ctx.fillStyle = 'red';
  ctx.beginPath();
  const topCurveHeight = size * 0.3;
  ctx.moveTo(x, y + topCurveHeight);
  ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
  ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + (size + topCurveHeight) / 2, x, y + size);
  ctx.bezierCurveTo(x, y + (size + topCurveHeight) / 2, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
  ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
  ctx.fill();
}

function update() {
  if (keys['ArrowLeft']) player.x -= player.speed;
  if (keys['ArrowRight']) player.x += player.speed;
  if (keys['ArrowUp']) player.y -= player.speed;
  if (keys['ArrowDown']) player.y += player.speed;

  player.x = Math.max(0, Math.min(canvas.width - player.size, player.x));
  player.y = Math.max(0, Math.min(canvas.height - player.size, player.y));

  frameCount++;
  if (frameCount % 30 === 0) spawnBone();
  if (frameCount % 600 === 0) difficultyMultiplier += 0.25;

  bones.forEach((bone, index) => {
    bone.x += bone.speed;
    if (bone.x > canvas.width) {
      bones.splice(index, 1);
      score += 10;
    }
    if (
      player.x < bone.x + bone.width &&
      player.x + player.size > bone.x &&
      player.y < bone.y + bone.height &&
      player.y + player.size > bone.y
    ) {
      player.hp -= 1;
      dialogue.textContent = "* HP: " + player.hp;
    }
  });

  scoreboard.textContent = "Score: " + score;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawHeart(player.x + player.size / 2 - 10, player.y, player.size);
  ctx.fillStyle = 'cyan';
  bones.forEach(bone => ctx.fillRect(bone.x, bone.y, bone.width, bone.height));
}

function loop() {
  update();
  draw();
  if (player.hp > 0) {
    requestAnimationFrame(loop);
  } else {
    dialogue.textContent = "* you died. Final Score: " + score;
    const tryAgain = document.createElement("button");
    tryAgain.textContent = "Try Again?";
    tryAgain.id = "fightBtn";
    tryAgain.onclick = () => location.reload();
    document.getElementById("game-section").appendChild(tryAgain);
  }
}

function startGame() {
  loop();
}