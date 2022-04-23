import React, { createContext, useState, useEffect } from 'react';

export const MobileContext = createContext({});

const MobileContextProvider = ({ children }) => {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const width = window.screen.availWidth;

		if (width <= 800) {
			setIsMobile(true);
		}
	}, []);

	return (
		<MobileContext.Provider value={{ isMobile, setIsMobile }}>
			{children}
		</MobileContext.Provider>
	);
};

export default MobileContextProvider;
