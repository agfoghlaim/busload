import React, { createContext, useReducer, useEffect } from 'react';
import {
	getNow,
	fetchGStop,
	fetchGRoutes,
	fetchStopTimes,
	fetchTripStopTimes,
	fetchShapes,
} from '../util.js';
import busRouteListReducer from '../reducers/busRouteListReducer';
import { useLocation } from 'react-router-dom';
export const BusRouteListContext = createContext({});

const BusRouteListContextProvider = ({ children }) => {
	const initialState = {
		loading: false,
		error: '',
		selectedDate: getNow(),

		list: { error: '', loading: false, dets: [] },

		selectedRoute: null,
		selectedDirection: null,
		selectedBusRouteDets: null,

		selectedBusStop: null,
		selectedBusStopDets: null, // basic stop info from /groute

		selectedStopExtraDets: { error: '', loading: false, dets: null }, // all stop info from /gstop

		selectedBusStopTimes2: { error: '', loading: false, dets: null },

		selectedTrip: null,

		tripStopTimes2: { error: '', loading: false, dets: null },
		tripShapes: { error: '', loading: false, dets: null },
		searchIsActive: false,
		searchResults: [],
	};

	const [routeList, dispatch] = useReducer(busRouteListReducer, initialState);

	const {
		selectedDirection,
		selectedRoute,
		selectedBusRouteDets,
		selectedTrip,
		selectedDate,
		list,
		selectedBusStop,
		selectedStopExtraDets,
	} = routeList;
	const location = useLocation();

	// (ROUTE / DIRECTION) In case of page refresh/ following a link manually set context using pathname
	useEffect(() => {
		if (!list.dets) return;
		const what = location.pathname.split('/');
		if (what[1] !== 'route') {
			return;
		}
		const routeId = what[2] ? what[2] : null;
		const directionId = what[3] ? what[3] : null;

		dispatch({ type: 'SELECT_BUS_ROUTE', payload: { routeId, directionId } });
	}, [location.pathname, list.dets]);

	// STOP
	useEffect(() => {
		if (!selectedBusRouteDets) return;
		const what = location.pathname.split('/');
		if (what[1] !== 'route') {
			return;
		}

		const stopId = what[4] ? what[4] : null;
		if (stopId) {
			dispatch({ type: 'SELECT_BUS_STOP', payload: stopId });
		}
	}, [
		selectedDirection,
		selectedRoute,
		selectedBusRouteDets,
		location.pathname,
	]);

	// TRIP Manually select tripId for refresh and arriving via link
	useEffect(() => {
		if (!selectedBusStop) return;
		const what = location.pathname.split('/');
		if (what[1] !== 'route') {
			return;
		}
		const tripId = what[5] ? what[5] : null;

		if (!tripId) {
			return;
		}
		dispatch({ type: 'SELECT_TRIP', payload: tripId });
	}, [location.pathname, selectedBusStop]);

	// Fetch Route List on load
	useEffect(() => {
		fetchGRoutes(dispatch, list);
	}, []);

	// fetch shapes when tripid selected
	useEffect(() => {
		if (!selectedTrip) return;

		fetchShapes(dispatch, selectedTrip);
	}, [selectedTrip]);

	// fetch RTStopTimes when tripid selected
	useEffect(() => {
		if (!selectedTrip) return;

		fetchTripStopTimes(dispatch, selectedTrip);
	}, [selectedTrip]);

	// '/api/groute' gets limited info on stops, when a stop is selected get '/api/gstop'
	useEffect(() => {
		// Dont run if: no stop selected, it's already loading or if we already have the extra dets.
		if (!selectedBusStop) return;
		if (selectedStopExtraDets.loading) return;
		if (selectedStopExtraDets.dets?.stop_id === selectedBusStop) return;

		fetchGStop(dispatch, selectedBusStop, selectedStopExtraDets);
	}, [selectedBusStop, selectedStopExtraDets]);

	// when selected stop changes get stoptimes
	useEffect(() => {
		if (!selectedBusStop || !selectedDirection || !selectedRoute) return;

		fetchStopTimes(
			selectedBusStop,
			selectedRoute,
			selectedDirection,
			selectedDate,
			dispatch
		);
	}, [selectedBusStop, selectedDirection, selectedRoute, selectedDate]);

	return (
		<BusRouteListContext.Provider value={{ routeList, dispatch }}>
			{children}
		</BusRouteListContext.Provider>
	);
};

export default BusRouteListContextProvider;
