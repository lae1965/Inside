import { createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'chats-list',
      component: () => import('@/components/ChatsList.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/chat',
      name: 'chat',
      component: () => import('@/components/ContentChat.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/components/UserLogin.vue')
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('@/components/UserAuth.vue')
    }
  ]
})

router.beforeEach((to: RouteLocationNormalized) => {
  if (to.meta?.requiresAuth && !window.localStorage.getItem('token')) return { name: 'login' }
})

export default router
