<template>
  <div>
    <HeroSection />

    <div class="content-layout">
      <div class="content-main">
        <div class="article-list-wrapper" v-if="filteredPosts.length">
          <div class="section-header">
            <h2 class="section-title">文章目录</h2>
            <span class="section-count">{{ filteredPosts.length }} 篇</span>
          </div>

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

          <div class="article-list">
            <ArticleCard v-for="post in filteredPosts" :key="post.slug" :post="post" />
          </div>
        </div>
      </div>

      <aside class="content-side">
        <TagCloud :posts="posts" :activeTag="activeCategory" @update:activeTag="activeCategory = $event" />
        <CalendarWidget :postDates="postDates" />
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import HeroSection from '../components/HeroSection.vue'
import ArticleCard from '../components/ArticleCard.vue'
import TagCloud from '../components/TagCloud.vue'
import CalendarWidget from '../components/CalendarWidget.vue'
import postsData from '../data/posts.json?url'

const posts = ref([])
const activeCategory = ref('')

onMounted(async () => {
  try {
    const res = await fetch(postsData)
    posts.value = await res.json()
  } catch {
    posts.value = []
  }
})

const categories = computed(() => {
  const catMap = {}
  posts.value.forEach(p => {
    if (p.category) {
      catMap[p.category] = (catMap[p.category] || 0) + 1
    }
  })
  return Object.entries(catMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
})

const postDates = computed(() => posts.value.map(p => p.date).filter(Boolean))

const filteredPosts = computed(() => {
  if (!activeCategory.value) return posts.value
  return posts.value.filter(p => p.category === activeCategory.value)
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

.content-side {
}

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
