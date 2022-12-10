let collection;

// todo should there be three different connections or just one

export default class FavoritesDAO {
	static async injectDB(con) {
		if (collection) {
			return
		}
		try {
			collection = await con.db(process.env.MOVIEREVIEWS_NS).collection('favorites')
		} catch (e) {
			console.error(`Unable to connect in FavoritesDAO: ${e}`)
		}
	}

	static async updateFavorites(userId, favorites) {
		try {
			return await collection.updateOne(
				{_id: userId},
				{$set: {favorites: favorites}},
				{upsert:true}
			)
		} catch (e) {
			console.error(`Unable to update favorites: ${e}`)
			return {error: e}
		}
	}

	static async getFavorites(id) {
		try {
			// todo why need multiple awaits
			// todo this returns only the first twenty right?

			let cursor = await collection.find({_id: id})
			let data = await cursor.toArray()
			return data[0] ||
				{
				_id: 'id',
				favorites: []
			}

		} catch (e) {
			console.error(`Something went wrong in getFavorites: ${e}`)
			throw e
		}
	}
}