# 🎯 중간지점 찾기 (Midpoint Finder)

여러 출발지의 정확한 중간지점을 찾아주는 웹 서비스입니다. Kakao Maps API를 활용하여 정확한 위치 데이터를 기반으로 최적의 중간지점을 계산합니다.

## 주요 기능

- Kakao 주소 검색 API를 통한 정확한 주소 및 좌표 검색
- 다중 출발지 등록 및 관리 (최소 3개 이상 필요)
- 등록된 출발지들의 정중앙 지점 자동 계산
- 중간지점의 도로명 주소 및 지번 주소 표시
- 실시간 지도 마커 표시 및 업데이트
- 계산된 중간지점 공유 기능

## 기술 스택

### Frontend
- React (with TypeScript)
- Vite
- Kakao Maps SDK
- CSS Modules

### Backend
- REST API 연동
- 좌표 기반 중심점 계산 알고리즘

## 설치 방법

```bash
# 저장소 클론
git clone https://github.com/your-username/midpoint-finder.git

# 디펜던시 설치
npm install

# 개발 서버 실행
npm run dev
```

## 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 변수를 설정하세요:

```
VITE_APP_KAKAO_API_KEY=your_kakao_maps_api_key
```

## 주요 컴포넌트

### SearchPage
- 메인 페이지 컴포넌트
- 출발지 관리 및 중간지점 계산 로직 포함
- Kakao Maps 초기화 및 설정

### PostCode
- Daum 우편번호 검색 모듈 통합
- 주소 검색 및 좌표 변환 기능

### ShareMiddlePoint
- 계산된 중간지점 공유 기능 제공

## 사용 방법

1. "+" 버튼을 클릭하여 새로운 출발지 추가
2. 우편번호 검색을 통해 정확한 주소 입력
3. 최소 3개의 출발지 등록
4. "중간지점 찾기" 버튼 클릭
5. 계산된 중간지점을 지도에서 확인
6. 필요시 공유 기능을 통해 다른 사용자와 공유
