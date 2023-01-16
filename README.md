## 2023-01-17 ("리덕스 기본구조" 까지 들음)

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

