---
title: "Vue 3 组合式 API 实战笔记"
date: "2026-03-22"
tags: ["Vue", "前端", "JavaScript"]
description: "深入 Vue 3 Composition API 在实际项目中的应用，对比 Options API 的优势与最佳实践。"
---

## 为什么选择组合式 API

Vue 3 的组合式 API（Composition API）提供了一种更灵活的逻辑复用方式。相比 Options API，它解决了一个核心问题：**相关逻辑的聚合**。

### Options API 的问题

在 Options API 中，同一个功能的代码被分散在不同的选项中：

```javascript
// 一个用户列表功能的代码分散在各处
export default {
  data() {
    return { users: [], loading: false, search: '' }
  },
  computed: {
    filteredUsers() { /* ... */ }
  },
  watch: {
    search() { /* ... */ }
  },
  methods: {
    fetchUsers() { /* ... */ }
  }
}
```

### 组合式 API 的解决方案

```javascript
// 相关逻辑被组织在一起
import { ref, computed, watch } from 'vue'

export function useUsers() {
  const users = ref([])
  const loading = ref(false)
  const search = ref('')

  const filteredUsers = computed(() => {
    return users.value.filter(u => u.name.includes(search.value))
  })

  watch(search, () => { /* 搜索逻辑 */ })

  async function fetchUsers() {
    loading.value = true
    users.value = await api.getUsers()
    loading.value = false
  }

  return { users, loading, search, filteredUsers, fetchUsers }
}
```

## setup 语法糖

`<script setup>` 让组合式 API 的使用更加简洁：

```vue
<script setup>
import { ref } from 'vue'
import { useUsers } from './composables/useUsers'

const count = ref(0)
const { users, loading } = useUsers()
</script>
```

## 常用模式

### 自定义 Composables

Composable 是组合式 API 的核心设计模式：

```javascript
// useDebounce.js
import { ref, watch } from 'vue'

export function useDebounce(source, delay = 300) {
  const debounced = ref(source.value)

  watch(source, (val) => {
    const timer = setTimeout(() => {
      debounced.value = val
    }, delay)
  })

  return debounced
}
```

### 响应式状态管理

使用 `provide/inject` 配合 composables 实现轻量状态管理：

```javascript
// store.js
import { reactive, provide, inject } from 'vue'

const STORE_KEY = '__store__'

export function createStore() {
  const state = reactive({ /* ... */ })
  provide(STORE_KEY, state)
}

export function useStore() {
  return inject(STORE_KEY)
}
```

## 总结

组合式 API 不是对 Options API 的替代，而是一种补充。对于简单组件，Options API 仍然直观可用。但在复杂业务场景下，组合式 API 的逻辑复用能力和组织方式显著提升了代码的可维护性。
