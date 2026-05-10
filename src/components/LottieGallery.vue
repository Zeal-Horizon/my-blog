<template>
  <div class="lottie-gallery" @click="nextAnimation">
    <div ref="container" class="lottie-container"></div>
    <div class="gallery-indicator">
      <span
        v-for="(_, i) in animations"
        :key="i"
        class="dot"
        :class="{ active: currentIndex === i }"
      ></span>
    </div>
    <p class="gallery-hint">点击切换</p>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import lottie from 'lottie-web'

const animations = [
  '/my-blog/animations/pulse.json',
  '/my-blog/animations/bounce.json',
  '/my-blog/animations/spin.json',
]

const currentIndex = ref(0)
const container = ref(null)
let animInstance = null

function loadAnimation(index) {
  if (animInstance) {
    animInstance.destroy()
    animInstance = null
  }
  if (!container.value) return
  animInstance = lottie.loadAnimation({
    container: container.value,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: animations[index],
  })
}

function nextAnimation() {
  currentIndex.value = (currentIndex.value + 1) % animations.length
}

watch(currentIndex, (idx) => {
  loadAnimation(idx)
})

onMounted(() => {
  loadAnimation(0)
})

onUnmounted(() => {
  if (animInstance) {
    animInstance.destroy()
    animInstance = null
  }
})
</script>

<style scoped>
.lottie-gallery {
  width: 100%;
  max-width: 200px;
  cursor: pointer;
  user-select: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.lottie-container {
  width: 100%;
  aspect-ratio: 1;
}

.lottie-container :deep(svg) {
  width: 100%;
  height: 100%;
}

.gallery-indicator {
  display: flex;
  gap: 6px;
  align-items: center;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--border-strong);
  transition: all 0.3s;
}

.dot.active {
  width: 20px;
  border-radius: 3px;
  background: var(--accent);
}

.gallery-hint {
  font-size: 0.7rem;
  color: var(--text-muted);
  letter-spacing: 0.4px;
}

@media (max-width: 960px) {
  .lottie-gallery {
    max-width: 140px;
  }
}
</style>
