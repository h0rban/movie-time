import mongodb from "mongodb"

const ObjectId = mongodb.ObjectId

let reviews;

function make_review_filter(reviewId, userId) {
	return {
		_id: new ObjectId(reviewId),
		user_id: userId
	}
}

// This will query the MongoDB database directly for reviews data.
export default class ReviewsDAO {

	static async injectDB(con) {
		if (!reviews) {
			try {
				reviews = await con.db(process.env.MOVIEREVIEWS_NS).collection('reviews')
			} catch (e) {
				console.error(`Unable to connect in ReviewsDAO, ${e}`)
			}
		}
	}

	static async addReview(movieId, user, review, date) {
		try {
			return await reviews.insertOne({
				name: user.name,
				user_id: user._id,
				date: date,
				review: review,
				movie_id: new ObjectId(movieId)
			})
		} catch (e) {
			console.error(`Unable to post review: ${e}`)
			return {error: e}
		}
	}

	static async updateReview(reviewId, userId, review, date) {
		try {
			return await reviews.updateOne(
				make_review_filter(reviewId, userId),
				{
					$set: {review: review, date: date},
					$inc: {modifiedCount: 1}
				})
		} catch (e) {
			console.error(`Unable to update review: ${e}`)
		}
	}

	static async deleteReview(reviewId, userId) {
		try {
			return await reviews.deleteOne(make_review_filter(reviewId, userId))
		} catch (e) {
			console.error(`Unable to delete review: ${e}`)
		}
	}
}