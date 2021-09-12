import React, { Component } from 'react';
import './ManagementComponents/NodeMap.css';
import {DELIVERY_URL} from './defineUrl';
import {nodeListElem, value_list_elem} from './ElemInterface/ElementsInterface'

declare global {
	interface Window {
		kakao: any;
	}
}

interface TrackingResultProps {
    srcLng:number;
    srcLat:number;
    destLng:number;
    destLat:number;
    droneLng:number;
    droneLat:number;
}

interface TrackingResultState {
	nodeList: Array<nodeListElem>;
	map: any;
	left: number;
	right: number;
	up: number;
	down: number;
}

class TrackingResult extends Component<TrackingResultProps, TrackingResultState> {
    state: TrackingResultState = {
		nodeList: [],
		map: {},
		left: 0,
		right: 0,
		up: 0,
		down: 0,
	};
	
    componentDidMount = () => {
		var mapContainer = document.getElementById('node_map'); // 지도를 표시할 div
		var mapOption = {
			center: new window.kakao.maps.LatLng(
				37.49575158172499,	
				126.95633291769067	
			),  
			// this.state.droneLng
			// this.state.droneLat,
			// 지도의 중심좌표
			level: 5, // 지도의 확대 레벨
		};

		// 지도를 생성합니다
		var map = new window.kakao.maps.Map(mapContainer, mapOption);
		this.setState({ map: map });

		/*
		this.getnodeList(
			this.state.left,
			this.state.right,
			this.state.up,
			this.state.down,
		);
		*/

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

			/*
			this.getnodeList(
				swLatLng.getLng(), // left
				neLatLng.getLng(), // right
				neLatLng.getLat(), // up
				swLatLng.getLat() // down
			);
			*/
		});
	};
	
	getnodeList(left: number, right: number, up: number, down: number) {
		var url =
			DELIVERY_URL +
			'?left=' +
			left +
			'&right=' +
			right +
			'&up=' +
			up +
			'&down=' +
			down;
		fetch(url)
			.then((res) => res.json())
			.then((data) => this.setState({ nodeList: data }))
			.catch((error) => console.error('Error:', error));
	}

	displayMarker(position: any, map: any) {
		// 마커를 생성합니다
		/*var marker = new window.kakao.maps.Marker({
			map: map, // 마커를 표시할 지도
			position: position.latlng, // 마커의 위치
		});*/

		var marker = this.addMarker(position, map)

		// 마커에 표시할 custom overlay를 생성합니다
		var customOverlay = new window.kakao.maps.CustomOverlay({
			position: marker.getPosition(),
		});

		var content = document.createElement('div');
		
		var title = document.createElement('div');
		title.innerHTML = '';
		title.className = 'title';
		title.setAttribute('style', 'background: #82CAFA;')
		
		var closeBtn = document.createElement('button');

		closeBtn.onclick = function () {
			customOverlay.setMap(null);
		};
		closeBtn.className = 'close';
		closeBtn.type = 'button';
		
		title.appendChild(closeBtn);
		
		var body = document.createElement('div');
		var bodytextAv = document.createElement('div');
		var bodytextBa = document.createElement('div');
		bodytextAv.appendChild(document.createTextNode('Available: O'));
		bodytextBa.appendChild(document.createTextNode('Battery: 77%'));
		body.insertAdjacentElement('beforeend', bodytextAv);
		body.insertAdjacentElement('beforeend', bodytextBa);

		var bodyElem = document.createElement('button');
		bodyElem.className = 'btn'
		bodyElem.setAttribute('style', 'background: #82CAFA; color : white; margin: 0 0 0 130px');
		bodyElem.appendChild(document.createTextNode('Register Delivery'));
		body.insertAdjacentElement('beforeend', bodyElem);

		body.className = 'body';
		body.setAttribute('style', 'margin: 35px 0 0 0');

		var info = document.createElement('div');
		info.className = 'info';
		
		info.insertAdjacentElement('afterbegin', title);
		
		var wrap = document.createElement('div');
		wrap.className = 'wrap';
		
		wrap.insertAdjacentElement('afterbegin', info);
		
		closeBtn.insertAdjacentElement('afterend', body);
		
		content.insertAdjacentElement('afterbegin', wrap);

		customOverlay.setContent(content);

		window.kakao.maps.event.addListener(marker, 'click', function () {
			customOverlay.setMap(map);
		});
	}

	addMarker(position: any, map: any) {
		if ( position.kind  === 'drone') var imageSrc = 'https://user-images.githubusercontent.com/68888653/126869406-4d22668f-04df-44e2-a952-6c4f7f9bc15d.png'
		else if ( position.kind === 'station') var imageSrc = 'https://user-images.githubusercontent.com/68888653/126869445-228df4e6-6496-4597-b12e-7a0dd11a12d8.png'
		else var imageSrc = 'https://user-images.githubusercontent.com/68888653/126869406-4d22668f-04df-44e2-a952-6c4f7f9bc15d.png'
		
		var imageSize = new window.kakao.maps.Size(30 , 35),
			markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize),
			//markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
				marker = new window.kakao.maps.Marker({
				map: map,
				position: position.latlng, // 마커의 위치
				image: markerImage 
			});

		// marker.setMap(map); // 지도 위에 마커를 표출합니다
	
		return marker;
	}

    render() {
		var positions = this.state.nodeList.map((node: nodeListElem) => {
			return {
				title: node.name.split('-')[1] + '-' + node.name.split('-')[2],
				kind: node.name.split('-')[0],
				content: [
					'sink : ' + node.sink_id,
					'id : ' + node.id,
					'sensor : ' +
						node.sensor_values.map((sensor: value_list_elem) => sensor.value_name+', '),
				],
				latlng: new window.kakao.maps.LatLng(node.lat, node.lng),
			};
		});

		for (var i = 0; i < positions.length; i++) {
			this.displayMarker(positions[i], this.state.map);
		}
        return(
            <div style={{ float: 'right', marginTop:"315px", marginRight:"100px"}}>
					<button
						type="button"
						className="btn my-2 my-sm-0" 
						data-toggle="modal"
						style={{ background: '#82CAFA', color : 'white' }}
						// onClick={this.handleSubmit}
					>
					Good!
					</button>
					</div>
        );
    }
}

export default TrackingResult;