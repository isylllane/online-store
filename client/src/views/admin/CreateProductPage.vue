<template>
  <div>
    <!-- Кнопка назад -->
    <v-btn
        variant="text"
        prepend-icon="mdi-arrow-left"
        to="/admin"
        class="mb-4"
    >
      Назад в админку
    </v-btn>

    <v-card elevation="3" rounded="lg">
      <v-toolbar color="primary" dark rounded-t-lg>
        <v-toolbar-title class="text-h5">
          <v-icon start>mdi-plus-box</v-icon>
          Добавить устройство
        </v-toolbar-title>
      </v-toolbar>

      <v-card-text class="pa-6">
        <v-form @submit.prevent class="py-2">
          <v-text-field
              v-model="name"
              density="comfortable"
              placeholder="Введите название"
              variant="outlined"
              label="Название"
          />

          <v-row>
            <v-col cols="12" md="6">
              <v-select
                  v-model="brand"
                  :items="brands"
                  item-title="name"
                  item-value="id"
                  label="Выберите бренд"
                  density="comfortable"
                  variant="outlined"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-select
                  v-model="type"
                  :items="types"
                  item-title="name"
                  item-value="id"
                  label="Выберите тип"
                  density="comfortable"
                  variant="outlined"
              />
            </v-col>
          </v-row>

          <v-text-field
              v-model="price"
              type="number"
              density="comfortable"
              placeholder="Введите стоимость"
              variant="outlined"
              label="Цена"
          />

          <!-- Загрузка файла - используем обычный input -->
          <div class="mb-4">
            <label class="text-subtitle-2 text-grey-darken-1">Изображение (JPG/JPEG)</label>
            <input
                type="file"
                accept=".jpg,.jpeg"
                @change="selectFile"
                class="file-input"
            />
            <div v-if="fileName" class="text-caption text-success mt-1">
              ✅ Выбран файл: {{ fileName }}
            </div>
            <div v-else class="text-caption text-grey mt-1">
              Выберите изображение для товара
            </div>
          </div>

          <v-divider class="my-4" />

          <!-- Характеристики -->
          <div class="d-flex justify-space-between align-center mb-4">
            <h3 class="text-h6">Характеристики</h3>
            <v-btn
                variant="tonal"
                color="primary"
                prepend-icon="mdi-plus"
                @click="addInfo"
            >
              Добавить свойство
            </v-btn>
          </div>

          <v-card
              v-for="item in info"
              :key="item.number"
              variant="outlined"
              class="mb-3 pa-3"
          >
            <v-row align="center">
              <v-col cols="12" md="5">
                <v-text-field
                    v-model="item.title"
                    @input="changeInfo('title', item.title, item.number)"
                    density="compact"
                    placeholder="Название характеристики"
                    variant="outlined"
                    label="Свойство"
                    hide-details
                />
              </v-col>
              <v-col cols="12" md="5">
                <v-text-field
                    v-model="item.description"
                    @input="changeInfo('description', item.description, item.number)"
                    density="compact"
                    placeholder="Значение"
                    variant="outlined"
                    label="Значение"
                    hide-details
                />
              </v-col>
              <v-col cols="12" md="2" class="text-center">
                <v-btn
                    icon="mdi-delete"
                    variant="text"
                    color="error"
                    @click="removeInfo(item.number)"
                />
              </v-col>
            </v-row>
          </v-card>

          <div v-if="info.length === 0" class="text-center pa-4 text-grey">
            <v-icon icon="mdi-information" size="32" />
            <p>Нет характеристик. Нажмите "Добавить свойство"</p>
          </div>
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn
            variant="outlined"
            @click="cancel"
        >
          Отмена
        </v-btn>
        <v-btn
            color="primary"
            size="large"
            :loading="loading"
            @click="addDevice"
        >
          <v-icon start>mdi-check</v-icon>
          Создать товар
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { deviceApi, typeApi, brandApi } from '@/api'
import { useNotificationStore } from '@/store/notification'

const router = useRouter()
const notification = useNotificationStore()

