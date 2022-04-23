import React, { useContext, useState } from 'react';

import { Outlet, useLocation } from 'react-router-dom';

import classes from './busRoute.module.scss';

import Split from 'react-split';

import { BusRouteListContext } from '../../contexts/busRouteContext';
import { FocusListContext } from '../../contexts/focusContext';
import { MobileContext } from '../../contexts/mobileContext';

import Layout from '../Layout/Layout';
import SearchResults from '../SearchResults/SearchResults';
import StopList from '../StopList/StopList';

const BusRoute = () => {
	const location = useLocation();
	const { routeList, dispatch } = useContext(BusRouteListContext);
	const { isMobile, setIsMobile } = useContext(MobileContext);
	const { focusList } = useContext(FocusListContext);
	const [mobileSizes, setMobileSizes] = useState([100, 0]);
	const { busRouteRef, handleHorizontalFocus, handleInternalFocus } = focusList;
	const { selectedRoute, searchIsActive } = routeList;

	function SplitOrNot({ children }) {
		const path = location.pathname.split('/').filter((p) => p !== '');

		// For '/route/:rid/:did' take full width, else take zero width.
		if (isMobile) {
			return (
				<Split
					minSize={0}
					sizes={path.length === 3 ? [100, 0] : [0, 100]}
					className="split"
					direction="horizontal"
					gutterSize={16}
				>
					{children}
				</Split>
			);
		}
		return (
			<Split
				sizes={[20, 80]}
				minSize={0}
				className="split"
				direction="horizontal"
				gutterSize={16}
			>
				{children}
			</Split>
		);
	}
	return (
		<Layout>
			<SplitOrNot>
				<div
					className={classes.busRoute}
					onKeyDown={(e) => {
						handleHorizontalFocus(e, 'busRouteRef');
						handleInternalFocus(e, 'busRouteRef');
					}}
					ref={busRouteRef}
				>
					<div className="split-heading">
						{searchIsActive
							? 'Search Results'
							: selectedRoute && !searchIsActive
							? `${selectedRoute} All stops`
							: ''}
					</div>
					<div className="padding">
						<SearchResults />
						<StopList />
					</div>
				</div>
				<div className={classes.wrapOutlet}>
					<Outlet />
				</div>
			</SplitOrNot>
		</Layout>
	);
};

export default BusRoute;
