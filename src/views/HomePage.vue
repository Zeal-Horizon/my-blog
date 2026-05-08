<template>
  <div>
    <HeroSection />

    <div class="content-layout">
      <div class="content-main">
        <div class="section-header">
          <h2 class="section-title">文章目录</h2>
          <span class="section-count">{{ filteredPosts.length }} 篇</span>
        </div>

        <div v-if="loading" class="loading-state">加载中...</div>
        <div v-else-if="filteredPosts.length === 0" class="loading-state">暂无文章</div>
        <div v-else class="article-list-wrapper">
          <div class="article-list">
            <ArticleCard v-for="post in filteredPosts" :key="post.slug" :post="post" />
          </div>
        </div>
      </div>

      <aside class="content-side">
        <TagCloud :posts="posts" :activeTag="activeTag" @update:activeTag="activeTag = $event" />
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import HeroSection from '../components/HeroSection.vue'
import ArticleCard from '../components/ArticleCard.vue'
import TagCloud from '../components/TagCloud.vue'
import postsData from '../data/posts.json?url'

const posts = ref([])
const loading = ref(true)
const activeTag = ref('')

onMounted(async () => {
  try {
    const res = await fetch(postsData)
    posts.value = await res.json()
  } catch {
    posts.value = []
  } finally {
    loading.value = false
  }
})

const filteredPosts = computed(() => {
  if (!activeTag.value) return posts.value
  return posts.value.filter(p => (p.tags || []).includes(activeTag.value))
})
</script>

<style scoped>
.content-layout {
  display: grid;
  grid-template-columns: 1fr 240px;
  gap: 64px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 20px;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
}

.section-count {
  font-size: 0.85rem;
  color: var(--text-tertiary);
  font-weight: 500;
}

.article-list-wrapper {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 24px 28px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
}

.article-list {
  display: flex;
  flex-direction: column;
}

.content-side {
  padding-top: 38px;
}

.loading-state {
  text-align: center;
  padding: 48px 0;
  color: var(--text-tertiary);
  font-size: 0.95rem;
}

@media (max-width: 768px) {
  .content-layout {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  .content-side {
    padding-top: 0;
    order: -1;
  }
  .article-list-wrapper {
    padding: 20px;
  }
}
</style>
