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

//todo написать что передаётся в теле

// POST / - Создание электроники
router.post('/', checkRole(roles.admin), deviceController.create);
// GET / - Получение электроники
router.get('/', deviceController.getAll);
// GET /:id - Получение электроники по id
router.get('/:id', deviceController.getOne);

module.exports = router;