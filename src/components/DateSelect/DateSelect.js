import React from 'react';
import classes from './dateSelect.module.scss';

const DateSelect = ({
	selectedBusStopTimes2,
	selectedDate,
	getNow,
	dispatch,
}) => {
	const { error, loading, dets } = selectedBusStopTimes2;

	return (
		<div className={classes.tripDate}>
			{error && <p className="error-tiny">{error}</p>}
			{!error && !loading && dets?.length === 0 && (
				<p className="info-tiny">No Service</p>
			)}
			{dets?.length ? (
				<p className="info-tiny">{loading ? 'Loading...' : dets[0].date}</p>
			) : null}
			<div className={classes.buttonsWrap}>
				<button
					onClick={() =>
						dispatch({
							type: 'SELECT_DATE',
							payload: getNow(-1, selectedDate),
						})
					}
				>
					Previous Day
				</button>
				<button
					onClick={() =>
						dispatch({
							type: 'SELECT_DATE',
							payload: getNow(1, selectedDate),
						})
					}
				>
					Next Day
				</button>
			</div>
		</div>
	);
};

export default DateSelect;
