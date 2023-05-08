import Button from '@/components/ui/Button';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import Link from 'next/link';

const Page = async () => {
	const session = await getServerSession(authOptions);

	return (
		<Link href="/dashboard/add">
			<Button size="lg" className=" outline_btn">
				Add a friend
			</Button>
		</Link>
	);
};

export default Page;
