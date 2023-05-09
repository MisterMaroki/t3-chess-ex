'use server';

import { z } from 'zod';
import { zact } from 'zact/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { fetchRedis } from '@/helpers/redis';
import { db } from '@/lib/db';

export const validatedAction = zact(
	z.object({
		email: z.string().max(5),
		userId: z.string(),
	})
)(async ({ email, userId }) => {
	try {
		const x = await db.get(`user:${userId}`);
		console.log('🚀 ~ file: addcs.ts:23 ~ ) ~ x:', x);
		return { message: `hello ${email}` };
	} catch (error) {
		console.log(error);
		return { message: JSON.stringify(error) };
	}
});
