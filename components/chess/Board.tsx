'use client';

import { getBookMoveAction, makeMoveAction } from '@/app/(home)/chess/actions';
import { pusherClient } from '@/lib/pusher';
import { toPusherKey } from '@/lib/utils';
import { Chess } from 'chess.ts';
import { Move, PartialMove, Piece, Square } from 'chess.ts/dist/types';
import type { NextPage } from 'next';
import { Session } from 'next-auth';
import { useEffect, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { useZact } from 'zact/client';
import { Button } from '../ui/Button';
import MoveList from './MoveList';

interface GameProps {
	dbGame: Game;
	session: Session;
}
const ChessBoard: NextPage<GameProps> = ({ dbGame, session }) => {
	// console.log('🚀 ~ file: Board.tsx:25 ~ session:', session);
	// console.log('🚀 ~ file: Board.tsx:25 ~ dbGame:', dbGame);
	const isBlack = dbGame.whitePlayer !== session?.user.id;
	console.log('🚀 ~ file: Board.tsx:26 ~ isBlack:', isBlack);
	const [game, setGame] = useState(new Chess(dbGame?.fen || undefined));
	const color = isBlack ? 'black' : 'white';
	const [engineHasMoves, setEngineHasMoves] = useState(true);
	const [opening, setOpening] = useState('');
	const isMyTurn = isBlack ? game.turn() === 'b' : game.turn() === 'w';
	console.log('🚀 ~ fsile: Board.tsx:22 ~ isMyTurn:', isMyTurn);

	const { mutate, data } = useZact(makeMoveAction);

	useEffect(() => {
		if (!data || !data.fen) return;

		setGame((g: Chess) => {
			g.load(data.fen);
			return g.clone();
		});
	}, [data?.fen]);

	useEffect(() => {
		if (!dbGame.id) return;
		pusherClient.subscribe(toPusherKey(`game:${dbGame.id}:fen`));
		console.log('listening to ', `game:${dbGame.id}:fen`);

		const newMoveHandler = (fen: string) => {
			console.log('🚀 ~ file: Board.tsx:49 ~ newMoveHandler ~ fen:', fen);
			setGame((g: Chess) => {
				g.load(fen);
				return g.clone();
			});
		};

		pusherClient.bind('new_move', newMoveHandler);

		return () => {
			pusherClient.unsubscribe(toPusherKey(`game:${dbGame.id}:fen`));
			pusherClient.unbind('new_move', newMoveHandler);
		};
	}, [dbGame.id]);

	const doStep = async (move: PartialMove) => {
		// We already verified that the inputted move was valid
		// Compute the history here, apply the inputted move as
		// fast as possible, then await the api and apply the response

		if (!isMyTurn) return;

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

		if (dbGame?.id) {
			console.log('updated game', game.history());
			await mutate({
				id: dbGame.id,
				fen: game.fen(),
				userId: session?.user.id,
			});
			return;
		}

		const data = await getBookMoveAction({ play: history, fen: game.fen() });

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
		<div className="relative flex flex-col flex-1 gap-4 pt-8 lg::h-full lg:flex-row ">
			<div className="flex flex-col flex-[2] min-w-max ">
				<Chessboard
					id={'chessboard'}
					position={game.fen()}
					boardOrientation={color}
					onPieceDrop={(sourceSquare, targetSquare) =>
						onDrop(sourceSquare, targetSquare)
					}
					// getPositionObject={(fen) => {
					// 	// console.log('🚀 ~ file: ChessBoard.tsx:96 ~ fen:', fen);
					// }}
					// customDarkSquareStyle={{ backgroundColor: '#779952' }}
					// customLightSquareStyle={{ backgroundColor: '#edeed1' }}
					customDarkSquareStyle={{
						backgroundColor: '#31ddaf57',
					}}
					customLightSquareStyle={{
						backgroundColor: '#79dbc111',
					}}
					arePremovesAllowed
				/>
				<div className="flex gap-2 mt-4">
					<Button
						onClick={() => {
							setGame(new Chess());
							setOpening('');
							setEngineHasMoves(true);
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
					<div className="flex items-center">
						<p>Playing as:</p>
						<p className="ml-2 text-gray-500">{isBlack ? 'Black' : 'White'}</p>
					</div>
				</div>
			</div>

			<div className="flex flex-col flex-1 gap-2 ">
				<div className="flex flex-row justify-between px-4">
					<div className="flex items-center">
						<p>Opening:</p>
						<p className="ml-2 text-sm text-gray-500">
							{opening || 'Waiting...'}
						</p>
					</div>
					<div className="flex items-center">
						<p>Engine</p>
						<span
							className={`ml-2 w-4 h-4 ${
								engineHasMoves ? 'bg-green-400' : 'bg-red-400'
							} border-2 border-white rounded-full -top-2 -right-2 dark:border-gray-900 blur-[1px] `}
						></span>
					</div>
				</div>
				<div className="max-h-[54vh] flex-1">
					<MoveList moves={game.history({ verbose: true })} />
				</div>
			</div>
		</div>
	);
};

export default ChessBoard;
