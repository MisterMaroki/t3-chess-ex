'use client';

import { validatedAction } from '@/app/(home)/home/addcs';
import { Session } from 'next-auth';
import { FC, useEffect } from 'react';
import { useZact } from 'zact/client';
import Button from './ui/Button';

interface Props {
	session: Session | null;
}
export const ZactButton: FC<Props> = ({ session }) => {
	const { mutate, data, isLoading, error } = useZact(validatedAction);

	const makeItHAppenBro = () => {
		mutate({
			email: session?.user.email || 'no email',
			userId: session?.user.id || 'no id',
		});
	};
	useEffect(() => {
		if (session) makeItHAppenBro();
	}, [session]);

	return (
		<Button onClick={makeItHAppenBro} disabled={isLoading}>
			{data
				? data.message
				: isLoading
				? 'Loading...'
				: error
				? error.message
				: 'Click me'}
		</Button>
	);
};
