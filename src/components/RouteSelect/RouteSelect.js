import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import classes from './routeSelect.module.scss';

import { BusRouteListContext } from '../../contexts/busRouteContext';

const RouteSelect = ({ selected }) => {
	// selected is the currently selected route. This component shows alt routes for the busstop. Use str cause it's easier to compare.
	const { route, direction } = selected;
	const str = `${route}-${direction}`;

	const { routeList, dispatch } = useContext(BusRouteListContext);
	const { selectedStopExtraDets } = routeList;
	const { dets, loading, error } = selectedStopExtraDets;

	return !loading && dets ? (
		<div className={classes.routeSelect}>
			<>
				{error ? <p className="tiny-error">{error}</p> : null}
				{dets && dets.hasOwnProperty('stop_id') ? (
					selectedStopExtraDets.dets.g_routes_data.map((route) => (
						<Link
							className={
								`${route.route_short_name}-${route.direction_id}` === str
									? classes.selectedRoute
									: classes.altRoutes
							}
							key={`${route.route_short_name}-${route.direction_id}`}
							to={`/route/${route.route_short_name}/${route.direction_id}/${selectedStopExtraDets.dets.stop_id}`}
							onClick={() => {
								dispatch({
									type: 'SELECT_BUS_ROUTE',
									payload: {
										routeId: route.route_short_name,
										directionId: route.direction_id,
									},
								});
								dispatch({
									type: 'SELECT_BUS_STOP',
									payload: selectedStopExtraDets.dets.stop_id,
								});
							}}
						>
							{route.route_short_name}
						</Link>
					))
				) : loading ? (
					<p className="loading-tiny">Loading...</p>
				) : // <span>Loading</span>
				null}
			</>
		</div>
	) : null;
};

export default RouteSelect;
