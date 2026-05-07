/**
 * Роутер по работе с типом электроники
 * Endpoints:
 * - POST / - Создание типа электроники
 * - GET / - Получить все типы электроники
 * - DELETE /:id - Удаление типа электроники
 */

const Router = require('express');
const router = new Router();
const typeController = require('../controllers/typeController');
const checkRole = require('../middleware/checkRoleMiddleware');
const roles = require('../enums.js');

// POST / - Создание типа электроники
router.post('/', checkRole(roles.admin), typeController.create);
// GET / - Получить все типы электроники
router.get('/', typeController.getAll);
// DELETE /:id - Удаление типа электроники
router.delete('/:id', checkRole(roles.admin), typeController.deleteOne);
module.exports = router;