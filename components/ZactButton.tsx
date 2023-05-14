'use client';

import { newGameAction } from '@/app/(home)/chess/actions';
import { Session } from 'next-auth';
import { redirect } from 'next/navigation';
import { FC, useEffect, useRef } from 'react';
import { useZact } from 'zact/client';
import { Button } from './ui/Button';

interface Props {
	session: Session | null;
}
export const ZactButton: FC<Props> = ({ session }) => {
	const { mutate, data, isLoading, error } = useZact(newGameAction);
	const inputRef = useRef<HTMLInputElement>(null);

	const createGame = () => {
		if (!session) return;
		mutate({
			userId: session.user.id,
			isPublic: false,
			length: 0,
			colorChoice: 'random',
		});
	};

	useEffect(() => {
		if (!data) return;
		const { id } = data;
		if (!id) return;
		redirect(`/chess/${id}`);
	}, [data]);
	return (
		<div>
			<input type="email" ref={inputRef} />
			<Button onClick={createGame} disabled={isLoading}>
				{isLoading ? 'Loading...' : error ? error.message : 'Click me'}
			</Button>
		</div>
	);
};
