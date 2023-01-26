import React from 'react';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
  return (
    <div className='auth-wrapper'>
      <h3 className='title'>회원가입</h3>
      <form>
        <label>Email</label>
        <input type="email" name="email"/>
        <label>Name</label>
        <input type="text" name="name"/>
        <label>Password</label>
        <input type="password" name="password"/>
        <label>Password Check</label>
        <input type="password" name="password_check"/>
        <input type="submit" />
      </form>
      <Link to="/login" style={{ color: 'gray', textDecoration: 'none' }}>이미 아이디가 존재한다면...</Link>
    </div>
  )
}

export default RegisterPage