'use client';

import { validatedAction } from '@/app/(home)/home/addcs';
import { Session } from 'next-auth';
import { FC } from 'react';
import { useZact } from 'zact/client';

interface Props {
	session: Session | null;
}
export const ZactButton: FC<Props> = ({ session }) => {
	console.log('🚀 ~ file: ZactButton.tsx:10 ~ session:', session);
	const { mutate, data, isLoading, error } = useZact(validatedAction);

	return (
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
	);
};
