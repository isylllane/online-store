<template>
  <v-container v-if="product" class="py-6">
    <v-btn
        variant="text"
        prepend-icon="mdi-arrow-left"
        to="/"
        class="mb-4"
    >
      Назад к каталогу
    </v-btn>

    <v-row>
      <!-- Изображение -->
      <v-col cols="12" md="6">
        <v-img
            :src="`/api/img/${product.img}`"
            height="400"
            class="rounded-lg elevation-3"
        />
      </v-col>

      <!-- Информация -->
      <v-col cols="12" md="6">
        <v-card elevation="2" class="pa-4">
          <h1 class="text-h5 font-weight-bold mb-2">
            {{ product.name }}
          </h1>

          <div class="d-flex align-center mb-4">
            <v-rating
                v-model="product.rating"
                readonly
                color="amber"
                density="comfortable"
            />
            <span class="ml-2 text-h6">{{ product.rating }}</span>
          </div>

          <v-divider class="my-4" />

          <div class="text-h6 text-primary font-weight-bold mb-4">
            {{ product.price.toLocaleString() }} ₽
          </div>

          <v-btn
              color="primary"

              block
              @click="addToCart"
          >
            <v-icon start>mdi-cart-plus</v-icon>
            Добавить в корзину
          </v-btn>

          <v-divider class="my-4" />

          <div v-if="product.info && product.info.length">
            <h3 class="text-h6 mb-3">Характеристики:</h3>
            <v-table>
              <tbody>
              <tr v-for="info in product.info" :key="info.id">
                <td class="font-weight-bold">{{ info.title }}:</td>
                <td>{{ info.description }}</td>
              </tr>
              </tbody>
            </v-table>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <div v-else class="d-flex justify-center align-center" style="height: 70vh">
    <v-progress-circular indeterminate size="64" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { deviceApi } from '@/api/index.js'
import { useCartStore } from '@/store/cart.js'
import { useNotificationStore } from '@/store/notification.js'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const notification = useNotificationStore()
const product = ref(null)

const loadProduct = async () => {
  try {
    const { data } = await deviceApi.getOne(route.params.id)
    product.value = data
  } catch {
    notification.show('Товар не найден', 'error')
    router.push('/')
  }
}

const addToCart = () => {
  cartStore.addItem(product.value)
  notification.showMessage(`${product.value.name} добавлен в корзину`, 'success')
}
onMounted(loadProduct)
</script>