import React, { useContext } from 'react';

import classes from './stopList.module.scss';

import { shortenString } from '../../util';

import { BusRouteListContext } from '../../contexts/busRouteContext';

import StopItem from '../../shared/StopItem/StopItem';

const StopList = () => {
	const { routeList, dispatch } = useContext(BusRouteListContext);

	const { selectedBusRouteDets, searchIsActive } = routeList;

	return (
		<div>
			{!searchIsActive && selectedBusRouteDets && selectedBusRouteDets.g_stops && (
				<h3>
					<span>{selectedBusRouteDets.route_short_name}</span> Towards{' '}
					{selectedBusRouteDets.g_stops?.length &&
						shortenString(
							selectedBusRouteDets.g_stops[
								selectedBusRouteDets.g_stops.length - 1
							].stop_name
						)}
				</h3>
			)}
			<div className={classes.stopItems}>
				{!searchIsActive &&
					selectedBusRouteDets &&
					selectedBusRouteDets.g_stops.map((stop) => (
						<StopItem stop={stop} dispatch={dispatch} key={stop.stop_id} />
					))}
			</div>
		</div>
	);
};

export default StopList;
