import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import classes from './timetables.module.scss';

import { shortenString } from '../../util';

import { FocusListContext } from '../../contexts/focusContext';
import { BusRouteListContext } from '../../contexts/busRouteContext';

import ArrowRight from '../../shared/ArrowRight/ArrowRight';

const Timetables = () => {
	const { routeList, dispatch } = useContext(BusRouteListContext);
	const { selectedRoute, selectedDirection, list } = routeList;
	const { focusList } = useContext(FocusListContext);
	const { timetableRef, handleHorizontalFocus, handleInternalFocus } =
		focusList;

	return (
		<div
			className={classes.timetableList}
			ref={timetableRef}
			onKeyDown={(e) => {
				handleHorizontalFocus(e, 'timetableRef');
				handleInternalFocus(e, 'timetableRef');
			}}
		>
			<div className="split-heading">Bus Routes</div>
			<div className="padding">
				{list.loading && (
					<div style={{ minHeight: 'calc(100vh - 5rem)' }}>
						<span className="info-tiny">Loading...</span>
					</div>
				)}
				{!list.loading && list.error && (
					<div style={{ minHeight: 'calc(100vh - 5rem)' }}>
						<span className="error-tiny">{list.error}.</span>
					</div>
				)}
				{
					<ul>
						{list?.dets?.length
							? list?.dets.map((route) => (
									<li
										key={`${route.route_short_name} - ${route.direction_id}`}
										className={`${
											route.route_short_name === selectedRoute &&
											route.direction_id === selectedDirection
												? classes.selectedRoute
												: ''
										}`}
									>
										<span className={classes.routeName}>
											{route.route_short_name}
										</span>
										<Link
											to={`/route/${route.route_short_name}/${route.direction_id}`}
											className={classes.direction}
											onClick={() =>
												dispatch({
													type: 'SELECT_BUS_ROUTE',
													payload: {
														routeId: route.route_short_name,
														directionId: route.direction_id,
													},
												})
											}
										>
											<span>
												{' '}
												<ArrowRight
													color={
														route.route_short_name === selectedRoute &&
														route.direction_id === selectedDirection
															? '#ffffff'
															: '#2b2b2b'
													}
												/>
											</span>
											<span className="srOnly">towards</span>

											{route.g_stops?.length &&
												shortenString(
													route.g_stops[route.g_stops.length - 1].stop_name
												)}
										</Link>
									</li>
							  ))
							: null}
					</ul>
				}
			</div>
		</div>
	);
};

export default Timetables;
