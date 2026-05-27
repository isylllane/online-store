import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
    state: () => ({
        items: [],
    }),

    actions: {
        loadCart() {
            const saved = localStorage.getItem('cart')
            if (saved) this.items = JSON.parse(saved)
        },

        saveCart() {
            localStorage.setItem('cart', JSON.stringify(this.items))
        },

        addItem(device) {
            const exist = this.items.find(i => i.id === device.id)
            if (exist) {
                exist.quantity++
            } else {
                this.items.push({ ...device, quantity: 1 })
            }
            this.saveCart()
        },

        removeItem(id) {
            this.items = this.items.filter(i => i.id !== id)
            this.saveCart()
        },

        updateQuantity(id, quantity) {
            const item = this.items.find(i => i.id === id)
            if (item && quantity >= 1) {
                item.quantity = quantity
                this.saveCart()
            }
        },

        clear() {
            this.items = []
            this.saveCart()
        },
    },

    getters: {
        totalCount: (state) => state.items.reduce((sum, i) => sum + i.quantity, 0),
        totalPrice: (state) => state.items.reduce((sum, i) => sum + (i.price * i.quantity), 0),
    },
})