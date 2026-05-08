<template>
  <canvas ref="canvas" class="mouse-effect" />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvas = ref(null)
let ctx = null
let particles = []
let mouse = { x: -1000, y: -1000 }
let rafId = null

const COLORS = ['#0052FF', '#3B82F6', '#00C9FF', '#2970FF']

class Particle {
  constructor(x, y, burst = false) {
    this.x = x
    this.y = y
    this.burst = burst

    if (burst) {
      const angle = Math.random() * Math.PI * 2
      const speed = 1 + Math.random() * 4
      this.vx = Math.cos(angle) * speed
      this.vy = Math.sin(angle) * speed
      this.life = 1.0
      this.decay = 0.008 + Math.random() * 0.015
      this.size = 2 + Math.random() * 3
    } else {
      this.vx = (Math.random() - 0.5) * 0.6
      this.vy = (Math.random() - 0.5) * 0.6 - 0.2
      this.life = 1.0
      this.decay = 0.012 + Math.random() * 0.012
      this.size = 1.5 + Math.random() * 2.5
    }

    this.color = COLORS[Math.floor(Math.random() * COLORS.length)]
  }

  update() {
    this.x += this.vx
    this.y += this.vy
    this.vx *= 0.98
    this.vy *= 0.98
    this.life -= this.decay
  }

  draw(ctx) {
    const alpha = Math.max(0, this.life)
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size * alpha, 0, Math.PI * 2)
    ctx.fillStyle = this.color
    ctx.globalAlpha = alpha * (this.burst ? 0.7 : 0.4)
    ctx.fill()
  }
}

function spawnTrail(count = 1) {
  for (let i = 0; i < count; i++) {
    const ox = (Math.random() - 0.5) * 14
    const oy = (Math.random() - 0.5) * 14
    particles.push(new Particle(mouse.x + ox, mouse.y + oy, false))
  }
}

function spawnBurst(x, y) {
  for (let i = 0; i < 24; i++) {
    particles.push(new Particle(x, y, true))
  }
}

function loop() {
  if (!ctx) return
  const w = window.innerWidth
  const h = window.innerHeight

  // Clear with trail fade
  ctx.clearRect(0, 0, w, h)

  // Spawn trail particles on movement
  if (mouse.x > 0 && mouse.y > 0) {
    spawnTrail(1)
  }

  // Update & draw
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i]
    p.update()
    p.draw(ctx)
    if (p.life <= 0) {
      particles.splice(i, 1)
    }
  }

  // Cap particles
  if (particles.length > 300) {
    particles.splice(0, particles.length - 300)
  }

  rafId = requestAnimationFrame(loop)
}

function onMouseMove(e) {
  mouse.x = e.clientX
  mouse.y = e.clientY
}

function onMouseLeave() {
  mouse.x = -1000
  mouse.y = -1000
}

function onClick(e) {
  spawnBurst(e.clientX, e.clientY)
}

function resize() {
  if (!canvas.value) return
  canvas.value.width = window.innerWidth
  canvas.value.height = window.innerHeight
}

onMounted(() => {
  if (!canvas.value) return
  ctx = canvas.value.getContext('2d')
  resize()
  window.addEventListener('resize', resize)
  window.addEventListener('mousemove', onMouseMove, { passive: true })
  window.addEventListener('mouseleave', onMouseLeave, { passive: true })
  window.addEventListener('click', onClick, { passive: true })
  loop()
})

onUnmounted(() => {
  window.removeEventListener('resize', resize)
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseleave', onMouseLeave)
  window.removeEventListener('click', onClick)
  if (rafId) cancelAnimationFrame(rafId)
  particles = []
})
</script>

<style scoped>
.mouse-effect {
  position: fixed;
  inset: 0;
  z-index: 99999;
  pointer-events: none;
}
</style>
