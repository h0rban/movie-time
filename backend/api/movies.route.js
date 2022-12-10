/*
	This will handle routing of incoming http requests, based on their URLs.
 */

import express from 'express'
import MoviesController from './movies.controller.js'
import ReviewsController from './reviews.controller.js'
import FavoritesController from './favorites.controller.js'

const router = express.Router() // get access to express router

// MOVIES
router.route('/').get(MoviesController.apiGetMovies)
router.route('/id/:id').get(MoviesController.apiGetMovieById)
router.route('/id-list/:idList').get(MoviesController.apiGetMovieByIdList)
// todo why does this not work
// router.route('/id-list').get(MoviesController.apiGetMovieByIdList)
router.route('/ratings').get(MoviesController.apiGetRatings)

// REVIEWS
router.route('/review')
	.put(ReviewsController.apiUpdateReview)
	.post(ReviewsController.apiPostReview)
	.delete(ReviewsController.apiDeleteReview)

// FAVORITES
router.route('/favorites').put(FavoritesController.apiUpdateFavorites)
router.route('/favorites/:userId').get(FavoritesController.apiGetFavorites)

export default router
