<template>
  <div class="author-section">
    <div class="author-main">
      <div class="author-content">
        <div class="author-top">
          <div class="author-avatar">Z</div>
          <div class="author-headline">
            <span class="author-label">个人博客</span>
            <h1 class="author-name">ZH</h1>
            <p class="author-subtitle">竹杖芒鞋轻胜马，谁怕？一蓑烟雨任平生。</p>
          </div>
        </div>

        <p class="author-bio">
          嵌入式软开工程师，练习时常3年，从单片机到 Linux 系统的实践经验。
          热爱技术写作与开源分享，关注嵌入式、后端架构与前端探索。
        </p>

        <div class="author-stats">
          <div class="stat-item">
            <span class="stat-value">6</span>
            <span class="stat-label">篇文章</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-value">3</span>
            <span class="stat-label">年经验</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-value">12</span>
            <span class="stat-label">个项目</span>
          </div>
        </div>
      </div>

      <div class="author-media">
        <LottieGallery />
      </div>
    </div>
  </div>
</template>

<script setup>
import LottieGallery from './LottieGallery.vue'
</script>

<style scoped>
.author-section {
  padding: 56px 0 48px;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 44px;
}

.author-main {
  display: flex;
  align-items: flex-start;
  gap: 80px;
  position: relative;
}

.author-content {
  flex: 1;
  max-width: 700px;
}

.author-media {
  flex-shrink: 0;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  margin-left: auto;
  padding-top: 4px;
}

.author-top {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 24px;
}

.author-avatar {
  width: 52px;
  height: 52px;
  background: var(--accent);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
  border-radius: 50%;
  flex-shrink: 0;
}

.author-headline {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.author-subtitle {
  font-size: 0.9rem;
  color: var(--text-tertiary);
  font-weight: 400;
  letter-spacing: 0.3px;
  margin-top: 2px;
  font-style: italic;
}

.author-label {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: var(--accent);
  text-transform: uppercase;
}

.author-name {
  font-size: 2.2rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--text-primary);
  line-height: 1.1;
}

.author-bio {
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.85;
  margin-bottom: 24px;
  max-width: 100%;
}

.author-stats {
  display: inline-flex;
  align-items: center;
  padding: 10px 0;
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
}

.stat-item {
  display: flex;
  align-items: baseline;
  gap: 6px;
  padding: 0 16px;
}

.stat-item:first-child {
  padding-left: 0;
}

.stat-divider {
  width: 1px;
  height: 14px;
  background: var(--border-strong);
}

.stat-value {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
}

.stat-label {
  font-size: 0.8rem;
  color: var(--text-tertiary);
  font-weight: 500;
}

@media (max-width: 960px) {
  .author-main {
    flex-direction: column;
    gap: 32px;
    align-items: flex-start;
  }
  .author-content { max-width: 100%; }
  .author-media {
    margin-left: 0;
    justify-content: flex-start;
    padding-top: 0;
  }
}

@media (max-width: 640px) {
  .author-section { padding: 40px 0 32px; }
  .author-name { font-size: 1.6rem; }
  .author-bio { font-size: 0.95rem; }
  .author-avatar { width: 44px; height: 44px; font-size: 0.9rem; }
}
</style>
