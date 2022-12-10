import ReviewsDAO from "../dao/reviewsDAO.js";

// This will handle data requests for reviews.
export default class ReviewsController {

	static async apiPostReview(req, res, next) {
		try {

			const {body: {movie_id, review, name, user_id}} = req
			const userInfo = {name: name, _id: user_id}
			const reviewResponse = await ReviewsDAO.addReview(movie_id, userInfo, review, new Date())

			let {error} = reviewResponse
			error ? res.status(500).json({error: error}) : res.json({status: 'success'})
		} catch (e) {
			res.status(500).json({error: e.message})
		}
	}

	static async apiUpdateReview(req, res, next) {
		try {

			const {body: {review_id, review, user_id}} = req
			const updateResponse = await ReviewsDAO.updateReview(review_id, user_id, review, new Date())

			let {error} = updateResponse
			error ? res.status(500).json({error: error}) : res.json({status: 'success'})
		} catch (e) {
			res.status(500).json({error: e.message})
		}
	}

	static async apiDeleteReview(req, res, next) {
		try {

			const {body: {review_id, user_id}} = req
			const deleteResponse = await ReviewsDAO.deleteReview(review_id, user_id)

			let {error} = deleteResponse
			error ? res.status(500).json({error: error}) : res.json({status: 'success'})
		} catch (e) {
			res.status(500).json({error: e.message})
		}
	}
}
