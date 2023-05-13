import ChessBoard from '@/components/chess/Board';

export default function page() {
	return (
		<div className="container relative flex flex-col h-full pt-8 md:flex-row">
			<audio autoPlay src="/welcome.mp3">
				Your browser does not support the
				<code>audio</code> element.
			</audio>
			<ChessBoard />
		</div>
	);
}
