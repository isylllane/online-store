/**
 * Контроллер по работе с брендами
 * Методы:
 * - create - Создание бренда
 * - getAll - Получение всех брендов
 * - deleteOne - Удаление одного бренда
 */

const {Brand, Type} = require('../models/models');
const ApiError = require('../error/ApiError');

class BrandController {
    async create(req, res, next) {
        try {
            const {name} = req.body;
            if (!name) {
                return next(ApiError.badRequest('Название бренда обязательно'));
            }
            const brand = await Brand.create({name});
            return res.json(brand);
        } catch (err) {
            if (err.name === 'SequelizeUniqueConstraintError') {
                return next(ApiError.badRequest('Бренд с таким названием уже существует'));
            }
            return next(ApiError.internal('Не удалось создать бренд'));
        }
    }

    async getAll(req, res, next) {
        try {
            const brands = await Brand.findAll();
            return res.json(brands);
        } catch (err) {
            return next(ApiError.internal('Не удалось получить список брендов'));
        }
    }
    async deleteOne(req, res, next) {
        try {
            const {id} = req.params;
            const deleted = await Brand.destroy({where: {id}});
            if (!deleted) {
                return next(ApiError.badRequest('Бренд не найден'));
            }
            return res.json({message: 'Бренд успешно удалён', id: Number(id)});
        } catch (err) {
            return next(ApiError.internal('Не удалось удалить бренд'));
        }
    }
}

module.exports = new BrandController();