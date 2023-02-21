import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';
import md5 from 'md5';

let timer;

const RegisterPage = () => {
  const { register, watch, formState: { errors }, handleSubmit } = useForm();
  const [errorFromSubmit, setErrorFromSubmit] = useState('');
  const [loading, setLoading] = useState(false);

  const password = useRef();
  password.current = watch('password');

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const auth = getAuth();
      let createdUser = await createUserWithEmailAndPassword(auth, data.email, data.password);
      
      await updateProfile(auth.currentUser, {
        displayName: data.name,
        photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
      });

      set(ref(getDatabase(), `users/${createdUser.user.uid}`), {
        name: createdUser.user.displayName,
        image: createdUser.user.photoURL
      });

      setLoading(false);
    } catch (err) {
      setErrorFromSubmit(err.message);
      setLoading(false);
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        setErrorFromSubmit('');
      }, 5000);
    }
  }

  return (
    <div className='auth-wrapper'>
       <div style={{ textAlign: 'center' }}>
        <h3>회원가입</h3>
       </div>
       <form onSubmit={handleSubmit(onSubmit)}>
          <label>이메일</label>
          <input type="email" name='email' { ...register('email', { required: true, pattern: /^\S+@\S+$/i }) } />
          { errors.email && <p className='error_message'>이메일은 필수 입력사항입니다.</p> }

          <label>이름</label>
          <input name='name' { ...register('name', { required: true, maxLength: 10 }) } />
          { errors.name && errors.name.type === 'required' && <p className='error_message'>이름은 필수 입력사항입니다.</p> }
          { errors.name && errors.name.type === 'maxLength' && <p className='error_message'>이름은 최대 10자까지 입력하실 수 있습니다.</p> }

          <label>비밀번호</label>
          <input type="password" name='passsword' { ...register('password', { required: true, minLength: 6 }) } />
          { errors.password && errors.password.type === 'required' && <p className='error_message'>비밀번호는 필수 입력사항입니다.</p> }
          { errors.password && errors.password.type === 'minLength' && <p className='error_message'>비밀번호는 최소 6자 이상 입력하셔야 합니다.</p> }

          <label>비밀번호 확인</label>
          <input type="password" name='password_check' { ...register('password_check', { required: true, validate: (value) => value === password.current }) } />
          { errors.password_check && errors.password_check.type === 'required' && <p className='error_message'>비밀번호 확인은 필수 입력사항입니다.</p> }
          { errors.password_check && errors.password_check.type === 'validate' && <p className='error_message'>비밀번호가 일치하지 않습니다.</p> }

          {errorFromSubmit && <p className='error_from_submit'>{errorFromSubmit}</p>}
          <input type="submit" disabled={loading}/>
       </form>
       <Link to="/" style={{ textDecoration: 'none', color: '#333' }}>이미 아이디가 존재한다면,,,</Link>
    </div>
  )
}

export default RegisterPage
