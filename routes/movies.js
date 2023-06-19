// роут на фильмы
const router = require('express').Router(); // экспортируем роутер из функционала Express
const { createMovie, getMovies, deleteMovie } = require('../controllers/movies');
const { createMovieJoi, deleteMovieJoi } = require('../middlewares/celebrate');

// возвращает все сохранённые текущим  пользователем фильмы
router.get('/', getMovies);

// создаёт фильм с переданными в теле
router.post('/', createMovieJoi, createMovie);

// удаляет сохранённый фильм по id
router.delete('/:_id', deleteMovieJoi, deleteMovie);

module.exports = router;
