import { fetchRedis } from './redis';

export const getGame = async (id: string) => {
	const game = (await fetchRedis('get', `game:${id}`)) as string;
	const parsedGame = JSON.parse(game) as Game;

	return parsedGame;
};
