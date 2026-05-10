<template>
  <div class="lottie-gallery" @click="nextAnimation">
    <div ref="container" class="lottie-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import lottie from 'lottie-web'

const animations = ref([])
const currentIndex = ref(0)
const container = ref(null)
let animInstance = null

function loadAnimation(index) {
  if (animInstance) {
    animInstance.destroy()
    animInstance = null
  }
  if (!container.value || !animations.value.length) return
  animInstance = lottie.loadAnimation({
    container: container.value,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: animations.value[index],
  })
}

function nextAnimation() {
  if (!animations.value.length) return
  currentIndex.value = (currentIndex.value + 1) % animations.value.length
}

watch(currentIndex, (idx) => {
  loadAnimation(idx)
})

onMounted(async () => {
  try {
    const res = await fetch('/my-blog/src/data/animations.json')
    const files = await res.json()
    animations.value = files.map(f => '/my-blog/images/' + encodeURIComponent(f))
  } catch {
    animations.value = []
  }
  if (animations.value.length > 0) {
    loadAnimation(0)
  }
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

@media (max-width: 960px) {
  .lottie-gallery {
    max-width: 140px;
  }
}
</style>
