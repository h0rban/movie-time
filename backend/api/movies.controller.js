import MoviesDAO from "../dao/moviesDAO.js";

function parseInt_or_default(data, default_value) {
	return parseInt(data) || default_value
}

function verify(item) {
	if (!item) {
		throw new Error('item is undefined')
	}
	return item
}

// This will handle data requests specific to movies.
export default class MoviesController {

	static async apiGetMovies(req, res, next) {

		const query = verify(req.query)

		// paging information that will be optionally passed in along with the HTTP request
		const moviesPerPage = parseInt_or_default(query.moviesPerPage, 20)
		const page = parseInt_or_default(query.page, 0)

		// set filters on ratings and title based on what are submitted with the query.
		let filters = {}
		if (query.rated) {
			filters.rated = query.rated
		} else if (query.title) {
			filters.title = query.title
		}

		// make the request to the MoviesDAO object using its getMovies method
		const {moviesList, totalNumMovies} =
			await MoviesDAO.getMovies({filters, page, moviesPerPage})

		// take the information retrieved by the DAO,package it up into an object
		// called response and put that into the HTTP response object as JSON
		let response = {
			page: page,
			filters: filters,
			movies: moviesList,
			total_results: totalNumMovies,
			entries_per_page: moviesPerPage,
		}

		res.json(response)
	}

	static async apiGetMovieById(req, res, next) {
		try {
			let id = req.params.id || {}
			let movie = await MoviesDAO.getMovieById(id)

			if (!movie) {
				res.status(404).json({error: 'apiGetMovieById: movie not found'})
				return;
			}
			res.json(movie)
		} catch (e) {
			console.error(`API, apiGetMovieById failed: ${e}`)
			res.status(500).json({error: e})
		}
	}

	static async apiGetMovieByIdList(req, res, next) {
		try {

			const {params: {idList}} = req

			let movies = await MoviesDAO.getMovieByIdList(JSON.parse(idList))

			if (!movies) {
				res.status(404).json({error: 'apiGetMovieByIdList: movies not found'})
				return;
			}
			res.json(movies)
		} catch (e) {
			console.error(`API, apiGetMovieByIdList failed: ${e}`)
			res.status(500).json({error: e})
		}
	}

	static async apiGetRatings(req, res, next) {
		try {
			let propertyTypes = await MoviesDAO.getRatings()
			res.json(propertyTypes)
		} catch (e) {
			console.error(`API, apiGetRatings failed: ${e}`)
			res.status(500).json({error: e})
		}
	}
}
