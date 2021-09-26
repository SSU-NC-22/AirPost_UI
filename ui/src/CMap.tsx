import React, { Component } from 'react';
import './ManagementComponents/NodeMap.css';
import { NODE_URL } from './defineUrl';
import { tagOptionsElem } from './ElemInterface/ElementsInterface';

// 참고 : https://apis.map.kakao.com/web/sample/multipleMarkerEvent/

import {
	nodeListElem,
	value_list_elem,
	nodeHealthCheckElem,
} from './ElemInterface/ElementsInterface';
import { makeArray } from 'jquery';
import { defaultProps } from 'react-select/src/Select';

declare global {
	interface Window {
		kakao: any;
	}
}

interface NodeMapProps {
	healthState: Map<number, number>;
	batteryState: Map<number, number>;
	getsourceList: Function;
	getdestList: Function;
}

interface NodeMapState {
	nodeList: Array<nodeListElem>;
	map: any;
	left: number;
	right: number;
	up: number;
	down: number;
}


class NodeMap extends Component<NodeMapProps, NodeMapState> {
	state: NodeMapState = {
		nodeList: [],
		map: {},
		left: 126.8146287054153,
		right: 126.94874516871015,
		up: 37.544991853368245,
		down: 37.491798077077085,
	};
	componentDidMount = () => {
		var mapContainer = document.getElementById('node_map'); // 지도를 표시할 div
		var mapOption = {
			center: new window.kakao.maps.LatLng(
				37.518442478524676,
				126.87796326530058
			), // 지도의 중심좌표
			level: 1, // 지도의 확대 레벨
		};

		// 지도를 생성합니다
		var map = new window.kakao.maps.Map(mapContainer, mapOption);
		mapContainer!.style.height = '730px';
		mapContainer!.style.width = ' 800px';
		map.relayout();
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
	
	// Get node list from backend
	getnodeList(left: number, right: number, up: number, down: number) {
		var url =
			NODE_URL +
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

	setsource(data:any) {
		this.props.getsourceList(data);
	}

	setdest(data:any) {
		this.props.getdestList(data);
	}

	// Make Marker
	displayMarker(position: any, map: any) {
		// 마커를 생성합니다
		/*var marker = new window.kakao.maps.Marker({
			map: map, // 마커를 표시할 지도
			position: position.latlng, // 마커의 위치
		});*/

		var stationmarker = this.addstationMarker(position, map);
		// var dronemarker = this.adddroneMarker(position, map);
		var tagmarker = this.addtagMarker(position, map);
		var tag:tagOptionsElem;
		tag = {label:'', id:0};
		tag.label = position.title;
		tag.id = position.id;
		
		// 마커에 표시할 custom overlay를 생성합니다
		if (stationmarker != null) {
			var ScustomOverlay = new window.kakao.maps.CustomOverlay({
				position: stationmarker.getPosition(),
			});

			var Scontent = document.createElement('div');

			var Stitle = document.createElement('div');
			Stitle.innerHTML = 'station for start point';
			Stitle.className = 'title';
			Stitle.setAttribute('style', 'background: #82CAFA;');

			var ScloseBtn = document.createElement('button');

			ScloseBtn.onclick = function () {
				ScustomOverlay.setMap(null);
			};
			ScloseBtn.className = 'close';
			ScloseBtn.type = 'button';

			Stitle.appendChild(ScloseBtn);

			var Sbody = document.createElement('div');
			var SbodytextAv = document.createElement('div');
			var SbodytextBa = document.createElement('div');
			SbodytextAv.appendChild(document.createTextNode('Available: O'));
			Sbody.insertAdjacentElement('beforeend', SbodytextAv);
			Sbody.insertAdjacentElement('beforeend', SbodytextBa);

			var SbodyElem = document.createElement('button');
			SbodyElem.className = 'btn'
			SbodyElem.setAttribute('style', 'background: #82CAFA; color : white; margin: 10px 0 0 0; font-size: 18px; padding: 0 5px');
			SbodyElem.appendChild(document.createTextNode('set this station to start point'));
			
			SbodyElem.onclick = () => this.setsource(tag);

			Sbody.insertAdjacentElement('beforeend', SbodyElem);

			Sbody.className = 'body';
			Sbody.setAttribute('style', 'margin: 7px 0 0 0; font-size: 18px');

			var Sinfo = document.createElement('div');
			Sinfo.className = 'info';
			Sinfo.insertAdjacentElement('afterbegin', Stitle);

			var Swrap = document.createElement('div');
			Swrap.className = 'wrap';
			Swrap.insertAdjacentElement('afterbegin', Sinfo);

			ScloseBtn.insertAdjacentElement('afterend', Sbody);
			Scontent.insertAdjacentElement('afterbegin', Swrap);
			ScustomOverlay.setContent(Scontent);

			window.kakao.maps.event.addListener(stationmarker, 'click', function () {
				ScustomOverlay.setMap(map);
			});
		}
		
		if (tagmarker != null) {
			var TcustomOverlay = new window.kakao.maps.CustomOverlay({
				position: tagmarker.getPosition(),
			});

			var Tcontent = document.createElement('div');

			var Ttitle = document.createElement('div');
			Ttitle.innerHTML = 'tag for end point';
			Ttitle.className = 'title';
			Ttitle.setAttribute('style', 'background: #82CAFA;');

			var TcloseBtn = document.createElement('button');

			TcloseBtn.onclick = function () {
				TcustomOverlay.setMap(null);
			};
			TcloseBtn.className = 'close';
			TcloseBtn.type = 'button';

			Ttitle.appendChild(TcloseBtn);

			var Tbody = document.createElement('div');
			var TbodytextAv = document.createElement('div');
			TbodytextAv.appendChild(document.createTextNode('Available: O'));
			Tbody.insertAdjacentElement('beforeend', TbodytextAv);

			var TbodyElem = document.createElement('button');
			TbodyElem.className = 'btn'
			TbodyElem.setAttribute('style', 'background: #82CAFA; color : white; margin: 10px 0 0 0; font-size: 18px; padding: 0 22px');
			TbodyElem.appendChild(document.createTextNode('set this tag to end point'));

			TbodyElem.onclick = () => this.setdest(tag);

			Tbody.insertAdjacentElement('beforeend', TbodyElem);

			Tbody.className = 'body';
			Tbody.setAttribute('style', 'margin: 7px 0 0 0; font-size: 18px');

			var Tinfo = document.createElement('div');
			Tinfo.className = 'info';

			Tinfo.insertAdjacentElement('afterbegin', Ttitle);

			var Twrap = document.createElement('div');
			Twrap.className = 'wrap';
	
			Twrap.insertAdjacentElement('afterbegin', Tinfo);
			TcloseBtn.insertAdjacentElement('afterend', Tbody);
			Tcontent.insertAdjacentElement('afterbegin', Twrap);
	
			TcustomOverlay.setContent(Tcontent);

			window.kakao.maps.event.addListener(tagmarker, 'click', function () {
				TcustomOverlay.setMap(map);
			});
		}

		/*
		if (dronemarker != null) {
			var DcustomOverlay = new window.kakao.maps.CustomOverlay({
				position: dronemarker.getPosition(),
			});

			window.kakao.maps.event.addListener(dronemarker, 'click', function () {
				DcustomOverlay.setMap(map);
			});
		}
		*/
	}

	// 마커 이미지 및 크기 지정 
	// 노드 종류에 따라 지도 위 마커이미지 다르게 표시
	addstationMarker(position: any, map: any) {
		if ( position.kind === 'station'){
			var imageSrc = 'https://user-images.githubusercontent.com/68888653/126869445-228df4e6-6496-4597-b12e-7a0dd11a12d8.png'

			var imageSize = new window.kakao.maps.Size(30 , 40),
			markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize),
			//markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
				marker = new window.kakao.maps.Marker({
				map: map,
				position: position.latlng, // 마커의 위치
				image: markerImage 
			});
			return marker;
		}
		return null;
	}

	addtagMarker(position: any, map: any) {
		if ( position.kind === 'tag') {
			var imageSrc = 'https://user-images.githubusercontent.com/68888653/131796807-2d320e22-d43f-4cdb-9925-a367f14aeca2.png'
	

			var imageSize = new window.kakao.maps.Size(30 , 40),
			markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize),
			//markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
				marker = new window.kakao.maps.Marker({
				map: map,
				position: position.latlng, // 마커의 위치
				image: markerImage 
			});
	
			return marker;
		}
		return null;
	}

	adddroneMarker(position: any, map: any) {
		if ( position.kind  === 'drone') {
			var imageSrc = 'https://user-images.githubusercontent.com/68888653/126869406-4d22668f-04df-44e2-a952-6c4f7f9bc15d.png'
			
			var imageSize = new window.kakao.maps.Size(30 , 40),
			markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize),
			//markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
				marker = new window.kakao.maps.Marker({
				map: map,
				position: position.latlng, // 마커의 위치
				image: markerImage 
			});
		return marker;
		}
	}

	render() {
		var positions = this.state.nodeList.map((node: nodeListElem) => {
			return {
				title: node.name.split('-')[1],
				kind: node.name.split('-')[0],
				id: node.id,
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

		return (
			<div>
				<div>
					<div id="node_map" style={{ width: '100%', height: '500px' }}></div>
				</div>
			</div>
		);
	}
}

export default NodeMap;