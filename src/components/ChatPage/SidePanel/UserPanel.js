import React, { useRef } from 'react';
import { BsFillChatFill } from 'react-icons/bs';
import Dropdown from 'react-bootstrap/Dropdown';
import Image from 'react-bootstrap/Image';
import { useDispatch, useSelector } from 'react-redux';
import { getAuth, signOut, updateProfile } from 'firebase/auth';
import { getDownloadURL, getStorage, ref as strRef, uploadBytesResumable } from 'firebase/storage';
import { setPhotoURL } from '../../../redux/actions/user_action';

const UserPanel = () => {
  const user = useSelector(state => state.user.currentUser);
  const dispatch = useDispatch();
  const inputOpenImageRef = useRef();

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth).then(() => {

    }).catch(error => {

    });
  }

  const handleImgBtnClick = () => {
    inputOpenImageRef.current.click();
  }

  const handleUploadImg = async (event) => {
    const file = event.target.files[0];
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
      });
    } catch (error) {
      console.log(error.message);
    }
  }



  return (
    <div>
      {/* logo */}
      <h3 style={{color: '#fff'}}>
        <BsFillChatFill /> {" "} Chat App
      </h3>

      <div style={{ display: 'flex', marginBottom: '1rem' }}>
        <Image src={user && user.photoURL} style={{ width: '30px', height: '30px', marginTop: '3px' }} roundedCircle />
        <Dropdown>
          <Dropdown.Toggle id="dropdown-basic"
            style={{ background: 'transparent', border: 0 }}
          >
            {user.displayName}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={handleImgBtnClick}>프로필 사진 변경</Dropdown.Item>
            <Dropdown.Item onClick={handleLogout}>로그아웃</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <input type="file" onChange={handleUploadImg} ref={inputOpenImageRef} style={{ display: 'none' }} accept="image/jpeg, image/png"/>

      </div>
    </div>
  )
}

export default UserPanel