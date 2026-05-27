import { defineStore } from 'pinia'

export const useNotificationStore = defineStore('notification', {
    state: () => ({
        show: false,
        message: '',
        color: 'success',
    }),

    actions: {
        // Метод showMessage (а не show!)
        showMessage(msg, color = 'success') {
            this.message = msg
            this.color = color
            this.show = true

            setTimeout(() => {
                this.show = false
            }, 3000)
        },

        hide() {
            this.show = false
        },
    },
})