import SignOutButton from '@/components/SignOutButton';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button';

const Page = async () => {
	const session = await getServerSession(authOptions);

	return (
		<div className="flex w-full h-screen">
			<h1 className="head_text">Welcome, {session?.user.name}!</h1>
		</div>
	);
};

export default Page;
