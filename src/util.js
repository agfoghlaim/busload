export const doMinutes = (route) => {
	const n = {
		'06': { title: '6', minutes: [] },
		'07': { title: '7', minutes: [] },
		'08': { title: '8', minutes: [] },
		'09': { title: '9', minutes: [] },
		10: { title: '10', minutes: [] },
		11: { title: '11', minutes: [] },
		12: { title: '12', minutes: [] },
		13: { title: '13', minutes: [] },
		14: { title: '14', minutes: [] },
		15: { title: '15', minutes: [] },
		16: { title: '16', minutes: [] },
		17: { title: '17', minutes: [] },
		18: { title: '18', minutes: [] },
		19: { title: '19', minutes: [] },
		20: { title: '20', minutes: [] },
		21: { title: '21', minutes: [] },
		22: { title: '22', minutes: [] },
		23: { title: '23', minutes: [] },
		24: { title: '24', minutes: [] },
		'00': { title: '00', minutes: [] },
	};

	route.forEach((trip) => {
		const hr = trip.departure_time.substring(0, 2);
		const ans = n[hr] || null;

		if (ans) {
			ans.minutes.push({
				min: trip.departure_time.substring(3, 5),
				trip_id: trip.trip_id,
				rt: trip.rt,
				departure_delay: trip.departure_delay,
				rtInfo: trip.rt_info,
			});
			ans.towards = trip.last_stop_name;
			ans.route_short_name = trip.route_short_name;
			ans.direction_id = trip.direction_id;
		}
	});
	const array = [];
	for (const i in n) {
		if (n[i].minutes.length) {
			array.push(n[i]);
		}
	}
	const sorted = array.sort((a, b) => parseInt(a.title) - parseInt(b.title));
	return sorted;
};

export const nice = (dep) => {
	if (typeof dep === 'undefined' || dep === null) return '?';
	if (dep.toString() === '0') {
		return '0';
	} else {
		const earlyLate = dep / 60;
		if (earlyLate > 0) {
			// late
			return `+${earlyLate}`;
		} else {
			return `${earlyLate} `;
		}
	}
};

export const shortenString = (str) => {
	const name = str.split(',');
	return name[0];
};

export const niceDelay = (delay) => {
	if (delay === null) {
		return '';
	}
	const del = +delay;

	let earlyLate = 'late';
	if (del < 0) {
		earlyLate = 'early';
	}
	if (del === 0) {
		return 'on time';
	}
	const int = Math.abs(delay);
	if (isNaN(int)) {
		return '';
	}
	const minutes = Math.round(int / 60);
	return `${minutes} min ${earlyLate}`;
};

// offset = 1 => tomorrow
// offset = -2 => day before yesterday etc
export const getNow = (offset = 0, selectedDate) => {
	const now = selectedDate
		? new Date(getDateStringFromYYYYMMDD(selectedDate))
		: new Date();

	const w = now.setDate(now.getDate() + offset); // tomorrow

	const x = new Date(w);

	const y = x.getFullYear().toString();
	let m = (x.getMonth() + 1).toString();
	let d = x.getDate().toString();

	// TODO test this (today is 12th nov - no leading zeros)
	d.length === 1 && (d = '0' + d);
	m.length === 1 && (m = '0' + m);

	return y + m + d;
};

export const isToday = (yyyymmdd) => {
	const today = getNow();

	return yyyymmdd === today;
};

export const getDateStringFromYYYYMMDD = (yymmdd) => {
	const string = yymmdd.trim();
	if (string.trim().length !== 8) {
		return false;
	}
	const y = string.substring(0, 4);
	const m = string.substring(4, 6);
	const d = string.substring(6, 8);
	const dateString = `${y}-${m}-${d}`;
	return dateString;
};

export const fetchStuff = async (url, resourceName) => {
	async function fetchData() {
		try {
			const data = await fetch(url);
			const ans = await data.json();

			if (ans.error) {
				throw new Error(ans.error);
			}
			return {
				error: ``,
				dets: ans.results,
			};
		} catch (error) {
			console.error(error.message);
			return {
				error: `Could not get ${resourceName}`,
				dets: [],
			};
		}
	}
	return await fetchData();
};

