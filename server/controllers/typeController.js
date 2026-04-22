/**
 * Контроллер по работе с типами
 * Методы:
 * - create - Создание типа
 * - getAll - Получение всех типов
 * - deleteOne - Удаление одного типа
 */

const {Type, Brand} = require('../models/models');
const ApiError = require('../error/ApiError');

class TypeController {
    async create(req, res, next) {
        try {
            const { name } = req.body;
            if (!name) {
                return next(ApiError.badRequest('Название типа обязательно'));
            }
            const type = await Type.create({ name });
            return res.json(type);

        } catch (err) {
            if (err.name === 'SequelizeUniqueConstraintError') {
                return next(ApiError.badRequest('Тип с таким названием уже существует'));
            }
            return next(ApiError.internal('Не удалось создать тип'));
        }
    }

    async getAll(req, res, next) {
        try {
            const types = await Type.findAll();
            return res.json(types);
        } catch (err) {
            return next(ApiError.internal('Не удалось получить список типов электроники'));
        }
    }
    async deleteOne(req, res, next) {
        try {
            const {id} = req.params;
            const deleted = await Type.destroy({where: {id}});
            if (!deleted) {
                return next(ApiError.badRequest('Тип электроники не найден'));
            }
            return res.json({message: 'Тип электроники успешно удалён', id: Number(id)});
        } catch (err) {
            return next(ApiError.internal('Не удалось удалить тип электроники'));
        }
    }
}

module.exports = new TypeController();