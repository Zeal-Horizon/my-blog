<template>
  <footer class="footer">
    <span>&copy; 2025 Zeal_Horizon · 个人博客</span>
    <div class="footer-links">
      <a href="https://github.com/user" target="_blank" rel="noopener">GitHub</a>
      <a href="mailto:zeal.horizon@example.com">邮件</a>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  border-top: 1px solid var(--border-color);
  padding: 28px 0 36px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  font-size: 0.9rem;
  color: var(--text-tertiary);
  gap: 12px;
}

.footer-links {
  display: flex;
  gap: 24px;
}

.footer-links a {
  color: var(--text-tertiary);
  font-weight: 500;
  transition: color var(--transition);
}

.footer-links a:hover {
  color: var(--accent);
}
</style>
