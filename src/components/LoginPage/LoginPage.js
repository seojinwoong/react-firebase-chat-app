import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

let timer;

const LoginPage = () => {

  const auth = getAuth();
  const { register, formState: { errors }, handleSubmit } = useForm();
  const [errorFromSubmit, setErrorFromSubmit] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoginLoading(true);

      await signInWithEmailAndPassword(auth, data.email, data.password);
      
      setLoginLoading(false);
      
    } catch (error) {
      setErrorFromSubmit(error.message);
      if (timer) clearTimeout(timer);
      setLoginLoading(false);
      timer = setTimeout(() => {
        setErrorFromSubmit('');
      }, 3000);
    }
  }

  return (
    <div className='auth-wrapper'>
      <h3 className='title'>로그인</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Email</label>
        <input type="email" name="email" {...register('email', { required: true, pattern: /^\S+@\S+$/i })} />
        {errors.email && <p className='error_txt'>이메일은 필수 입력사항입니다.</p>}

        <label>Password</label>
        <input type="password" name="password" {...register('password', { required: true, minLength: 6 })}/>
        {errors.password && errors.password.type === 'required' && <p className='error_txt'>비밀번호는 필수 입력사항입니다.</p>}
        {errors.password && errors.password.type === 'minLength' && <p className='error_txt'>비밀번호는 최소 6자 이상 입력하셔야 합니다.</p>}

        <input type="submit" className={`${loginLoading ? 'button_disabled' : ''}`}/>

        {errorFromSubmit && <p className='error_txt'>{errorFromSubmit}</p>}
      </form>
      <Link to="/register" style={{ color: 'gray', textDecoration: 'none' }}>아직 아이디를 만들지 않았다면,,,</Link>
    </div>
  )
}

export default LoginPage