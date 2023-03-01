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
  반면에 web socket은 그러할 필요가 없다.

### Firebase
- 기본적으로 웹, 앱 개발을 할때에 공통적으로 필요한 기능구성들이 있다(인증, 데이터베이스, 스토리지, 푸시 알림, 배포 등등)
  이러한 공통적인 부분들을 이 Firebase가 손쉽게 해결해준다. Firebase는 이러한 부분들을 자동으로 만들어주는 플랫폼이다.

- Firbase에서 사용하는 데이터베이스는 NoSQL 기반으로 Document 형식의 빠르고 간편한 데이터베이스이다. RTSP(Real Time Stream Protocol) 방식을 지원한다. 즉 새로고침을 하지 않아도 자동적으로 데이터 변화를 확인할 수 있다. 이 기능 덕분에 채팅이나, 택시앱같은 실시간 기능을 요하는 프로젝트를 쉽게 구현할 수 있다.

### Firebase 이제 사용해보기
1. firebase 공홈에 들어가 신규 프로젝트 하나를 생성해준다.
2. 생성해준 firebase 프로젝트를 우리의 리액트 프로젝트와 연결해준다.
3. 스크립트를 넣는 방식도 있지만, npm으로 설치해준다.
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

## 2023-01-26 ("리덕스 기본구조" 까지 들음)

### react-hook-form
react-hook-form은 form의 유효성 검사를 좀 더 손쉽게 진행할 수 있는 라이브러리이다.
```js
  npm install react-hook-form --save
```
사용법

![study_1](/study/study_1.png)

## 2023-01-28 ("firebase에서 이메일로 유저 생성시 생기는 문제점" 까지 들음)

react-hook-form을 사용할 시에는
handleSubmit이라는 메서드를 제공해준다. 이것을 이용하자.
```js
  const { register, watch, formState: {errors}, handleSubmit } = useForm();
  <form onSubmit={handleSubmit(onSubmit)}>
```

submit을 하면 email, password로 계정을 생성하기
순서 1) getAuth()로 auth를 생성해준다.
순서 2) createUserWithEmailAndPassword 메서드를 사용해 인증된 계정을 생성해준다.

## 2023-02-14 ("로그인 페이지 만들기" 까지 들음)
- firebase의 기능을 통해 회원가입을 하려고 할 때 기본세팅을 하지 않았으므로 오류가 발생한다.
- 해결 방법

![study_1](/study/study_2.png)
프로젝트 상세에서 Authentication으로 들어간다

![study_1](/study/study_3.png)
![study_1](/study/study_4.png)
Users 탭에 회원들의 정보를 알 수 있다.

## 2023-02-22 ("프로필 이미지 수정(3) 리덕스 스토어 데이터 변경 및 데이터베이스에 데이터 저장" 까지 들음)
- redux의 데이터 flow (엄격한 단방향 데이터 flow)
![study_1](/study/study_5.png)

- 프로필 이미지 수정흐름
1) 프론트단에서 이미지 저장  event를 실행해주면
2) firebase storage에 해당 파일과 contentType을 저장한다. (첫번째 인자: 해당파일의 정보, 두번째 인자: 해당파일의 contentType)
3) firebase storage에 저장했다면 그 다음에는 auth의 유저정보랑 database의 user 유저정보를 변경해준다.

- 어떠한 경우에 async await을 써야하는가 아리까리할때,,,
1) 일단 method를 실행하고 결과를 변수에 저장하는데, await을 쓰지 않고 저장해본다
2) 변수에 담은 결과물을 console.log로 찍어보는데 
3) 그런데 이런식으로 Promise로 나온다면 await을 써주자.
![study_1](/study/study_6.png)


## 2023-02-23 ("ChatRoom 생성하기" 까지 들음)
- 함수형 컴포넌트를 클래스형 컴포넌트로 바꾸는 연습을 하자.
ChatRooms.js 를 보면서 연습하기

- 클래스형 컴포넌트에서 useSelector 기능 사용하기

클래스형 컴포넌트에서는 react hook을 사용할 수 없다
그렇다면 redux의 데이터는 어떻게 받아올 것인가? ==>
connect라는 기능이 있다
```js
import { connect } from 'react-redux';

...

const mapStateToProps = state => {
  return {
    user: state.user.currentUser
  }
}

export default connect(mapStateToProps)(ChatRooms)
```

이런식으로 하단 export 부분에 사용해주면 useSelector처럼 사용할 수 있다.

## 2023-02-27 ('메세지 저장하기' 까지 들음)
- firebase에서 데이터 실시간으로 받기

firebase에서는 데이터베이스에 data가 저장되는 순간을 실시간으로 event listener로 받을 수 있다.

![study_1](/study/study_7.png)


- firebase에 데이터 저장하기

![study_1](/study/study_8.png)

chatRoom이라는 이름의 table을 찾아 key라는 id값을 가지는 행(row)를 찾아, newChatRoom의 정보를 넣어준다

![study_1](/study/study_9.png)

onChildAdded <- 값을 누군가가 넣거나, 내가 넣거나 여하튼 값이 추가되는 상황을 포착한다

## 2023-03-01
- 정확한 이유는 모르겠지만,,, firebase에서 message의 내용들을 제대로 출력하기 위해서는 MainPanel 컴포넌트에 key값을 넣어준다.

![study_1](/study/study_10.png)

- 시간과 관련한 기능들을 사용할 수 있는 라이브러리 => moment.js
```js
npm install moment
```

- hasOwnProperty
해당 Object가 key를 가지고 있는지, 있다면 true 반환 없다면 false 반환

![study_1](/study/study_11.png)

- percentage 구하는 방법 (수학적)
![study_1](/study/study_12.png)

- await의 의미
![study_1](/study/study_13.png)

await 뒤의 작업이 완료될때까지 기다린다.

![study_1](/study/study_14.png)
- uploadTask의는 4개의 파라미터를 받는다.

1번째 parameter => 이벤트 리스너의 종류
2번째 parameter => 이벤트가 진행중일 때 처리 함수
3번째 parameter => 오류가 발생했을 때 처리 함수
4번째 parameter => 이벤트가 완료되고 나서의 함수
