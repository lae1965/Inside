import {
  createRouter,
  createWebHistory,
  type NavigationGuardNext,
  type RouteLocationNormalized
} from 'vue-router'

import ChatsList from '@/components/ChatsList.vue'
import ContentChat from '@/components/ContentChat.vue'
import UserAuth from '@/components/UserAuth.vue'
import UserLogin from '@/components/UserLogin.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'chats-list',
      component: ChatsList,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/chat',
      name: 'chat',
      component: ContentChat,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: UserLogin
    },
    {
      path: '/auth',
      name: 'auth',
      component: UserAuth
    }
  ]
})

const isAuth = (): boolean => !!window.localStorage.getItem('token')
router.beforeEach(
  (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    if (to.matched.some((route) => route.meta?.requiresAuth)) {
      if (isAuth()) next()
      else next('/login')
    } else next()
  }
)

export default router
