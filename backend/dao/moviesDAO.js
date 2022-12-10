import mongodb from 'mongodb'

const ObjectId = mongodb.ObjectId

let movies;

// This will query the MongoDB database directly for movies data.
export default class MoviesDAO {

	static async injectDB(con) {
		if (!movies) {
			try {
				movies = await con.db(process.env.MOVIEREVIEWS_NS).collection('movies')
			} catch (e) {
				console.error(`Unable to connect in MoviesDAO, ${e}`)
			}
		}
	}

	static async getMovies({filters = null, page = 0, moviesPerPage = 20} = {}) {
		let query
		if (filters) {
			if ('title' in filters) {
				query = {$text: {$search: filters.title}}
			} else if ('rated' in filters) {
				query = {'rated': {$eq: filters.rated}}
			}
		}

		try {
			const cursor = await movies.find(query).limit(moviesPerPage).skip(moviesPerPage * page)
			const moviesList = await cursor.toArray()
			const totalNumMovies = await movies.countDocuments(query)

			return {moviesList, totalNumMovies}
		} catch (e) {
			console.error(`Unable to issue find command, ${e}`)
			return {moviesList: [], totalNumMovies: 0}
		}
	}

	static async getRatings() {
		try {
			return await movies.distinct('rated')
		} catch (e) {
			console.error(`Unable to get ratings, ${e}`)
			return []
		}
	}

	static async getMovieById(id) {
		try {
			return await movies.aggregate([
				{$match: {_id: new ObjectId(id)}},
				{$lookup: {from: 'reviews', localField: '_id', foreignField: 'movie_id', as: 'reviews'}}
			]).next()
		} catch (e) {
			console.error(`Unable to get movie by id: ${e}`)
			throw e;
		}
	}

	static async getMovieByIdList(id_list) {
		try {

			// todo why does following not work
			//  movies.find({_id: {$in: id_list.map(id => new ObjectId(id))}})

			const obj_ids = id_list.map(id => new ObjectId(id))
			const cursor = await movies.aggregate([
				{$match: {_id: {$in: obj_ids}}},
			])
			return await cursor.toArray()
		} catch (e) {
			console.error(`Unable to get movie by id list: ${e}`)
			throw e;
		}
	}
}
