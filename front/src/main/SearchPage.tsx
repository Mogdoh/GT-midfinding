import React, { useEffect, useState } from 'react';
import { findCenter } from '../api/MapApi';
import PostCode from '../components/PostCode';


declare global {
interface Window {
    kakao: any;
    daum: any;
}
}

interface Address {
우편번호: string;
기본주소: string;
상세주소: string;
lat: number;
lng: number;
}

interface Place {
name: string;
address: string;
lat: string;
lng: string;
}

const Backdrop = ({ children, onClick }: any) => {
return (
    <div
    style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.3)',
        zIndex: 1000
    }}
    onClick={onClick}
    >
    <div
        style={{
        position: 'relative',
        width: '400px',
        margin: '100px auto',
        padding: '20px',
        background: 'white',
        zIndex: 1001
        }}
        onClick={e => e.stopPropagation()}
    >
        {children}
    </div>
    </div>
);
};

// 마커
let map: any;
let marker: any;
let midMarker: any;

const SearchPage = () => {
const [selectedPlaces, setSelectedPlaces] = useState<Place[]>([]); // 선택된 장소 목록
const [editIndex, setEditIndex] = useState<number | null>(null); // 편집 중인 장소의 인덱스
const [showPostCode, setShowPostCode] = useState<boolean>(false); // 다음 API 표시 여부
const [midCoords, setMidCoords] = useState<{ lat: number; lng: number } | null>(null); // 중간지점 결과값
const [midAddress, setMidAddress] = useState<string>(''); // 중간지점 주소 값
const [address, setAddress] = useState<Address>({
    우편번호: '',
    기본주소: '',
    상세주소: '',
    lat: 0,
    lng: 0,
});

// 장소 목록에 추가
const addSelectedPlace = (place: Place) => {
    setSelectedPlaces([...selectedPlaces, place]);
};

// 편집 클릭 핸들러
const handleEditClick = (index: number) => {
    setEditIndex(index);
    setShowPostCode(true); // 다음 우편번호 검색 창
};

// 삭제 클릭 핸들러
const handleDeleteClick = (index: number) => {
    const updatedPlaces = selectedPlaces.filter((_, i) => i !== index); // 삭제할 데이터에 대한 변수명이 필요하면 "_" 바꾸기
    setSelectedPlaces(updatedPlaces);
};

// 좌표를 주소로 변환하는 함수
const coordsToAddress = (coords: { lat: number; lng: number }, callback: (address: string) => void) => {
    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.coord2Address(coords.lng, coords.lat, (result: any, status: any) => {
    if (status === window.kakao.maps.services.Status.OK) {
        const roadAddress = result[0].road_address?.address_name || '';
        const bunjiAddress = result[0].address?.address_name || '';
        callback(`${roadAddress} (${bunjiAddress})`);
    } else {
        callback('주소 정보를 찾을 수 없습니다.');
    }
    });
};

useEffect(() => {
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=f0f31cc5416f1f0f93f26f887c5557a0&libraries=services&autoload=false`; // env 설정
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
        window.kakao.maps.load(() => {
                const container = document.getElementById('map');
                const options = {
                    center: new window.kakao.maps.LatLng(37.566826, 126.9786567), // 초기 중심 좌표
                    level: 3 // 지도 확대 정도
            };
            map = new window.kakao.maps.Map(container, options);
            console.log('카카오 API 지도 로드 완료');
            });
        };
    script.onerror = () => {
        console.log('카카오 API 지도 로드 실패');
    };
    return () => {
        document.head.removeChild(script); // 제거
    };
    }, []);

// address 변경될 때 실행
useEffect(() => {
    if (address.lat && address.lng && map) {
        const coords = new window.kakao.maps.LatLng(address.lat, address.lng);
        // const geocoder = new window.kakao.maps.services.Geocoder(); // 주소 좌표 변환 객체
        map.setCenter(coords);

        if (marker) {
            marker.setPosition(coords); // 좌표로 마커 위치 설정
        } else {
        marker = new window.kakao.maps.Marker({
            map: map,
            position: coords,
        });
    }

    const infowindow = new window.kakao.maps.InfoWindow({
        content: `<div style="width:150px;text-align:center;padding:6px 0;">${address.기본주소}</div>`,
        });
    infowindow.open(map, marker);

    coordsToAddress({ lat: address.lat, lng: address.lng }, setMidAddress);
    }
    }, [address]);

// 중앙 지점 찾기 함수
const handleFindCenter = () => {
    if (selectedPlaces.length < 3) {
    alert('중간 지점을 찾으려면 최소 세 개의 장소가 필요합니다.');
    return;
    }
    const coordinates = selectedPlaces.map(place => ({
        lat: parseFloat(place.lat),
        lng: parseFloat(place.lng),
    }));

    // 백엔드 통신
    findCenter(coordinates)
    .then((result) => {
        const midCoords = { lat: parseFloat(result.latitude), lng: parseFloat(result.longitude) };
        setMidCoords(midCoords);
        coordsToAddress(midCoords, setMidAddress);

        const coords = new window.kakao.maps.LatLng(midCoords.lat, midCoords.lng);
        if (midMarker) {
            midMarker.setPosition(coords);
        } else {
            midMarker = new window.kakao.maps.Marker({
                map: map,
                position: coords,
        });
        }
    })
    .catch((error) => {
        console.error('중앙 지점 찾기 오류:', error);
    });
};

return (
    <div>
        <div>
            <h3>출발지 검색</h3>
            <button onClick={() => setShowPostCode(true)}>주소 검색</button>
        </div>
        {showPostCode && (
            <Backdrop onClick={() => setShowPostCode(false)}>
            <PostCode
                key="postcode"
                setAddress={setAddress}
                setPostCodeModal={setShowPostCode}
                addSelectedPlace={addSelectedPlace}
            />
            </Backdrop>
        )}
        <div>
            <h3>선택된 장소:</h3>
            <ul>
            {selectedPlaces.map((place, index) => (
                <li key={index}>
                {editIndex === index ? (
                    <div>
                        <button onClick={() => setShowPostCode(true)}>주소 검색</button>
                    </div>
                ) : (
                    <div>
                        <h5>{place.name}</h5>
                        <span>{place.address}</span>
                        <span>{place.lat}, {place.lng}</span>
                        <button onClick={() => handleEditClick(index)}>편집</button>
                        <button onClick={() => handleDeleteClick(index)}>삭제</button>
                    </div>
                )}
                </li>
            ))}
            </ul>
            <button onClick={handleFindCenter}>중앙 지점 찾기</button>
                {midCoords && (
                <div>
                    <h3>중간지점: {midCoords.lat},{midCoords.lng}</h3>
                    <h4>주소: {midAddress}</h4>
                </div>
            )}
        </div>
        <div id="map" style={{ width: '100%', height: '500px' }}></div>
    </div>
);
};

export default SearchPage;
