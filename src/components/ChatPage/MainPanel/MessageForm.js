import React from 'react'
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const MessageForm = () => {
  const now = 60;
  return (
    <div>
      <FloatingLabel controlId="floatingTextarea2" label="Comments">
        <Form.Control
          as="textarea"
          placeholder="Leave a comment here"
          style={{ height: '100px' }}
        />
      </FloatingLabel>
      <ProgressBar now={now} label={`${now}%`} />

      <Row>
        <Col>
          <button className='message-form-button'
            style={{ width: '100%' }}
          >SEND</button>
        </Col>
        <Col>
        <button className='message-form-button'
            style={{ width: '100%' }}
          >UPLOAD</button></Col>
      </Row>
    </div>
  )
}

export default MessageForm