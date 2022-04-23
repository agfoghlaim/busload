import React, { createContext, useReducer, useRef } from 'react';

import focusListReducer from '../reducers/focusListReducer';
export const FocusListContext = createContext({});

const FocusListContextProvider = ({ children }) => {
	const initialState = {
		routeStopRef: useRef(null),
		searchStopRef: useRef(null),
		busRouteRef: useRef(null),
		firstSearchResultRef: useRef(null),
		tripRef: useRef(null),
		mapRef: useRef(null),
		timetableRef: useRef(null),
		refNamesGoingWest: [
			'mapRef',
			'tripRef',
			'routeStopRef',
			'busRouteRef',
			'timetableRef',
		],
		refNamesGoingEast: [
			'timetableRef',
			'busRouteRef',
			'routeStopRef',
			'tripRef',
			'mapRef',
		],
		goWestFrom: (index, refName) => {
			const short = initialState.refNamesGoingWest;
			// return first ref to  exist that isnt 'refName'.
			const first = short.find((name, i) => {
				return initialState[name].current && name !== refName && i > index
					? true
					: false;
			});
			if (first) return first;

			// If nothing to the west, 'round robin' to the last ref.current.
			const firstExisting = short.find(
				(refName) => initialState[refName].current
			);
			return firstExisting;
		},

		// Return the NAME of the appropiate ref
		goEastFrom: (index, refName) => {
			// return first ref going east from refName to exist
			const first = initialState.refNamesGoingEast.find((name, i) => {
				return initialState[name].current && name !== refName && i > index
					? true
					: false;
			});
			if (first) return first;

			// If nothing to the east, 'round robin' to the beginning.
			return initialState.refNamesGoingEast[0];
		},
		firstToExist: (refName) => {
			return {
				west: () => {
					const short = initialState.refNamesGoingWest;
					const index = short.indexOf(refName);

					const what =
						index === 0
							? initialState.goWestFrom(index, refName)
							: initialState.goWestFrom(index, refName);
					return initialState[what];
				},
				east: () => {
					const short = initialState.refNamesGoingEast;
					const index = short.indexOf(refName);

					const what = initialState.goEastFrom(index, refName);

					return initialState[what];
				},
			};
		},
		refSectionConfig: {
			// This is fine for '/route/rid/did/sid/tripid' but if everything isnt loaded the refs don't exist
			timetableRef: {
				west: () => initialState.firstToExist('timetableRef').west(),
				east: () => initialState.firstToExist('timetableRef').east(),
			},
			busRouteRef: {
				west: () => initialState.firstToExist('busRouteRef').west(),
				east: () => initialState.firstToExist('busRouteRef').east(),
			},
			routeStopRef: {
				west: () => initialState.firstToExist('routeStopRef').west(),
				east: () => initialState.firstToExist('routeStopRef').east(),
			},
			tripRef: {
				west: () => initialState.firstToExist('tripRef').west(),
				east: () => initialState.firstToExist('tripRef').east(),
			},
			mapRef: {
				west: () => initialState.firstToExist('mapRef').west(),
				east: () => initialState.firstToExist('mapRef').east(),
			},
		},
		handleHorizontalFocus: (e, refName) => {
			const relKeys = ['Tab', 'Shift', 'Escape'];
			// const relKeys = ['ArrowRight', 'ArrowLeft', 'Tab', 'Shift', 'Escape'];
			if (!relKeys.includes(e.key)) return;

			e.preventDefault();

			// If 'Esc' move focus up to the searchStop componnet
			if (e.key === 'Escape') {
				initialState.searchStopRef.current.focus();
				return;
			}
			if (e.shiftKey && e.key === 'Tab') {
				const refToFocus = initialState.refSectionConfig[refName].west();

				if (!refToFocus.current) return;

				// Get ~first focusable element in the target ref.current.
				const els = refToFocus.current.querySelectorAll('A, BUTTON');
				if (!els.length) return;
				els[0].focus();
				return;
			}
			if (e.key === 'Tab' && !e.shiftKey) {
				const refToFocus = initialState.refSectionConfig[refName].east();
				if (!refToFocus.current) {
					// console.log('no ref to focus');
					return;
				}

				const els = refToFocus.current.querySelectorAll('A, BUTTON');

				if (els.length) {
					els[0].focus();
				}
				return;
			}
		},
		handleInternalFocus: (e, refName) => {
			const relKeys = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'];
			if (!relKeys.includes(e.key)) return;
			const currentRef = initialState[refName];
			const els = Array.from(currentRef.current.querySelectorAll('A, BUTTON'));

			if (!els.length) return;
			const focused = els[els.indexOf(document.activeElement)];
			if (!focused) {
				// console.log('returning nothing is focused this is bad', focused);
				return;
			}
			e.preventDefault();

			const indexOfFocused = els.indexOf(focused);

			if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
				const nextEl = els[indexOfFocused + 1];

				if (nextEl) {
					nextEl.focus();
					return;
				}

				els[0].focus();
			} else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
				const prevEl = els[indexOfFocused - 1];
				if (prevEl) {
					prevEl.focus();
					return;
				}
				els[els.length - 1].focus();
			}
		},
	};

	const [focusList, dispatch] = useReducer(focusListReducer, initialState);

	return (
		<FocusListContext.Provider value={{ focusList, dispatch }}>
			{children}
		</FocusListContext.Provider>
	);
};

export default FocusListContextProvider;
