<template>
  <div>
    <!-- Заголовок -->
    <v-row class="mb-6">
      <v-col>
        <h1 class="text-h4 font-weight-bold">Каталог товаров</h1>
        <p class="text-grey">Выберите лучшую электронику</p>
      </v-col>
    </v-row>

    <v-row>
      <!-- Боковая панель с фильтрами -->
      <v-col cols="12" md="3">
        <v-card class="pa-4" elevation="2">
          <h3 class="text-h6 mb-4">Фильтры</h3>

          <v-select
              v-model="filters.typeId"
              :items="types"
              item-title="name"
              item-value="id"
              label="Тип устройства"
              clearable
              @update:model-value="loadProducts"
          />

          <v-select
              v-model="filters.brandId"
              :items="brands"
              item-title="name"
              item-value="id"
              label="Бренд"
              clearable
              @update:model-value="loadProducts"
          />

          <v-btn
              v-if="filters.typeId || filters.brandId"
              variant="text"
              color="error"
              size="small"
              @click="clearFilters"
          >
            <v-icon start>mdi-filter-remove</v-icon>
            Сбросить фильтры
          </v-btn>
        </v-card>
      </v-col>

      <!-- Список товаров -->
      <v-col cols="12" md="9">
        <!-- Загрузка -->
        <v-row v-if="loading" justify="center" class="py-8">
          <v-progress-circular indeterminate size="64" />
        </v-row>

        <!-- Товары -->
        <v-row v-else>
          <v-col
              v-for="product in products"
              :key="product.id"
              cols="12" sm="6" lg="4"
          >
            <ProductCard
                :product="product"
                :brand-name="getBrandName(product.brandId)"
                @click="goToProduct(product.id)"
            />
          </v-col>
        </v-row>

        <!-- Пустой результат -->
        <v-row v-if="!loading && products.length === 0">
          <v-col class="text-center py-8">
            <v-icon icon="mdi-emoticon-sad" size="64" color="grey" />
            <h3 class="mt-2">Товаров не найдено</h3>
            <p class="text-grey">Попробуйте изменить фильтры</p>
          </v-col>
        </v-row>

        <!-- Пагинация -->
        <v-row v-if="totalPages > 1" class="mt-4">
          <v-col class="d-flex justify-center">
            <v-pagination
                v-model="page"
                :length="totalPages"
                @update:model-value="loadProducts"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ProductCard from '@/components/ProductCard.vue'
import { deviceApi, typeApi, brandApi } from '@/api'

const router = useRouter()
const products = ref([])
const types = ref([])
const brands = ref([])
const loading = ref(false)
const page = ref(1)
const totalPages = ref(1)
const limit = 12

const filters = ref({
  typeId: null,
  brandId: null,
})

const getBrandName = (brandId) => {
  const brand = brands.value.find(b => b.id === brandId)
  return brand ? brand.name : ''
}

const loadTypes = async () => {
  const { data } = await typeApi.getAll()
  types.value = data
}

const loadBrands = async () => {
  const { data } = await brandApi.getAll()
  brands.value = data
}

const loadProducts = async () => {
  loading.value = true
  try {
    const params = {
      page: page.value,
      limit,
      ...(filters.value.typeId && { typeId: filters.value.typeId }),
      ...(filters.value.brandId && { brandId: filters.value.brandId }),
    }
    const { data } = await deviceApi.getAll(params)
    products.value = data.rows
    totalPages.value = Math.ceil(data.count / limit)
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const clearFilters = () => {
  filters.value.typeId = null
  filters.value.brandId = null
  page.value = 1
  loadProducts()
}

const goToProduct = (id) => {
  router.push(`/product/${id}`)
}

onMounted(() => {
  loadTypes()
  loadBrands()
  loadProducts()
})
</script>