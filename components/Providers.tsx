'use client';

import { FC, Fragment, ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';

interface ProvidersProps {
	children: ReactNode;
}

const Providers: FC<ProvidersProps> = ({ children }) => {
	return (
		<Fragment>
			<Toaster position="top-center" reverseOrder={false} />
			{children}
		</Fragment>
	);
};

export default Providers;
