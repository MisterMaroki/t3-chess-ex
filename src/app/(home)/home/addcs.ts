'use server';

import { fetchRedis } from '@/helpers/redis';
import { db } from '@/lib/db';
import { zact } from 'zact/server';
import { z } from 'zod';

export const validatedAction = zact(
	z.object({
		email: z.string().email(),
		userId: z.string(),
	})
)(async ({ email, userId }) => {
	const friendIds = (await fetchRedis(
		'smembers',
		`user:${userId}:friends`
	)) as string[];
	console.log('friend ids', friendIds);

	const x = await db.get(`user:${userId}`);
	console.log('🚀 ~ file: addcs.ts:23 ~ ) ~ x:', x);
	return { message: `hello ${email}\n${friendIds}` };
});
