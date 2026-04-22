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

router.post('/', checkRole('ADMIN'), deviceController.create);
router.get('/', deviceController.getAll);
router.get('/:id', checkRole('ADMIN'), deviceController.getOne);

module.exports = router;