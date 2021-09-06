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
	sourceList: tagOptionsElem;
	destList: tagOptionsElem;
	invoiceNumber:string;
	sNameValid: boolean;
	sNumberValid: boolean;
	rNameValid: boolean;
	rNumberValid: boolean;
	submit:boolean;
}

class RegisterDelivery extends Component<{},RegisterDeliveryState> {
	state:RegisterDeliveryState = {
		tagList:[],
		senderName:'',
		senderPn:'',
		recipientName:'',
		recipientPn:'',
		sourceList:{label:'', id:0},
		destList:{label:'', id:0},
		invoiceNumber:'',
		sNameValid: false,
		sNumberValid: false,
		rNameValid: false,
		rNumberValid: false,
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

	getsourceList = (data:any) => {
		var tagList: tagOptionsElem;
		var tagList = {label:'', id:0};
		tagList.id = data.id;
		tagList.label = data.label;

		this.setState({sourceList:data});
	}

	getdestList = (data:any) => {
		var tagList: tagOptionsElem;
		var tagList = {label:'', id:0};
		tagList.id = data.id;
		tagList.label = data.label;

		this.setState({destList:data});
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

	/*
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
	*/

	makeInvoiceNumber() {
		const date = new Date();
		var tempNum = "";
		var tempMonth = 0;
		var tempDate = 0;
		var tempHours = 0;
		var tempMinutes = 0;
		var tempSeconds = 0;

		tempNum += String(date.getFullYear());

		tempMonth = date.getMonth();
		if (tempMonth < 10) {
			tempNum += "0";
		}
		tempNum += String(tempMonth);

		tempDate = date.getDate();
		if (tempDate < 10) { 
			tempNum += "0";
		}
		tempNum += String(tempDate);
		tempNum += String(date.getDay());

		tempHours = date.getHours();
		if (tempHours < 10) {
			tempNum += "0";
		}
		tempNum += String(tempHours);

		tempMinutes = date.getMinutes();
		if (tempMinutes < 10) {
			tempNum += "0";
		}
		tempNum += String(tempMinutes);

		tempSeconds = date.getSeconds();
		if (tempSeconds < 10) {
			tempNum += "0";
		}
		tempNum += tempSeconds;
		tempNum = String(tempNum);

		return tempNum;
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

		/*
		if (!this.state.destValid) {
			alert('Please enter destination tag');
			return;
		}
		*/

		// Check whether user really want to submit
		var submitValid: boolean;
		submitValid = window.confirm('Are you sure to register this delivery?');
		if (!submitValid) {
			return;
		}
		this.setState({submit:true})

		var order_num = this.makeInvoiceNumber();
		this.setState({invoiceNumber:order_num});

		fetch(url, {
			method: 'POST', // or 'PUT'
			body: JSON.stringify({
				order_num: order_num,
				drone_id: 1,
				src_name: this.state.senderName,
				src_phone: this.state.senderPn,
				dest_name: this.state.recipientName,
				dest_phone: this.state.recipientPn,
				source_station_id:this.state.sourceList.id,
				dest_station_id: this.state.destList.id,
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

		if(this.state.sNameValid && this.state.rNameValid && this.state.sNameValid && this.state.rNumberValid && this.state.submit) {
			return <Redirect to = {{ pathname:'/confirm', state:{ senderName:this.state.senderName, senderPn:this.state.senderPn, recipientName:this.state.recipientName, recipientPn:this.state.recipientPn, invoiceNumber:this.state.invoiceNumber, sourceList:this.state.sourceList.label, destList:this.state.destList.label}}}></Redirect> 
			//(<DeliveryConfirm senderName={this.state.senderName} senderPn={this.state.senderPn} recipientName={this.state.recipientName} recipientPn={this.state.recipientPn} destinationTagId={this.state.destinationTagId} destinationTagName={this.state.destinationTagName}></DeliveryConfirm>);
		}

		return (
			<>
				<div>
					<div style={{float: "left"}}>
						<CMap
							healthState={new Map<0, 0>()}
							batteryState={new Map<0, 0>()}
							getsourceList={this.getsourceList}
							getdestList={this.getdestList}
						></CMap>
					</div>
					<div className="form-group" style={{float:"right", marginTop:"50px"}}>
						<div style={{marginBottom:"15px", marginLeft:"70px"}}>
							<img
    							src={ "https://user-images.githubusercontent.com/68888653/131796807-2d320e22-d43f-4cdb-9925-a367f14aeca2.png" }
    							width='30px'
    							height='40px'
							/>
							<label style={{marginLeft:"20px", fontWeight:"bold"}}>Tag</label>
						</div>
						<div style={{marginBottom:"60px", marginLeft:"70px"}}>
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
						<label>Source Station</label>
							<Select
								className="basic-select"
								name="sink"
								value={this.state.sourceList}
								classNamePrefix="select"
								placeholder={"select source"}
								// onChange={this.handleTagChange}
							/>
						<label>Destination Tag</label>
							<Select
								className="basic-select"
								name="sink"
								value={this.state.destList}
								classNamePrefix="select"
								placeholder={"select destination"}
								// onChange={this.handleTagChange}
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