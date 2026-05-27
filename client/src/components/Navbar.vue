<template>
  <v-app-bar color="primary" dark app>
    <v-app-bar-title>
      <router-link to="/" style="color: white; text-decoration: none">
        TechStore
      </router-link>
    </v-app-bar-title>

    <v-spacer />

    <v-btn variant="text" to="/">
      <v-icon start>mdi-home</v-icon>
      Каталог
    </v-btn>

    <v-btn variant="text" to="/cart">
      <v-icon start>mdi-cart</v-icon>
      Корзина
      <v-badge
          v-if="cartStore.totalCount"
          color="red"
          :content="cartStore.totalCount"
          inline
      />
    </v-btn>

    <template v-if="userStore.isAuth">
      <v-btn v-if="userStore.isAdmin" variant="text" to="/admin">
        <v-icon start>mdi-account</v-icon>
        Админ
      </v-btn>
      <v-btn variant="text" @click="logout">
        <v-icon start>mdi-logout</v-icon>
        Выйти
      </v-btn>
    </template>

    <template v-else>
      <v-btn variant="text" to="/login">Войти</v-btn>
      <v-btn variant="text" to="/register">Регистрация</v-btn>
    </template>
  </v-app-bar>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { useCartStore } from '@/store/cart'

const router = useRouter()
const userStore = useUserStore()
const cartStore = useCartStore()

const logout = () => {
  userStore.logout()
  router.push('/')
}
</script>