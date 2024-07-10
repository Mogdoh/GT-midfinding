import '../style/Main.css';
import friend from '../assets/friend.png';
import my from '../assets/my.png';
import { useNavigate } from 'react-router-dom';

const Main = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/searchpage');
  };
  return (
    <div>
      <div className="mid-title">미드 모여!</div>
      <div className="main-title">
        <div className="location-mid">
          <img src={friend} />
          <div className="location-title">친구와 정하기</div>
          <div className="location-detail">
            친구들이 직접 거리를 입력하여
            <br />
            취합한 내용을 토대로 약속장소의
            <br />
            중간지점을 추천해줍니다.
          </div>
        </div>
        <div className="location-mid" onClick={handleClick}>
          <img src={my} />
          <div className="location-title">내가 정하기</div>
          <div className="location-detail">
            {' '}
            내가 친구들의 주소 및 역을
            <br />
            작성하여 약속장소 중간지점을
            <br />
            추천해줍니다.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
