import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { FocusListContext } from '../../contexts/focusContext';
import { BusRouteListContext } from '../../contexts/busRouteContext';
import { MobileContext } from '../../contexts/mobileContext';

import classes from './layout.module.scss';
import Timetables from '../Timetables/Timetables';
import Split from 'react-split';
import SearchStop from '../SearchStop/SearchStop';
import SearchResults from '../SearchResults/SearchResults';

const Layout = ({ children }) => {
	const { focusList } = useContext(FocusListContext);
	const { isMobile } = useContext(MobileContext);
	const { busRouteRef } = focusList;
	const { routeList } = useContext(BusRouteListContext);
	const { searchIsActive } = routeList;
	const location = useLocation();
	const path = location.pathname.split('/').filter((p) => p !== '');
	// For desktop, so the SearchStop component stays above the BusRoute/SearchResults component
	const [searchMargin, setSearchMargin] = useState('15vw');
	const [timetableWidth, setTimetableWidth] = useState(20);

	function handleSetMarginSize(sizes) {
		if (!sizes) return;
		setSearchMargin(`${sizes[0]}vw`);
		setTimetableWidth(sizes[0]);
	}

	function SplitOrNot({ children }) {
		if (isMobile) {
			return (
				<Split
					sizes={location.pathname === '/' ? [100, 0] : [0, 100]}
					className="split first-split"
					direction="horizontal"
					minSize={0}
					gutterSize={16}
					snapOffset={10}
				>
					{children}
				</Split>
			);
		}
		return (
			!isMobile && (
				<Split
					sizes={[timetableWidth, 100 - timetableWidth]}
					className="split first-split"
					direction="horizontal"
					minSize={0}
					gutterSize={16}
					snapOffset={10}
					onDragEnd={handleSetMarginSize}
				>
					{children}
				</Split>
			)
		);
	}

	return (
		<div className={classes.layout}>
			<header className={classes.header}>
				<>
					<Link to={`/`} className="mono">
						Busload Galway
					</Link>
					{/* <button onClick={() => setIsMobile(!isMobile)}>
						{isMobile ? 'to Desktop' : 'to Mobile'}
					</button> */}
				</>
			</header>
			<section className={classes.info}>
				{isMobile && path.length !== 3 ? null : (
					<SearchStop searchMargin={!isMobile ? searchMargin : '1rem'} />
				)}
			</section>
			<main>
				<SplitOrNot>
					<div className={classes.left}>
						<Timetables />
					</div>
					<div className={classes.right}>
						{location.pathname === '/' &&
							searchIsActive &&
							!isMobile(
								<>
									<div className="split-heading">Search results</div>
									<div ref={busRouteRef} className={'padding'}>
										<SearchResults />
									</div>
								</>
							)}

						{children}
					</div>
				</SplitOrNot>
			</main>
			<footer
				style={{
					background: 'var(--black)',
					color: 'var(--white)',
					fontWeight: 'bold',
					display: 'grid',
					placeContent: 'center',
				}}
			>
				Marie {new Date().getFullYear()}
			</footer>
		</div>
	);
};

export default Layout;
