import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';

import classes from './tripTable.module.scss';

import { BusRouteListContext } from '../../contexts/busRouteContext';

import Icon from '../../components/Icon/Icon';

import { niceDelay } from '../../util';

const TripTable = ({ selectedStopStopTime, setSelectedStopStopTime }) => {
	const { routeList, dispatch } = useContext(BusRouteListContext);
	const {
		selectedBusStop,
		selectedRoute,
		selectedDirection,
		selectedTrip,
		tripStopTimes2,
	} = routeList;

	const { dets, loading, error } = tripStopTimes2;

	useEffect(() => {
		if (!dets) return;
		if (!dets.g_stop_times.length || !selectedBusStop) return;
		const ans = dets.g_stop_times.find((s) => s.stop_id === selectedBusStop);
		if (!ans) return;
		setSelectedStopStopTime(ans);
	}, [selectedBusStop, dets, setSelectedStopStopTime]); // todo set state?

	function distTravelled(st, i) {
		let ans = '';
		if (st[i] && st[i + 1]) {
			ans = Math.round(
				st[i + 1].shape_dist_traveled - st[i].shape_dist_traveled
			);
		}
		return ans && ans > 0 ? `${ans} m` : '';
	}

	return !loading &&
		!error &&
		dets?.g_stop_times?.length &&
		selectedStopStopTime ? (
		<table className={classes.tripTable}>
			<thead>
				<tr>
					<th>Stop</th>
					<th>Scheduled</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{dets.g_stop_times.map((st, i) => (
					<tr key={st.stop_id}>
						<td>
							<span className={classes.iconWrap}>
								<Icon className={classes.icon} />
								<Link
									to={`/route/${selectedRoute}/${selectedDirection}/${st.stop_id}/${selectedTrip}`}
									className={`${
										selectedBusStop === st.stop_id ? classes.selectedStop : ''
									}`}
									onClick={() =>
										dispatch({
											type: 'SELECT_BUS_STOP',
											payload: st.stop_id,
										})
									}
								>
									{st.stop_name}
								</Link>
							</span>
						</td>
						<td>{st.departure_time.substring(0, 5)}</td>
						<td>
							{st.hasOwnProperty('departure_delay')
								? niceDelay(st.departure_delay)
								: ''}
						</td>
						<td className={classes.pseudoRow}>
							{distTravelled(dets.g_stop_times, i)}
						</td>
					</tr>
				))}
			</tbody>
		</table>
	) : null;
};

export default TripTable;
