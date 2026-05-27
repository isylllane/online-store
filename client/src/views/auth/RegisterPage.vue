<template>
  <v-row align="center" justify="center" class="fill-height">
    <v-col cols="12" sm="8" md="5" lg="4">
      <v-card class="elevation-12 rounded-lg">
        <v-toolbar color="primary" dark flat rounded-t-lg>
          <v-toolbar-title class="text-h5">
            <v-icon start>mdi-account-plus</v-icon>
            Регистрация
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
            />

            <v-text-field
                v-model="confirmPassword"
                label="Подтвердите пароль"
                type="password"
                variant="outlined"
                prepend-inner-icon="mdi-lock-check"
                :rules="confirmRules"
                required
            />

            <v-checkbox
                v-model="consent"
                color="primary"
                :rules="[v => !!v || 'Необходимо согласие']"
            >
              <template v-slot:label>
                Я согласен на обработку персональных данных
              </template>
            </v-checkbox>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-6 pt-0">
          <v-spacer />
          <v-btn
              color="primary"
              size="large"
              :loading="loading"
              :disabled="!valid"
              @click="handleRegister"
          >
            Зарегистрироваться
            <v-icon end>mdi-check</v-icon>
          </v-btn>
        </v-card-actions>

        <v-divider />

        <v-card-text class="text-center pa-4">
          Уже есть аккаунт?
          <router-link to="/login" class="text-primary">
            Войти
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
const confirmPassword = ref('')
const consent = ref(false)
const valid = ref(false)
const loading = ref(false)

const emailRules = [
  v => !!v || 'Email обязателен',
  v => /.+@.+\..+/.test(v) || 'Введите корректный email',
]
const passwordRules = [
  v => !!v || 'Введите пароль',
  v => v.length >= 6 || 'Пароль должен быть минимум 6 символов',
]
const confirmRules = [
  v => !!v || 'Подтвердите пароль',
  v => v === password.value || 'Пароли не совпадают',
]

const handleRegister = async () => {
  loading.value = true
  try {
    await userStore.register(email.value, password.value, consent.value)
    notification.showMessage('Регистрация успешна!', 'success')
    router.push('/')
  } catch (error) {
    const msg = error.response?.data?.message || 'Ошибка регистрации'
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