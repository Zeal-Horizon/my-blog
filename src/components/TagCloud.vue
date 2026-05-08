<template>
  <div class="tag-cloud" v-if="tags.length">
    <h3 class="cloud-title">标签云</h3>
    <div class="cloud-items">
      <button
        v-for="tag in tags"
        :key="tag.name"
        class="cloud-tag"
        :class="{ active: activeTag === tag.name }"
        :style="{ fontSize: tag.size + 'rem', opacity: tag.opacity }"
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
    .map(([name, count]) => {
      const ratio = maxCount === minCount ? 0.5 : (count - minCount) / (maxCount - minCount)
      return {
        name,
        count,
        size: 0.75 + ratio * 0.85,
        opacity: 0.5 + ratio * 0.5
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
  padding: 0;
}

.cloud-title {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  text-transform: uppercase;
  margin-bottom: 14px;
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
  color: var(--accent);
}

.cloud-tag.active {
  color: var(--accent);
  font-weight: 700;
}
</style>
