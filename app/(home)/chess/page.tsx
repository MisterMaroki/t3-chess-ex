import ChessBoard from 'components/chess/Board';

export default function page() {
	return (
		<section className="container min-h-full md:overflow-y-auto">
			<audio autoPlay src="/welcome.mp3">
				Your browser does not support the
				<code>audio</code> element.
			</audio>

			<ChessBoard dbGame={null} session={null} />
		</section>
	);
}
