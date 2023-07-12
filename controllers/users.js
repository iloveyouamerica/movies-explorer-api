// контроллер пользователей
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/notFoundError');
const RequestError = require('../errors/requestError');
const ConflictError = require('../errors/conflictError');
const AuthError = require('../errors/authError');

// поиск пользователя по id
const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('Пользователь с таким id не найден'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new RequestError('Передан некорректный id пользователя'));
      }
      return next(err);
    });
};

// обновление данных пользователя
const updateUser = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .orFail(new NotFoundError('Пользователь с таким id не найден'))
    .then((user) => res.status(201).send({ email: user.email, name: user.name }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new RequestError('Переданы некорректные данные'));
      }
      if (err.code === 11000) {
        return next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
      }
      return next(err);
    });
};

// создаём пользователя (signup)
const createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({ name, email, password: hash })
        .then((user) => res.status(201).send({ name: user.name, email: user.email }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            return next(new RequestError('Некорректные данные при создании пользователя'));
          }
          if (err.code === 11000) {
            return next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
          }
          return next(err);
        });
    })
    .catch(next);
};

// контроллер аутентификации
const login = (req, res, next) => {
  const { email, password } = req.body;
  const { NODE_ENV, JWT_SECRET } = process.env;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return next(new AuthError('Неверный email или пароль'));
      }
      return bcrypt.compare(password, user.password) // сравниваем пароли
        .then((matched) => {
          if (!matched) {
            return next(new AuthError('Неверный email или пароль'));
          }
          // создаём токен
          const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
          return res.send({ token });
        });
    })
    .catch(next);
};

module.exports = {
  createUser, getUserInfo, updateUser, login,
};
