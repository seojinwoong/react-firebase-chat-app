import React, { Component } from 'react';
import { FaRegSmileWink, FaPlus } from 'react-icons/fa';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { connect } from 'react-redux';
import { getDatabase, ref, push, child, update } from 'firebase/database';

export class ChatRooms extends Component {
  state = {
    show: false,
    name: '',
    description: '',
    chatRoomsRef: ref(getDatabase(), 'chatRooms'),
  };

  handleClose = () => this.setState({ show: false });
  handleShow = () => this.setState({ show: true });

  handleSubmit = (e) => {
    e.preventDefault();
    const { name, description } = this.state;

    if (this.isFormValid(name, description)) {
      this.addChatRoom();
    }
  }

  isFormValid = (name, description) => name && description

  addChatRoom = async () => {
    const key = push(this.state.chatRoomsRef).key;
    const { name, description } = this.state;
    const { user } = this.props;
    const newChatRoom = {
      id: key,
      name: name,
      description: description,
      createdBy: {
        name: user.displayName,
        image: user.photoURL
      }
    }

    try {
      await update(child(this.state.chatRoomsRef, key), newChatRoom)
      this.setState({
        name: '',
        description: '',
        show: false
      })
    } catch (error) {
      alert(error)
    }
  }

  render() {
    return (
    <div>
        <div style={{
          position: 'relative', width: '100%', display: 'flex', alignItems: 'center'
        }}>
          <FaRegSmileWink style={{ marginRight: 3 }}/>
          CHAT ROOMS {" "} (1)
          <FaPlus 
            onClick={this.handleShow}
            style={{
              position: 'absolute', right: 0, cursor: 'pointer'
            }}
          />

        </div>
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>

            <Form onSubmit={this.handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>방 이름</Form.Label>
                <Form.Control
                  onChange={e => this.setState({ name: e.target.value })}
                  type='text' placeholder="Enter a chat room name"
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
              >
                <Form.Label>방 설명</Form.Label>
                <Form.Control as="textarea" rows={3} 
                  onChange={e => this.setState({ description: e.target.value })}
                  type='text' placeholder="Enter a chat room description"
                />
              </Form.Group>
            </Form>

          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={this.handleSubmit}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
    </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.user.currentUser
  }
}

export default connect(mapStateToProps)(ChatRooms)