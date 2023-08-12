const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getSaveMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getSaveMovies);
router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex(),
  }),
}), deleteMovie);
router.post('/', createMovie);

module.exports = router;
