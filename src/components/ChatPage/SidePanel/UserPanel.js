import React, { useRef } from 'react';
import { BsFillChatFill } from 'react-icons/bs';
import Dropdown from 'react-bootstrap/Dropdown';
import Image from 'react-bootstrap/Image';
import { useDispatch, useSelector } from 'react-redux';
import { getAuth, signOut } from 'firebase/auth';
import { getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import {setPhotoURL} from '../../../redux/actions/user_action';

const UserPanel = () => {
  const user = useSelector(state => state.user.currentUser);
  const imgUploadBtn = useRef();
  const dispatch = useDispatch();

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth).then(() => {

    }).catch(error => {

    });
  }
  const handleImgBtnClick = () => {
    imgUploadBtn.current.click();
  }

  const handleUploadImg = async (e) => {
    const file = e.target.files[0];
    const auth = getAuth();
    const user = auth.currentUser;

    const metadata = { contentType: file.type };
    const storage = getStorage();

    try {
      let uploadTask = uploadBytesResumable(ref(storage, `user_image/${user.uid}`), file, metadata); 
      let downloadURL = await uploadTask.ref.getDownloadURL();

      // 프로필 이미지 수정
      await firebase.auth().currentUser.updateProfile({
        photoURL: downloadURL
      });
      
      dispatch(setPhotoURL(downloadURL));

      // 데이터베이스 유저 이미지 수정
      await firebase.database().ref('users')
        .child(user.uid)
        .update({ image: downloadURL })
        

    } catch (error) {
      console.error(error.message);
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
        <input type="file" onChange={handleUploadImg} ref={imgUploadBtn} style={{ display: 'none' }} accept="image/jpeg, image/png"/>

      </div>
    </div>
  )
}

export default UserPanel