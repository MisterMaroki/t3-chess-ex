'use client';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { Move } from 'chess.ts';
import { useEffect, useRef } from 'react';

const MoveList: React.FC<{ moves: Move[] }> = ({ moves }) => {
	let moveStrings: (String | undefined)[][] = [];
	for (let i = 0; i < moves.length; i += 2) {
		moveStrings.unshift([moves[i]?.san || '...', moves[i + 1]?.san || '...']);
	}

	const scrollDownRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (scrollDownRef.current) {
			const elHeight = 10000;
			scrollDownRef.current.scrollTop = elHeight;
		}
	}, [moves]);

	return (
		<div
			className="relative flex flex-col flex-1 h-[35vh] lg:h-full p-3 overflow-x-hidden overflow-y-scroll scrolling-touch glassy_bg scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2"
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
						<div key={`${index}-container`} className={`grid grid-cols-5 `}>
							<div
								className={`p-4 text-xl w-16 font-bold text-center col-span-1`}
								key={`${index}-num`}
							>
								{index + 1}.
							</div>
							<div
								className={`p-4 text-xl flex-1 text-center ${check[1]} col-span-2`}
								key={`${index}-move-white`}
							>
								{moveStrings[0]}
							</div>
							<div
								className={`p-4 text-xl flex-1 text-center ${check[0]} ${
									moveStrings[1] ? '' : 'gradient'
								} col-span-2 `}
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
