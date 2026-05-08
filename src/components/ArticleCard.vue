<template>
  <router-link :to="`/post/${post.slug}`" class="article-card">
    <span class="card-date">{{ formatDate(post.date) }}</span>
    <span class="card-dot">—</span>
    <h3 class="card-title">{{ post.title }}</h3>
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
  align-items: baseline;
  gap: 10px;
  padding: 12px 0;
  color: inherit;
  border-bottom: 1px solid var(--border-color);
  transition: border-color 0.2s;
}

.article-card:first-child { padding-top: 0; }
.article-card:last-child { border-bottom: none; }

.article-card:hover .card-title {
  color: var(--accent);
}

.card-date {
  font-size: 0.8rem;
  color: var(--text-tertiary);
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;
  min-width: 78px;
}

.card-dot {
  color: #C0C7D2;
  font-size: 0.8rem;
  flex-shrink: 0;
}

.card-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.4;
  transition: color 0.15s;
  letter-spacing: -0.2px;
}
</style>
