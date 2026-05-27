<template>
  <v-card class="product-card" elevation="3" @click="$emit('click')">
    <v-img
        :src="`/api/img/${product.img}`"
        height="400"
        class="bg-grey-lighten-3"
    >
      <template v-slot:placeholder>
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-progress-circular indeterminate color="primary" />
        </v-row>
      </template>
    </v-img>

    <v-card-title class="text-subtitle-1 font-weight-bold">
      {{ product.name }}, {{ brandName }}
    </v-card-title>

    <v-card-text>
      <div class="d-flex align-center mb-2">
        <v-rating
            v-model="product.rating"
            readonly
            size="small"
            color="amber"
            density="compact"
        />
        <span class="ml-2 text-caption">{{ product.rating }}</span>
      </div>
      <div class="text-h6 text-primary font-weight-bold">
        {{ product.price.toLocaleString() }} ₽
      </div>
    </v-card-text>

    <v-divider />

    <v-card-actions>
      <v-btn
          color="primary"
          variant="tonal"
          block
          @click.stop="addToCart"
      >
        <v-icon start>mdi-cart-plus</v-icon>
        В корзину
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { useCartStore } from '@/store/cart'
import { useNotificationStore } from '@/store/notification'

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
  brandName: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['click'])

const cartStore = useCartStore()
const notification = useNotificationStore()

const addToCart = () => {
  cartStore.addItem(props.product)
  notification.showMessage(`${props.product.name} добавлен в корзину`, 'success')
}
</script>

<style scoped>
.product-card {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}
.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
}
</style>