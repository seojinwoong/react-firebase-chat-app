import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

let timer;

const RegisterPage = () => {

  const { register, watch, formState: { errors }, handleSubmit } = useForm();
  const [errorFromSubmit, setErrorFromSubmit] = useState('');

  const password = useRef();
  password.current = watch('password');

  const onSubmit = async (data) => {
    try {
      const auth = getAuth();
      const createdUser = createUserWithEmailAndPassword(auth, data.email, data.password);

    } catch (error) {
      setErrorFromSubmit(error.message);
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        setErrorFromSubmit('');
      }, 3000);
    }
  }

  return (
    <div className='auth-wrapper'>
      <h3 className='title'>회원가입</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Email</label>
        <input type="email" name="email" {...register('email', { required: true, pattern: /^\S+@\S+$/i })} />
        {errors.email && <p className='error_txt'>이메일은 필수 입력사항입니다.</p>}

        <label>Name</label>
        <input type="text" name="name" {...register('name', { required: true, maxLength: 10 })}/>
        {errors.name && errors.name.type === 'required' && <p className='error_txt'>이름은 필수 입력사항입니다.</p>}
        {errors.name && errors.name.type === 'maxLength' && <p className='error_txt'>이름글자수는 최대 10자 입니다.</p>}

        <label>Password</label>
        <input type="password" name="password" {...register('password', { required: true, minLength: 6 })}/>
        {errors.password && errors.password.type === 'required' && <p className='error_txt'>비밀번호는 필수 입력사항입니다.</p>}
        {errors.password && errors.password.type === 'minLength' && <p className='error_txt'>비밀번호는 최소 6자 이상 입력하셔야 합니다.</p>}

        <label>Password Check</label>
        <input type="password" name="password_check" 
          { ...register('password_check', {
            required: true,
            validate: value => value === password.current
          }) }
        />
        {errors.password_check && errors.password_check.type === 'required' && <p className='error_txt'>비밀번호 확인은 필수 입력사항입니다.</p>}
        {errors.password_check && errors.password_check.type === 'validate' && <p className='error_txt'>비밀번호가 일치하지 않습니다.</p>}

        <input type="submit" />

        {errorFromSubmit && <p className='error_txt'>{errorFromSubmit}</p>}
      </form>
      <Link to="/login" style={{ color: 'gray', textDecoration: 'none' }}>이미 아이디가 존재한다면...</Link>
    </div>
  )
}

export default RegisterPage