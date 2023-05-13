import Providers from '@/components/Providers';
import './globals.css';

export const metadata = {
	title: 'GlassBoard Chess',
	description: 'Create and play chess games with your friends',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>
				<div className="main">
					<div className="gradient" />
				</div>
				<main className="min-h-screen antialiased app">
					<Providers>{children}</Providers>
				</main>
			</body>
		</html>
	);
}
