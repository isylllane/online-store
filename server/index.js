/**
 * Точка входа в приложение
 * Настройка Express сервера, CORS и запуск на указанном порту
 */

require('dotenv').config();

const express = require('express');
// Запросы к браузеру
const cors = require('cors');
// Конфигуратор подключения к базе данных
const sequelize = require("./db");
// Модели данных
const models = require("./models/models");
const PORT = process.env.PORT || 7000;

const app = express();
app.use(cors());
app.use(express.json());

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    } catch (error) {
        console.log(error);
    }
};
start();