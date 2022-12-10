import React, {useState} from 'react'

import MovieDataService from '../services/movies'
import {useParams, useLocation, useNavigate} from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'

const AddReview = ({user}) => {

	const params = useParams()
	const location = useLocation()
	const navigate = useNavigate()

	// todo figure out a better way to do editing, why not useState
	let editing = false
	let initialReviewState = ''

	if (location.state && location.state.currentReview) {
		editing = true
		// setReview(location.state.currentReview.review)
		initialReviewState = location.state.currentReview.review
		// todo should i sue set review here instead
	}

	const [review, setReview] = useState(initialReviewState)

	const onChangeReview = e => setReview(e.target.value)

	const saveReview = () => {

		let data = {
			review: review,
			name: user.name,
			user_id: user.googleId,
			movie_id: params.id
		}

		if (editing) {
			data.review_id = location.state.currentReview._id
			// data.review_id = review._id
			MovieDataService.updateReview(data)
				.then(response => navigate('/movies/' + params.id))
				.catch(e => console.log(e))
		} else {
			MovieDataService.createReview(data)
				.then(response => navigate('/movies/' + params.id))
				.catch(e => console.log(e))
		}
	}

	return (
		<Container className={'main-container'}>
			<Form>
				<Form.Group className={'mb-3'}>
					<Form.Label>{editing ? 'Edit' : 'Create'} Review</Form.Label>
					<Form.Control
						as={'textarea'}
						type={'text'}
						required
						review={review}
						onChange={onChangeReview}
						defaultValue={editing ? location.state.currentReview.review : ''}/>
						{/*// defaultValue={editing ? review.review : ''}/>*/}
				{/*	todo why cant i do this*/}
				</Form.Group>
				<Button variant={'primary'} onClick={saveReview}>Submit</Button>
			</Form>
		</Container>
	)
}

export default AddReview