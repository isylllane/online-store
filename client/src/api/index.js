import axios from 'axios'

const api = axios.create({
    baseURL: '/api',
})

// Автоматически добавляем токен в заголовки
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Пользователи
export const userApi = {
    register: (data) => api.post('/user/registration', data),
    login: (data) => api.post('/user/login', data),
    check: () => api.get('/user/auth'),
    getAll: () => api.get('/user/all'),
    getOne: (id) => api.get(`/user/${id}`),
}

// Типы товаров
export const typeApi = {
    getAll: () => api.get('/type'),
    create: (name) => api.post('/type', { name }),
    delete: (id) => api.delete(`/type/${id}`),
}

// Бренды
export const brandApi = {
    getAll: () => api.get('/brand'),
    create: (name) => api.post('/brand', { name }),
    delete: (id) => api.delete(`/brand/${id}`),
}

export const deviceApi = {
    getAll: (params) => api.get('/device', { params }),
    getOne: (id) => api.get(`/device/${id}`),
    create: (formData) => {
        return api.post('/device', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
    },
    delete: (id) => api.delete(`/device/${id}`),
}

export default api