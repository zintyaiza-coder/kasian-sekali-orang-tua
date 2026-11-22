const canvas = document.getElementById('sparkle-canvas');
const ctx = canvas.getContext('2d');
const heartWrapper = document.getElementById('heart-wrapper');

const stop1 = document.getElementById('grad-stop-1');
const stop2 = document.getElementById('grad-stop-2');
const stop3 = document.getElementById('grad-stop-3');

let width, height;
let particles = [];
let hue = 340; // Mulai dari warna merah muda/merah

// Sesuaikan ukuran kanvas dengan layar
function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Kelas Partikel Kelap-Kelip
class Sparkle {
  constructor(x, y, isBurst = false) {
    this.x = x ?? Math.random() * width;
    this.y = y ?? Math.random() * height;
    this.size = isBurst ? Math.random() * 4 + 2 : Math.random() * 2.5 + 0.8;
    this.speedX = isBurst ? (Math.random() - 0.5) * 6 : (Math.random() - 0.5) * 0.4;
    this.speedY = isBurst ? (Math.random() - 0.5) * 6 : (Math.random() - 0.5) * 0.4 - 0.3;
    this.alpha = Math.random();
    this.blinkSpeed = Math.random() * 0.04 + 0.015;
    this.isBurst = isBurst;
    this.life = 1;
    this.particleHue = (hue + (Math.random() * 40 - 20)) % 360;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.isBurst) {
      this.life -= 0.02;
      this.alpha = Math.max(0, this.life);
    } else {
      this.alpha += this.blinkSpeed;
      if (this.alpha >= 1 || this.alpha <= 0.1) {
        this.blinkSpeed *= -1;
      }
      // Kembalikan partikel jika keluar layar
      if (this.y < 0) this.y = height;
      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
    }
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = `hsl(${this.particleHue}, 100%, 75%)`;
    ctx.shadowBlur = 10;
    ctx.shadowColor = `hsl(${this.particleHue}, 100%, 60%)`;

    // Gambar bentuk bintang 4 sudut
    ctx.beginPath();
    ctx.moveTo(this.x, this.y - this.size * 2);
    ctx.quadraticCurveTo(this.x, this.y, this.x + this.size * 2, this.y);
    ctx.quadraticCurveTo(this.x, this.y, this.x, this.y + this.size * 2);
    ctx.quadraticCurveTo(this.x, this.y, this.x - this.size * 2, this.y);
    ctx.quadraticCurveTo(this.x, this.y, this.x, this.y - this.size * 2);
    ctx.fill();
    ctx.restore();
  }
}

// Buat partikel latar belakang awal
for (let i = 0; i < 70; i++) {
  particles.push(new Sparkle());
}

// Ledakan kilau saat hati diklik
heartWrapper.addEventListener('click', (e) => {
  for (let i = 0; i < 25; i++) {
    particles.push(new Sparkle(e.clientX, e.clientY, true));
  }
});

// Fungsi utama untuk mengubah warna otomatis & animasi partikel
function animate() {
  ctx.clearRect(0, 0, width, height);

  // Putar spektrum warna (Hue 0 - 360) secara otomatis
  hue = (hue + 0.6) % 360;

  const lightColor = `hsl(${hue}, 100%, 78%)`;
  const mainColor  = `hsl(${hue}, 100%, 55%)`;
  const darkColor  = `hsl(${hue}, 100%, 28%)`;
  const softGlow   = `hsla(${hue}, 100%, 55%, 0.55)`;

  // Terapkan warna ke gradien hati & variabel CSS
  stop1.setAttribute('stop-color', lightColor);
  stop2.setAttribute('stop-color', mainColor);
  stop3.setAttribute('stop-color', darkColor);

  document.documentElement.style.setProperty('--glow-color', mainColor);
  document.documentElement.style.setProperty('--glow-soft', softGlow);

  // Render dan perbarui semua partikel
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].draw();

    if (particles[i].isBurst && particles[i].life <= 0) {
      particles.splice(i, 1);
    }
  }

  requestAnimationFrame(animate);
}

animate();
