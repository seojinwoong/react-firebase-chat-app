## 2023-01-16 ("리덕스 기본구조" 까지 들음)

- react-router-dom 6버전 기준에서는 src/index.js 에서 BrowserRouter를 App 컴포넌트 바깥으로 감싸준다.
- 또한 그 Router 바깥을 감싸는 Provider도 있다 (redux)

```js
import {
  BrowserRouter as Router,
} from "react-router-dom";

<Provider>
  <Router >
      <App />
  </Router>
</Provider>
```

- redux는 총 4개의 라이브러리를 install 해준다.
```js
    npm install redux react-redux redux-promise redux-thunk
```

왜 이렇게 많이 설치하냐면, 기본 redux는 객체(object)밖에 처리하지 못한다. 그래서 
promise나 함수를 처리하기 위해서 추가적으로 redux 라이브러리를 설치해준다.

## 2023-01-17 ("React Bootstrap" 까지 들음)

- 실시간으로 결과물을 나타내주는 경우에는 node.js에서는 socket io를 주로 사용한다.
  하지만 이번 강좌는 Firebase를 다루는데 이 안에 web socket이 포함되어 있다.

### REST 통신 VS Web Socket
- Rest 통신은 한방향 통신이다.
  반면에 web socket은 양방향 통신이다.
  REST 통신은 결과물을 요청하기 위해서는 새로고침을 해야한다.

### Firebase
- 기본적으로 웹, 앱 개발을 할때에 공통적으로 필요한 기능구성들이 있다(인증, 데이터베이스, 스토리지, 푸시 알림, 배포 등등)
  이러한 공통적인 부분들을 이 Firebase가 손쉽게 해결해준다. Firebase는 이러한 부분들을 자동으로 만들어주는 플랫폼이다.

- Firbase에서 사용하는 데이터베이스는 NoSQL 기반은 Document 형식의 빠르고 간편한 데이터베이스이다. RTSP(Real Time Stream Protocol) 방식을 지원한다. 즉 새로고침을 하지 않아도 자동적으로 데이터 변화를 확인할 수 있다.

### Firebase 이제 사용해보기
1. firebase 공홈에 들어가 신규 프로젝트 하나를 생성해준다.
2. 생성해준 firebase 프로젝트를 우리의 리액트 프로젝트와 연결해준다.
2-1. 스크립트를 넣는 방식도 있지만, npm으로 설치해준다.
```js
  npm install firebase --save
```
3. 설치 후 firebase의 configuration을 우리의 코드에 넣어주기 어디다가? 
```js
  /src/firebase.js 에다가!
```

### react-bootstrap
이번 강의에서는 react-bootstrap으로 스타일링을 해준다.
- 방법
```js
  1) npm install bootstrap react-bootstrap --save
  2) src/index.js 에다가 .css 파일을 import 해준다.
  3) react-icons를 다운 해준다. => npm install react-icons
```