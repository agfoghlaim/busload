import React, { useContext } from 'react';
import classes from './map.module.scss';

import { BusRouteListContext } from '../../contexts/busRouteContext';
import { FocusListContext } from '../../contexts/focusContext';

import {
	MapContainer,
	TileLayer,
	Marker,
	Polyline,
	useMap,
} from 'react-leaflet';

const Map = () => {
	const { routeList } = useContext(BusRouteListContext);
	const { tripShapes, selectedBusStop, selectedBusStopDets } = routeList;

	const { focusList } = useContext(FocusListContext);
	const { handleHorizontalFocus, handleInternalFocus, mapRef } = focusList;

	// Not dealing with shapes loading & error, the polyline just won't load.
	const { dets: shapes } = tripShapes;

	function MyComponent() {
		const map = useMap();

		if (!selectedBusStopDets) return null;
		map.setView(
			[selectedBusStopDets.stop_lat, selectedBusStopDets.stop_lon],
			15
		);
		return null;
	}

	const polyline =
		shapes &&
		shapes.map((s) => {
			return [s.shape_pt_lat, s.shape_pt_lon];
		});
	const options = { color: 'purple' };

	return selectedBusStopDets && selectedBusStop ? (
		<div
			ref={mapRef}
			onKeyDown={(e) => {
				handleHorizontalFocus(e, 'mapRef');
				handleInternalFocus(e, 'mapRef');
			}}
		>
			<MapContainer
				width="100%"
				height="100%"
				// center={[53.280816778923196, -9.00697934960717]}
				center={
					selectedBusStopDets
						? [selectedBusStopDets.stop_lat, selectedBusStopDets.stop_lon]
						: [53.280816778923196, -9.00697934960717]
				}
				zoom={15}
			>
				<MyComponent />
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				{polyline?.length && (
					<Polyline pathOptions={options} positions={polyline} />
				)}

				{selectedBusStop && selectedBusStopDets && (
					<Marker
						key={selectedBusStopDets.stop_id}
						position={[
							selectedBusStopDets.stop_lat,
							selectedBusStopDets.stop_lon,
						]}
						className={classes.marker}
						// eventHandlers={{
						// 	click: () => {
						// 		setPopBus(v);
						// 	},
						// }}
					/>
				)}
			</MapContainer>
		</div>
	) : null;
};

export default Map;
