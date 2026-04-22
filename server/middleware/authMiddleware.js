/**
 * Middleware для аутентификации пользователя
 * Проверяет JWT-токен и добавляет данные пользователя в req.user
 */

const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    if (req.method === 'OPTIONS') {
        next()
        return
    }
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({message: "Пользователь не авторизован"})
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next()

    } catch (err) {
        res.status(401).json({message: "Пользователь не авторизован"})
    }
}