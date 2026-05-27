<template>
  <div>
    <v-row class="mb-6">
      <v-col>
        <h1 class="text-h3 font-weight-bold">
          <v-icon start size="40" color="primary">mdi-shield-cog</v-icon>
          Админ панель
        </h1>
      </v-col>
    </v-row>

    <v-card elevation="3" rounded="lg">
      <v-tabs v-model="tab" color="primary" grow>
        <v-tab value="products" class="text-none">
          <v-icon start>mdi-package-variant</v-icon>
          Товары
        </v-tab>
        <v-tab value="types" class="text-none">
          <v-icon start>mdi-tag</v-icon>
          Типы
        </v-tab>
        <v-tab value="brands" class="text-none">
          <v-icon start>mdi-store</v-icon>
          Бренды
        </v-tab>
        <v-tab value="users" class="text-none">
          <v-icon start>mdi-account-group</v-icon>
          Пользователи
        </v-tab>
      </v-tabs>

      <v-window v-model="tab" class="pa-6">
        <!-- Товары -->
        <v-window-item value="products">
          <v-btn color="primary" to="/admin/create" class="mb-4">
            <v-icon start>mdi-plus</v-icon>
            Добавить товар
          </v-btn>

          <v-table>
            <thead>
            <tr>
              <th>ID</th>
              <th>Изображение</th>
              <th>Название</th>
              <th>Цена</th>
              <th>Действия</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="product in products" :key="product.id">
              <td>{{ product.id }}</td>
              <td>
                <v-img
                    :src="`/api/img/${product.img}`"
                    width="50"
                    height="50"
                    cover
                    class="rounded"
                />
              </td>
              <td>{{ product.name }}</td>
              <td>{{ product.price.toLocaleString() }} ₽</td>
              <td>
                <v-btn
                    icon="mdi-delete"
                    variant="text"
                    color="error"
                    size="small"
                    :loading="deletingId === product.id"
                    @click="confirmDelete(product)"
                />
              </td>
            </tr>
            </tbody>
          </v-table>

          <div v-if="products.length === 0" class="text-center pa-8">
            <v-icon icon="mdi-package-variant" size="48" color="grey" />
            <p class="text-grey mt-2">Нет товаров</p>
          </div>
        </v-window-item>

        <!-- Типы -->
        <v-window-item value="types">
          <v-row align="center">
            <v-col cols="12" md="8">
              <v-text-field
                  v-model="newType"
                  label="Название типа"
                  variant="outlined"
                  clearable
                  @keyup.enter="addType"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-btn
                  color="primary"
                  block
                  :loading="typeLoading"
                  @click="addType"
              >
                <v-icon start>mdi-plus</v-icon>
                Добавить тип
              </v-btn>
            </v-col>
          </v-row>

          <v-divider class="my-4" />

          <div class="d-flex flex-wrap">
            <v-chip
                v-for="type in types"
                :key="type.id"
                class="ma-2"
                size="large"
                closable
                @click:close="deleteType(type.id)"
            >
              {{ type.name }}
            </v-chip>
            <div v-if="types.length === 0" class="text-center pa-8 w-100">
              <v-icon icon="mdi-tag-off" size="48" color="grey" />
              <p class="text-grey mt-2">Нет типов. Добавьте первый!</p>
            </div>
          </div>
        </v-window-item>

        <!-- Бренды -->
        <v-window-item value="brands">
          <v-row align="center">
            <v-col cols="12" md="8">
              <v-text-field
                  v-model="newBrand"
                  label="Название бренда"
                  variant="outlined"
                  clearable
                  @keyup.enter="addBrand"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-btn
                  color="primary"
                  block
                  :loading="brandLoading"
                  @click="addBrand"
              >
                <v-icon start>mdi-plus</v-icon>
                Добавить бренд
              </v-btn>
            </v-col>
          </v-row>

          <v-divider class="my-4" />

          <div class="d-flex flex-wrap">
            <v-chip
                v-for="brand in brands"
                :key="brand.id"
                class="ma-2"
                size="large"
                closable
                @click:close="deleteBrand(brand.id)"
            >
              {{ brand.name }}
            </v-chip>
            <div v-if="brands.length === 0" class="text-center pa-8 w-100">
              <v-icon icon="mdi-store-off" size="48" color="grey" />
              <p class="text-grey mt-2">Нет брендов. Добавьте первый!</p>
            </div>
          </div>
        </v-window-item>

        <!-- Пользователи -->
        <v-window-item value="users">
          <v-table>
            <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Роль</th>
              <th>Согласие на данные</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.id }}</td>
              <td>{{ user.email }}</td>
              <td>
                <v-chip :color="user.role === 'ADMIN' ? 'primary' : 'grey-darken-1'" size="small">
                  {{ user.role }}
                </v-chip>
              </td>
              <td>
                <v-icon :color="user.personalDataConsent ? 'green' : 'red'">
                  {{ user.personalDataConsent ? 'mdi-check-circle' : 'mdi-close-circle' }}
                </v-icon>
              </td>
            </tr>
            </tbody>
          </v-table>
        </v-window-item>
      </v-window>
    </v-card>

    <!-- Диалог подтверждения удаления -->
    <v-dialog v-model="showDeleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5 bg-error text-white pa-4">
          Подтверждение удаления
        </v-card-title>
        <v-card-text class="pa-4">
          Вы уверены, что хотите удалить товар <strong>{{ productToDelete?.name }}</strong>?
          <br>
          <span class="text-red">Это действие нельзя отменить!</span>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="outlined" @click="showDeleteDialog = false">
            Отмена
          </v-btn>
          <v-btn color="error" :loading="deletingId" @click="deleteProduct">
            Удалить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { deviceApi, typeApi, brandApi, userApi } from '@/api'
