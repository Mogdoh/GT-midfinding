import React, { useEffect, useState } from "react";
import { findCenter } from "../api/MapApi";
import PostCode from "../components/PostCode";
import "../style/SearchPage.css";
import ShareMiddlePoint from "../components/ShareMiddlePoint";
import ShareIcon from "../images/free-icon-share-1828960.png";

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
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.3)",
        zIndex: 1000,
      }}
      onClick={onClick}
    >
      <div
        style={{
          position: "relative",
          width: "400px",
          margin: "100px auto",
          padding: "20px",
          background: "white",
          zIndex: 1001,
        }}
        onClick={(e) => e.stopPropagation()}
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
  const [midCoords, setMidCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null); // 중간지점 결과값
  const [midAddress, setMidAddress] = useState<string>(""); // 중간지점 주소 값
  const [address, setAddress] = useState<Address>({
    우편번호: "",
    기본주소: "",
    상세주소: "",
    lat: 0,
    lng: 0,
  });

  // 장소 목록에 추가
  const addSelectedPlace = (place: Place) => {
    const updatedPlaces = [...selectedPlaces];
    if (selectedPlaces.length === 0) {
      updatedPlaces.push(place);
    } else {
      updatedPlaces[selectedPlaces.length - 1] = place;
    }
    setSelectedPlaces(updatedPlaces);
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
        const roadAddress = result[0].road_address?.address_name || "";
        const bunjiAddress = result[0].address?.address_name || "";
        callback(`${roadAddress} (${bunjiAddress})`);
      } else {
        callback("주소 정보를 찾을 수 없습니다.");
      }
    });
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${
      import.meta.env.VITE_APP_KAKAO_API_KEY
    }&libraries=services&autoload=false`; // env 설정
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById("map");
        const options = {
          center: new window.kakao.maps.LatLng(37.566826, 126.9786567), // 초기 중심 좌표
          level: 3, // 지도 확대 정도
        };
        map = new window.kakao.maps.Map(container, options); // 지도 생성
        const mapTypeControl = new window.kakao.maps.MapTypeControl(); // 일반 지도랑 스카이뷰 지도 타입을 전환할 수 있는 지도타입 컨트롤 생성
        map.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT); // 오른쪽위에 표시 정의
        const zoomControl = new window.kakao.maps.ZoomControl(); // 지도 확대 축소를 제어할 수 있는 줌 컨트롤러
        map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT); // 줌 컨트롤러 생성
      });
    };
    script.onerror = () => {};
    return () => {
      document.head.removeChild(script); // 제거
    };
  }, []);

  // address 변경될 때 실행
  useEffect(() => {
    if (address.lat && address.lng && map) {
      const coords = new window.kakao.maps.LatLng(address.lat, address.lng);
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
      alert("중간 지점을 찾으려면 최소 세 개의 장소가 필요합니다.");
      return;
    }
    const coordinates = selectedPlaces.map((place) => ({
      lat: parseFloat(place.lat),
      lng: parseFloat(place.lng),
    }));

    // 백엔드 통신
    findCenter(coordinates)
      .then((result) => {
        const midCoords = {
          lat: parseFloat(result.latitude),
          lng: parseFloat(result.longitude),
        };
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

        const infowindow = new window.kakao.maps.InfoWindow({
          content: `<div style="width:150px;text-align:center;padding:6px 0;">중간지점</div>`,
        });
        infowindow.open(map, midMarker);
      })
      .catch((error) => {
        console.error("중앙 지점 찾기 오류:", error);
      });
  };

  const addNewEntry = () => {
    setSelectedPlaces([...selectedPlaces, { name: "", address: "", lat: "", lng: "" }]);
    setShowPostCode(true);
  };

  return (
    <div className="container">
      <div className="header">
        <h3>내가 정하기</h3>
      </div>
      {selectedPlaces.length === 0 && (
        <div className="no-places">
          <button onClick={addNewEntry} className="circle-button">
            <p style={{ color: "black", fontSize: "200%" }}>+</p>
          </button>
        </div>
      )}
      <div className="grid">
        {selectedPlaces.map((place, index) => (
          <div key={index} className="place-card">
            <h4>출발지 - {place.address}</h4>
            <button onClick={() => handleEditClick(index)}>편집</button>
            <button onClick={() => handleDeleteClick(index)}>삭제</button>
          </div>
        ))}
        {selectedPlaces.length > 0 && (
          <div className="plus-button-wrapper">
            <button onClick={addNewEntry} className="circle-button">
              <p style={{ color: "black", fontSize: "200%" }}>+</p>
            </button>
          </div>
        )}
      </div>
      <div className="search-button-container">
        <button className="search-button" onClick={handleFindCenter}>
          중간지점 찾기
        </button>
        <ShareMiddlePoint
          middlePoint={{
            address: midAddress,
          }}
        />
      </div>
      {midCoords && (
        <div>
          <h4>중간지점: {midAddress}</h4>
        </div>
      )}
      <div id="map" className="map-container"></div>
      <div className="share-button-container">
        <button className="share-button">
          <img src={ShareIcon} alt="공유하기" />
        </button>
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
    </div>
  );
};

export default SearchPage;
