/**
 * Контроллер по работе с пользователями
 * Методы:
 * - registration - Регистрация нового пользователя
 * - login - Авторизация (вход в систему)
 * - check - Проверка JWT-токена (защищённый маршрут)
 * Функции:
 * - generateJwt - Генерация JWT-токена
 */

const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User, Basket} = require('../models/models');

const generateJwt = (id, email, role) => {
    return jwt.sign({id, email, role},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}


class UserController {
    async registration(req, res, next) {

        try {
            const {email, password, role} = req.body;

            if (!email || !password) {
                return next(ApiError.badRequest('Некорректный email или пароль'));
            }

            const candidate = await User.findOne({where: { email } });
            if (candidate) {
                return next(ApiError.badRequest('Пользователь с таким email уже существует'));
            }

            const hashPassword = await bcrypt.hash(password, 5);
            const user = await User.create({email, role, password: hashPassword});
            await Basket.create({userId: user.id});

            const token = generateJwt(user.id, user.email, user.role);
            return res.json({ token });
        } catch (err) {
            return next(ApiError.internal('Ошибка при регистрации пользователя'));
        }
    }

    async login(req, res, next) {
        try {
            const {email, password} = req.body;

            if (!email || !password) {
                return next(ApiError.badRequest('Не указан email или пароль'));
            }

            const user = await User.findOne({where: { email } });

            if (!user) {
                return next(ApiError.badRequest('Пользователь не найден'))
            }

            const comparePassword = await bcrypt.compare(password, user.password);
            if (!comparePassword) {
                return next(ApiError.badRequest('Указан неверный пароль'))
            }

            const token = generateJwt(user.id, user.email, user.role);
            return res.json({ token });
        } catch (err) {
            return next(ApiError.internal('Ошибка при авторизации'));
        }
    }

    async check(req, res, next) {
        try {
            if (!req.user) {
                return next(ApiError.forbidden('Пользователь не авторизован'));
            }

            const token = generateJwt(req.user.id, req.user.email, req.user.role);
            return res.json({ token });
        } catch (err) {
            return next(ApiError.internal('Ошибка при проверке токена'));
        }
    }
}

module.exports = new UserController();