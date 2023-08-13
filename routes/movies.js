const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { URL } = require('../utils/constants');

const {
  getSaveMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getSaveMovies);
router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().length(24).hex(),
  }),
}), deleteMovie);
router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().regex(URL),
    trailerLink: Joi.string().required().regex(URL),
    thumbnail: Joi.string().required().regex(URL),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);

module.exports = router;
