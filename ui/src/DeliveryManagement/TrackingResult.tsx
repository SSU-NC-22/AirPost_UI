import React, { Component } from 'react';
import '../ManagementComponents/NodeMap.css';
import {DELIVERY_URL, NODE_URL} from '../defineUrl';
import {nodeListElem, value_list_elem, nodeHealthCheckElem,} from '../ElemInterface/ElementsInterface'
import {LocationConsumer} from '../App'

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
	droneNid:number;
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
		left: 126.8146287054153,
		right: 126.94874516871015,
		up: 37.544991853368245,
		down: 37.491798077077085,
	};
	componentDidMount = () => {
		var mapContainer = document.getElementById('node_map'); // ������ ǥ���� div
		var mapOption = {
			center: new window.kakao.maps.LatLng(
				37.518442478524676,
				126.87796326530058
			), // ������ �߽���ǥ
			level: 1, // ������ Ȯ�� ����
		};

		// ������ �����մϴ�
		var map = new window.kakao.maps.Map(mapContainer, mapOption);
		mapContainer!.style.height = '800px';
		mapContainer!.style.width = ' 1100px';
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

	contextMarker(lat: number, lng: number, map: any) {
		var position = {
			kind: 'drone',
			latlng: new window.kakao.maps.LatLng(lat, lng),
		};

		this.addMarker(position, map)
	}

	addMarker(position: any, map: any) {
		if ( position.kind  === 'drone'){
			var imageSrc = 'https://user-images.githubusercontent.com/68888653/126869406-4d22668f-04df-44e2-a952-6c4f7f9bc15d.png';
			var iwContent = '<div style="padding:0px;">Your Package is <br>here!</div>';
		} 
		else if ( position.kind === 'station') {
			var imageSrc = 'https://user-images.githubusercontent.com/68888653/126869445-228df4e6-6496-4597-b12e-7a0dd11a12d8.png'
			var iwContent = '<div style="padding:5px;">Station where <br>package was sent</div>';
		}
		else {
			var imageSrc = 'https://user-images.githubusercontent.com/68888653/131796807-2d320e22-d43f-4cdb-9925-a367f14aeca2.png'
			var iwContent = '<div style="padding:5px;">Tag where <br>to receive package</div>';
		}
		
		var imageSize = new window.kakao.maps.Size(30 , 35),
			markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize),
			//markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
				marker = new window.kakao.maps.Marker({
				map: map,
				position: position.latlng, // ��Ŀ�� ��ġ
				image: markerImage 
			});

		// marker.setMap(map); // ���� ���� ��Ŀ�� ǥ���մϴ�
	
		var infowindow = new window.kakao.maps.InfoWindow({
			position : position, 
			content : iwContent 
		});
		  
		// ��Ŀ ���� ���������츦 ǥ���մϴ�. �ι�° �Ķ������ marker�� �־����� ������ ���� ���� ǥ�õ˴ϴ�
		infowindow.open(map, marker); 

		return marker;
	}

    render() {
		
		var positions = this.state.nodeList.map((node: nodeListElem) => {
			return {
				kind: node.name.split('-')[0],
				latlng: new window.kakao.maps.LatLng(node.lat, node.lng),
			};
		});

		for (var i = 0; i < positions.length; i++) {
			if ((positions[i].latlng).getLat() === this.props.srcLat && (positions[i].latlng).getLng() === this.props.srcLng)
			{
				this.addMarker(positions[i], this.state.map);
			}

			if ((positions[i].latlng).getLat() === this.props.destLat && (positions[i].latlng).getLng() === this.props.destLng)
			{
				this.addMarker(positions[i], this.state.map);
			}
		}
		
        return(
            <div>
				<LocationConsumer>
				{({state}:any) => (
          			[state.location.get(this.props.droneNid)].filter(
						  (element, i) => element !=null
					  ).map
					  (arr => (
						this.contextMarker(arr[0], arr[1], this.state.map)
					  ))
      			)}
    			</LocationConsumer>
				<div>
					<div id="node_map" style={{ width: '100%', height: '500px'}}></div>
				</div>
			</div>
        );
    }
}

export default TrackingResult;