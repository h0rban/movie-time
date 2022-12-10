import React, {useState, useEffect, useCallback} from "react";
import MovieDataService from "../services/movies"
import {Link} from "react-router-dom"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import Container from "react-bootstrap/Container"
import Card from "react-bootstrap/Card"
import {BsStar, BsStarFill} from 'react-icons/bs'

import "./MoviesList.css"

const MoviesList = ({user, favorites, addFavorite, deleteFavorite}) => {

	// todo is there a way to make transition to start when user logs in instead of showing them immediately

	// useState to set state values
	const [movies, setMovies] = useState([]);
	const [searchTitle, setSearchTitle] = useState("");
	const [searchRating, setSearchRating] = useState("");
	const [ratings, setRatings] = useState(["AllRatings"]);
	const [currentPage, setCurrentPage] = useState(0);
	const [entriesPerPage, setEntriesPerPage] = useState(0);
	const [currentSearchMode, setCurrentSearchMode] = useState("");

	// useCallback to define function which should only be created once and will be dependencies for useEffect
	const retrieveRatings = useCallback(() => {
		MovieDataService.getRatings()
			.then(response => setRatings(["AllRatings"].concat(response.data)))
			.catch(e => console.log(e))
	}, [])

	const retrieveMovies = useCallback(() => {
		setCurrentSearchMode("")
		MovieDataService.getAll(currentPage)
			.then(response => {
				const {data: {movies, page, entries_per_page}} = response
				setMovies(movies)
				setCurrentPage(page)
				setEntriesPerPage(entries_per_page)
			})
			.catch(e => console.log(e))
	}, [currentPage])

	const find = useCallback((query, by) => {
		MovieDataService.find(query, by, currentPage)
			.then(response => setMovies(response.data.movies))
			.catch(e => console.log(e))
	}, [currentPage])

	const findByTitle = useCallback(() => {
		setCurrentSearchMode("findByTitle")
		find(searchTitle, "title")
	}, [find, searchTitle])

	const findByRating = useCallback(() => {
		setCurrentSearchMode("findByRating")
		searchRating === "All Ratings" ? retrieveMovies() : find(searchRating, "rated")
	}, [find, searchRating, retrieveMovies])

	const retrieveNextPage = useCallback(() => {
		switch (currentSearchMode) {
			case "findByTitle":
				findByTitle()
				break
			case "findByRating":
				findByRating()
				break
			default:
				retrieveMovies()
		}
	}, [currentSearchMode, findByTitle, findByRating, retrieveMovies])

	// to carry out side effect functionality
	useEffect(() => retrieveRatings(), [retrieveRatings])
	useEffect(() => setCurrentPage(0), [currentSearchMode])
	useEffect(() => retrieveNextPage(), [currentPage, retrieveNextPage])

	// not dependent on by useEffect
	const onChangeSearchTitle = e => setSearchTitle(e.target.value)
	const onChangeSearchRating = e => setSearchRating(e.target.value)

	const makeMovieCard = movie => (
		<Col key={movie._id}>
			<Card className={"moviesListCard"}>
				{user && (
					favorites.includes(movie._id)
						? <BsStarFill className={'star starFill'} onClick={() => deleteFavorite(movie._id)}/>
						: <BsStar className={'star starEmpty'} onClick={() => addFavorite(movie._id)}/>
				)}
				<Card.Img className={"smallPoster"}
				          src={movie.poster + '/100px180'}
				          onError={({currentTarget}) => {
					          currentTarget.onerror = null // prevents looping
					          currentTarget.src = '/images/default-img.jpeg'
				          }}
				/>
				<Card.Body>
					<Card.Title>{movie.title}</Card.Title>
					<Card.Text>Rating: {movie.rated}</Card.Text>
					<Card.Text>{movie.plot}</Card.Text>
					<Link to={"/movies/" + movie._id}>View Reviews</Link>
				</Card.Body>
			</Card>
		</Col>
	)

	return (
		<div className={"App"}>
			<Container className={"main-container"}>
				<Form>
					<Row>
						<Col>
							<Form.Group className={"mb-3"}>
								<Form.Control type={"text"} placeholder={"Search by title"} value={searchTitle}
								              onChange={onChangeSearchTitle}/>
							</Form.Group>
							<Button variant={"primary"} type={"button"} onClick={findByTitle}>Search</Button>
						</Col>
						<Col>
							<Form.Group className={"mb-3"}>
								<Form.Control as={"select"} onChange={onChangeSearchRating}>
									{ratings.map((rating, i) => (<option value={rating} key={i}>{rating}</option>))}
								</Form.Control>
							</Form.Group>
							<Button variant={"primary"} type={"button"} onClick={findByRating}>Search</Button>
						</Col>
					</Row>
				</Form>
				<Row className={"movieRow"}>{movies.map(makeMovieCard)}</Row>
				<br/>
				Showing page: {currentPage + 1}
				<Button variant={"link"} onClick={() => setCurrentPage(currentPage + 1)}>
					Get next {entriesPerPage} results
				</Button>
			</Container>
		</div>
	)
}

export default MoviesList;