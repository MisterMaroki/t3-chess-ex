'use client';

import { FC, useEffect, useState } from 'react';
import useSound from 'use-sound';
import { Icons } from './Icons';
import { Button } from './ui/Button';

interface Props {}

const songs = ['/song.mp3', '/good-song.mp3'];
// const audio = new Audio('/song.mp3');
const SoundOnOffButton: FC<Props> = () => {
	const [isEnabled, setIsEnabled] = useState(false);
	const [currentSong, setCurrentSong] = useState(0);
	const [play, { stop, pause }] = useSound(songs[0], {
		loop: true,
	});

	const [play1, { stop: stop1, pause: pause1 }] = useSound(songs[1], {
		loop: true,
	});

	const toggleSound = () => {
		setIsEnabled(!isEnabled);
	};

	const nextSong = () => {
		if (isEnabled) pauseCurrentSong();

		setCurrentSong(() => (currentSong ? 0 : 1));
	};

	const playCurrentSong = () => {
		if (currentSong) {
			play1();
		} else {
			play();
		}
	};

	const pauseCurrentSong = () => {
		if (currentSong) {
			pause1();
		} else {
			pause();
		}
	};

	useEffect(() => {
		if (isEnabled) {
			playCurrentSong();
		} else {
			pauseCurrentSong();
		}
	}, [isEnabled, currentSong]);

	return (
		<div className="flex items-center gap-3">
			<Button onClick={toggleSound} className="flex-auto ">
				{isEnabled ? <Icons.VolumeX /> : <Icons.Volume2 />}
			</Button>
			<label className="relative inline-flex items-center cursor-pointer">
				<input
					type="checkbox"
					value={currentSong}
					className="sr-only peer"
					onChange={nextSong}
				/>
				<div className="w-11 h-6 rounded-full peer bg-primary peer-focus:ring-4 peer-focus:ring-purple-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all border-gray-600 peer-checked:bg-purple-600"></div>
				<span className="ml-3 text-sm font-medium text-gray-600">
					Toggle song
				</span>
			</label>
		</div>
	);
};

export default SoundOnOffButton;
