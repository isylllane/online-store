/**
 * Контроллер по работе с электроникой
 * Методы:
 * - create - Создание электроники
 * - getAll - Получение всей электроники (с пагинацией и фильтрацией)
 * - getOne - Получение конкретной электроники
 * - deleteOne - Удаление электроники
 */

const uuid = require('uuid');
const path = require('path');
const {Device} = require('../models/models');
const ApiError = require('../error/ApiError');
const {DeviceInfo} = require('../models/models');

class DeviceController {
    async create(req, res, next) {
        try {
            console.log('=== ПОЛУЧЕНЫ ДАННЫЕ ===');
            console.log('Body:', req.body);
            console.log('Files:', req.files);
            console.log('Info:', req.body.info);
            let {name, price, brandId, typeId, info} = req.body
            // Проверка обязательных полей
            if (!name || !price || !brandId || !typeId) {
                return next(ApiError.badRequest('Все поля (name, price, brandId, typeId) обязательны'));
            }
            const {img} = req.files

            // Проверка формата файла
            const fileExtension = path.extname(img.name).toLowerCase();
            if (fileExtension !== '.jpg' && fileExtension !== '.jpeg') {
                return next(ApiError.badRequest('Допустимы только jpg/jpeg файлы'));
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
    // НОВЫЙ МЕТОД ДЛЯ УДАЛЕНИЯ
    async deleteOne(req, res, next) {
        try {
            const { id } = req.params;

            console.log('Удаление товара с ID:', id);

            // Сначала находим товар, чтобы получить имя файла изображения
            const device = await Device.findOne({ where: { id } });

            if (!device) {
                return next(ApiError.badRequest('Товар не найден'));
            }

            console.log('Найден товар:', device.name);
            console.log('Изображение:', device.img);

            // Удаляем изображение из папки static, если оно существует
            if (device.img) {
                const imagePath = path.resolve(__dirname, '..', 'static', device.img);
                console.log('Путь к изображению:', imagePath);

                // Проверяем существует ли файл
                const fs = require('fs');
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                    console.log(`Изображение ${device.img} удалено`);
                } else {
                    console.log(`Файл изображения не найден: ${imagePath}`);
                }
            }

            // Удаляем характеристики товара
            const deletedInfo = await DeviceInfo.destroy({ where: { deviceId: id } });
            console.log(`Удалено характеристик: ${deletedInfo}`);

            // Удаляем сам товар
            const deleted = await Device.destroy({ where: { id } });
            console.log(`Товар удален: ${deleted}`);

            return res.json({
                message: 'Товар успешно удалён',
                id: Number(id)
            });

        } catch (err) {
            console.error('Ошибка при удалении товара:', err);
            return next(ApiError.internal('Не удалось удалить товар: ' + err.message));
        }
    }
}

module.exports = new DeviceController();
