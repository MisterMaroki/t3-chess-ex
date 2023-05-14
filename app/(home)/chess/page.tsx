import ChessBoard from 'components/chess/Board';

export default function page() {
	return (
		<div className="container min-h-full md:overflow-y-auto">
			<audio autoPlay src="/welcome.mp3">
				Your browser does not support the
				<code>audio</code> element.
			</audio>
			<div className="absolute inset-0 w-full h-full ">
				<div className="glassy_bg chesslayoutbg" />
			</div>
			<ChessBoard dbGame={null} session={null} />
		</div>
	);
}
