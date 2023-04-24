import React, { Component } from 'react';
import { FaRegSmileWink, FaPlus } from 'react-icons/fa';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
export class ChatRooms extends Component {
  state = {
    modalShow: false,
  }
  setModalShow = () => {  this.setState({ modalShow: true }) };
  setModalHide = () => {  this.setState({ modalShow: false }) };
  
  render() {
    return (
      <div>
        <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}>
          <FaRegSmileWink style={{ marginRight: 3 }}/>
          CHAT ROOMS {" "} (1)
          <FaPlus style={{ position: 'absolute', right: 0, cursor: 'pointer' }} onClick={this.setModalShow}/>
        </div>

        <Modal
          show={this.state.modalShow}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              채팅방 개설하기
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>채팅방 이름</Form.Label>
                <Form.Control type="text" placeholder="채팅방 이름을 작성해주세요." />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>채팅방 상세설명</Form.Label>
                <Form.Control as="textarea" placeholder="채팅방 이름을 작성해주세요." />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
             <Button>채팅방 개설</Button>
            <Button onClick={this.setModalHide}>닫기</Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

export default ChatRooms