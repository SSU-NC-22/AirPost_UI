import React, { Component } from 'react';
import Select from 'react-select';
import {
	value_list_elem,
	sinkListElem,
	sinkOptionsElem,
	locationElem,
} from '../../ElemInterface/ElementsInterface';
import { NODE_URL, SINK_URL} from '../../defineUrl';
import LarLngPicker from '../LatLngPicker';
// react-select : https://github.com/JedWatson/react-select

interface RegisterNodeState {
	sinkList: Array<sinkListElem>;
	valueList: Array<value_list_elem>;

	node_name: string;
	kind: string;
	location: locationElem;
	sink_id: number;
	nameValid: boolean;
	kindValid: boolean;
	valueValid: boolean;
	sinkValid: boolean;
}

interface nodeOptionsElem {
	label: string;
	value: string;
}

/*
RegisterNode
- Show modal to register node
*/

class RegisterNode extends Component<{}, RegisterNodeState> {
	state: RegisterNodeState = {
		sinkList: [],
		valueList: [],

		node_name: '',
		kind: '',
		location: {
			lng: 0,
			lat: 0,
			alt: 0,
		},
		sink_id: 0,

		nameValid: false,
		kindValid: false,
		valueValid: false,
		sinkValid: false,
	};
	componentDidMount() {
		this.getsinkList();
	}

	// Get sink list from backend
	getsinkList() {
		var url = SINK_URL;

		fetch(url)
			.then((res) => res.json())
			.then((data) => this.setState({ sinkList: data }))
			.catch((error) => console.error('Error:', error));
	}

