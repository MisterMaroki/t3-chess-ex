'use client';

import MoveList from '@/components/MovesList';
import { forwardRef } from 'react';
import { Chessboard } from 'react-chessboard';
import { CustomSquareProps } from 'react-chessboard/dist/chessboard/types';
import type { Move } from 'chess.ts';
// eslint-disable-next-line react/display-name
const CustomSquareRenderer = forwardRef<HTMLDivElement, CustomSquareProps>(
	(props, ref) => {
		const { children, square, squareColor, style } = props;

		return (
			<div
				ref={ref}
				style={{
					...style,
					position: 'relative',
					// backgroundColor: 'transparent',
				}}
			>
				{children}
				{/* <div
					style={{
						position: 'absolute',
						right: 0,
						bottom: 0,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						height: 16,
						width: 16,
						borderTopLeftRadius: 6,
						backgroundColor: squareColor === 'black' ? '#31ddaf' : '#312e81',
						color: '#fff',
						fontSize: 14,
					}}
				>
					{square}
				</div> */}
			</div>
		);
	}
);
export default function page() {
	return (
		<div className="flex items-start justify-start w-full h-full gap-x-4">
			<div className="flex-1">
				<Chessboard
					id="CustomSquare"
					customSquare={CustomSquareRenderer}
					customBoardStyle={{
						boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
					}}
					customDarkSquareStyle={{
						backgroundColor: 'radial-gradient(#31ddaf, #312e81)',
					}}
					customLightSquareStyle={{
						backgroundColor: '#31ddaf21',
					}}
				/>
			</div>
			<MoveList
				moves={[
					{
						san: 'e4',
						from: 'e4',
						to: 'e5',
						color: 'w',
						flags: '',
						piece: 'p',
					},
					{
						san: 'Nf3',
						from: 'g1',
						to: 'f3',
						color: 'w',
						flags: 'n',
						piece: 'n',
					},
				]}
			/>
		</div>
	);
}
