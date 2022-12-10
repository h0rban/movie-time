import app from './server.js'
import mongodb from 'mongodb'
import dotenv from 'dotenv'
import MoviesDAO from './dao/moviesDAO.js'
import ReviewsDAO from "./dao/reviewsDAO.js";
import FavoritesDAO from "./dao/favoritesDAO.js";

async function main() {

	// sets up our environment variables with reference to the .env
	dotenv.config();

	// create a MongoDB client object with access to our database's URL
	const env = process.env
	const client = new mongodb.MongoClient(env.MOVIEREVIEWS_DB_URI)
	const port = env.PORT || 8000;

	try {

		// todo how to set timeout in case this does not connect

		// connect the client object to the database then we pass the client object to the DAO
		await client.connect()
		await MoviesDAO.injectDB(client)
		await ReviewsDAO.injectDB(client)
		await FavoritesDAO.injectDB(client)

		app.listen(port, () => console.log(`Server is running on port: ${port}`))

	} catch (e) {
		console.log(e)
		process.exit(1)
	}
}

main().catch(console.error)