<template>
  <div class="tag-cloud" v-if="tags.length">
    <h3 class="cloud-title">标签云</h3>
    <div class="cloud-items">
      <button
        v-for="tag in tags"
        :key="tag.name"
        class="cloud-tag"
        :class="{ active: activeTag === tag.name }"
        :style="{ fontSize: tag.size + 'rem', opacity: tag.opacity, color: tag.color }"
        @click="toggleTag(tag.name)"
      >
        {{ tag.name }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  posts: { type: Array, required: true },
  activeTag: { type: String, default: '' }
})

const emit = defineEmits(['update:activeTag'])

const palette = [
  '#E06C75', '#61AFEF', '#98C379', '#E5C07B'
]

const tags = computed(() => {
  const tagMap = {}
  props.posts.forEach(p => {
    (p.tags || []).forEach(t => {
      tagMap[t] = (tagMap[t] || 0) + 1
    })
  })

  const counts = Object.values(tagMap)
  const maxCount = Math.max(...counts, 1)
  const minCount = Math.min(...counts, 1)

  return Object.entries(tagMap)
    .map(([name, count], i) => {
      const ratio = maxCount === minCount ? 0.5 : (count - minCount) / (maxCount - minCount)
      return {
        name,
        count,
        size: 0.75 + ratio * 0.85,
        opacity: 0.5 + ratio * 0.5,
        color: palette[i % palette.length]
      }
    })
    .sort((a, b) => b.count - a.count)
})

function toggleTag(name) {
  emit('update:activeTag', props.activeTag === name ? '' : name)
}
</script>

<style scoped>
.tag-cloud {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 20px 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
}

.cloud-title {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  text-transform: uppercase;
  margin-bottom: 14px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color);
}

.cloud-items {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 12px;
  align-items: baseline;
}

.cloud-tag {
  color: var(--text-secondary);
  font-weight: 500;
  cursor: pointer;
  transition: color 0.15s;
  line-height: 1.4;
  background: none;
  border: none;
  padding: 0;
  font-family: inherit;
}

.cloud-tag:hover {
  filter: brightness(1.25);
}

.cloud-tag.active {
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 3px;
}
</style>
