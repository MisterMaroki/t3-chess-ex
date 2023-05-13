'use client';

import { getBookMove } from '@/app/(home)/chess/getBookMove';
import { Chess } from 'chess.ts';
import { Move, PartialMove, Piece, Square } from 'chess.ts/dist/types';
import type { NextPage } from 'next';
import { Fragment, useEffect, useRef, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Button } from '../ui/Button';
import MoveList from './MoveList';

const ChessBoard: NextPage = () => {
	const [game, setGame] = useState(new Chess());
	const availableSquares = useRef<string[]>([]);
	const [engineHasMoves, setEngineHasMoves] = useState(true);
	const [opening, setOpening] = useState('');

	useEffect(() => {
		console.log('updated game', game.history());
	}, [game]);
	const doStep = async (move: PartialMove) => {
		// We already verified that the inputted move was valid
		// Compute the history here, apply the inputted move as
		// fast as possible, then await the api and apply the response

		let history = game
			.history({ verbose: true })
			.map((m: Move) => `${m.from}${m.to}`)
			.join(',');
		if (history !== '') history += ',';
		history += `${move.from}${move.to}`;

		setGame((g: Chess) => {
			g.move(move);
			return g.clone();
		});

		const data = await getBookMove({ play: history, fen: game.fen() });

		if (data?.res) {
			setGame((g: Chess) => {
				g.move(data.res);
				return g.clone();
			});
		} else {
			console.log('no move found');
		}

		if (data?.opening) setOpening(data.opening);

		setEngineHasMoves(!!data?.online);
	};

	const onDrop: (
		sourceSquare: Square,
		targetSquare: Square,
		piece?: Piece
	) => boolean = (sourceSquare, targetSquare, piece) => {
		const pmove = {
			from: sourceSquare,
			to: targetSquare,
			promotion: 'q',
		} as PartialMove;
		// Seems like we need to validate the move by using a new object...
		if (game.validateMoves([pmove as Move])) {
			doStep(pmove);
			return true;
		}
		return false;
	};

	return (
		<Fragment>
			<div className="flex flex-col flex-1 ">
				<Chessboard
					id={'chessboard'}
					position={game.fen()}
					onPieceDrop={(sourceSquare, targetSquare) =>
						onDrop(sourceSquare, targetSquare)
					}
					onPieceDragBegin={(piece, from) => {
						const moves = game.moves({ square: from, verbose: true });
						if (moves.length === 0) return;
						const squaresToHighlight = moves.map((m) => m.to);
						availableSquares.current = squaresToHighlight;
					}}
					onPieceDragEnd={() => {
						availableSquares.current = [];
					}}
					getPositionObject={(fen) => {
						// console.log('🚀 ~ file: ChessBoard.tsx:96 ~ fen:', fen);
					}}
					customBoardStyle={{
						borderRadius: '4px',
						// boxShadow: '0 0px 1px rgba(0, 0, 0, 0.9)',
						backdropFilter: 'blur(4px)',
					}}
					// customDarkSquareStyle={{ backgroundColor: '#779952' }}
					// customLightSquareStyle={{ backgroundColor: '#edeed1' }}
					customDarkSquareStyle={{
						backgroundColor: 'radial-gradient(#31ddaf, #312e81)',
					}}
					customLightSquareStyle={{
						backgroundColor: '#31ddaf41',
						// backdropFilter: 'blur(40px)',
					}}
					// customPieces={customPieces()}
					// customSquare={({ children, square, squareColor, style }) => {
					// 	const isHighlighted = availableSquares.current.includes(square);
					// 	return (
					// 		<div
					// 			// ref={ref}
					// 			style={{
					// 				...style,
					// 				...(isHighlighted
					// 					? {
					// 							boxShadow: `inset 0 0 0 2px ${
					// 								squareColor === 'white' ? '#779952' : '#edeed1'
					// 							}`,
					// 					  }
					// 					: {}),
					// 			}}
					// 		>
					// 			{children}
					// 		</div>
					// 	);
					// }}
					areArrowsAllowed
					arePremovesAllowed
					showBoardNotation={false}
					clearPremovesOnRightClick
					animationDuration={150}
				/>
				<div className="flex gap-2 mt-4">
					<Button
						onClick={() => {
							setGame(new Chess());
						}}
					>
						Reset
					</Button>
					<Button
						onClick={() => {
							setGame((g: Chess) => {
								g.undo();
								return g.clone();
							});
						}}
					>
						Undo
					</Button>
				</div>
			</div>

			<div className="flex flex-col justify-start flex-1">
				<div className="flex flex-row justify-between px-4">
					<div className="flex items-center">
						<p>Engine</p>
						<span
							className={`ml-2 w-4 h-4 ${
								engineHasMoves ? 'bg-green-400' : 'bg-red-400'
							} border-2 border-white rounded-full -top-2 -right-2 dark:border-gray-900 blur-[1px] `}
						></span>
					</div>

					<div className="flex items-center">
						<p>Opening:</p>
						<p className="ml-2 text-sm text-gray-500">
							{opening || 'Waiting...'}
						</p>
					</div>
				</div>
				<MoveList moves={game.history({ verbose: true })} />
			</div>
		</Fragment>
	);
};

export default ChessBoard;
