import React, { useState, useRef } from 'react'
import { useSelector } from 'react-redux';

import Form from 'react-bootstrap/Form';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { getDatabase, ref, set, push, child } from 'firebase/database';
import { getDownloadURL, getStorage, ref as strRef, uploadBytesResumable } from 'firebase/storage';

const MessageForm = () => {
  const chatRoom = useSelector(state => state.chatRoom.currentChatRoom);
  const user = useSelector(state => state.user.currentUser);

  const [content, setContent] = useState('');
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const messagesRef = ref(getDatabase(), 'messages');
  const inputOpenImgRef = useRef();

  const handleOpenImg = () => {
    inputOpenImgRef.current.click();
  }

  const handleUpload = (e) => {
    const file = e.target.files[0];
    const storage = getStorage();

    const filePath = `/message/public/${file.name}`;
    const metadata = { contentType: file.type };
    setLoading(true);
    try {
      const storageRef = strRef(storage, filePath);
      const uploadTask = uploadBytesResumable(storageRef, file, metadata);
      
      uploadTask.on('state_changed', 
        snapshot => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setPercentage(progress);
        },
        error => {
          console.error(error.message);
          setLoading(false);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
            set(push(child(messagesRef, chatRoom.id)), createMessage(downloadURL))
            setLoading(false);
          });
        }
      )
    } catch (error) {
      console.error(error.message);
    }
  }

  const createMessage = (fileUrl = null) => {
    const message = {
      timestamp: "" + new Date(),
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

  const handleChange = (e) => {
    setContent(e.target.value);
  }

  const handleSubmit = async () => {
    if (!content) {
      setErrors(prev => prev.concat('type contents first'));
      return;
    }

    setLoading(true);

    try {
      await set(push(child(messagesRef, chatRoom.id)), createMessage());

      setLoading(false);
      setContent("");
      setErrors([]);
    } catch (e) {
      setErrors(prev => prev.concat(e.message));
      setLoading(false);
      setTimeout(() => {
        setErrors([]);
      }, 5000);
    }
  }

  return (
    <div>
        <Form onSubmit={handleSubmit}>
          <Form.Control
            as="textarea"
            placeholder="Leave a comment here"
            style={{ height: '100px' }}
            value={content}
            onChange={handleChange}
          />
        </Form>
      {
        !(percentage === 0 || percentage === 100)
        && <ProgressBar now={percentage} label={`${percentage}%`} />
      }
      <Row>
        <Col>
          <button className='message-form-button'
            onClick={handleSubmit}
            style={{ width: '100%' }}
          >SEND</button>
        </Col>
        <Col>
        <button className='message-form-button'
            onClick={handleOpenImg}
            style={{ width: '100%' }}
          >UPLOAD</button></Col>
      </Row>

      <input type="file" accept="image/jpeg, image/png" style={{ display: 'none' }} ref={inputOpenImgRef} onChange={handleUpload}/>
    </div>
  )
}

export default MessageForm