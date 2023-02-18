import React from 'react';
import { BsFillChatFill } from 'react-icons/bs';
import Dropdown from 'react-bootstrap/Dropdown';
import Image from 'react-bootstrap/Image';
import { useSelector } from 'react-redux';

const UserPanel = () => {
  const user = useSelector(state => state.user.currentUser);

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
            <Dropdown.Item>프로필 사진 변경</Dropdown.Item>
            <Dropdown.Item>로그아웃</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  )
}

export default UserPanel