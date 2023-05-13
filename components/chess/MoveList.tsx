'use client';
import { Move } from 'chess.ts';
import { use, useEffect, useRef } from 'react';
import { ScrollArea } from '../ui/scroll-area';

const MoveList: React.FC<{ moves: Move[] }> = ({ moves }) => {
	let moveStrings: (String | undefined)[][] = [];
	for (let i = 0; i < moves.length; i += 2) {
		moveStrings.unshift([moves[i]?.san, moves[i + 1]?.san]);
	}

	const scrollDownRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		// scrollDownRef.current?.scrollIntoView();

		scrollDownRef.current?.scrollTo({
			top: scrollDownRef.current.scrollHeight,
			// behavior: 'smooth',
		});
	}, [moves]);
	return (
		<div
			className="relative flex flex-col h-[35vh] md:h-full p-3 overflow-y-scroll overflow-x-hidden scrolling-touch scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2"
			ref={scrollDownRef}
		>
			{moveStrings
				.reverse()
				.map((moveStrings: (String | undefined)[], index): JSX.Element => {
					const check = [
						index % 2 === 0 ? 'purple_gradient' : '',
						index % 2 === 0 ? '' : 'purple_gradient',
					];
					return (
						<div key={`${index}-container`} className="flex justify-between ">
							<div
								className={`p-4 text-xl w-16 font-bold text-center `}
								key={`${index}-num`}
							>
								{index + 1}.
							</div>
							<div
								className={`p-4 text-xl flex-1 text-center ${check[1]}`}
								key={`${index}-move-white`}
							>
								{moveStrings[0]}
							</div>
							<div
								className={`p-4 text-xl flex-1 text-center ${check[0]} ${
									moveStrings[1] ? '' : 'gradient'
								}`}
								key={`${index}-move-black`}
							>
								{moveStrings[1]}
							</div>
						</div>
					);
				})}
		</div>
	);
};

export default MoveList;
{
	/* <div
			id="messages"
			className="relative flex flex-col h-[35vh] md:h-full p-3 overflow-y-scroll overflow-x-hidden scrolling-touch scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2"
			ref={scrollDownRef}
		>
			{moveStrings
				.reverse()
				.map((moveStrings: (String | undefined)[], index): JSX.Element => {
					const check = [
						index % 2 === 0 ? 'purple_gradient' : '',
						index % 2 === 0 ? '' : 'blue-gradient',
					];
					return (
						<div key={`${index}-container`} className="flex justify-between ">
							<div
								className={`p-4 text-xl w-16 font-bold text-center ${check[0]}`}
								key={`${index}-num`}
							>
								{index + 1}.
							</div>
							<div
								className={`p-4 text-xl flex-1 text-center ${check[1]}`}
								key={`${index}-move-white`}
							>
								{moveStrings[0]}
							</div>
							<div
								className={`p-4 text-xl flex-1 text-center ${check[0]} ${
									moveStrings[1] ? '' : 'gradient'
								}`}
								key={`${index}-move-black`}
							>
								{moveStrings[1]}
							</div>
						</div>
					);
				})}
		</div> */
}
