'use client';

import { validatedAction } from '@/app/(home)/home/addcs';
import { Session } from 'next-auth';
import { FC } from 'react';
import { useZact } from 'zact/client';

interface Props {
	session: Session | null;
}
export const ZactButton: FC<Props> = ({ session }) => {
	const { mutate, data, isLoading, error } = useZact(validatedAction);
	console.log('🚀 ~ file: ZactButton.tsx:14 ~ error:', error?.message);

	return (
		<>
			<button
				onClick={() =>
					mutate({
						email: session?.user.email || 'no email',
						userId: session?.user.id || 'no id',
					})
				}
				disabled={isLoading}
			>
				{data
					? data.message
					: isLoading
					? 'Loading...'
					: error
					? error.message
					: 'Click me'}
			</button>
			<button
				onClick={() =>
					mutate({
						email: 'mail',
						userId: session?.user.id || 'no id',
					})
				}
				disabled={isLoading}
			>
				{data
					? data.message
					: isLoading
					? 'Loading...'
					: error
					? error.message
					: 'Click me'}
			</button>
		</>
	);
};
