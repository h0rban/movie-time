import React, {useState, useEffect} from "react";
import MovieDataService from "../services/movies"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import Container from "react-bootstrap/Container"
import Card from "react-bootstrap/Card"
import Image from "react-bootstrap/Image"
import {Link, useParams} from "react-router-dom";
import "./Movie.css"

import Button from 'react-bootstrap/Button'
import moment from 'moment'

const Movie = ({user}) => {

	let params = useParams()

	const [movie, setMovie] = useState({
		id: null,
		title: "",
		rated: "",
		poster: "",
		plot: "",
		reviews: []
	})

	useEffect(() => {
		const getMovie = id => {
			MovieDataService.getMovieBy(id)
				.then(response => setMovie(response.data))
				.catch(e => console.log(e))
		}
		getMovie(params.id)
	}, [params.id])

	// todo can access user id both from the passed review and the user param, which is better
	const deleteReview = (review_id, index) => {

		let data = {
			review_id: review_id,
			user_id: user.googleId
		}

		// todo why do i need to wrap it in data
		MovieDataService.deleteReview({data: data})
			// MovieDataService.deleteReview(data)
			.then(response => {
				setMovie((prevState) => {
					prevState.reviews.splice(index, 1);
					return ({...prevState})
				})
			})
			.catch(e => console.log('failed to delete', e))
	}

	const makeReviewComponent = (review, index) => (
		<div className={"d-flex"} key={index}>
			<div className={"flex-shrink-0 reviewsText"}>
				<h5>{review.name + " reviewed on "} {moment(review.date).format('Do MMMM YYYY')}</h5>
				<p className={"review"}>{review.review}</p>
				{user && user.googleId === review.user_id &&
				<Row>
					<Col>
						<Link to={{pathname: '/movies/' + params.id + '/review'}}
						      state={{currentReview: review}}>
							Edit
						</Link>
					</Col>
					<Col>
						<Button variant={'link'} onClick={() => deleteReview(review._id, index)}>
							Delete
						</Button>
					</Col>
				</Row>
				}
			</div>
		</div>
	)

	return (
		<div className={"App"}>
			<Container>
				<Row>
					<Col>
						<div className={"poster"}>
							<Image className={"bigPicture"}
							       fluid
							       src={movie.poster + "/100px250"}
							       onError={({currentTarget}) => {
								       currentTarget.onerror = null // prevents looping
								       currentTarget.src = '/images/default-img.jpeg'
							       }}
							/>
						</div>
					</Col>
					<Col>
						<Card>
							<Card.Header as={"h5"}>{movie.title}</Card.Header>
							<Card.Body>
								<Card.Text>{movie.plot}</Card.Text>
								{user && <Link to={'/movies/' + params.id + '/review'}>Add Review</Link>}
							</Card.Body>
						</Card>
						<h2>Reviews</h2>
						<br/>
						{movie.reviews.map(makeReviewComponent)}
					</Col>
				</Row>
			</Container>
		</div>
	)
}

export default Movie