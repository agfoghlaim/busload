import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import classes from './stopItem.module.scss';

import { BusRouteListContext } from '../../contexts/busRouteContext';
import { FocusListContext } from '../../contexts/focusContext';

import Icon from '../../components/Icon/Icon';

import { shortenString } from '../../util';

const StopItem = ({ stop, route = null, i, j }) => {
	const { routeList, dispatch } = useContext(BusRouteListContext);
	const { focusList } = useContext(FocusListContext);
	const { firstSearchResultRef } = focusList;

	const { selectedBusStop } = routeList;

	const getUrl = () => {
		if (route) {
			return `/route/${route.route_short_name}/${route.direction_id}/${stop.stop_id}`;
		}
		return `${stop.stop_id}`;
	};

	return (
		<div
			key={stop.stop_id}
			className={
				selectedBusStop !== stop.stop_id
					? `${classes.stopItem}`
					: `${classes.selectedStop} ${classes.stopItem}`
			}
		>
			<span className={classes.iconWrap}>
				<Icon className={classes.icon} />
			</span>
			<Link
				style={{ border: `${0 === j && i === 0 ? '3px solid orange' : ''}` }}
				ref={0 === j && i === 0 ? firstSearchResultRef : null}
				to={getUrl()}
				onClick={(e) => {
					dispatch({
						type: 'SELECT_BUS_STOP',
						payload: stop.stop_id,
					});
					dispatch({ type: 'SEARCH_IS_ACTIVE', payload: false });
					dispatch({ type: 'SEARCH_RESULTS', payload: [] });
				}}
			>
				{shortenString(stop.stop_name)}
			</Link>
		</div>
	);
};

export default StopItem;
