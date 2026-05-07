/**
 * Роутер по работе с регистрацией, авторизацией
 * Endpoints:
 * - POST /registration - Регистрация нового пользователя
 * - POST /login - Авторизация (вход в систему)
 * - GET /auth - Проверка JWT-токена (защищённый маршрут)
 * - GET /all - Получение всех пользователей (защищённый маршрут)
 * - GET /:id - Получение данных пользователя
 */

const Router = require('express');
const router = new Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require("../middleware/checkRoleMiddleware");
const checkOwner = require("../middleware/checkOwnerMiddleware");
const roles = require("../enums");

// POST /registration - Регистрация нового пользователя
router.post('/registration', userController.registration);
//  POST /login - Авторизация (вход в систему)
router.post('/login', userController.login);
// GET /auth - Проверка JWT-токена (защищённый маршрут)
router.get('/auth', authMiddleware, userController.check);
// GET /all - Получение всех пользователей
router.get('/all', checkRole(roles.admin), userController.getAll);
// GET /:id - Получение данных пользователя
router.get('/:id', authMiddleware, checkOwner, userController.getOne);


module.exports = router;