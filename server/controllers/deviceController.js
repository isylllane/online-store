/**
 * Контроллер по работе с электроникой
 * Методы:
 * - create - Создание электроники
 * - getAll - Получение всей электроники (с пагинацией и фильтрацией)
 * - getOne - Получение конкретной электроники
 */

const uuid = require('uuid');
const path = require('path');
const {Device} = require('../models/models');
const ApiError = require('../error/ApiError');
const {DeviceInfo} = require('../models/models');

class DeviceController {
    async create(req, res, next) {
        try {
            let {name, price, brandId, typeId, info} = req.body
            // Проверка обязательных полей
            if (!name || !price || !brandId || !typeId) {
                return next(ApiError.badRequest('Все поля (name, price, brandId, typeId) обязательны'));
            }
            const {img} = req.files

            // Проверка формата файла
            const fileExtension = path.extname(img.name).toLowerCase();
            if (fileExtension !== '.jpg') {
                return next(ApiError.badRequest('Допустимы только jpg-файлы'));
            }

            let fileName = uuid.v4() + fileExtension;
            img.mv(path.resolve(__dirname, '..', 'static', fileName));

            const device = await Device.create({name, price, brandId, typeId, img: fileName});

            if (info) {
                info = JSON.parse(info)
                info.forEach(i =>
                    DeviceInfo.create({
                        title: i.title,
                        description: i.description,
                        deviceId: device.id
                    })
                )
            }
            return res.json(device)
        } catch (e) {
            if (e.name === 'SequelizeUniqueConstraintError') {
                return next(ApiError.badRequest('Товар с таким названием уже существует'));
            }
            return next(ApiError.internal('Не удалось создать товар'));
        }

    }

    async getAll(req, res, next) {
        try {
            let {brandId, typeId, limit, page} = req.query;
            page = page || 1;
            limit = limit || 10;
            let offset = page * limit - limit;

            let devices;
            if (!brandId && !typeId) {
                devices = await Device.findAndCountAll({limit: limit, offset: offset});
            } else if (brandId && !typeId) {
                devices = await Device.findAndCountAll({where: {brandId}, limit: limit, offset: offset});
            } else if (!brandId && typeId) {
                devices = await Device.findAndCountAll({where: {typeId}, limit: limit, offset: offset});
            }else if (brandId && typeId) {
                devices = await Device.findAndCountAll({where: {typeId, brandId}, limit: limit, offset: offset});
            }
            return res.json(devices)
        } catch (e) {
            return next(ApiError.internal('Не удалось получить список товаров'));
        }

    }

    async getOne(req, res, next) {
        try {
            const { id } = req.params;
            const device = await Device.findOne({
                where: { id },
                include: [{ model: DeviceInfo, as: 'info' }]
            });

            if (!device) {
                return next(ApiError.badRequest('Товар не найден'));
            }

            return res.json(device);
        } catch (err) {
            return next(ApiError.internal('Не удалось получить товар'));
        }
    }
}

module.exports = new DeviceController();
