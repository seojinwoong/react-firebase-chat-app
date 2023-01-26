import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';

const RegisterPage = () => {

  const { register, watch, formState: { errors } } = useForm();

  const password = useRef();
  password.current = 

  return (
    <div className='auth-wrapper'>
      <h3 className='title'>회원가입</h3>
      <form>
        <label>Email</label>
        <input type="email" name="email"  {...register('email', { required: true, pattern: /^\S+@\S+$/i })} />
        {errors.email && <p className='error_txt'>이메일은 필수 입력사항입니다.</p>}

        <label>Name</label>
        <input type="text" name="name"/>
        {errors.name && errors.name.type === 'required' && <p className='error_txt'>이름은 필수 입력사항입니다.</p>}
        {errors.name && errors.name.type === 'maxLength' && <p className='error_txt'>이름글자수는 최대 10자 입니다.</p>}

        <label>Password</label>
        <input type="password" name="password" ref={register({ required: true, minLength: 6 })}/>
        {errors.password && errors.password.type === 'required' && <p className='error_txt'>비밀번호는 필수 입력사항입니다.</p>}
        {errors.password && errors.password.type === 'minLength' && <p className='error_txt'>비밀번호는 최소 6자 이상 입력하셔야 합니다.</p>}

        <label>Password Check</label>
        <input type="password" name="password_check" {...register()}/>

        <input type="submit" />
      </form>
      <Link to="/login" style={{ color: 'gray', textDecoration: 'none' }}>이미 아이디가 존재한다면...</Link>
    </div>
  )
}

export default RegisterPage