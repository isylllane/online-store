<template>
  <v-row align="center" justify="center" class="fill-height">
    <v-col cols="12" sm="8" md="5" lg="4">
      <v-card class="elevation-12 rounded-lg">
        <v-toolbar color="primary" dark flat rounded-t-lg>
          <v-toolbar-title class="text-h5">
            <v-icon start>mdi-login</v-icon>
            Вход в аккаунт
          </v-toolbar-title>
        </v-toolbar>

        <v-card-text class="pa-6">
          <v-form ref="form" v-model="valid">
            <v-text-field
                v-model="email"
                label="Email"
                type="email"
                variant="outlined"
                prepend-inner-icon="mdi-email"
                :rules="emailRules"
                required
            />

            <v-text-field
                v-model="password"
                label="Пароль"
                type="password"
                variant="outlined"
                prepend-inner-icon="mdi-lock"
                :rules="passwordRules"
                required
                @keyup.enter="handleLogin"
            />
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-6 pt-0">
          <v-spacer />
          <v-btn
              color="primary"
              size="large"
              :loading="loading"
              :disabled="!valid"
              @click="handleLogin"
          >
            Войти
            <v-icon end>mdi-arrow-right</v-icon>
          </v-btn>
        </v-card-actions>

        <v-divider />

        <v-card-text class="text-center pa-4">
          Нет аккаунта?
          <router-link to="/register" class="text-primary">
            Зарегистрироваться
          </router-link>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { useNotificationStore } from '@/store/notification'

const router = useRouter()
const userStore = useUserStore()
const notification = useNotificationStore()

const email = ref('')
const password = ref('')
const valid = ref(false)
const loading = ref(false)

const emailRules = [
  v => !!v || 'Email обязателен',
  v => /.+@.+\..+/.test(v) || 'Введите корректный email',
]
const passwordRules = [v => !!v || 'Введите пароль']

const handleLogin = async () => {
  loading.value = true
  try {
    await userStore.login(email.value, password.value)
    notification.showMessage('Добро пожаловать!', 'success')
    router.push('/')
  } catch (error) {
    const msg = error.response?.data?.message || 'Ошибка входа'
    notification.showMessage(msg, 'error')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.fill-height {
  min-height: calc(100vh - 64px);
}
</style>