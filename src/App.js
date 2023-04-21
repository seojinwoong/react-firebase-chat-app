import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import ChatPage from './components/ChatPage/ChatPage';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser } from './redux/actions/user_action';

const App = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.user_reducer.isLoading)

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) { // 로그인 한 경우
        navigate('/');
        dispatch(setUser(user));        
      } else { // 로그인 하지 않은 경우
        navigate('/login');
        dispatch(clearUser());
      }
    });
  }, []);
  
  if (isLoading) {
    return (
      <div>
        ...loading
      </div>
    )
  } else {
    return (
      <Routes>
        <Route path="/" element={<ChatPage/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/register" element={<RegisterPage/>} />
      </Routes>
    )
  }
}

export default App