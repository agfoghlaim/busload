import { doMinutes } from '../util';

export default function busRouteListReducer(state, action) {
	switch (action.type) {
		case 'INIT':
			const { selectedRoute, selectedDirection } = action.payload;
			return {
				...state,
				selectedRoute,
				selectedDirection,
			};
		case 'BUS_ROUTE_LIST':
			return {
				...state,
				loading: false,
				error: '',
				list: { ...action.payload },
			};
		case 'SELECT_BUS_ROUTE':
			const selectedBusRouteDets = state.list.dets.find(
				(route) =>
					route.route_short_name === action.payload.routeId &&
					route.direction_id === action.payload.directionId
			);

			return {
				...state,
				selectedRoute: action.payload.routeId,
				selectedDirection: action.payload.directionId,
				selectedBusRouteDets,
			};
		case 'SELECT_BUS_STOP':
			if (!state.selectedBusRouteDets?.g_stops.length) {
				return {
					...state,
					selectedBusRouteDets: null,
					selectedBusStop: null,
				};
			}
			const selectedStop = state.selectedBusRouteDets.g_stops.find(
				(stop) => stop.stop_id === action.payload
			);

			return {
				...state,
				selectedBusStop: selectedStop?.stop_id ? selectedStop.stop_id : null,
				selectedBusStopDets: selectedStop,
			};
		case 'SELECT_TRIP':
			return {
				...state,
				selectedTrip: action.payload,
			};
		case 'SELECT_DATE':
			return {
				...state,
				selectedDate: action.payload,
			};

		case 'TRIP_STOPTIMES':
			return {
				...state,
				tripStopTimes2: { ...action.payload },
			};
		case 'SHAPES':
			return {
				...state,
				tripShapes: { ...action.payload },
			};
		case 'FETCHED_G_STOP':
			return {
				...state,
				selectedStopExtraDets: { ...action.payload },
			};

		case 'STOP_TIMES':
			if (action.payload.dets) {
				const withMins = action.payload?.dets?.map((route) => {
					return {
						stopTimes: doMinutes(route.g_stop_times),
						date: route.date.substring(0, 16),
					};
				});

				return {
					...state,
					selectedBusStopTimes2: {
						...state.selectedBusStopTimes2,
						dets: withMins,
					},
				};
			}
			return {
				...state,
				selectedBusStopTimes2: {
					...state.selectedBusStopTimes2,
					...action.payload,
				},
			};
		case 'SEARCH_IS_ACTIVE':
			return {
				...state,
				searchIsActive: action.payload,
			};
		case 'SEARCH_RESULTS':
			return {
				...state,
				searchResults: action.payload,
			};
		default:
			return { ...state };
	}
}
