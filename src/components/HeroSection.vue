<template>
  <div class="author-section">
    <div class="author-main">
      <div class="author-content">
        <div class="author-top">
          <div class="author-avatar">Z</div>
          <div class="author-headline">
            <span class="author-label">个人博客</span>
            <h1 class="author-name">Zeal_Horizon</h1>
          </div>
        </div>

        <p class="author-bio">
          嵌入式开发工程师，十年从单片机到 Linux 系统的实践经验。
          热爱技术写作与开源分享，关注嵌入式、后端架构与前端探索。
        </p>

        <div class="author-stats">
          <div class="stat-item">
            <span class="stat-value">6</span>
            <span class="stat-label">篇文章</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-value">10</span>
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
        <div class="hero-animation">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="anim-svg">
            <defs>
              <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#0052FF"/>
                <stop offset="100%" stop-color="#00C9FF"/>
              </linearGradient>
            </defs>
            <circle cx="100" cy="100" r="80" fill="none" stroke="url(#g1)" stroke-width="1.5" opacity="0.3">
              <animate attributeName="r" values="80;85;80" dur="4s" repeatCount="indefinite"/>
            </circle>
            <circle cx="100" cy="100" r="55" fill="none" stroke="url(#g1)" stroke-width="1" opacity="0.2">
              <animate attributeName="r" values="55;60;55" dur="3s" repeatCount="indefinite"/>
            </circle>
            <circle cx="100" cy="100" r="30" fill="url(#g1)" opacity="0.08">
              <animate attributeName="r" values="30;35;30" dur="5s" repeatCount="indefinite"/>
            </circle>
            <g opacity="0.15">
              <circle cx="100" cy="30" r="4" fill="#0052FF">
                <animate attributeName="cy" values="30;170;30" dur="10s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="1;0.3;1" dur="10s" repeatCount="indefinite"/>
              </circle>
              <circle cx="60" cy="50" r="3" fill="#00C9FF">
                <animate attributeName="cy" values="50;160;50" dur="8s" repeatCount="indefinite"/>
              </circle>
              <circle cx="140" cy="40" r="3" fill="#0052FF">
                <animate attributeName="cy" values="40;170;40" dur="12s" repeatCount="indefinite"/>
              </circle>
            </g>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

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
  align-items: center;
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

/* Animated SVG */
.hero-animation {
  width: 100%;
  max-width: 200px;
}

.anim-svg {
  width: 100%;
  height: auto;
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
  .hero-animation { max-width: 140px; }
}
</style>
