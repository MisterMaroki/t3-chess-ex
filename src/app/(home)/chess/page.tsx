'use client';

import MoveList from '@/components/chess/MoveList';
import { forwardRef } from 'react';
import { Chessboard } from 'react-chessboard';
import { CustomSquareProps } from 'react-chessboard/dist/chessboard/types';
import type { Move } from 'chess.ts';
import ChessBoard from '@/components/chess/Board';
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
		<div className="container flex flex-col h-full pt-28 md:pt-12 md:flex-row">
			<audio autoPlay src="/welcome.mp3">
				Your browser does not support the
				<code>audio</code> element.
			</audio>
			<ChessBoard />
		</div>
	);
}
