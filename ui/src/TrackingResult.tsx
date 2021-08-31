import React, { Component } from 'react';
import './ManagementComponents/NodeMap.css';
import {DELIVERY_URL} from './defineUrl';
import { useHistory, useLocation } from 'react-router-dom';

declare global {
	interface Window {
		kakao: any;
	}
}

interface TrackingResultState {
	map: any;
	left: number;
	right: number;
	up: number;
	down: number;
    srcLng:number;
    srcLat:number;
    destLng:number;
    destLat:number;
    droneLng:number;
    droneLat:number;
}

class TrackingResult extends Component<TrackingResultState> {
    state: TrackingResultState = {
		map: {},
		left: 0,
		right: 0,
		up: 0,
		down: 0,
        srcLng:0,
        srcLat:0,
        destLng:0,
        destLat:0,
        droneLng:0,
        droneLat:0,
	};

	/*
    componentDidMount = () => {

        this.getLngLat();

		var mapContainer = document.getElementById('node_map'); // 지도를 표시할 div
		var mapOption = {
			center: new window.kakao.maps.LatLng(
				37.49575158172499,
				126.95633291769067
			), // 지도의 중심좌표
			level: 5, // 지도의 확대 레벨
		};

		// 지도를 생성합니다
		var map = new window.kakao.maps.Map(mapContainer, mapOption);
		this.setState({ map: map });

		this.getnodeList(
			this.state.left,
			this.state.right,
			this.state.up,
			this.state.down,
		);

		// 드래그가 끝날 때 or 확대 수준이 변경되면
		window.kakao.maps.event.addListener(map, 'idle', () => {
			// 지도의 현재 영역을 얻어옵니다
			var bounds = map.getBounds();

			// 영역의 남서쪽 좌표를 얻어옵니다
			var swLatLng = bounds.getSouthWest();

			// 영역의 북동쪽 좌표를 얻어옵니다
			var neLatLng = bounds.getNorthEast();

			this.setState({
				left: swLatLng.getLng(), // left
				right: neLatLng.getLng(), // right
				up: neLatLng.getLat(), // up
				down: swLatLng.getLat(), // down
			});

			this.getnodeList(
				swLatLng.getLng(), // left
				neLatLng.getLng(), // right
				neLatLng.getLat(), // up
				swLatLng.getLat() // down
			);
		});
	};

    getLngLat() {
        var url = DELIVERY_URL;

		fetch(url)
			.then((res) => res.json())
			.then((data) => this.setState({ tagList: data }))
			.catch((error) => console.error('Error:', error));
    }
	*/
    render() {
        return(
            <div style={{ float: 'right', marginTop:"315px", marginRight:"100px"}}>
					<button
						type="button"
						className="btn my-2 my-sm-0" 
						data-toggle="modal"
						style={{ background: '#82CAFA', color : 'white' }}
						// onClick={this.handleSubmit}
					>
					Tracking Delivery
					</button>
					</div>
        );
    }
}

export default TrackingResult;