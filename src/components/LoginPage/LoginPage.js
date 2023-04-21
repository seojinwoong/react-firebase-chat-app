import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import Spinner from 'react-bootstrap/Spinner';

let timer;

const LoginPage = () => {
  const [errorFromSubmit, setErrorFromSubmit] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, formState: { errors }, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const auth = getAuth();
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
        <h3>Register</h3>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>email</label>
        <input type="email" name='email' { ...register('email', { required: true, pattern: /^\S+@\S+$/i }) }/>
        { errors.email && errors.email.type === 'required' && <p>이메일은 필수입력 값입니다.</p> }
        { errors.email && errors.email.type === 'pattern' && <p>유효하지 않은 이메일 형식입니다.</p> }

        <label>password</label>
        <input type="password" name='password' { ...register('password', { required: true, minLength: 6 }) }/>
        { errors.password && errors.password.type === 'required' && <p>비밀번호는 필수입력 값입니다.</p> }
        { errors.password && errors.password.type === 'minLength' && <p>비밀번호는 최소 6자 이상 입력하셔야 합니다.</p> }

        { errorFromSubmit && <p className='error_message'>{errorFromSubmit}</p> }

        <button disabled={loading} >
          {loading ? <Spinner animation="border" variant="light" /> : '제출'}
        </button>

        <Link style={{ color: 'gray', textDecoration: 'none' }} to="/register">아직 아이디가 없다면,,,</Link>
      </form>
    </div>
  );

}


export default LoginPage