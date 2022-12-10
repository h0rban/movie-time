import axios from "axios";

class FavoritesDataService {

	api_base = process.env.REACT_APP_API_BASE_URL

	updateFavorites(data) {
		return axios.put(`${this.api_base}/api/v1/movies/favorites`, data)
	}

	getFavorites(user_id) {
		return axios.get(`${this.api_base}/api/v1/movies/favorites/${user_id}`)
	}
}

export default new FavoritesDataService();
