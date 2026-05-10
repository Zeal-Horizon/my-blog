<template>
  <router-link :to="`/post/${post.slug}`" class="article-card">
    <div class="card-main">
      <span class="card-date">{{ formatDate(post.date) }}</span>
      <h3 class="card-title">{{ post.title }}</h3>
    </div>
    <div v-if="post.tags && post.tags.length" class="card-tags">
      <span v-for="tag in post.tags" :key="tag" class="card-tag">{{ tag }}</span>
    </div>
  </router-link>
</template>

<script setup>
defineProps({ post: { type: Object, required: true } })

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}.${m}.${day}`
}
</script>

<style scoped>
.article-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 0;
  color: inherit;
  border-bottom: 1px solid var(--border-color);
  transition: all 0.2s;
}

.article-card:first-child { padding-top: 0; }
.article-card:last-child { border-bottom: none; }

.article-card:hover .card-title {
  color: var(--accent);
}

.card-main {
  display: flex;
  align-items: baseline;
  gap: 14px;
  min-width: 0;
  flex: 1;
}

.card-date {
  font-size: 0.8rem;
  color: var(--text-tertiary);
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;
  min-width: 78px;
}

.card-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.4;
  transition: color 0.15s;
  letter-spacing: -0.2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-tags {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}

.card-tag {
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--accent);
  background: var(--accent-subtle);
  padding: 2px 10px;
  border-radius: 100px;
  white-space: nowrap;
  letter-spacing: 0.2px;
}

@media (max-width: 640px) {
  .article-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
  .card-main {
    gap: 10px;
  }
  .card-tags {
    margin-left: 92px;
  }
}
</style>
