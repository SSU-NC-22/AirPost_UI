import React, { Component } from 'react';
import './ManagementComponents/NodeMap.css';
import { NODE_URL } from './defineUrl';

// ���� : https://apis.map.kakao.com/web/sample/multipleMarkerEvent/

import {
	nodeListElem,
	value_list_elem,
	sensorListElem,
	nodeHealthCheckElem,
} from './ElemInterface/ElementsInterface';
declare global {
	interface Window {
		kakao: any;
	}
}

interface NodeMapProps {
	healthState: Map<number, number>;
	batteryState: Map<number, number>;
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
		left: 126.93120847993194,
		right: 126.9814068917757,
		up: 37.504736714448086,
		down: 37.48669801512536,
	};
	componentDidMount = () => {
		var mapContainer = document.getElementById('node_map'); // ������ ǥ���� div
		var mapOption = {
			center: new window.kakao.maps.LatLng(
				37.49575158172499,
				126.95633291769067
			), // ������ �߽���ǥ
			level: 3, // ������ Ȯ�� ����
		};

		// ������ �����մϴ�
		var map = new window.kakao.maps.Map(mapContainer, mapOption);
		mapContainer!.style.height = '800px';
		mapContainer!.style.width = ' 1200px';
		map.relayout();
		this.setState({ map: map });

		this.getnodeList(
			this.state.left,
			this.state.right,
			this.state.up,
			this.state.down,
		);

		// �巡�װ� ���� �� or Ȯ�� ������ ����Ǹ�
		window.kakao.maps.event.addListener(map, 'idle', () => {
			// ������ ���� ������ ���ɴϴ�
			var bounds = map.getBounds();

			// ������ ������ ��ǥ�� ���ɴϴ�
			var swLatLng = bounds.getSouthWest();

			// ������ �ϵ��� ��ǥ�� ���ɴϴ�
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

	// Make Marker
	displayMarker(position: any, map: any) {
		// ��Ŀ�� �����մϴ�
		/*var marker = new window.kakao.maps.Marker({
			map: map, // ��Ŀ�� ǥ���� ����
			position: position.latlng, // ��Ŀ�� ��ġ
		});*/

		var marker = this.addMarker(position, map)

		// ��Ŀ�� ǥ���� custom overlay�� �����մϴ�
		var customOverlay = new window.kakao.maps.CustomOverlay({
			position: marker.getPosition(),
		});

		var content = document.createElement('div');

		var title = document.createElement('div');
		title.innerHTML = position.title;
		title.className = 'title';

		var closeBtn = document.createElement('button');

		closeBtn.onclick = function () {
			customOverlay.setMap(null);
		};
		closeBtn.className = 'close';
		closeBtn.type = 'button';
		title.appendChild(closeBtn);

		var body = document.createElement('div');

		for (var i = 0; i < 3; i++) {
			var bodyElem = document.createElement('div');
			bodyElem.appendChild(document.createTextNode(position.content[i]));
			body.insertAdjacentElement('beforeend', bodyElem);
		}

		body.className = 'body';

		var info = document.createElement('div');
		info.className = 'info';

		info.insertAdjacentElement('afterbegin', title);

		var wrap = document.createElement('div');
		wrap.className = 'wrap';
		wrap.insertAdjacentElement('afterbegin', info);
		title.insertAdjacentElement('afterend', body);
		content.insertAdjacentElement('afterbegin', wrap);

		customOverlay.setContent(content);

		window.kakao.maps.event.addListener(marker, 'click', function () {
			customOverlay.setMap(map);
		});
	}

	// ��Ŀ �̹��� �� ũ�� ���� 
	// ��� ������ ���� ���� �� ��Ŀ�̹��� �ٸ��� ǥ��
	addMarker(position: any, map: any) {
		if ( position.kind  === 'drone') var imageSrc = 'https://user-images.githubusercontent.com/68888653/126869406-4d22668f-04df-44e2-a952-6c4f7f9bc15d.png'
		else if ( position.kind === 'station') var imageSrc = 'https://user-images.githubusercontent.com/68888653/126869445-228df4e6-6496-4597-b12e-7a0dd11a12d8.png'
		else var imageSrc = 'https://user-images.githubusercontent.com/68888653/126869406-4d22668f-04df-44e2-a952-6c4f7f9bc15d.png'
		
		var imageSize = new window.kakao.maps.Size(30 , 35),
			markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize),
			//markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
				marker = new window.kakao.maps.Marker({
				map: map,
				position: position.latlng, // ��Ŀ�� ��ġ
				image: markerImage 
			});

		// marker.setMap(map); // ���� ���� ��Ŀ�� ǥ���մϴ�
	
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
						node.sensors.map((sensor: value_list_elem) => sensor.value_name+', '),
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