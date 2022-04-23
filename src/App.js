import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';

import './App.css';

import Layout from './components/Layout/Layout';
import BusRoute from './components/BusRoute/BusRoute';
import RouteStop from './components/RouteStop/RouteStop';
import Trip from './components/Trip/Trip';

function App() {
	return (
		<Routes>
			<Route
				path="/*"
				element={
					<div className="App">
						<Layout />
					</div>
				}
			/>
			<Route path="route/" element={<Outlet />}>
				<Route path=":routeid/:directionid" element={<BusRoute />}>
					<Route path=":stopid" element={<RouteStop />}>
						<Route path=":tripid" element={<Trip />}></Route>
					</Route>
				</Route>
			</Route>
			<Route
				path="*"
				element={
					<main style={{ padding: '1rem' }}>
						<p>There's nothing here!</p>
					</main>
				}
			/>
		</Routes>
	);
}

export default App;
