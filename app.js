require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate'); // спец. миддлвэр celebrate для обработки ошибок
const { loginJoi, createUserJoi } = require('./middlewares/celebrate');
const rootRouter = require('./routes'); // корневой роутер
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const centralCatchErrors = require('./middlewares/centralCatchErrors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('cors');
const { limiter } = require('./middlewares/rateLimiter');

const { PORT = 3000 } = process.env;
const app = express(); // создаём приложение
app.use(cors()); // добавляем заголовки к каждому ответу, доступ для любого домена: true

app.disable('x-powered-by'); // скрыть информацию о сервере (по книге Eaton R Brown)

// подключаемся к базе данных
mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb')
  .then(() => console.log('Подключение к базе данных выполнено успешно!'))
  .catch((err) => console.log(`Ошибка подключения к базе данных: ${err}`));

app.use(express.json()); // для парсинга тела запроса в формате JSON (body-parser)

app.use(requestLogger); // подключаем логгер запросов

app.use(limiter); // rateLimiter

app.use('/signin', loginJoi, login); // авторизация пользователя
app.use('/signup', createUserJoi, createUser); // регистрация пользователя
app.use(auth); // защищаем роуты от неавторизованного пользователя
app.use('/', rootRouter); // корневой роутер

app.use(errorLogger); // подключаем логгер ошибок

// обработчик ошибок celebrate
app.use(errors());

// центральный обработчик ошибок
app.use(centralCatchErrors);

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту: ${PORT}`);
});
