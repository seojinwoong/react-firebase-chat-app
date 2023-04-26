import React, { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { getDatabase, ref, set, push, child } from 'firebase/database';

import { useSelector } from 'react-redux';

const MessageForm = () => {
  const user = useSelector(state => state.user_reducer.currentUser);
  const chatRoom = useSelector(state => state.chatRoom_reducer.currentChatRoom);
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesRef = ref(getDatabase(), 'messages');
  const now = 60;

  const createMessage = (fileUrl = null) => {
    const message = {
      timestamp: new Date(),
      user: {
        id: user.uid,
        name: user.displayName,
        image: user.photoURL
      }
    }

    if (fileUrl !== null) {
      message['image'] = fileUrl;
    } else {
      message['content'] = content;
    }

    return message;
  }

  const handleSubmuit = async () => {
    if (!content) {
      setErrors(prev => prev.concat('메세지를 입력해주세요'));
      return;
    } 

    setLoading(true);

    try {
      await set(push(child(messagesRef, chatRoom.id)), createMessage());

      setLoading(false);
      setContent("");
      setErrors([]);
    } catch (error) {
      setErrors(prev => prev.concat(error.message));
      setLoading(false);
      setTimeout(() => {
        setErrors([]);
      }, 5000);      
    }
  }

  const handleChangeMessage = (e) => {
    setContent(e.target.value);
  }

  return (
    <div>
      <Form onSubmit={handleSubmuit}>
        <FloatingLabel controlId="floatingTextarea2" label="Comments">
          <Form.Control
            value={content}
            onChange={handleChangeMessage}
            as="textarea"
            placeholder="Leave a comment here"
            style={{ height: '100px' }}
          />
        </FloatingLabel>
      </Form>

      <ProgressBar now={now} label={`${now}%`} />
      
      {
        errors.length > 0 && errors.map(errorMsg => <p key={errorMsg} style={{ color: 'red' }}>{errorMsg}</p>)
      }

      <Row>
        <Col>
          <button onClick={handleSubmuit} className="message-form-button" style={{ width: '100%' }}>SEND</button>
        </Col>
        <Col>
          <button className="message-form-button" style={{ width: '100%' }}>UPLOAD</button>
        </Col>
      </Row>
    </div>
  )
}

export default MessageForm