import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Select from 'react-select';
import CMap from './CMap'
import { DELIVERY_URL, TAG_URL } from './defineUrl';
import DeliveryConfirm from './DeliveryConfirm';
import { tagOptionsElem } from './ElemInterface/ElementsInterface';

interface RegisterDeliveryState {
	tagList: Array <tagOptionsElem>;
	senderName:string;
	senderPn:string;
	recipientName:string;
	recipientPn:string;
	destinationTagId:number;
	destinationTagName:string;
	invoiceNumber:string;
	sNameValid: boolean;
	sNumberValid: boolean;
	rNameValid: boolean;
	rNumberValid: boolean;
	destValid: boolean;
	submit:boolean;
}

class RegisterDelivery extends Component<{},RegisterDeliveryState> {
	state:RegisterDeliveryState = {
		tagList:[],
		senderName:'',
		senderPn:'',
		recipientName:'',
		recipientPn:'',
		destinationTagId:0,
		destinationTagName:'',
		invoiceNumber:'',
		sNameValid: false,
		sNumberValid: false,
		rNameValid: false,
		rNumberValid: false,
		destValid: false,
		submit:false,
	}

	componentDidMount() {
		this.gettagList();
	}

	// 현재 출발지에서 도달할 수 있는 tag들을 backend로부터 받아와야 함
	gettagList() {
		var url = TAG_URL;

		fetch(url)
			.then((res) => res.json())
			.then((data) => this.setState({ tagList: data }))
			.catch((error) => console.error('Error:', error));
	}

	handleSNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.value.length > 0) {
			this.setState({
				senderName: e.target.value,
				sNameValid: true,
			});
		} else {
			this.setState({
				senderName: e.target.value,
				sNameValid: false,
			});
		}
	};

	handleRNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.value.length > 0) {
			this.setState({
				recipientName: e.target.value,
				rNameValid: true,
			});
		} else {
			this.setState({
				recipientName: e.target.value,
				rNameValid: false,
			});
		}
	};

	handleSNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const phExp = /^[0]{1}[1]{1}[0-1]{1}[0-9]{8}/;
		if (e.target.value.match(phExp)) {
			this.setState({
				senderPn: e.target.value,
				sNumberValid: true,
			});
		} else {
			this.setState({
				senderPn: e.target.value,
				sNumberValid: false,
			});
		}
	};

	handleRNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const phExp = /^[0]{1}[1]{1}[0-1]{1}[0-9]{8}/;
		if (e.target.value.match(phExp)) {
			this.setState({
				recipientPn: e.target.value,
				rNumberValid: true,
			});
		} else {
			this.setState({
				recipientPn: e.target.value,
				rNumberValid: false,
			});
		}
	};

	handleTagChange = (tag: any) => {
		if ( tag != null) {
			this.setState({
				destinationTagId: tag.id,
				destinationTagName: tag.label,
				destValid: true,
			});
		} else {
			this.setState({
				destinationTagId: tag.id,
				destinationTagName: tag.lable,
				destValid: false,
			});
		}
	};

	makeInvoiceNumber() {
		
	}

	handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();

		var url = DELIVERY_URL;
		var data = this.state;

		if (!this.state.sNameValid) {
			alert('Please enter sender name.');
			return;
		}
		if (!this.state.rNameValid) {
			alert('Please enter recipient name.');
			return;
		}
		if (!this.state.sNumberValid) {
			alert('Please enter valid type of sender phone number.');
			return;
		}
		if (!this.state.rNumberValid) {
			alert('Please enter valid type of recipient phone number.');
			return;
		}
		if (!this.state.destValid) {
			alert('Please enter destination tag');
			return;
		}

		// Check whether user really want to submit
		var submitValid: boolean;
		submitValid = window.confirm('Are you sure to register this delivery?');
		if (!submitValid) {
			return;
		}
		this.setState({submit:true})

		this.makeInvoiceNumber();

		fetch(url, {
			method: 'POST', // or 'PUT'
			body: JSON.stringify({
				senderName: this.state.senderName,
				recipientName: this.state.recipientName,
				senderPn: this.state.senderPn,
				recipientPn: this.state.recipientPn,
				destinationTagId: this.state.destinationTagId,
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then((res) => res.json())
			.then((response) => console.log('Success:', JSON.stringify(response)))
			.catch((error) => console.error('Error:', error))
			.then(() => window.location.reload(false));
	};

	render() {
		let tagOptions: Array<tagOptionsElem>;
		tagOptions = [{label:'EXP', id:0}];
		{/*
		tagOptions = this.state.tagList.map((val: tagOptionsElem) => {
			return {
				id: val.id,
			};
		});
		*/}

		if(this.state.sNameValid && this.state.rNameValid && this.state.sNameValid && this.state.rNumberValid && this.state.destValid&& this.state.submit) {
			return <Redirect to = {{ pathname:'/confirm', state:{ senderName:this.state.senderName, senderPn:this.state.senderPn, recipientName:this.state.recipientName, recipientPn:this.state.recipientPn, destinationTagId:this.state.destinationTagId, destinationTagName:this.state.destinationTagName}}}></Redirect> 
			//(<DeliveryConfirm senderName={this.state.senderName} senderPn={this.state.senderPn} recipientName={this.state.recipientName} recipientPn={this.state.recipientPn} destinationTagId={this.state.destinationTagId} destinationTagName={this.state.destinationTagName}></DeliveryConfirm>);
		}

		return (
			<>
				<div>
					<div style={{float: "left"}}>
						<CMap
							healthState={new Map<0, 0>()}
							batteryState={new Map<0, 0>()}
						></CMap>
					</div>
					<div className="form-group" style={{float:"right", marginTop:"80px"}}>
						<div style={{marginBottom:"15px", marginLeft:"70px"}}>
							<img
    							src={ "https://user-images.githubusercontent.com/68888653/126869406-4d22668f-04df-44e2-a952-6c4f7f9bc15d.png" }
    							width='30px'
    							height='40px'
							/>
							<label style={{marginLeft:"20px", fontWeight:"bold"}}>Tag</label>
						</div>
						<div style={{marginBottom:"100px", marginLeft:"70px"}}>
							<img
    							src={ "https://user-images.githubusercontent.com/68888653/126869445-228df4e6-6496-4597-b12e-7a0dd11a12d8.png" }
    							width='30px'
    							height='40px'
							/>
							<label style={{marginLeft:"20px", fontWeight:"bold"}}>Station</label>
						</div>
						<label>Sender Name</label>
						<input
							type="text"
							className="form-control"
							name="client_name"
							placeholder={'Enter your name'}
							style={{marginBottom:"10px", width:"270px"}}
							value={this.state.senderName}
							onChange={this.handleSNameChange}
						/>
						<label>Sender Phone Number</label>
						<input
							type="text"
							className="form-control"
							name="client_name"
							placeholder={'Enter your phone number'}
							style={{marginBottom:"10px"}}
							value={this.state.senderPn}
							onChange={this.handleSNumberChange}
						/>
						<label>Recipient Name</label>
						<input
							type="text"
							className="form-control"
							name="client_name"
							placeholder={'Enter recipient name'}
							style={{marginBottom:"10px"}}
							value={this.state.recipientName}
							onChange={this.handleRNameChange}
						/>
						<label>Recipient Phone Number</label>
						<input
							type="text"
							className="form-control"
							name="client_name"
							placeholder={'Enter recipient phone numeber'}
							style={{marginBottom:"10px"}}
							value={this.state.recipientPn}
							onChange={this.handleRNumberChange}
						/>
						<label>Destination Tag</label>
							<Select
								className="basic-select"
								name="sink"
								options={tagOptions}
								classNamePrefix="select"
								placeholder={"select destination"}
								onChange={this.handleTagChange}
							/>
					</div>
					<div style={{float:"right", marginTop:"20px"}}>
						<button
							type="submit"
							className="btn my-2 my-sm-0" 
							onClick={this.handleSubmit}
							style={{ background: '#82CAFA', color : 'white'}}
							>
							Submit
						</button>
					</div>
				</div>
			</>
		);
	}
}

export default RegisterDelivery;