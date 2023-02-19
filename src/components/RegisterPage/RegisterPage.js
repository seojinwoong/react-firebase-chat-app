import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import md5 from 'md5';
import { getDatabase, ref, set } from 'firebase/database';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

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

      // firebase 데이터베이스에 저장해주기
      set(ref(getDatabase(), `users/${createdUser.user.uid}`), {
        name: createdUser.user.displayName,
        image: createdUser.user.photoURL
      });

      setLoading(false);
    } catch (error) {
      setErrorFromSubmit(error.message);
      setLoading(false);
      setTimeout(() => {
        setErrorFromSubmit('');
      }, 5000);
    }
  }

  return (
    <div className='auth-wrapper'>
      <div style={{ textAlign: 'center' }}>
        <h3>register</h3>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Email</label>
        <input type="email" name="email" {...register('email', { required: true, pattern: /^\S+@\S+$/i })} />
        {errors.email && <p className='error_message'>This Email field is required</p>}

        <label>Name</label>
        <input name="name" {...register('name', { required: true, maxLength: 10 })} />
        {errors.name && errors.name.type === 'required' && <p className='error_message'>This Name field is required</p>}
        {errors.name && errors.name.type === 'maxLength' && <p className='error_message'>your name exceed maximum length</p>}

        <label>Password</label>
        <input name="password" type='password' {...register('password', { required: true, minLength: 6 })} />
        {errors.password && errors.password.type === 'required' && <p className='error_message'>This password field is required</p>}
        {errors.password && errors.password.type === 'minLength' && <p className='error_message'>password must have at least 6 characters</p>}

        <label>Password Confirm</label>
        <input name="password_confirm" type='password' {...register('password_confirm', { required: true, validate: value => value === password.current })} />
        {errors.password_confirm && errors.password_confirm.type === 'required' && <p className='error_message'>This password Confirm field is required</p>}
        {errors.password_confirm && errors.password_confirm.type === 'validate' && <p className='error_message'>the passwords do not match</p>}

        {errorFromSubmit && <p>{errorFromSubmit}</p>}

        <input type="submit" disabled={loading}/>
        <Link style={{ color: 'gray', textDecoration: 'none' }} to='/login'>이미 아이디가 있다면,,,</Link>
      </form>
    </div>
  )
}

export default RegisterPage