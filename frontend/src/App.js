import {GoogleOAuthProvider} from '@react-oauth/google';

import {Routes, Route, Link} from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import Container from "react-bootstrap/Container"
import Nav from "react-bootstrap/Nav"
import Navbar from "react-bootstrap/Navbar"

// components
import MoviesList from "./components/MoviesList"
import Movie from "./components/Movie"
import Login from "./components/Login";
import Logout from "./components/Logout";
import AddReview from "./components/AddReview";

import './App.css';
import './components/FavoriteList.css'

import {useState, useEffect, useCallback} from "react";
import FavoritesDataService from "./services/favorites";
import MovieDataService from "./services/movies";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {FavoritesList} from "./components/FavoritesList";


const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;


// todo what is the difference between useEffect and eseCallback

function App() {

	const [user, setUser] = useState(null)
	const [favorites_ids, setFavorites_ids] = useState([])
	const [favorites_data, setFavorites_data] = useState([])
	const [push_favorites, setPush_favorites] = useState(false)


	const getFavorites = useCallback(() => {
		FavoritesDataService.getFavorites(user.googleId)
			.then(res => {
				const {data: {favorites}} = res
				setFavorites_ids(favorites)
				// console.log('setting ids to retrieved: ', favorites)
			})
			.catch(e => console.log(e))
	}, [user])

	const set_and_push_favs = (new_favs, log = false) => {
		log && console.log(new_favs)
		setPush_favorites(true)
		setFavorites_ids(new_favs)

		// todo verify this is set to false
	}

	const addFavorite = mid => set_and_push_favs([...favorites_ids, mid])
	const deleteFavorite = mid => set_and_push_favs(favorites_ids.filter(f => f !== mid))
	const reorderFavorites = new_ids => set_and_push_favs(new_ids, true)

	const updateFavorites = useCallback(() => {
		FavoritesDataService.updateFavorites({
			_id: user.googleId,
			favorites: favorites_ids
		})
			// todo why dont i want to have this then
			// .then(res => setFavorites_ids(new_favs))
			.catch(e => console.log(e))
	}, [user, favorites_ids])

	const pullFavoritesData = useCallback(() => {

		// TODO WHY IS THIS CALLED MULTIPLE TIMES

		// console.log('pull called for ids:',
		// 	favorites_ids,
		// 	favorites_ids.length === 0 ? 'ignoring' : '')

		if (favorites_ids.length > 0) {

			// todo consider pulling fav ids first

			MovieDataService.getMoviesByIdList(favorites_ids)
				.then(response => {

					let sorted = response.data.sort(
						(a, b) => favorites_ids.indexOf(a._id) - favorites_ids.indexOf(b._id)
					)

					setFavorites_data(
						sorted.map(movie => {
							return {
								id: movie._id,
								title: movie.title,
								poster: movie.poster
							}})
					)
				})
				.catch(e => console.log(e))
		}
	}, [favorites_ids]);

	useEffect(() => {
		if (user && push_favorites) {
			updateFavorites()
			setPush_favorites(false)
		}
		// todo do i need favorites_ids here ?
	}, [user, favorites_ids, push_favorites, updateFavorites, setPush_favorites])

	useEffect(() => {
		if (user) {
			getFavorites()
		}
	}, [user, getFavorites])

	useEffect(() => {
		pullFavoritesData()
	}, [favorites_ids, pullFavoritesData])

	useEffect(() => {
		let loginData = JSON.parse(localStorage.getItem("login"));
		if (loginData) {
			let loginExp = loginData.exp;
			let now = Date.now() / 1000;
			if (now < loginExp) {
				// Not expired
				setUser(loginData);
			} else {
				// Expired
				localStorage.setItem("login", null);
			}
		}
	}, []);

	const nav_bar = (
		<Navbar bg={"primary"} expand={"lg"} sticky={"top"} variant={"dark"}>
			<Container className={"container-fluid"}>
				<Navbar.Brand className={"brand"} href={"/"}>
					{/*todo check why the logo disappears on review page if reloaded*/}
					<img src={"images/movies-logo.png"} alt={"movies logo"} className={"moviesLogo"}/>
					MOVIE TIME
				</Navbar.Brand>
				<Navbar.Toggle aria-controls={"basic-navbar-nav"}/>
				<Navbar.Collapse id={"responsive-nav-bar"}>
					<Nav className={"ml-auto"}>
						<Nav.Link as={Link} to={"/movies"}>
							Movies
						</Nav.Link>
						{user &&
							<Nav.Link as={Link} to={"/favorites"}>
								Favorites
							</Nav.Link>
						}
					</Nav>
				</Navbar.Collapse>
				{user ? <Logout setUser={setUser}/> : <Login setUser={setUser}/>}
			</Container>
		</Navbar>
	)

	const movie_list = <MoviesList user={user} addFavorite={addFavorite} deleteFavorite={deleteFavorite}
	                               favorites={favorites_ids}/>

	const fav_list = (

		<div>
			<Container className={'favoritesContainer'}>
				<div className={"favoritesPanel"}>
					{favorites_ids.length < 1
						? "You haven't chosen any favorites yet"
						: "Drag your favorites to rank them"}
				</div>
				<DndProvider backend={HTML5Backend}>
					<FavoritesList
						reorderFavorites={reorderFavorites}
						favorites_data={favorites_data}
						getFavorites={getFavorites}
					/>
				</DndProvider>
			</Container>
		</div>
	)

	// todo check if exact path is different from path
	// todo also check when the movie is clicked I am not at the top of the page
	const routes = (
		<Routes>
			<Route exact path={"/"} element={movie_list}/>
			<Route exact path={"/movies"} element={movie_list}/>
			<Route exact path={"/movies/:id/"} element={<Movie user={user}/>}/>
			<Route exact path={"/movies/:id/review"} element={<AddReview user={user}/>}/>

			{/* todo this works but what is the point of showing movies in the favorites_ids route */}
			<Route exact path={"/favorites"} element={user ? fav_list : movie_list}/>
		</Routes>
	)

	return (
		<GoogleOAuthProvider clientId={clientId}>
			<div className={"App"}>
				{nav_bar}
				{routes}
			</div>
		</GoogleOAuthProvider>
	);
}

export default App;
