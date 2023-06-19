// users router
const router = require('express').Router(); // экспортируем роутер из функционала Express
const { getUserInfo, updateUser } = require('../controllers/users');
const { updateUserJoi } = require('../middlewares/celebrate');

// поиск пользователя по id
router.get('/me', getUserInfo);

// обвновление данных пользователя
router.patch('/me', updateUserJoi, updateUser);

module.exports = router;
