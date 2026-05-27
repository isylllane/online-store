import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
// todo Сделать всплывающее окно о том что при удалении бренда товары также будут удалены
// Подробно расписать авторизацию и установку постгресса
export default createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'light',
        themes: {
            light: {
                colors: {
                    primary: '#1976D2',
                    secondary: '#424242',
                    accent: '#82B1FF',
                    error: '#FF5252',
                    success: '#4CAF50',
                    warning: '#FFC107',
                },
            },
        },
    },
})