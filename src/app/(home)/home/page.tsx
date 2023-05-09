import { ZactButton } from '@/components/ZactButton';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

const Page = async () => {
	const session = await getServerSession(authOptions);
	if (!session) redirect('/');

	return (
		<div className="flex w-full h-screen">
			<h1 className="head_text">Welcome, {session?.user.name}!</h1>
			<ZactButton session={session} />
		</div>
	);
};

export default Page;
