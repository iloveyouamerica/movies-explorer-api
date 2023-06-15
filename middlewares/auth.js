// миддлвэра авторизации
const jwt = require('jsonwebtoken');
const AuthError = require('../errors/authError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  // достаём заголовок авторизации
  const { authorization } = req.headers;

  // проверяем, что заголовок есть и начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new AuthError('Вам нужно авторизоваться'));
  }

  // достаём токен и методом replace отсекаем приставку Bearer
  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    // верифицируем токен
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return next(new AuthError('Вам нужно авторизоваться'));
  }

  req.user = payload; // записываем полезную нагрузку в объект запроса
  return next();
};
