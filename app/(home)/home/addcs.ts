'use server';

import { fetchRedis } from 'helpers/redis';
import { redis } from 'lib/redis';
import { zact } from 'zact/server';
import { z } from 'zod';

export const validatedAction = zact(
	z.object({
		userId: z.string(),
		emailToAdd: z.string().email(),
	})
)(async ({ emailToAdd, userId }) => {
	const friendIds = (await fetchRedis(
		'smembers',
		`user:${userId}:friends`
	)) as string[];

	const x = await redis.get(`user:${userId}`);
	console.log('🚀 ~ file: addcs.ts:23 ~ ) ~ x:', x);
	return { message: `added ${emailToAdd}\n to friends.` };
});
