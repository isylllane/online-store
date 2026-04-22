/**
 * Роутер по работе с регистрацией, авторизацией
 * Endpoints:
 * - POST /registration - Регистрация нового пользователя
 * - POST /login - Авторизация (вход в систему)
 * - GET /auth - Проверка JWT-токена (защищённый маршрут)
 */

const Router = require('express');
const router = new Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.get('/auth', authMiddleware, userController.check);

module.exports = router;