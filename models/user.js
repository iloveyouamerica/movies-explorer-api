// модель пользователя
const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Некорректный e-mail',
    },
  },
  password: {
    type: String,
    required: true,
    select: false, // не возвращаем хэш пароля
  },
});

module.exports = mongoose.model('user', userSchema);
