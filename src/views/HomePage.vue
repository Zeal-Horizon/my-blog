<template>
  <div>
    <HeroSection />

    <div class="content-layout">
      <div class="content-main">
        <div class="section-header">
          <h2 class="section-title">文章目录</h2>
          <span class="section-count">{{ filteredPosts.length }} 篇</span>
        </div>

        <!-- Category Tabs -->
        <div class="category-tabs" v-if="categories.length">
          <button
            v-for="cat in categories"
            :key="cat.name"
            class="cat-tab"
            :class="{ active: activeCategory === cat.name }"
            @click="toggleCategory(cat.name)"
          >
            {{ cat.name }}
            <span class="cat-count">{{ cat.count }}</span>
          </button>
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
        <TagCloud :posts="posts" :activeTag="activeCategory" @update:activeTag="activeCategory = $event" />
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
const activeCategory = ref('')

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

const categories = computed(() => {
  const catMap = {}
  posts.value.forEach(p => {
    (p.tags || []).forEach(t => {
      catMap[t] = (catMap[t] || 0) + 1
    })
  })
  return Object.entries(catMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
})

const filteredPosts = computed(() => {
  if (!activeCategory.value) return posts.value
  return posts.value.filter(p => (p.tags || []).includes(activeCategory.value))
})

function toggleCategory(name) {
  activeCategory.value = activeCategory.value === name ? '' : name
}
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

/* Category Tabs */
.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.cat-tab {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 14px;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text-secondary);
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 100px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.cat-tab:hover {
  color: var(--accent);
  border-color: var(--accent);
  background: var(--accent-subtle);
}

.cat-tab.active {
  color: #fff;
  background: var(--accent);
  border-color: var(--accent);
}

.cat-count {
  font-size: 0.7rem;
  opacity: 0.7;
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
  .category-tabs {
    gap: 6px;
  }
  .cat-tab {
    padding: 4px 12px;
    font-size: 0.75rem;
  }
}
</style>
