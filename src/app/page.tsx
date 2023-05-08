import Button from '@/components/ui/Button';
import { db } from '@/lib/db';
import Link from 'next/link';

export default async function Home() {
	await db.set('hello', 'world');

	return (
		<section className="flex-col w-full flex-center">
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
