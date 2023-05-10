'use client';

import { validatedAction } from '@/app/(home)/home/addcs';
import { Session } from 'next-auth';
import { FC, useEffect, useRef } from 'react';
import { useZact } from 'zact/client';
import Button from './ui/Button';

interface Props {
	session: Session | null;
}
export const ZactButton: FC<Props> = ({ session }) => {
	const { mutate, data, isLoading, error } = useZact(validatedAction);
	const inputRef = useRef<HTMLInputElement>(null);

	const makeItHAppenBro = () => {
		if (!session) return;
		mutate({
			emailToAdd: inputRef.current?.value || '',
			userId: session?.user.id || '',
		});
	};

	return (
		<div>
			<input type="email" ref={inputRef} />
			<Button onClick={makeItHAppenBro} disabled={isLoading}>
				{data
					? data.message
					: isLoading
					? 'Loading...'
					: error
					? error.message
					: 'Click me'}
			</Button>
		</div>
	);
};
