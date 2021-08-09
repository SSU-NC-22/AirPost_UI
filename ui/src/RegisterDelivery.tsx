import React, { Component } from 'react';
import CMap from './CMap'

class RegisterDelivery extends Component {
	render() {
		return (
			<>
				<div>
					<CMap
						healthState={new Map<0, 0>()}
						batteryState={new Map<0, 0>()}
					></CMap>
				</div>
			</>
		);
	}
}

export default RegisterDelivery;