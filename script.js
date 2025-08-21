/* ---------------- Celebration Animation ---------------- */
const btn = document.getElementById("celebrateBtn");
const balloonContainer = document.getElementById("balloon-container");
const confettiCanvas = document.getElementById("confettiCanvas");
const ctx = confettiCanvas.getContext("2d");

confettiCanvas.width = window.innerWidth;
confettiCanvas.height = window.innerHeight;

btn.addEventListener("click", () => {
  createManyBalloons(50);
  launchConfetti();
});

function createManyBalloons(count) {
  for (let i = 0; i < count; i++) {
    const balloon = document.createElement("div");
    balloon.classList.add("balloon");

    const colors = ["#ff4fb5", "#ffcc00", "#00c2ff", "#8a2be2", "#ff6347"];
    const size = Math.random() * 40 + 40;
    balloon.style.width = `${size}px`;
    balloon.style.height = `${size * 1.3}px`;
    balloon.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)];
    balloon.style.left = Math.random() * 100 + "vw";
    balloon.style.animationDuration = 4 + Math.random() * 4 + "s";

    balloonContainer.appendChild(balloon);

    setTimeout(() => {
      balloon.remove();
    }, 8000);
  }
}

/* Confetti Effect */
function launchConfetti() {
  let confettiPieces = [];

  for (let i = 0; i < 200; i++) {
    confettiPieces.push({
      x: confettiCanvas.width / 2,
      y: confettiCanvas.height / 2,
      r: Math.random() * 6 + 2,
      d: Math.random() * 100,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      tilt: Math.random() * 10 - 10,
      tiltAngleIncremental: Math.random() * 0.07 + 0.05,
      tiltAngle: 0
    });
  }

  function draw() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettiPieces.forEach((p) => {
      ctx.beginPath();
      ctx.lineWidth = p.r;
      ctx.strokeStyle = p.color;
      ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
      ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
      ctx.stroke();
    });
    update();
  }

  function update() {
    confettiPieces.forEach((p, index) => {
      p.tiltAngle += p.tiltAngleIncremental;
      p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
      p.x += Math.sin(p.d);
      p.tilt = Math.sin(p.tiltAngle - index / 3) * 15;

      if (p.y > confettiCanvas.height) {
        p.x = Math.random() * confettiCanvas.width;
        p.y = -10;
      }
    });
  }

  function animate() {
    draw();
    requestAnimationFrame(animate);
  }
  animate();
}

/* ---------------- Google Sheet Wish Form ---------------- */
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxF3Kb7-nyY-72zYnoinATw1JKiViu2zOyn-e8ZiUnxqaJ_GjIr49_ATxdB8LdOGFddeQ/exec";

const form = document.getElementById("wishForm");
const statusEl = document.getElementById("wishStatus");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  statusEl.style.display = "none";

  const name = document.getElementById("name").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !message) {
    statusEl.textContent = "⚠️ Please enter both name and message!";
    statusEl.style.display = "block";
    return;
  }

  try {
    const res = await fetch(WEB_APP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `name=${encodeURIComponent(name)}&message=${encodeURIComponent(message)}`
    });

    const data = await res.json();

    if (data.ok) {
      form.reset();
      statusEl.textContent = "✅ Wish saved to Google Sheet!";
    } else {
      statusEl.textContent = "⚠️ Error: " + (data.error || "Could not save wish");
    }
    statusEl.style.display = "block";
  } catch (err) {
    statusEl.textContent = "❌ Network Error: " + err.message;
    statusEl.style.display = "block";
  }
});