	// Handle node name change by typing
	handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		// name valid check : user should enter node name
		if (e.target.value.length > 0) {
			this.setState({
				node_name: e.target.value,
				nameValid: true,
			});
		} else {
			this.setState({
				node_name: e.target.value,
				nameValid: false,
			});
		}
	};

	// 노드 종류에 따라 마커이미지 다르게 나타나기 위해 사용자로부터 노드 종류 받음.
	handleKindChange = (nodeKind: any) => {
		if (nodeKind !== null) {
			this.setState({
				kind: nodeKind.value,
				kindValid: true,
			});
		} else {
			this.setState({
				kind: nodeKind.value,
				kindValid: false,
			});
		}

		if (nodeKind.value == 'drone'){
			let DroneOption: Array<value_list_elem> = [
				{ value_name: 'battery'}, {value_name: 'gps'}, {value_name: 'atm'}, {value_name: 'accelerate'}, {value_name: 'speed'}
			];
			this.setState({
				valueList: DroneOption,
				valueValid:true
			});
		}
		if (nodeKind.value == 'station'){
			let StationOption: Array<value_list_elem> = [
				{value_name: 'gps'}, {value_name: 'ultrasonic'}
			];
			this.setState({
				valueList: StationOption,
				valueValid:true
			});
		} 
	}

	// Handle LarLng change by pick lat, lng at map
	handleLarLngChange = (location: locationElem) => {
		this.setState({
			location,
		});
	};

	// Handle selected sink change by selecting sink
	handleSinkChange = (sink: any) => {
		// sink valid check : user should select sink
		if (sink !== null) {
			this.setState({
				sink_id: sink.id,
				sinkValid: true,
			});
		} else {
			this.setState({
				sink_id: sink.id,
				sinkValid: false,
			});
		}
	};

	handleValueChange = (idx: number) => (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		// Value list is updated dynamic. Its element can be added or removed freely.
		// so find changing field by using received idx and change state.
		const newsensor_values = this.state.valueList.map(
			(value: value_list_elem, sidx: number) => {
				if (idx !== sidx) return value;
				return { ...value, value_name: e.target.value };
			}
		);

		// value list valid check : User should enter more than a value and each value input field should be filled
		if (
			newsensor_values !== null &&
			!newsensor_values.some((value) => value.value_name === '') && // find empty field
			newsensor_values[idx].value_name.length > 0
		) {
			this.setState({ valueList: newsensor_values, valueValid: true });
		} else {
			this.setState({ valueList: newsensor_values, valueValid: false });
		}
	};

	handleRemoveClick = (idx: number) => () => {
		// Remove #idx value list elem which user picked
		this.setState({
			valueList: this.state.valueList.filter(
				(s: any, sidx: number) => idx !== sidx
			),
		});
	};

	handleAddClick = () => {
		// Add a value list elem
		this.setState({
			valueList: [...this.state.valueList, {value_name: ''}],
		});
	};

	// Handle submit button click event
	handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();

		var url = NODE_URL;
		var data = this.state;
		var name = this.state.kind + '-' + this.state.node_name;     // 노드종류를 이름 앞에 붙여 서버로 보냄 (ex. trashcan-trashcanNode1)

		// Valid check (unvalid -> alert)
		if (!this.state.nameValid) {
			alert('Please enter node name.');
			return;
		}
		if (!this.state.kindValid) {
			alert('Please select more than a node kind.');
			return;
		}
		if (!this.state.valueValid) {
			alert('Please select more than a sensor.');
			return;
		}
		if (!this.state.sinkValid) {
			alert('Please enter sink.');
			return;
		}

		// Check whether user really want to submit
		var submitValid: boolean;
		submitValid = window.confirm('Are you sure to register this node?');
		if (!submitValid) {
			return;
		}

		console.log(
			JSON.stringify({
				name: name,
				lat: data.location.lat,
				lng: data.location.lng,
			})
		);

		fetch(url, {
			method: 'POST', // or 'PUT'
			body: JSON.stringify({
				name: name,
				lat: data.location.lat,
				lng: data.location.lng,
				sink_id: data.sink_id,
				sensors: data.valueList,
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then((res) => res.json())
			.then((response) => console.log('Success:', JSON.stringify(response)))
			.catch((error) => console.error('Error:', error))
			.then(() => window.location.reload(false)); // nodeList will change so reload for reflecting change
	};

	render() {
		let sinkOptions: Array<sinkOptionsElem>;
		sinkOptions = this.state.sinkList.map((val: sinkListElem) => {
			return { label: val.name, value: val.name, id: val.id };
		});

		let nodeOptions: Array<nodeOptionsElem> = [
			{ label: 'drone', value: 'drone'}, 
			{ label: 'station', value: 'station' }, 
		];
		return (
			<>
				<div
					className="modal fade"
					id="register-node-modal"
					role="dialog"
					aria-labelledby="register-node-modal"
				>
					<div className="modal-dialog  modal-lg" role="document">
						<div className="modal-content">
							<div className="modal-header">
								<h4 className="modal-title" id="register-node-modal">
									Register node
								</h4>
								<button
									type="button"
									className="close"
									data-dismiss="modal"
									aria-label="Close"
								>
									<span aria-hidden="true">×</span>
								</button>
							</div>
							<div className="modal-body">
								<form>
									<div className="form-group">
										<label>Node name</label>
										<input
											type="text"
											className="form-control"
											name="node_name"
											placeholder="name"
											value={this.state.node_name}
											onChange={this.handleNameChange}
										/>
									</div>
									<div>
										<label>location</label>
										<LarLngPicker
											handleLarLngChange={this.handleLarLngChange}
										/>
									</div>
									<div className="form-group">
										<label>Select Node</label>
										<Select
											options={nodeOptions}
											name="action"
											classNamePrefix="select"
											onChange={this.handleKindChange}
										/>
									</div>
									<div className="form-group">
										<label>Register sensors</label>
										{this.state.valueList.map(
											(value: value_list_elem, idx: number) => (
												<div className="input-group mb-3">
													<div className="input-group-prepend">
														<span className="input-group-text">{idx}</span>
													</div>
													<input
														type="text"
														className="form-control"
														name="sensor_values"
														placeholder={'Enter value name'}
														value={value.value_name}
														onChange={this.handleValueChange(idx)}
													/>
													<div className="input-group-append">
														<button
															className="btn btn-secondary btn-sm"
															type="button"
															id="button-addon2"
															onClick={this.handleRemoveClick(idx)}
															style={{ background: 'light' }}
														>
															<svg
																width="1em"
																height="1em"
																viewBox="0 0 16 16"
																className="bi bi-trash-fill"
																fill="currentColor"
																xmlns="http://www.w3.org/2000/svg"
															>
																<path
																	fill-rule="evenodd"
																	d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z"
																/>
															</svg>
														</button>
													</div>
												</div>
											)
										)}
									</div>
									<div className="form-group">
										<button
											type="button"
											className="btn"
											onClick={this.handleAddClick}
											style={{ background: '#82CAFA', color : 'white' }}
										>
											Add value
										</button>
									</div>
									<div className="form-group">
										<label>Select sink</label>
										<Select
											className="basic-select"
											name="sink"
											options={sinkOptions}
											classNamePrefix="select"
											onChange={this.handleSinkChange}
										/>
									</div>
									<div className="modal-footer">
										<button
											type="submit"
											className="btn my-2 my-sm-0" 
											onClick={this.handleSubmit}
											style={{ background: '#82CAFA', color : 'white' }}
										>
											Submit
										</button>
										<button
											type="reset"
											className="btn btn-default"
											data-dismiss="modal"
										>
											Cancel
										</button>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</>
		);
	}
}

export default RegisterNode;


