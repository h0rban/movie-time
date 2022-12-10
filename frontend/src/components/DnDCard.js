import {memo} from 'react'
import {useDrag, useDrop} from 'react-dnd'
import {ItemTypes} from './ItemTypes.js'
import {Card} from "react-bootstrap";

import './FavoriteList.css'

const style = {
	padding: '10px',
	marginBottom: '.5rem',
	backgroundColor: 'white',
	cursor: 'move',
}

export const DnDCard = memo(({id, title, index, poster, moveCard, findCard}) => {

	const initialIndex = findCard(id).index

	const [{isDragging}, drag] = useDrag(() => ({
		type: ItemTypes.DnDCard,
		item: {id, initialIndex},
		collect: (monitor) => ({isDragging: monitor.isDragging()}),
		end: (item, monitor) => {
			const {id: droppedId, initialIndex} = item;
			!monitor.didDrop() && moveCard(droppedId, initialIndex)
		}
	}), [id, initialIndex, moveCard])

	const [, drop] = useDrop(
		() => ({
			accept: ItemTypes.DnDCard,
			hover({id: draggedId}) {
				if (draggedId !== id) {
					const {index: overIndex} = findCard(id)
					moveCard(draggedId, overIndex)
				}
			}
		}), [findCard, moveCard])

	const opacity = isDragging ? 0 : 1

	// todo see styling of numbers
	return (
		<div ref={(node) => drag(drop(node))} style={{...style, opacity}}>
			<Card className="favoritesCard">
				{index < 9
					?
					<div className="favoritesNumber favoritesNumberOneDigit">
						{index + 1}
					</div>
					:
					<div className="favoritesNumber favoritesNumberTwoDigit">
						{index + 1}
					</div>
				}
				{/* todo why does intellij not recognize the poster css*/}
				<div>
					<Card.Img
						className="favoritesPoster"
						src={poster + "/100px180"}
						onError={({currentTarget}) => {
							currentTarget.onerror = null; // prevents looping
							currentTarget.src = "/images/default-img.jpeg";
						}}/>
				</div>
				<div className="favoritesTitle">
					{title}
				</div>
			</Card>
		</div>
	)
})
