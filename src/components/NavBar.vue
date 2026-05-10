<template>
  <nav class="nav">
    <router-link to="/" class="logo-area">
      <span class="logo-mark">Z</span>
      <span class="logo-text">ZH</span>
    </router-link>
    <div class="nav-links">
      <router-link to="/" exact-active-class="active-link">文章</router-link>
      <a href="https://github.com/Zeal-Horizon" target="_blank" rel="noopener">GitHub</a>
    </div>
  </nav>
</template>

<style scoped>
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0 18px;
  border-bottom: 1px solid var(--border-color);
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-mark {
  width: 30px;
  height: 30px;
  background: var(--accent);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 0.9rem;
}

.logo-text {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.3px;
}

.nav-links {
  display: flex;
  gap: 28px;
  align-items: center;
  font-weight: 500;
  font-size: 0.95rem;
}

.nav-links a {
  color: var(--text-secondary);
  transition: color var(--transition);
  letter-spacing: 0.2px;
}

.nav-links a:hover,
.nav-links a.active-link {
  color: var(--accent);
  font-weight: 600;
}

@media (max-width: 640px) {
  .nav-links { gap: 18px; font-size: 0.85rem; }
  .logo-text { font-size: 1rem; }
}
</style>
