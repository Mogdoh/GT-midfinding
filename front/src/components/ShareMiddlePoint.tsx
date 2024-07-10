import { useState, useEffect } from 'react';

interface ShareMiddlePoint {
  middlePoint: {
    address: string;
  };
}

declare global {
  interface window {
    Kakao: any;
  }
}

const ShareMiddlePoint: React.FC<ShareMiddlePoint> = ({ middlePoint }) => {
  const shareUrl = 'http://localhost:5173';
  const shareTitle = `중간 지점: ${middlePoint?.address}`;
  const [isKakaoSDKLoaded, setIsKakaoSDKLoaded] = useState(false);

  // API 접속
  useEffect(() => {
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(`${import.meta.env.VITE_APP_KAKAO_API_KEY}`);
      setIsKakaoSDKLoaded(window.Kakao.isInitialized());
      console.log('Kakao SDK 초기화 상태:', window.Kakao.isInitialized());
    } else {
      setIsKakaoSDKLoaded(true);
      console.log('Kakao SDK가 이미 초기화되어 있습니다.');
    }
  }, []);

  // 페이스북 URL 공유 설정
  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '페이스북 공유하기', 'width=600,height=800,location=no,status=no,scrollbars=yes');
  };

  // 네이버 URL 공유 설정
  const shareNaver = () => {
    window.open(`https://share.naver.com/web/shareView?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`);
  };

  const shareKakao = () => {
    if (window.Kakao) {
      window.Kakao.Share.sendDefault({
        objectType: 'location',
        address: `${middlePoint?.address}`,
        addressTitle: 'test',
        content: {
          title: '중간지점',
          description: `${middlePoint?.address}`,
          imageUrl: 'http://k.kakaocdn.net/dn/bSbH9w/btqgegaEDfW/vD9KKV0hEintg6bZT4v4WK/kakaolink40_original.png',
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
        buttons: [
          {
            title: '웹으로 보기',
            link: {
              mobileWebUrl: shareUrl,
              webUrl: shareUrl,
            },
          },
        ],
      });
    }
  };

  return (
    <div className="share-middle-point">
      <div className="share-buttons">
        <button onClick={shareFacebook}>페이스북</button>
        <button onClick={shareNaver}>네이버</button>
        <button onClick={shareKakao}>카카오톡</button>
      </div>
    </div>
  );
};

export default ShareMiddlePoint;
