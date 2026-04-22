/**
 * Точка входа в приложение
 * Настройка Express сервера, CORS и запуск на указанном порту
 */

require('dotenv').config();

const express = require('express');
// Запросы к браузеру
const cors = require('cors');
// Конфигуратор подключения к базе данных
const sequelize = require('./db');
const PORT = process.env.PORT || 7000;
// Модели данных
const models = require('./models/models');
// Маршруты
const router = require('./routes/index');
const fileUpload = require("express-fileupload");
const path = require("path");

const errorHandler = require("./middleware/ErrorHandingMiddleware");


const app = express();

app.use(cors());
app.use('/api/img/', express.static(path.join(__dirname, "static")));
app.use(express.json());
app.use(fileUpload({}));

app.use('/api', router)

// Обработка ошибок
app.use(errorHandler);

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, () => console.log(`Сервер запущен на порту: ${PORT}`));
    } catch (error) {
        console.log(error);
    }
};
start();