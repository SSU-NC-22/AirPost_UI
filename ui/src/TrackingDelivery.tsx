import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import {DELIVERY_URL} from './defineUrl'

interface TrackingDeliveryState {
	invoiceNumber:string;
	numberValid:boolean;
	submit:boolean;
}

class TrackingDelivery extends Component<{}, TrackingDeliveryState> {
	state:TrackingDeliveryState = {
		invoiceNumber:'',
		numberValid:false,
		submit:false,
	}

	handleNumberChange= (e: React.ChangeEvent<HTMLInputElement>) => {
		const phExp = /^[0-9]{16}/;
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
		e.preventDefault();

		var url = DELIVERY_URL;
		var data = this.state;

		if (!this.state.numberValid) {
			alert('Please enter valid invoice number(16 numbers).');
			return;
		}

		fetch(url, {
			method: 'POST', // or 'PUT'
			body: JSON.stringify({
				invoiceNumber: this.state.invoiceNumber,
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then((res) => res.json())
			.then((response) => console.log('Success:', JSON.stringify(response)))
			.catch((error) => console.error('Error:', error))
			.then(() => window.location.reload(false));

		this.setState({submit:true})
	};

	render() {
		if (this.state.invoiceNumber && this.state.submit) {
			return <Redirect to = {{ pathname:'/result'}}></Redirect> 
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