// Данные формы
const name = ref('')
const price = ref('')
const brand = ref(null)
const type = ref(null)
const file = ref(null)
const fileName = ref('')
const loading = ref(false)
const info = ref([])

// Списки для селектов
const types = ref([])
const brands = ref([])

// Работа с характеристиками
const changeInfo = (key, value, number) => {
  info.value = info.value.map(item => {
    if (item.number === number) {
      return { ...item, [key]: value }
    }
    return item
  })
}

const addInfo = () => {
  info.value = [...info.value, { title: '', description: '', number: Date.now() }]
}

const removeInfo = (number) => {
  info.value = info.value.filter(item => item.number !== number)
}

// Выбор файла
const selectFile = (e) => {
  const selectedFile = e.target.files[0]

  if (selectedFile) {
    const fileExtension = selectedFile.name.split('.').pop().toLowerCase()

    if (fileExtension === 'jpg' || fileExtension === 'jpeg') {
      file.value = selectedFile
      fileName.value = selectedFile.name
      console.log('Файл выбран:', selectedFile.name)
      notification.showMessage(`Файл "${selectedFile.name}" выбран`, 'success')
    } else {
      notification.showMessage('Можно загружать только JPG/JPEG файлы!', 'error')
      e.target.value = ''
      file.value = null
      fileName.value = ''
    }
  }
}

// Загрузка типов и брендов
const loadTypes = async () => {
  try {
    const { data } = await typeApi.getAll()
    types.value = data || []
  } catch (error) {
    console.error("Ошибка при получении типов:", error)
  }
}

const loadBrands = async () => {
  try {
    const { data } = await brandApi.getAll()
    brands.value = data || []
  } catch (error) {
    console.error("Ошибка при получении брендов:", error)
  }
}

// Отмена - возврат в админку
const cancel = () => {
  router.push('/admin')
}

// Создание устройства
const addDevice = async () => {
  console.log('=== ПРОВЕРКА ПЕРЕД ОТПРАВКОЙ ===')
  console.log('name:', name.value)
  console.log('price:', price.value)
  console.log('brand:', brand.value)
  console.log('type:', type.value)
  console.log('file:', file.value)
  console.log('info:', info.value)

  // Валидация
  if (!name.value) {
    notification.showMessage('Введите название устройства', 'warning')
    return
  }
  if (!price.value || Number(price.value) <= 0) {
    notification.showMessage('Введите корректную цену', 'warning')
    return
  }
  if (!brand.value) {
    notification.showMessage('Выберите бренд', 'warning')
    return
  }
  if (!type.value) {
    notification.showMessage('Выберите тип', 'warning')
    return
  }
  if (!file.value) {
    notification.showMessage('Выберите изображение', 'warning')
    return
  }

  loading.value = true

  try {
    const formData = new FormData()
    formData.append('name', name.value)
    formData.append('price', `${price.value}`)
    formData.append('img', file.value)
    formData.append('brandId', String(brand.value))
    formData.append('typeId', String(type.value))

    // Отправляем только заполненные характеристики
    const validInfo = info.value.filter(i => i.title && i.description)
    if (validInfo.length > 0) {
      formData.append('info', JSON.stringify(validInfo))
    }

    console.log('=== ОТПРАВКА FORMDATA ===')
    for (let pair of formData.entries()) {
      console.log(pair[0] + ':', pair[1])
    }

    const response = await deviceApi.create(formData)
    console.log('Ответ сервера:', response.data)

    notification.showMessage('Устройство успешно добавлено!', 'success')

    // Возвращаемся в админку
    setTimeout(() => {
      router.push('/admin')
    }, 1500)

  } catch (error) {
    console.error("Ошибка при создании устройства:", error.response ? error.response.data : error)
    const msg = error.response?.data?.message || 'Ошибка при создании устройства'
    notification.showMessage(msg, 'error')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadTypes()
  loadBrands()
})
</script>

<style scoped>
.file-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  margin-top: 4px;
  cursor: pointer;
}

.file-input:hover {
  border-color: #1976D2;
}

.file-input:focus {
  outline: none;
  border-color: #1976D2;
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
}
</style>