/**
 * Роутер по работе с брендами
 * Endpoints:
 * - POST / - Создание бренда
 * - GET / - Получение брендов
 * - DELETE /:id - Удаление бренда
 */

const Router = require('express');
const router = new Router();

const brandController = require('../controllers/brandController');
const checkRole = require('../middleware/checkRoleMiddleware');
const roles = require('../enums.js');
// POST / - Создание бренда
router.post('/', checkRole(roles.admin), brandController.create);
// GET / - Получение брендов
router.get('/', brandController.getAll);
// DELETE /:id - Удаление бренда
router.delete('/:id', checkRole(roles.admin), brandController.deleteOne);

module.exports = router;