import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import {TRACKING_URL} from './defineUrl'
import TrackingResult from './TrackingResult';
import CMap from './CMap'

interface TrackingDeliveryState {
	invoiceNumber:string;
	numberValid:boolean;
	submit:boolean;

	srcLat:number;
	srcLng:number;
	destLat:number;
	destLng:number;
	droneLat:number;
	droneLng:number;
}

class TrackingDelivery extends Component<TrackingDeliveryState> {
	state:TrackingDeliveryState = {
		invoiceNumber:'',
		numberValid:false,
		submit:false,

		srcLat:0,
        srcLng:0,
        destLat:0,
        destLng:0,
        droneLat:0,
        droneLng:0,
	}

	handleNumberChange= (e: React.ChangeEvent<HTMLInputElement>) => {
		const phExp = /^[0-9]{15}/;
		if (e.target.value.match(phExp)) {
			this.setState({
				invoiceNumber: e.target.value,
				numberValid: true,
			});
		} else {
			this.setState({
				invoiceNumber: e.target.value,
				numberValid: false,
			});
		}
	};

	handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
		var url = TRACKING_URL + '/' + this.state.invoiceNumber;

		if (!this.state.numberValid) {
			alert('Please enter valid invoice number(15 numbers).');
			return;
		}

		fetch(url)
			.then((res) => res.json()) 
			.then((data) => this.setState({srcLng:data.srcLng, srcLat:data.srcLat, destLng:data.destLng, destLat:data.destLat, droneLng:data.droneLng, droneLat:data.droneLat}))
			.catch((error) => console.error('Error:', error));

		this.setState({submit:true})
	};

	render() {
		if (this.state.numberValid && this.state.submit) {
			return <TrackingResult srcLat={this.state.srcLat} srcLng={this.state.srcLng} destLat={this.state.destLat} destLng={this.state.destLng} droneLat={this.state.droneLat} droneLng={this.state.droneLng}></TrackingResult>
			//<Redirect to = {{ pathname:'/result', state:{invoiceNumber:this.state.invoiceNumber}}}></Redirect> 
		}
		return (
			<>
			<div>
				<div style={{float:"left", marginLeft:"150px", marginTop:"270px"}}>
					<label style={{fontSize:"25px"}}>invoice number</label>
					<input
						type="text"
						className="form-control"
						name="client_name"
						placeholder={'Enter invoice number'}
						style={{textAlign:"center", width:"700px"}}
						value={this.state.invoiceNumber}
						onChange={this.handleNumberChange}
					/>
				</div>
				<div style={{ float: 'right', marginTop:"315px", marginRight:"100px"}}>
					<button
						type="button"
						className="btn my-2 my-sm-0" 
						data-toggle="modal"
						style={{ background: '#82CAFA', color : 'white' }}
						onClick={this.handleSubmit}
					>
					Tracking Delivery
					</button>
					</div>
			</div>
			</>
		);
	}
}

export default TrackingDelivery;