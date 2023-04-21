import React from 'react';
import { AiFillWechat } from 'react-icons/ai';
import Image from 'react-bootstrap/Image';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { useSelector } from 'react-redux';
import { getAuth, signOut } from 'firebase/auth';

const UserPanel = () => {
  const user = useSelector(state => state.user_reducer.currentUser);

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth);
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

        <DropdownButton id="dropdown-basic-button" title={ user ? user.displayName + '님, 반갑습니다!' : null }>
          <Dropdown.Item>프로필 사진 변경</Dropdown.Item>
          <Dropdown.Item onClick={handleLogout}>로그아웃</Dropdown.Item>
        </DropdownButton>
      </div>

    </div>
  )
}

export default UserPanel