import axios from "axios";

class MovieDataService {

	api_base = process.env.REACT_APP_API_BASE_URL

	getAll(page = 0) {
		return axios.get(`${this.api_base}/api/v1/movies?page=${page}`);
	}

	find(query, by = "title", page = 0) {
		return axios.get(`${this.api_base}/api/v1/movies?${by}=${query}&page=${page}`);
	}

	getRatings() {
		return axios.get(`${this.api_base}/api/v1/movies/ratings`);
	}

	getMovieBy(id) {
		return axios.get(`${this.api_base}/api/v1/movies/id/${id}`)
	}

	getMoviesByIdList(id_list) {

		// todo why does this approach not work
		// const data = {params: {id_list: id_list}}
		// return axios.get(`${this.api_base}/api/v1/movies/id-list/`, data)

		let listString = JSON.stringify(id_list);
		let url = `${process.env.REACT_APP_API_BASE_URL}/api/v1/movies/id-list/${listString}`
		return axios.get(url);
	}

	createReview(data) {
		return axios.post(`${this.api_base}/api/v1/movies/review`, data)
	}

	updateReview(data) {
		return axios.put(`${this.api_base}/api/v1/movies/review`, data)
	}

	deleteReview(data) {
		return axios.delete(`${this.api_base}/api/v1/movies/review`, data)
	}
}

export default new MovieDataService();
