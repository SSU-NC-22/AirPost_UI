import React, { Component } from 'react';

class TrackingDelivery extends Component {
	render() {
		return (
			<>
				<div style={{ float: 'right' }}>
					<button
						type="button"
						className="btn my-2 my-sm-0" 
						data-toggle="modal"
						style={{ background: '#82CAFA', color : 'white' }}
					>
						Tracking Delivery
					</button>
				</div>
			</>
		);
	}
}

export default TrackingDelivery;