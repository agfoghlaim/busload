import React, { useContext } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import classes from './routeStop.module.scss';

import { shortenString, getNow } from '../../util';

import { BusRouteListContext } from '../../contexts/busRouteContext';
import { FocusListContext } from '../../contexts/focusContext';
import { MobileContext } from '../../contexts/mobileContext';

import EuroTable from '../EuroTable/EuroTable';
import RouteSelect from '../RouteSelect/RouteSelect';
import Icon from '../Icon/Icon';
import Split from 'react-split';
import DateSelect from '../DateSelect/DateSelect';

const RouteStop = () => {
	const { routeList, dispatch } = useContext(BusRouteListContext);
	const { isMobile } = useContext(MobileContext);
	const { focusList } = useContext(FocusListContext);
	const { routeStopRef, handleHorizontalFocus, handleInternalFocus } =
		focusList;

	const {
		selectedBusStopDets,
		selectedBusStopTimes,
		selectedBusStopTimes2,
		selectedTrip,
		selectedRoute,
		selectedDate,
	} = routeList;
	const location = useLocation();
	const { loading, error, dets } = selectedBusStopTimes2;

	function SplitOrNot({ children }) {
		const path = location.pathname.split('/').filter((p) => p !== '');

		return isMobile ? (
			<Split
				className="split"
				direction="horizontal"
				style={{ height: '100%' }}
				minSize={0}
				sizes={path.length <= 4 ? [100, 0] : [0, 100]}
				gutterSize={16}
			>
				{children}
			</Split>
		) : (
			<Split
				className="split"
				direction="horizontal"
				style={{ height: '100%' }}
				sizes={[30, 70]}
				minSize={0}
				gutterSize={16}
			>
				{children}
			</Split>
		);
	}
	return (
		<SplitOrNot>
			<div
				className={classes.routeStop}
				ref={routeStopRef}
				onKeyDown={(e) => {
					handleHorizontalFocus(e, 'routeStopRef');
					handleInternalFocus(e, 'routeStopRef');
				}}
			>
				<div className="split-heading">
					{selectedRoute && selectedRoute}{' '}
					{selectedBusStopDets && shortenString(selectedBusStopDets.stop_name)}
				</div>
				<div className="padding">
					{selectedBusStopDets && (
						<div className={classes.routeStopContent}>
							<div className={classes.stopHeading}>
								<Icon />
								<h4>{selectedBusStopDets.stop_name}</h4>
							</div>

							<DateSelect
								selectedBusStopTimes={selectedBusStopTimes}
								selectedBusStopTimes2={selectedBusStopTimes2}
								selectedDate={selectedDate}
								getNow={getNow}
								dispatch={dispatch}
							/>

							{!loading &&
							!error &&
							dets &&
							dets.length &&
							dets[0].stopTimes.length ? (
								<RouteSelect
									selected={{
										route: dets[0].stopTimes[0].route_short_name,
										direction: dets[0].stopTimes[0].direction_id,
									}}
								/>
							) : loading && !error ? (
								<p className="info-tiny">Loading Routes...</p>
							) : error ? (
								<p className="error-tiny">Something went wrong!</p>
							) : (
								<p className="info-tiny">Nothing to show.</p>
							)}
							{selectedBusStopTimes2.dets?.length
								? selectedBusStopTimes2.dets.map((route, i) =>
										route.stopTimes?.length ? (
											<div key={`${route.stopTimes[0].route_short_name}-${i}`}>
												<div
													className={classes.info}
													key={i}
													style={{ overflow: 'hidden' }}
												>
													<h5>
														<span>{route.stopTimes[0].route_short_name}</span>{' '}
														Towards {shortenString(route.stopTimes[0].towards)}
													</h5>
													<EuroTable
														route={route.stopTimes}
														dispatch={dispatch}
														selectedTrip={selectedTrip}
													/>
													<div className={classes.legend}>
														<p>
															<span className={classes.egNoRealtime}> </span>
															<span className={classes.egDets}>
																{' '}
																= no realtime
															</span>
														</p>
														<p>
															<span className={classes.egLate}>+1 </span>
															<span className={classes.egDets}>
																{' '}
																= 1 min late
															</span>
														</p>
														<p>
															<span className={classes.egEarly}>-1 </span>
															<span className={classes.egDets}>
																{' '}
																= 1 min early
															</span>
														</p>
														<p>
															<span className={classes.egOntime}>0 </span>
															<span className={classes.egDets}> = on time</span>
														</p>
													</div>
												</div>
											</div>
										) : (
											<div>
												<p className="info-tiny">No Services</p>
											</div>
										)
								  )
								: null}
						</div>
					)}
				</div>
			</div>
			<div style={{ width: '100%', height: '100%' }}>
				<Outlet />
			</div>
		</SplitOrNot>
	);
};

export default RouteStop;
