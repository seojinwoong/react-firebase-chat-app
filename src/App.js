import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import ChatPage from './components/ChatPage/ChatPage';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';

import { getAuth, onAuthStateChanged } from 'firebase/auth';


const App = () => {
  const navigate = useNavigate();
  
  return (
    <Routes>
      <Route path="/" element={<ChatPage />}></Route>
      <Route path="/login" element={<LoginPage />}></Route>
      <Route path="/register" element={<RegisterPage />}></Route>
    </Routes>

  )
}

export default App