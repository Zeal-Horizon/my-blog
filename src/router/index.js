import { createRouter, createWebHashHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import PostPage from '../views/PostPage.vue'

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/post/:slug', name: 'Post', component: PostPage },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
