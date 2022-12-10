import update from 'immutability-helper'
import {memo, useCallback, useEffect, useState} from 'react'
import {DnDCard} from './DnDCard.js'
import {useDrop} from "react-dnd";
import {ItemTypes} from "./ItemTypes";

import './FavoriteList.css'

// TODO review style
const style = {
	width: 500,
	margin: '1em',
}
export const FavoritesList = memo((
	{
		reorderFavorites,
		favorites_data,
		getFavorites,
	}) => {

	const [cards, setCards] = useState(favorites_data)

	useEffect(() => {
			if (favorites_data.length > 0) {
				setCards(favorites_data)
			}
		},
		// toString() used for comparisons to avoid unnecessary rerenders
		[favorites_data.toString()])

	useEffect(() => {
			// todo why does push favs not recognized as false here
			if (favorites_data.length > 0) {
				reorderFavorites(cards.map(c => c.id))
			}
		},
		[cards])

	useEffect(() => {
		// todo find out why list is empty on refresh
		if (favorites_data.length === 0) {
			getFavorites()
			// console.log(favorites_data)
		}
	}, [favorites_data, getFavorites])

	// todo consider doing a two-way hashmap
	const findCard = useCallback(id => {
		const card = cards.filter(c => `${c.id}` === id)[0]
		return {
			card,
			index: cards.indexOf(card)
		}
	}, [cards])

	const moveCard = useCallback((id, toIndex) => {
		const {card, index} = findCard(id)
		setCards(
			update(cards, {
				$splice: [
					[index, 1],
					[toIndex, 0, card],
				],
			})
		)
	}, [findCard, cards, setCards])

	const [, drop] = useDrop(() => ({accept: ItemTypes.DnDCard}))

	// todo what is the ref drop for
	return (
		<div ref={drop} style={style}>
			{
				cards.map((card, index) => (
						<DnDCard
							key={card.id}
							id={`${card.id}`}
							index={index}
							title={card.title}
							poster={card.poster}
							moveCard={moveCard}
							findCard={findCard}
						/>
					)
				)
			}
		</div>
	)
})