import { useUserStore } from '@/store/user'
import { useNotificationStore } from '@/store/notification'

const userStore = useUserStore()
const notification = useNotificationStore()

const tab = ref('products')
const products = ref([])
const types = ref([])
const brands = ref([])
const users = ref([])
const newType = ref('')
const newBrand = ref('')
const typeLoading = ref(false)
const brandLoading = ref(false)
const deletingId = ref(null)
const showDeleteDialog = ref(false)
const productToDelete = ref(null)

// Загрузка товаров
const loadProducts = async () => {
  try {
    const { data } = await deviceApi.getAll({ limit: 100 })
    products.value = data.rows || []
  } catch (error) {
    console.error('Ошибка загрузки товаров:', error)
  }
}

// Загрузка типов
const loadTypes = async () => {
  try {
    const { data } = await typeApi.getAll()
    types.value = data || []
  } catch (error) {
    console.error('Ошибка загрузки типов:', error)
  }
}

// Загрузка брендов
const loadBrands = async () => {
  try {
    const { data } = await brandApi.getAll()
    brands.value = data || []
  } catch (error) {
    console.error('Ошибка загрузки брендов:', error)
  }
}

// Загрузка пользователей
const loadUsers = async () => {
  try {
    const { data } = await userApi.getAll()
    users.value = data || []
  } catch (error) {
    console.error('Ошибка загрузки пользователей:', error)
  }
}

// Добавление типа
const addType = async () => {
  if (!newType.value.trim()) {
    notification.showMessage('Введите название типа', 'warning')
    return
  }

  typeLoading.value = true
  try {
    await typeApi.create(newType.value)
    notification.showMessage('Тип успешно добавлен!', 'success')
    newType.value = ''
    await loadTypes()
  } catch (error) {
    notification.showMessage(error.response?.data?.message || 'Ошибка', 'error')
  } finally {
    typeLoading.value = false
  }
}

// Удаление типа
const deleteType = async (id) => {
  try {
    await typeApi.delete(id)
    notification.showMessage('Тип удален', 'info')
    await loadTypes()
  } catch (error) {
    notification.showMessage('Ошибка удаления', 'error')
  }
}

// Добавление бренда
const addBrand = async () => {
  if (!newBrand.value.trim()) {
    notification.showMessage('Введите название бренда', 'warning')
    return
  }

  brandLoading.value = true
  try {
    await brandApi.create(newBrand.value)
    notification.showMessage('Бренд успешно добавлен!', 'success')
    newBrand.value = ''
    await loadBrands()
  } catch (error) {
    notification.showMessage(error.response?.data?.message || 'Ошибка', 'error')
  } finally {
    brandLoading.value = false
  }
}

// Удаление бренда
const deleteBrand = async (id) => {
  try {
    await brandApi.delete(id)
    notification.showMessage('Бренд удален', 'info')
    await loadBrands()
  } catch (error) {
    notification.showMessage('Ошибка удаления', 'error')
  }
}

// Подтверждение удаления товара
const confirmDelete = (product) => {
  productToDelete.value = product
  showDeleteDialog.value = true
}

// Удаление товара
const deleteProduct = async () => {
  if (!productToDelete.value) return

  deletingId.value = productToDelete.value.id
  try {
    await deviceApi.delete(productToDelete.value.id)
    notification.showMessage('Товар успешно удален!', 'success')
    showDeleteDialog.value = false
    productToDelete.value = null
    await loadProducts() // Обновляем список
  } catch (error) {
    const msg = error.response?.data?.message || 'Ошибка при удалении товара'
    notification.showMessage(msg, 'error')
  } finally {
    deletingId.value = null
  }
}

onMounted(() => {
  loadProducts()
  loadTypes()
  loadBrands()
  if (userStore.isAdmin) {
    loadUsers()
  }
})
</script>

<style scoped>
.w-100 {
  width: 100%;
}
</style>