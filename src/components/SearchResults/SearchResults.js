import React, { useContext } from 'react';

import classes from './searchResults.module.scss';

import { shortenString } from '../../util';

import { BusRouteListContext } from '../../contexts/busRouteContext';

import StopItem from '../../shared/StopItem/StopItem';

const SearchResults = () => {
	const { routeList, dispatch } = useContext(BusRouteListContext);
	const { searchIsActive, searchResults } = routeList;

	return searchIsActive && searchResults && searchResults.length ? (
		<div className={classes.searchResults}>
			{searchResults.map((route, j, all) => (
				<div
					className={classes.searchResultsRoutes}
					key={`${route.route_short_name}-${route.direction_id}`}
				>
					<h3>
						<span>{route.route_short_name}</span> Towards{' '}
						{shortenString(route.last_stop)}
					</h3>
					<div className={classes.stopItems}>
						{route.g_stops.map((stop, i) => (
							<StopItem
								stop={stop}
								key={stop.stop_id}
								route={route}
								dispatch={dispatch}
								i={i}
								j={j}
							/>
						))}
					</div>
				</div>
			))}
		</div>
	) : null;
};

export default SearchResults;
