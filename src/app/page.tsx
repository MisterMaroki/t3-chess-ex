import { Button } from '@/components/ui/Button';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function Home() {
	await db.set('hello', 'world');
	const session = await getServerSession(authOptions);
	if (session?.user) redirect('/home');

	return (
		<section className="flex-col w-full h-full flex-center">
			<h1 className="text-center head_text">
				GlassBoard <span className="text-6xl">♗</span> <br />
				<span className="text-center orange_gradient"> AI-Powered Moves</span>
			</h1>
			<p className="pb-8 text-center desc">
				Chat with your friends and play chess with the help of AI
			</p>
			<Link href="/login">
				<Button size="lg" className=" outline_btn">
					Get Started
				</Button>
			</Link>
		</section>
	);
}
