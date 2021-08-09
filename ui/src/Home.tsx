import React,{ Component } from 'react';
import Iframe from 'react-iframe';
import HomeMap from './HomeMap'
import { KIBANA_DASHBOARDS_URL } from './defineUrl';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';

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
		/*
		<div
			className="embed-responsive embed-responsive-16by9"
			style={{
				position: 'absolute',
				width: '100%',
				height: '80%',
				left: '0px',
			}}
		>
			<Iframe
				url={dashboardUrl}
				className="embed-responsive-item"
				height="50%"
				scrolling="yes"
			></Iframe>
		</div>
		*/
	);
}


export default Home;