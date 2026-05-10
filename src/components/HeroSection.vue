<template>
  <div class="author-section">
    <div class="author-main">
      <div class="author-content">
        <div class="author-top">
          <div class="author-avatar">
            <img :src="avatarSrc" alt="ZH" class="avatar-img" />
          </div>
          <div class="author-headline">
            <span class="author-label">个人博客</span>
            <h1 class="author-name">ZH</h1>
            <p class="author-subtitle">惟江上之清风，与山间之明月。</p>
          </div>
        </div>

        <p class="author-bio">
          练习时长3年半的嵌入式软开程序员<br />
          以代码为日常，以热爱抵漫长。<br />
          喜欢代码构筑的虚拟世界，也爱人间烟火。
        </p>
      </div>

      <div class="author-media">
        <LottieGallery />
      </div>
    </div>
  </div>
</template>

<script setup>
import LottieGallery from './LottieGallery.vue'

const avatarSrc = '/my-blog/avatar/avatar.jpg'
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
  border-radius: 50%;
  flex-shrink: 0;
  overflow: hidden;
  border: 2px solid var(--border-color);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
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
  margin-bottom: 0;
  max-width: 100%;
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
  .author-avatar { width: 44px; height: 44px; }
}
</style>
