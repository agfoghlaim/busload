import React from 'react';
import ReactDOM from 'react-dom';
import BusRouteListContextProvider from './contexts/busRouteContext';
import FocusListContextProvider from './contexts/focusContext';
import MobileContextProvider from './contexts/mobileContext';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';

ReactDOM.render(
	<React.StrictMode>
		<BrowserRouter>
			<BusRouteListContextProvider>
				<FocusListContextProvider>
					<MobileContextProvider>
						<App />
					</MobileContextProvider>
				</FocusListContextProvider>
			</BusRouteListContextProvider>
		</BrowserRouter>
		,
	</React.StrictMode>,
	document.getElementById('root')
);
