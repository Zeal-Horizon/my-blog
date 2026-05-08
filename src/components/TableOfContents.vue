<template>
  <div class="toc" v-if="headings.length > 0">
    <h3 class="toc-title">目录</h3>
    <ul class="toc-list">
      <li
        v-for="(h, i) in headings"
        :key="i"
        :class="['toc-item', `toc-level-${h.level}`]"
      >
        <a :href="`#${h.id}`" class="toc-link" @click.prevent="scrollTo(h.id)">
          {{ h.text }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const headings = ref([])

function extract() {
  const container = document.querySelector('.post-content')
  if (!container) return

  const els = container.querySelectorAll('h1, h2, h3')
  headings.value = Array.from(els).map((el, i) => {
    const id = `h-${i}`
    el.id = id
    return { id, text: el.textContent, level: parseInt(el.tagName.charAt(1)) }
  })
}

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

watch(() => route.params.slug, () => nextTick(extract))
onMounted(() => setTimeout(extract, 300))
</script>

<style scoped>
.toc {
  position: sticky;
  top: 40px;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  padding-right: 12px;
}

.toc-title {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  text-transform: uppercase;
  margin-bottom: 16px;
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  border-left: 1px solid var(--border-color);
  padding-left: 16px;
}

.toc-item { line-height: 1.4; }
.toc-level-3 { padding-left: 10px; }

.toc-link {
  color: var(--text-tertiary);
  font-size: 0.8rem;
  font-weight: 400;
  transition: color 0.15s;
  display: block;
}

.toc-link:hover { color: var(--accent); }

.toc-level-2 .toc-link {
  font-weight: 500;
  color: var(--text-secondary);
}
</style>
