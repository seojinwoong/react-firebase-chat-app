import React, { useRef } from 'react';
import { AiFillWechat } from 'react-icons/ai';
import Image from 'react-bootstrap/Image';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { useSelector, useDispatch } from 'react-redux';
import { getAuth, signOut, updateProfile } from 'firebase/auth';
import { getDatabase, ref, update } from 'firebase/database';
import { getStorage, uploadBytesResumable, ref as strRef, getDownloadURL } from 'firebase/storage';
import { setPhotoURL } from '../../../redux/actions/user_action';

const UserPanel = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user_reducer.currentUser);
  const inputOpenImageRef = useRef();

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth);
  }

  const handleOpenImageRef = () => {
    inputOpenImageRef.current.click();
  }

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    const auth = getAuth();
    const user = auth.currentUser;

    const metadata = { contentType: file.type };
    const storage = getStorage();

    try {
      let uploadTask = uploadBytesResumable(strRef(storage, `user_image/${user.uid}`), file, metadata);

      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        updateProfile(user, {
          photoURL: downloadURL
        });

        dispatch(setPhotoURL(downloadURL));
        
        update(ref(getDatabase(), `users/${user.uid}`), {image: downloadURL});

      });
    } catch (error) {
      console.log(error.message);
    }
  } 

  return (
    <div>
      <h3>
        <AiFillWechat />{" "}CHAT APP
      </h3>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {
          user 
          ? <Image src={user.photoURL} style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '10px' }}/>
          : null
        }

        <DropdownButton id="dropdown-basic-button"  title={ user ? user.displayName + '님, 반갑습니다!' : null }>
          <Dropdown.Item onClick={handleOpenImageRef}>프로필 사진 변경</Dropdown.Item>
          <Dropdown.Item onClick={handleLogout}>로그아웃</Dropdown.Item>
        </DropdownButton>
      </div>

      <input
        onChange={handleUploadImage}
        accept="image/jpeg, image/png"
        style={{ display: 'none' }}
        ref={inputOpenImageRef}
        type="file"
      />

    </div>
  )
}

export default UserPanel