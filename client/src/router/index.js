import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store/user'

const routes = [
  {
    path: '/',
    name: 'catalog',
    component: () => import('@/views/shop/CatalogPage.vue'),  
  },
  {
    path: '/product/:id',
    name: 'product',
    component: () => import('@/views/shop/ProductPage.vue'),  
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('@/views/shop/CartPage.vue'),     
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/LoginPage.vue'),    
    meta: { guest: true },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/auth/RegisterPage.vue'), 
    meta: { guest: true },
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/views/admin/AdminPage.vue'),   
    meta: { admin: true },
  },
  {
    path: '/admin/create',
    name: 'createProduct',
    component: () => import('@/views/admin/CreateProductPage.vue'), 
    meta: { admin: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Защита маршрутов
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  if (!userStore.isAuth && localStorage.getItem('token')) {
    await userStore.checkAuth()
  }

  if (to.meta.admin && !userStore.isAdmin) {
    next('/')
  } else if (to.meta.guest && userStore.isAuth) {
    next('/')
  } else {
    next()
  }
})

export default router