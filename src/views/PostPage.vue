<template>
  <div class="article-page">
    <div v-if="loading" class="loading-state">加载中...</div>

    <div v-else-if="!post" class="loading-state">
      <p>文章未找到</p>
      <router-link to="/" class="back-link">← 返回首页</router-link>
    </div>

    <div v-else class="article-layout">
      <div class="article-left">
        <TableOfContents />
      </div>

      <article class="article-wrapper">
        <header class="article-header">
          <router-link to="/" class="back-btn">← 返回</router-link>
          <h1 class="article-title">{{ post.title }}</h1>
          <div class="article-meta">
            <span>{{ formatDate(post.date) }}</span>
            <span class="dot">·</span>
            <span>{{ post.readingTime }} 分钟</span>
          </div>
          <div v-if="post.tags && post.tags.length" class="article-meta-tags">
            <span v-for="tag in post.tags" :key="tag" class="meta-tag">{{ tag }}</span>
          </div>
        </header>
        <div class="post-content article-content" v-html="post.content"></div>
      </article>

      <div class="article-right">
        <div class="sidebar-block">
          <h3 class="sidebar-title">标签</h3>
          <div class="sidebar-tags" v-if="post.tags && post.tags.length">
            <span v-for="tag in post.tags" :key="tag" class="sidebar-tag">{{ tag }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import TableOfContents from '../components/TableOfContents.vue'
import postsData from '../data/posts.json?url'

const route = useRoute()
const post = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await fetch(postsData)
    const posts = await res.json()
    post.value = posts.find(p => p.slug === route.params.slug) || null
  } catch {
    post.value = null
  } finally {
    loading.value = false
  }
})

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
}
</script>

<style scoped>
.article-page {
  width: 100%;
  padding: 40px 0 80px;
}

.loading-state {
  text-align: center;
  padding: 80px 20px;
  color: var(--text-tertiary);
}

.loading-state .back-link {
  display: inline-block;
  margin-top: 12px;
  color: var(--accent);
  font-weight: 500;
}

/* Three-column layout */
.article-layout {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
  gap: 80px;
  width: 100%;
  align-items: flex-start;
}

.article-left {
  min-width: 0;
}

.article-wrapper {
  min-width: 0;
  max-width: 860px;
}

.article-right {
  min-width: 0;
}

/* Header */
.article-header {
  margin-bottom: 40px;
  padding-bottom: 28px;
  border-bottom: 1px solid var(--border-color);
}

.back-btn {
  display: inline-block;
  font-size: 0.9rem;
  color: var(--text-tertiary);
  font-weight: 500;
  margin-bottom: 20px;
  transition: color 0.2s;
}

.back-btn:hover {
  color: var(--accent);
}

.article-title {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.03em;
  color: var(--text-primary);
  margin-bottom: 14px;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 12px;
}

.dot { color: #D0D5DD; }

.article-meta-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.meta-tag {
  font-size: 0.75rem;
  color: var(--accent);
  font-weight: 500;
  background: var(--accent-subtle);
  padding: 4px 10px;
  border-radius: 2px;
}

/* Sidebar */
.sidebar-title {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  text-transform: uppercase;
  margin-bottom: 14px;
}

.sidebar-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.sidebar-tag {
  font-size: 0.75rem;
  color: var(--accent);
  font-weight: 500;
  background: var(--accent-subtle);
  padding: 4px 10px;
  border-radius: 2px;
}

/* Responsive breakpoints matching reference */
@media (max-width: 1200px) {
  .article-layout {
    grid-template-columns: 180px 1fr 180px;
    gap: 40px;
  }
}

@media (max-width: 960px) {
  .article-layout { grid-template-columns: 1fr; gap: 0; }
  .article-wrapper { max-width: 100%; }
  .article-left { display: none; }
  .article-right { display: none; }
}

@media (max-width: 640px) {
  .article-page { padding: 24px 0 48px; }
  .article-title { font-size: 1.5rem; }
  .article-header { margin-bottom: 28px; padding-bottom: 20px; }
}
</style>
