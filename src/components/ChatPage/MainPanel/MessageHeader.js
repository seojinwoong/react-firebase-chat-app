import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { FaLock, FaLockOpen } from 'react-icons/fa';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { AiOutlineSearch } from 'react-icons/ai';
import Image from 'react-bootstrap/Image';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Accordion from 'react-bootstrap/Accordion';
import { useSelector } from 'react-redux';
import { getDatabase, ref, child, remove, update, onValue } from 'firebase/database';

const MessageHeader = ({handleSearchChange}) => {
  const chatRoom = useSelector(state => state.chatRoom_reducer.currentChatRoom);
  const isPrivateChatRoom = useSelector(state => state.chatRoom_reducer.isPrivateChatRoom);
  const userPosts = useSelector(state => state.chatRoom_reducer.userPosts);
  const user = useSelector(state => state.user_reducer.currentUser);
  const usersRef = ref(getDatabase(), 'users');
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    if (chatRoom && user) {
      addFavoriteListener(chatRoom.id, user.uid);
    }
  }, []);

  const addFavoriteListener = (chatRoomId, userId) => {
    onValue(child(usersRef, `${userId}/favorited`), data => {
      if (data.val() !== null) {
        const chatRoomIds = Object.keys(data.val());
        const isAlreadyFavorited = chatRoomIds.includes(chatRoomId);
        setIsFavorited(isAlreadyFavorited);
      }
    });
  }

  const handleFavorite = () => {
    if (isFavorited) {
      setIsFavorited(prev => !prev);
      remove(child(usersRef, `${user.uid}/favorited/${chatRoom.id}`));
    } else {
      setIsFavorited(prev => !prev);
      update(child(usersRef, `${user.uid}/favorited`), {
        [chatRoom.id]: {
          name: chatRoom.name,
          description: chatRoom.description,
          createdBy: {
            name: chatRoom.createdBy.name,
            image: chatRoom.createdBy.image,
          }
        }
      })
    }
  }

  const renderUserPosts = (userPosts) =>
    Object.entries(userPosts)
      .sort((a, b) => b[1].count - a[1].count)
      .map(([key, value], i) => (
        <div style={{ display: 'flex' }}>
          <img src={value.image} alt={key} style={{ width: '30px', height: '30px', borderRadius: '50%' }} title={key} className='mr-3'/>
          <div>
            <p>{key}</p>
            <p>{value.count} 개</p>
          </div>
        </div>  
      ))

  return (
    <div
      style={{
        width: '100%',
        height: '170px',
        border: '.2rem solid #ececec',
        borderRadius: '4px',
        padding: '1rem',
        marginBottom: '1rem'
      }}
    >
      <Container>
        <Row>
          <Col><h2>{ isPrivateChatRoom ? <FaLock style={{ marginBottom: '10px' }}/> : <FaLockOpen style={{ marginBottom: '10px' }}/>} {chatRoom && chatRoom.name} 
          <span onClick={handleFavorite}>
          {
            isFavorited
            ? <MdFavorite style={{ marginBottom: '10px' }}/>
            : <MdFavoriteBorder style={{ marginBottom: '10px' }}/>
          }
          </span>
          </h2></Col>
          <Col>
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">
                <AiOutlineSearch />
              </InputGroup.Text>
              <Form.Control
                onChange={handleSearchChange}
                placeholder="Search Messages"
                aria-label="Search"
                aria-describedby="basic-addon1"
              />
            </InputGroup>
          </Col>
        </Row>

        {!isPrivateChatRoom &&
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <p>
              <Image src={chatRoom && chatRoom.createdBy.image} style={{ width: '30px', height: '30px', borderRadius: '50%' }}/>{" "}
              {chatRoom && chatRoom.createdBy.name} 
            </p>
          </div>
        }

        <Row>
          <Col>
            <Accordion>
              <Accordion.Item eventKey="0"> 
                <Accordion.Header style={{ display: 'flex', height: '40px' }}>description</Accordion.Header>
                <Accordion.Body>
                  {chatRoom && chatRoom.description}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
          <Col>
            <Accordion>
              <Accordion.Item eventKey="1"> 
                <Accordion.Header style={{ display: 'flex', height: '40px' }}>user posts</Accordion.Header>
                <Accordion.Body>
                  {userPosts && renderUserPosts(userPosts)}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default MessageHeader