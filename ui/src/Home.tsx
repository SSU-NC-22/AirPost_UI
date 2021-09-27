import React from 'react';
import HomeMap from './HomeMap'
import { KIBANA_DASHBOARDS_URL } from './defineUrl';

/* 
Home
- linked by HOME tab.
*/
function Home() {
	const dashboardUrl: string = KIBANA_DASHBOARDS_URL;
	return (
		<div>
			<HomeMap 
				healthState={new Map<0, 0>()}
				batteryState={new Map<0, 0>()}
			></HomeMap>
		</div>
	);
}


export default Home;