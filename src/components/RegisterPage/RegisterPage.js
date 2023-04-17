import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

const RegisterPage = () => {

  const { register, watch, formState: { errors }, handleSubmit } = useForm();
  const password = useRef();
  password.current = watch('password');

  console.log('password.current', password.current);

  return (
    <div className='auth-wrapper'>
      <div style={{ textAlign: 'center' }}>
        <h3>Register</h3>
      </div>
      <form>
        <label>email</label>
        <input type="email" name='email' { ...register('email', { required: true, pattern: /^\S+@\S+$/i }) }/>
        { errors.email && errors.email.type === 'required' && <p>이메일은 필수입력 값입니다.</p> }
        { errors.email && errors.email.type === 'pattern' && <p>유효하지 않은 이메일 형식입니다.</p> }

        <label>name</label>
        <input type="text" name='name' { ...register('name', { required: true, maxLength: 10 }) }/>
        { errors.name && errors.name.type === 'required' && <p>이름은 필수입력 값입니다.</p> }
        { errors.name && errors.name.type === 'maxLength' && <p>이름은 최대 10자까지 입력 가능합니다.</p> }

        <label>password</label>
        <input type="password" name='password' { ...register('password', { required: true, minLength: 6 }) }/>
        { errors.password && errors.password.type === 'required' && <p>비밀번호는 필수입력 값입니다.</p> }
        { errors.password && errors.password.type === 'minLength' && <p>비밀번호는 최소 6자 이상 입력하셔야 합니다.</p> }

        <label>password confirm</label>
        <input type="password" name='password_confirm' { ...register('password_confirm', { required: true, validate: value => value === password.current }) }/>
        { errors.password_confirm && errors.password_confirm.type === 'required' && <p>비밀번호 확인은 필수입력 값입니다.</p> }
        { errors.password_confirm && errors.password_confirm.type === 'validate' && <p>비밀번호가 일치하지 않습니다.</p> }
        
        <input type="submit" />

        <Link style={{ color: 'gray', textDecoration: 'none' }} to="/login">이미 아이디가 있다면,,,</Link>
      </form>
    </div>
  );

}


export default RegisterPage