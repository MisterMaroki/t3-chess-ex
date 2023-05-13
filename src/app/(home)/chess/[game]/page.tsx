import ChessBoard from '@/components/chess/Board';
import { FC } from 'react';

type Props = {
	params: {
		game: string;
	};
};

const page: FC<Props> = ({ params }) => {
	//check if game is in redis
	//if not, create new game
	//if so, load game
	//if game is over, show game over screen
	//if game is not over, show game

	return (
		<div className="">
			<ChessBoard />
		</div>
	);
};

export default page;
