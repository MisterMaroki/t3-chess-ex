'use client';

import { FC, useEffect, useState } from 'react';
import { Icons } from './Icons';
import Button from './ui/Button';

interface Props {}
const audio = new Audio('/song.mp3');
const SoundOnOffButton: FC<Props> = () => {
	const [isEnabled, setIsEnabled] = useState(false);

	const toggleSound = () => {
		setIsEnabled(!isEnabled);
	};

	useEffect(() => {
		if (isEnabled) {
			audio.play();
			audio.loop = true;
		} else {
			audio.pause();
		}

		return () => {
			audio.remove();
		};
	}, [isEnabled]);

	return (
		<Button onClick={toggleSound}>
			{/* {isEnabled ? (
				<audio autoPlay loop src="/notify.mp3">
					Your browser does not support the
					<code>audio</code> element.
				</audio>
			) : null} */}
			{isEnabled ? <Icons.VolumeX /> : <Icons.Volume2 />}
		</Button>
	);
};

export default SoundOnOffButton;
