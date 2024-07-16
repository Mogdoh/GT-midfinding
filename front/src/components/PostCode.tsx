import React from "react";
import DaumPostcode from "react-daum-postcode";

declare global {
  interface Window {
    kakao: any;
    daum: any;
  }
}

interface PostCodeProps {
  setAddress: (address: { 우편번호: string; 기본주소: string; 상세주소: string; lat: number; lng: number }) => void;
  setPostCodeModal: (isVisible: boolean) => void;
  addSelectedPlace: (place: { name: string; address: string; lat: string; lng: string }) => void;
}

const PostCode: React.FC<PostCodeProps> = ({ setAddress, setPostCodeModal, addSelectedPlace }) => {
  const handleComplete = async (data: any) => {
    const mainAddress = data.roadAddress || data.jibunAddress;

    try {
      const coords: any = await getAddressCoords(mainAddress);
      const lat = coords.getLat();
      const lng = coords.getLng();

      setAddress({
        우편번호: data.zonecode,
        기본주소: mainAddress,
        상세주소: "",
        lat,
        lng,
      });

      addSelectedPlace({
        name: mainAddress,
        address: mainAddress,
        lat: lat.toString(),
        lng: lng.toString(),
      });

      setPostCodeModal(false);
    } catch (error) {
      console.error("좌표 변환 오류:", error);
    }
  };

  const getAddressCoords = (address: string) => {
    return new Promise((resolve, reject) => {
      const geoCoder = new window.kakao.maps.services.Geocoder();
      geoCoder.addressSearch(address, (result: any, status: any) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
          resolve(coords);
        } else {
          reject(status);
        }
      });
    });
  };

  return <DaumPostcode onComplete={handleComplete} />;
};

export default PostCode;
