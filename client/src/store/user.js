import { defineStore } from 'pinia'
import { userApi } from '@/api'
import { useCartStore } from '@/store/cart'

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null,
        token: localStorage.getItem('token') || null,
    }),

    actions: {
        // Установка пользователя из токена
        setUserFromToken(token) {
            this.token = token
            localStorage.setItem('token', token)
            try {
                const payload = JSON.parse(atob(token.split('.')[1]))
                this.user = {
                    id: payload.id,
                    email: payload.email,
                    role: payload.role,
                }
            } catch (e) {
                this.user = null
            }
        },

        // Регистрация
        async register(email, password, consent) {
            const { data } = await userApi.register({ email, password, personalDataConsent: consent })
            this.setUserFromToken(data.token)
            return data
        },

        // Вход
        async login(email, password) {
            const { data } = await userApi.login({ email, password })
            this.setUserFromToken(data.token)
            return data
        },

        // Проверка токена
        async checkAuth() {
            try {
                const { data } = await userApi.check()
                this.setUserFromToken(data.token)
                return true
            } catch {
                this.logout()
                return false
            }
        },

        // Выход
        logout() {
            this.user = null
            this.token = null
            localStorage.removeItem('token')
            const cartStore = useCartStore()
            cartStore.clear()
        },
    },

    getters: {
        isAuth: (state) => !!state.user,
        isAdmin: (state) => state.user?.role === 'ADMIN',
    },
})