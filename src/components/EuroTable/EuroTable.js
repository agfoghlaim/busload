import React from 'react';
import { Link } from 'react-router-dom';

import classes from './euroTable.module.scss';

import { nice } from '../../util';

const EuroTable = ({ route, dispatch, selectedTrip }) => {
	return (
		<>
			<table className={classes.euroTable}>
				<thead>
					<tr>
						<th>Hour</th>
						<th colSpan="100%">
							Minutes
							<span className="srOnly">(past the hour)</span>
						</th>
					</tr>
				</thead>
				<tbody>
					{route.map((r, i) => (
						<tr key={i}>
							<th>{r.title}</th>
							{r.minutes.map((m) => (
								<td key={m.trip_id} className={`${m.rt ? classes.rtTd : ''}`}>
									<Link
										title="Go to trip"
										className={
											selectedTrip && m.trip_id === selectedTrip
												? classes.selectedTrip
												: ''
										}
										to={`${m.trip_id}`}
										onClick={() => {
											dispatch({ type: 'SELECT_TRIP', payload: m.trip_id });
										}}
									>
										<span>{m.min}</span>
										<span>
											<span className="srOnly">realtime</span>
											{m.rt && `${nice(m.departure_delay)}`}
										</span>
									</Link>
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</>
	);
};

export default EuroTable;
