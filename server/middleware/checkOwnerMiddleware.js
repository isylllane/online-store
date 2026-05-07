/**
 * Middleware для проверки владельца ресурса
 * Проверяет, что пользователь запрашивает свои данные (или является админом)
 */

const jwt = require("jsonwebtoken");
const roles = require("../enums");

module.exports = function (req, res, next) {
    if (req.method === 'OPTIONS') {
        next();
        return;
    }

    try {
        const { id } = req.params;
        const currentUserId = req.user.id; // ID из токена
        const currentUserRole = req.user.role;

        // Если пользователь админ - пропускаем
        if (currentUserRole === roles.admin) {
            next();
            return;
        }

        // Если ID из URL совпадает с ID из токена - пропускаем
        if (parseInt(currentUserId) === parseInt(id)) {
            next();
            return;
        }

        // Иначе - доступ запрещен
        return res.status(403).json({message: "Доступ запрещен. Вы можете просматривать только свои данные"});

    } catch (err) {
        return res.status(401).json({message: "Ошибка при проверке прав доступа"});
    }
}