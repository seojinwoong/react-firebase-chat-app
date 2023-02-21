import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

let timer;

const LoginPage = () => {
  const auth = getAuth();

  const { register, handleSubmit, formState: { errors }  } = useForm();
  const [errorFromSubmit, setErrorFromSubmit] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, data.email, data.password);
      setLoading(false);
    } catch (error) {
      setErrorFromSubmit(error.message);
      setLoading(false);
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        setErrorFromSubmit('');
      }, 5000);
    }
  }

  return (
    <div className='auth-wrapper'>
    <div style={{ textAlign: 'center' }}>
     <h3>로그인</h3>
    </div>
    <form onSubmit={handleSubmit(onSubmit)}>
       <label>이메일</label>
       <input type="email" name='email' { ...register('email', { required: true, pattern: /^\S+@\S+$/i }) } />
       { errors.email && <p className='error_message'>이메일은 필수 입력사항입니다.</p> }

       <label>비밀번호</label>
       <input type="password" name='passsword' { ...register('password', { required: true, minLength: 6 }) } />
       { errors.password && errors.password.type === 'required' && <p className='error_message'>비밀번호는 필수 입력사항입니다.</p> }
       { errors.password && errors.password.type === 'minLength' && <p className='error_message'>비밀번호는 최소 6자 이상 입력하셔야 합니다.</p> }

       {errorFromSubmit && <p className='error_from_submit'>{errorFromSubmit}</p>}
       <input type="submit" disabled={loading}/>
    </form>
    <Link to="/register" style={{ textDecoration: 'none', color: '#333' }}>아직 아이디가 없다면,,,</Link>
 </div>
  )
}

export default LoginPage