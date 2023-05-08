import SignOutButton from '@/components/SignOutButton';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import Image from 'next/image';

const Page = async () => {
	const session = await getServerSession(authOptions);

	return <div className="flex w-full h-screen">{session?.user.email}</div>;
};

export default Page;
