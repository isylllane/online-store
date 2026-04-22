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

router.post('/', checkRole('ADMIN'), brandController.create);
router.get('/', brandController.getAll);
router.delete('/:id', checkRole('ADMIN'), brandController.deleteOne);

module.exports = router;