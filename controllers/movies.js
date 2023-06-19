// контроллер фильмов
const Movie = require('../models/movie');
const NotFoundError = require('../errors/notFoundError');
const RequestError = require('../errors/requestError');
const ForbiddenError = require('../errors/forbiddenError');

// возвращает все сохранённые фильмы
const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(next);
};

// создаёт фильм с переданными в теле
// country, director, duration, year, description, image,
// trailer, nameRU, nameEN и thumbnail, movieId
const createMovie = (req, res, next) => {
  const owner = req.user._id;
  const {
    country, director, duration, year, description,
    image, trailerLink, thumbnail, movieId, nameRU, nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner,
  })
    .then((movie) => res.status(201).send(movie))
    .catch(next);
};

// удаление фильма
const deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .orFail(new NotFoundError('Фильм с таким id не найден'))
    .then((movie) => {
      if (`${movie.owner}` !== req.user._id) {
        throw new ForbiddenError('Удалить этот фильм может только владелец аккаунта');
      }
      return Movie.deleteOne({ _id: movie._id })
        .then(() => movie); // Возвращаем удаленный фильм
    })
    .then((deletedMovie) => res.status(200).send(deletedMovie))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new RequestError('Неверный id фильма'));
      }
      return next(err);
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
