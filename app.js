require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Импорт cors должен быть здесь
const helmet = require('helmet');
const { errors } = require('celebrate'); // спец. миддлвэр celebrate для обработки ошибок
const { loginJoi, createUserJoi } = require('./middlewares/celebrate');
const rootRouter = require('./routes'); // корневой роутер
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const centralCatchErrors = require('./middlewares/centralCatchErrors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { PORT, DB_ADDRESS } = require('./utils/config');
const { limiter } = require('./middlewares/rateLimiter');

const app = express(); // создаём приложение

app.use(cors()); // добавляем заголовки к каждому ответу, доступ для любого домена: true

app.use(helmet());

// подключаемся к базе данных
mongoose.connect(DB_ADDRESS)
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
