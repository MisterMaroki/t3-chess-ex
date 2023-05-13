'use server';

import { fetchRedis } from 'helpers/redis';
import { redis } from 'lib/redis';
import axios, { AxiosError } from 'axios';
import { Chess } from 'chess.ts';
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

export const getBookMove = zact(
	z.object({
		play: z.string(),
		fen: z.string(),
	})
)(async ({ play, fen }) => {
	console.log('🚀 ~ file: getBookMove.ts:44 ~ ) ~ fen:', fen);
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
		console.log('🚀 ~ file: getBookMove.ts:63 ~ ) ~ resData:', resData);

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
