'use server';

import { getGame } from '@/helpers/get-game';
import { pusherServer } from '@/lib/pusher';
import { redis } from '@/lib/redis';
import { toPusherKey } from '@/lib/utils';
import axios, { AxiosError } from 'axios';
import { Chess } from 'chess.ts';
import { nanoid } from 'nanoid';
import { zact } from 'zact/server';
import { z } from 'zod';

type MastersResponseMove = {
	uci: string;
	san: string;
	averageRating: number;
	white: number;
	draws: number;
	black: number;
	game: null;
};

type MastersResponse = {
	white: number;
	black: number;
	draw: number;
	moves: MastersResponseMove[];
	topGames: MastersResponseGame[];
	opening: {
		eco: string;
		name: string;
	};
};

type MastersResponseGame = {
	uci: string;
	san: string;
	averageRating: number;
	white: number;
	draws: number;
	black: number;
	game: null;
};

export const getBookMoveAction = zact(
	z.object({
		play: z.string(),
		fen: z.string(),
	})
)(async ({ play, fen }) => {
	const lichessResponse = await axios
		.get<MastersResponse>('masters', {
			baseURL: 'https://explorer.lichess.ovh',
			headers: {
				Authorization: `Bearer ${process.env.LICHESS_API_KEY}`,
			},

			params: {
				play,
				// fen: fen,
				// since: 1952,
				// moves: 12,
				// topGames: 0,
			},
		})
		.catch((e: AxiosError) => console.log(e.response?.data));

	if (lichessResponse) {
		const resData = lichessResponse.data as MastersResponse;

		if (resData.moves.length > 0) {
			return {
				res: resData.moves[0].san,
				online: true,
				opening: resData.opening.name,
			};
		}
	}
	const game = new Chess(fen);
	const moves = game.moves({ verbose: true });
	const randomIndex = Math.floor(Math.random() * moves.length);
	const randomMove = moves[randomIndex];
	return { res: randomMove?.san, online: false, opening: '' };
});

export const newGameAction = zact(
	z.object({
		isPublic: z.boolean(),
		length: z.number(),
		colorChoice: z.enum(['random', 'white', 'black']),
		userId: z.string(),
	})
)(async ({ isPublic, length, colorChoice, userId }) => {
	const game = new Chess();
	const fen = game.fen();
	const id = nanoid();
	const color =
		colorChoice === 'random'
			? Math.random() > 0.5
				? 'white'
				: 'black'
			: colorChoice;

	await redis.set(`game:${id}`, {
		fen,
		blackPlayer: color === 'black' ? userId : null,
		whitePlayer: color === 'white' ? userId : null,
		isPublic,
		length,
		nextMove: 'white',
	});

	return { id, color };
});

export const getGameAction = zact(
	z.object({
		id: z.string(),
	})
)(async ({ id }) => {
	const game: Game | null = await redis.get(`game:${id}`);
	return game;
});

export const makeMoveAction = zact(
	z.object({
		id: z.string(),
		fen: z.string(),
		userId: z.string(),
	})
)(async ({ id, fen, userId }) => {
	const game = await getGame(id);
	if (!game) {
		return { error: 'Game not found' };
	}

	const isBlack = game.whitePlayer !== userId;

	const res = await redis.set(`game:${id}`, {
		fen,
		blackPlayer: isBlack ? userId : game.blackPlayer,
		whitePlayer: !isBlack ? userId : game.whitePlayer,
		isPublic: game.isPublic,
		length: game.length + 1,
		nextMove: game.nextMove === 'white' ? 'black' : 'white',
	});

	pusherServer.trigger(toPusherKey(`game:${id}:fen`), 'new_move', fen);

	return { fen: fen };
});
