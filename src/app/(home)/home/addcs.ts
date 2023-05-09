'use server';

import { z } from 'zod';
import { zact } from 'zact/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { fetchRedis } from '@/helpers/redis';
import { db } from '@/lib/db';

export const validatedAction = zact(
	z.object({
		email: z.string().email(),
		userId: z.string(),
	})
)(async ({ email, userId }) => {
	try {
		const friendIds = (await fetchRedis(
			'smembers',
			`user:${userId}:friends`
		)) as string[];
		console.log('friend ids', friendIds);

		const x = await db.get(`user:${userId}`);
		console.log('🚀 ~ file: addcs.ts:23 ~ ) ~ x:', x);
		return { message: `hello ${email}\n${friendIds}` };
	} catch (error) {
		console.log(error);
		return { message: JSON.stringify(error) };
	}
});
