import FavoritesDAO from '../dao/favoritesDAO.js'
// todo why need to put .js, webstorm does not do it for me

export default class FavoritesController {
	static async apiUpdateFavorites(req, res, next) {
		try {
			const {body: {_id, favorites}} = req
			const favorites_response = await FavoritesDAO.updateFavorites(_id, favorites)
			const {error} = favorites_response
			if (error) {
				res.status(500).json({error})
			}
			res.json({status: 'success'})
		} catch (e) {
			console.log(`API, failed to update favorites, ${e}`)
			res.status(500).json({error: e.message})
		}
	}

	static async apiGetFavorites(req, res, next) {
		try {
			const {params: {userId}} = req
			const favorites = await FavoritesDAO.getFavorites(userId)
			if (!favorites) {
				res.status(404).json({error: 'not found'})
				return
			}
			res.json(favorites)
		} catch (e) {
			console.log(`API, failed to get favorites, ${e}`)
			res.status(500).json({error: e})
		}
	}
}