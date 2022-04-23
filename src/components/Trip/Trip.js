import React, { useContext, useState } from 'react';

import classes from './trip.module.scss';

import { BusRouteListContext } from '../../contexts/busRouteContext';
import { FocusListContext } from '../../contexts/focusContext';

import SplitHeading from '../../shared/SplitHeading/SplitHeading';
import Map from '../Map/Map';
import TripTable from '../TripTable/TripTable';
import Split from 'react-split';

import { shortenString } from '../../util';

const Trip = () => {
	const { routeList } = useContext(BusRouteListContext);
	const { selectedBusStopTimes2, selectedStopExtraDets } = routeList;

	const { focusList } = useContext(FocusListContext);
	const { tripRef, handleHorizontalFocus, handleInternalFocus } = focusList;

	const [selectedStopStopTime, setSelectedStopStopTime] = useState(null);

	function getSplitHeadingText() {
		if (!selectedStopStopTime) return '';

		return `${selectedStopStopTime.departure_time.substring(
			0,
			5
		)} Towards ${shortenString(selectedStopStopTime.last_stop_name)}`;
	}
	return selectedBusStopTimes2?.dets?.length &&
		selectedStopExtraDets?.dets?.g_routes?.length ? (
		<>
			<Split
				className="split-v"
				direction="vertical"
				minSize={0}
				expandToMin={false}
				sizes={[60, 40]}
				style={{}}
			>
				<div
					className={classes.trip}
					ref={tripRef}
					onKeyDown={(e) => {
						handleHorizontalFocus(e, 'tripRef');
						handleInternalFocus(e, 'tripRef');
					}}
				>
					<SplitHeading text={getSplitHeadingText()} />

					<div className="padding">
						<TripTable
							selectedStopStopTime={selectedStopStopTime}
							setSelectedStopStopTime={setSelectedStopStopTime}
						/>
					</div>
				</div>

				<Map />
			</Split>
		</>
	) : null;
};

export default Trip;
