// root router
const router = require('express').Router();
const userRouter = require('./users');
const moviesRouter = require('./movies');
const NotFoundError = require('../errors/notFoundError');

router.use('/users', userRouter);
router.use('/movies', moviesRouter);
router.use('/*', (req, res, next) => { // обработка несуществующих маршрутов
  next(new NotFoundError('Такой страницы не существует'));
});

module.exports = router;
