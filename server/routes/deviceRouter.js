/**
 * Роутер по работе с электроникой
 * Endpoints:
 * - POST / - Создание электроники
 * - GET / - Получение электроники
 * - GET /:id - Получение электроники по id
 * - DELETE /:id - Удаление электроники
 */

const Router = require('express');
const router = new Router();
const deviceController = require('../controllers/deviceController');
const checkRole = require('../middleware/checkRoleMiddleware');
const roles = require('../enums.js');

// POST / - Создание электроники
router.post('/', checkRole(roles.admin), deviceController.create);
// GET / - Получение электроники
router.get('/', deviceController.getAll);
// GET /:id - Получение электроники по id
router.get('/:id', deviceController.getOne);
// DELETE /:id - Удаление электроники (НОВЫЙ ЭНДПОИНТ)
router.delete('/:id', checkRole(roles.admin), deviceController.deleteOne);

module.exports = router;