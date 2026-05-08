<template>
  <div class="page" :class="{ 'page-article': isArticlePage }">
    <NavBar />

    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>

    <SiteFooter v-if="!isArticlePage" />

    <MouseEffect />

    <button
      :class="['back-to-top', { visible: showBackTop }]"
      @click="scrollToTop"
      aria-label="回到顶部"
    >
      ↑
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from './components/NavBar.vue'
import SiteFooter from './components/SiteFooter.vue'
import MouseEffect from './components/MouseEffect.vue'

const route = useRoute()
const isArticlePage = computed(() => route.name === 'Post')
const showBackTop = ref(false)

function onScroll() {
  showBackTop.value = window.scrollY > 400
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style>
/* scoped doesn't work with body-level layout */
.page {
  max-width: var(--content-max);
  margin: 0 auto;
  padding: 0 40px;
}

.page-article {
  max-width: none;
  padding: 0 40px;
}

.back-to-top {
  position: fixed;
  bottom: 32px;
  right: 32px;
  z-index: 50;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #fff;
  border: 1px solid var(--border-strong);
  color: var(--text-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.2s;
  opacity: 0;
  transform: translateY(12px);
  pointer-events: none;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.back-to-top.visible {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.back-to-top:hover {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
  box-shadow: 0 4px 16px rgba(0, 82, 255, 0.2);
}

@media (max-width: 768px) {
  .page, .page-article { padding: 0 24px; }
  .back-to-top { bottom: 20px; right: 20px; }
}
</style>
