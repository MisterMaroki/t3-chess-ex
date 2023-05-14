import { getGame } from '@/helpers/get-game';
import { authOptions } from '@/lib/auth';
import ChessBoard from 'components/chess/Board';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

type Props = {
	params: {
		id: string;
	};
};

const Page = async ({ params }: Props) => {
	const session = await getServerSession(authOptions);
	if (!session) redirect('/');

	const game = await getGame(params.id);

	return (
		<div className="hello">
			<ChessBoard dbGame={{ ...game, id: params.id }} session={session} />
		</div>
	);
};

export default Page;
