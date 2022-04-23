import React, { useEffect, useState, useContext } from 'react';

import classes from './searchStop.module.scss';

import { useLocation } from 'react-router-dom';

import { BusRouteListContext } from '../../contexts/busRouteContext';
import { FocusListContext } from '../../contexts/focusContext';

const SearchStop = ({ searchMargin }) => {
	const { routeList, dispatch } = useContext(BusRouteListContext);
	const { focusList } = useContext(FocusListContext);
	const { busRouteRef, searchStopRef, routeStopRef, tripRef } = focusList;
	const { list, searchIsActive } = routeList;

	// Not handling errors/loading. Timetables will already have failed.
	const { dets } = list;
	const [stops, setStops] = useState([]);
	const [value, setValue] = useState('');
	const location = useLocation();

	// Get a flat list of all bus stops.
	useEffect(() => {
		if (!dets || !dets.length) return;
		const allStops = [];
		dets.forEach((l, j) => {
			l.g_stops.forEach((s, i) => {
				const ans = {
					stop_id: s.stop_id,
					stop_name: s.stop_name,
					route_short_name: l.route_short_name,
					direction_id: l.direction_id,
					towards: l.g_stops[l.g_stops.length - 1].stop_name,
				};
				allStops.push(ans);
			});
		});
		setStops(allStops);
	}, [dets]);

	// reset value when search becomes in actife
	useEffect(() => {
		if (searchIsActive) return;
		setValue('');
	}, [searchIsActive]);

	// cancel search when a url change
	useEffect(() => {
		dispatch({ type: 'SEARCH_IS_ACTIVE', payload: false });
		dispatch({ type: 'SEARCH_RESULTS', payload: [] });
		setValue('');
	}, [location.pathname, dispatch]);

	function filter(e) {
		const searchStr = e.target.value;
		setValue(searchStr);
		if (searchStr === '') {
			dispatch({ type: 'SEARCH_IS_ACTIVE', payload: false });
			dispatch({ type: 'SEARCH_RESULTS', payload: [] });
			return;
		}

		if (!searchStr || searchStr === '') return;
		const results = stops.filter((s) => {
			const what = s.stop_name.toLowerCase().indexOf(searchStr.toLowerCase());

			return what > -1 ? true : false;
		});
		const resultIds = results.map((r) => r.stop_id);

		// Filter the real routeList.list of routes/stops.
		const realRes = dets.reduce((acc, cur) => {
			const lastStop = cur.g_stops[cur.g_stops.length - 1].stop_name;
			const hasStops = cur.g_stops.filter((stop) =>
				resultIds.includes(stop.stop_id)
			);

			if (hasStops.length) {
				acc.push({
					...cur,
					g_stops: hasStops,
					last_stop: lastStop,
				});
			}
			return acc;
		}, []);

		if (realRes.length) {
			dispatch({ type: 'SEARCH_IS_ACTIVE', payload: true });
			dispatch({ type: 'SEARCH_RESULTS', payload: realRes });
		}
	}

	function cancelSearch(e) {
		// Don't cancel if a link has been clicked.
		if (!e.relatedTarget || e.relatedTarget.nodeName !== 'A') {
			dispatch({ type: 'SEARCH_IS_ACTIVE', payload: false });
			dispatch({ type: 'SEARCH_RESULTS', payload: [] });
			setValue('');
		}
		return;
	}

	function focusOnResults(e) {
		if (!searchIsActive) return;
		if (e.key === 'Tab') {
			e.preventDefault();
			const ans = busRouteRef.current.getElementsByTagName('A');
			ans[0].focus();
		}
	}

	// This handles focus doing down from SearchStop to the appropiate section/'page' TODO should be defined in focusContext
	function handleFocus(e) {
		const relKeys = ['Tab'];

		// don't interfer with 'shift-tab'
		if (e.shiftKey || e.key === 'Shift') return;
		if (!relKeys.includes(e.key)) return;
		// 1. If search is active send focus to SearchResults
		if (searchIsActive) {
			focusOnResults(e);
			return;
		}
		const splitPath = location.pathname.split('/').filter((p) => p !== '');

		// 2. '/' Focus will automatically go to TimeTables

		// 3. '/route/:rid/:did, send focus to BusRoute
		if (splitPath.length === 3 && !searchIsActive) {
			const ans = busRouteRef.current.getElementsByTagName('A'); //here
			e.preventDefault();
			ans[0].focus();
		}
		// 4. '/route/:rid/:did/:stopid', send focus to RouteStop
		if (splitPath.length === 4 && !searchIsActive) {
			const ans = routeStopRef.current.getElementsByTagName('BUTTON'); //here
			e.preventDefault();
			ans[0].focus();
		}
		// 5. '/route/:rid/:did/:stopid/:tripid', send focus to Trip
		if (splitPath.length === 5 && !searchIsActive) {
			const ans = tripRef.current.getElementsByTagName('A'); //here
			e.preventDefault();
			ans[0].focus();
		}
	}
	return (
		<div className={classes.searchStop} style={{ marginLeft: searchMargin }}>
			<label htmlFor="search-bus-stops" className="sr-only">
				Search bus stops
			</label>
			<input
				ref={searchStopRef}
				type="search"
				value={value}
				name="search-bus-stops"
				id="search-bus-stops"
				onChange={filter}
				onBlur={cancelSearch}
				className="input"
				placeholder="Start typing Bus Stop..."
				onKeyDown={handleFocus}
			/>
		</div>
	);
};

export default SearchStop;
