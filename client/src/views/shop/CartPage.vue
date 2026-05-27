<template>
  <div>
    <h1 class="text-h4 font-weight-bold mb-6">Корзина</h1>

    <v-row v-if="cartStore.items.length">
      <v-col cols="12" md="8">
        <v-card v-for="item in cartStore.items" :key="item.id" class="mb-4" elevation="2">
          <v-list-item>
            <template v-slot:prepend>
              <v-img
                  :src="`/api/img/${item.img}`"
                  width="100"
                  height="100"
                  cover
                  class="rounded"
              />
            </template>

            <v-list-item-title class="text-h6">
              {{ item.name }}
            </v-list-item-title>

            <v-list-item-subtitle>
              {{ item.price.toLocaleString() }} ₽ за шт.
            </v-list-item-subtitle>

            <template v-slot:append>
              <div class="d-flex align-center">
                <v-btn
                    icon="mdi-minus"
                    variant="outlined"
                    size="small"
                    @click="updateQuantity(item.id, item.quantity - 1)"
                />
                <span class="mx-3 text-h6">{{ item.quantity }}</span>
                <v-btn
                    icon="mdi-plus"
                    variant="outlined"
                    size="small"
                    @click="updateQuantity(item.id, item.quantity + 1)"
                />
                <v-btn
                    icon="mdi-delete"
                    variant="text"
                    color="error"
                    class="ml-4"
                    @click="removeItem(item.id)"
                />
              </div>
            </template>
          </v-list-item>

          <v-divider />

          <v-card-text class="text-right">
            <span class="text-h6">Итого: </span>
            <span class="text-h5 text-primary font-weight-bold">
              {{ (item.price * item.quantity).toLocaleString() }} ₽
            </span>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card elevation="3" class="pa-4">
          <h3 class="text-h5 mb-4">Итого</h3>
          <v-divider class="mb-4" />

          <div class="d-flex justify-space-between mb-2">
            <span>Товаров:</span>
            <span class="font-weight-bold">{{ cartStore.totalCount }} шт.</span>
          </div>

          <div class="d-flex justify-space-between text-h6 mb-4">
            <span>Сумма:</span>
            <span class="text-primary font-weight-bold">
              {{ cartStore.totalPrice.toLocaleString() }} ₽
            </span>
          </div>

          <v-btn
              color="success"
              size="large"
              block
              class="mb-3"
              @click="checkout"
          >
            <v-icon start>mdi-checkout</v-icon>
            Оформить заказ
          </v-btn>

          <v-btn
              variant="outlined"
              color="error"
              block
              @click="clearCart"
          >
            <v-icon start>mdi-trash-can</v-icon>
            Очистить корзину
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <!-- Пустая корзина -->
    <v-row v-else class="text-center py-12">
      <v-col>
        <v-icon icon="mdi-cart-off" size="96" color="grey-lighten-1" />
        <h2 class="mt-4 text-grey">Корзина пуста</h2>
        <p class="text-grey">Добавьте товары из каталога</p>
        <v-btn to="/" color="primary" size="large" class="mt-4">
          Перейти в каталог
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useCartStore } from '@/store/cart.js'
import { useNotificationStore } from '@/store/notification.js'

const cartStore = useCartStore()
const notification = useNotificationStore()

const updateQuantity = (id, quantity) => {
  cartStore.updateQuantity(id, quantity)
}

const removeItem = (id) => {
  cartStore.removeItem(id)
  notification.showMessage('Товар удален из корзины', 'info')
}

const clearCart = () => {
  cartStore.clear()
  notification.showMessage('Корзина очищена', 'info')
}

const checkout = () => {
  notification.showMessage('Заказ оформлен! Спасибо за покупку!', 'success')
  cartStore.clear()
}

onMounted(() => {
  cartStore.loadCart()
})
</script>