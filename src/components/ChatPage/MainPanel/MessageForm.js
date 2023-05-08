import React, { useState, useRef } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { getDatabase, ref, set, push, child, remove } from 'firebase/database';
import { getStorage, ref as strRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

import { useSelector } from 'react-redux';

let errorTimer;

const MessageForm = () => {
  const user = useSelector(state => state.user_reducer.currentUser);
  const chatRoom = useSelector(state => state.chatRoom_reducer.currentChatRoom);
  const isPrivateChatRoom = useSelector(state => state.chatRoom_reducer.isPrivateChatRoom);

  const [content, setContent] = useState('');
  const [errors, setErrors] = useState('');
  const [loading, setLoading] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const messagesRef = ref(getDatabase(), 'messages');
  const typingRef = ref(getDatabase(), 'typing');
  const inputOpenImgRef = useRef();

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

  const handleSubmit = async () => {
    if (!content) {
      setErrors('메세지를 입력해주세요!');
      if (errorTimer) clearTimeout(errorTimer);
      errorTimer = setTimeout(() => {
        setErrors("");
      }, 5000);      
      return;
    } 

    setLoading(true);

    try {
      await set(push(child(messagesRef, chatRoom.id)), createMessage());

      await remove(child(typingRef, `${chatRoom.id}/${user.uid}`));

      setLoading(false);
      setContent("");
      setErrors("");
    } catch (error) {
      setErrors(error.message);
      setLoading(false);
      if (errorTimer) clearTimeout(errorTimer);
      errorTimer = setTimeout(() => {
        setErrors("");
      }, 5000);      
    }
  }

  const handleChangeMessage = (e) => {
    setContent(e.target.value);
  }

  const handleOpenImageRef = () => { inputOpenImgRef.current.click(); }
  
  const getPath = () => {
    if (isPrivateChatRoom) return `/message/private/${chatRoom.id}`
    else return `/message/public`
  }

  const handleUploadImage = (e) => {
    const file = e.target.files[0];
    const storage = getStorage();

    const filePath = `${getPath()}/${file.name}`;
    const metadata = { contentType: file.type };

    setLoading(true);
    try {
      const storageRef = strRef(storage, filePath);
      const uploadTask = uploadBytesResumable(storageRef, file, metadata);

      uploadTask.on('state_changed', (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setPercentage(progress);
      }, (error) => {
        console.log(error.message);
      }, () => {
        alert('이미지 업로드가 완료되었습니다!');
        getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
          set(push(child(messagesRef, chatRoom.id)), createMessage(downloadURL));
          setLoading(false);
        });
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleKeyDown = e => {
    if (e.ctrlKey && e.keyCode === 13) {
      handleSubmit();
    }

    if (content) {
      set(ref(getDatabase(), `typing/${chatRoom.id}/${user.uid}`), {
        userName: user.displayName
      })
    } else {
      remove(ref(getDatabase(), `typing/${chatRoom.id}/${user.uid}`));
    }
  }

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <FloatingLabel controlId="floatingTextarea2" label="Comments">
          <Form.Control
            onKeyDown={handleKeyDown}
            value={content}
            onChange={handleChangeMessage}
            as="textarea"
            placeholder="Leave a comment here"
            style={{ height: '100px' }}
          />
        </FloatingLabel>
      </Form>

      {
        !(percentage === 0 || percentage === 100) &&
        <ProgressBar now={percentage} label={`${percentage}%`} />
      }
      
      { errors !== '' && <p style={{ color: 'red'}}>{errors}</p> }

      <Row>
        <Col>
          <button onClick={handleSubmit} className="message-form-button" style={{ width: '100%' }} disabled={loading}>SEND</button>
        </Col>
        <Col>
          <button onClick={handleOpenImageRef} className="message-form-button" style={{ width: '100%' }} disabled={loading}>UPLOAD</button>
        </Col>
      </Row>

      <input type="file" style={{ display: 'none' }} accept='images/jpeg, image/png' ref={inputOpenImgRef} onChange={handleUploadImage}/>

    </div>
  )
}

export default MessageForm