export const fetchGStop = async (dispatch, selectedBusStop) => {
	dispatch({
		type: 'FETCHED_G_STOP',
		payload: { loading: true },
	});

	const ans = await fetchStuff(
		`https://galway-bus.apis.ie/api/gstop/bystopid/${selectedBusStop}`,

		'Other routes serving this stop'
	);

	const stop = ans?.dets?.stops?.length ? ans.dets.stops[0] : null;

	dispatch({
		type: 'FETCHED_G_STOP',
		payload: {
			loading: false,
			error: ans.error,
			dets: stop || null,
		},
	});
};

export const fetchGRoutes = async (dispatch, list) => {
	dispatch({
		type: 'BUS_ROUTE_LIST',
		payload: { ...list, loading: true },
	});

	const ans = await fetchStuff(
		`https://galway-bus.apis.ie/api/groute`,
		'Bus Routes'
	);

	dispatch({
		type: 'BUS_ROUTE_LIST',
		payload: { ...ans, loading: false },
	});
};
export const fetchStopTimes = async (
	selectedBusStop,
	selectedRoute,
	selectedDirection,
	selectedDate,
	dispatch
) => {
	const realTimeUrl = `https://galway-bus.apis.ie/api/realtime/gstoptimes/${selectedBusStop}/${selectedRoute}/${selectedDirection}`;

	const stopTimesUrl = `https://galway-bus.apis.ie/api/gstoptimes/bystopidrouteid/${selectedBusStop}/${selectedRoute}/${selectedDirection}/${selectedDate}`;

	const url = isToday(selectedDate) ? realTimeUrl : stopTimesUrl;
	dispatch({ type: 'STOP_TIMES', payload: { loading: true } });
	try {
		const busRoutes = await fetch(url);
		const ans = await busRoutes.json();

		if (ans.error) {
			throw new Error(ans.error.message);
			// when the serverside request to gtfs-r feed fails the response is 503? with message like 'could not collect...' should check for that error here and then send another request for the stop times without the realtime.
		}
		dispatch({
			type: 'STOP_TIMES',
			payload: { loading: false, error: '', dets: ans.results },
		});
	} catch (error) {
		console.error('StopTimes error: ', error);
		dispatch({
			type: 'STOP_TIMES',
			payload: { loading: false, error: 'Could not fetch stop times' },
		});
	}
	dispatch({ type: 'STOP_TIMES', payload: { loading: false } });
};

export const fetchTripStopTimes = async (dispatch, selectedTrip) => {
	dispatch({ type: 'TRIP_STOPTIMES', payload: { loading: true } });
	try {
		const stopTimes = await fetch(
			`https://galway-bus.apis.ie/api/realtime/bytripidmatch/${selectedTrip}`
		);
		const ans = await stopTimes.json();
		if (ans.error) {
			throw new Error(ans.error);
		}
		dispatch({
			type: 'TRIP_STOPTIMES',
			payload: { loading: false, error: '', dets: ans.results },
		});
	} catch (error) {
		console.error(error.message);
		dispatch({
			type: 'TRIP_STOPTIMES',
			payload: { error: 'Could not fetch trip stop times', loading: false },
		});
	}
};

export const fetchShapes = async (dispatch, selectedTrip) => {
	dispatch({ type: 'SHAPES', payload: { loading: true } });
	try {
		const shapes = await fetch(
			`https://galway-bus.apis.ie/api/shapebytripid/${selectedTrip}`
		);

		const ans = await shapes.json();
		if (ans.error) {
			throw new Error(ans.error);
		}
		dispatch({
			type: 'SHAPES',
			payload: { loading: false, error: '', dets: ans.results },
		});
	} catch (error) {
		console.error(error.message);
		dispatch({
			type: 'SHAPES',
			payload: { error: 'Could not fetch trip shapes', loading: false },
		});
	}
};
