import React, { Component } from 'react';
import { FaRegSmileWink, FaPlus } from 'react-icons/fa';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { connect } from 'react-redux';
import { getDatabase, ref, push, child, update, onChildAdded, off } from 'firebase/database';
import { setCurrentChatRoom } from '../../../redux/actions/chatRoom_action';
import Badge from 'react-bootstrap/Badge';

export class ChatRooms extends Component {
  state = {
    show: false,
    name: '',
    description: '',
    chatRoomsRef: ref(getDatabase(), 'chatRooms'),
    messagesRef: ref(getDatabase(), 'messages'),
    chatRooms: [],
    firstLoad: true,
    activeChatRoomId: '',
    notifications: [],

  };

  componentDidMount() {
    this.AddChatRoomsListeners();
  }

  componentWillUnmount() {
    off(this.state.chatRoomsRef);
  }

  setFirstChatRoom = () => {
    const firstChatRoom = this.state.chatRooms[0];
    if (this.state.firstLoad && this.state.chatRooms.length > 0) {
      this.props.dispatch(setCurrentChatRoom(firstChatRoom));
      this.setState({ activeChatRoomId: firstChatRoom.id })
    }
    this.setState({ firstLoad: false });
  }

  AddChatRoomsListeners = () => {
    let chatRoomsArray = [];
    onChildAdded(this.state.chatRoomsRef, DataSnapshot => {
      chatRoomsArray.push(DataSnapshot.val());
      this.setState({ chatRooms: chatRoomsArray }, 
        () => this.setFirstChatRoom()  
      )
      this.addNotificationListener(DataSnapshot.key);
    }); 
  }

  addNotificationListener = (chatRoomId) => {
    this.state.messagesRef.child(chatRoomId).on('value', DataSnapshot => {
      if (this.props.chatRoom) {
        this.handleNotification(
          chatRoomId, // 생성된 방들의 고유 아이디
          this.props.chatRoom.id, // 현재 채팅방의 아이디
          this.state.notifications, //
          DataSnapshot
        )
      }
    });
  }

  handleNotification = (chatRoomId, currentChatRoomId, notifications, DataSnapshot) => {
    //  목표는,,, 방 하나 하나에 맞는 알림 정보를 notifications state에 넣어주기

    // 이미 notifications state 안에 알림 정보가 들어있는 채팅방과, 그렇지 않은 채팅방을 나누어주기
    let index = notifications.findIndex(notification => notification.id  === chatRoomId)

    if (index === -1) { // notifications state 안에 해당 채팅방의 알림 정보가 없을 때
      notifications.push({
        id: chatRoomId,
        total: DataSnapshot.numChildren(),
        lastKnwonTotal: DataSnapshot.numChildren(),
        count: 0
      })
    } else { // 이미 해당 채팅방의 알림 정보가 있을 때
      
    }

  }

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

  changeChatRoom = (room) => {
    this.props.dispatch(setCurrentChatRoom(room));
    this.setState({ activeChatRoomId: room.id });
  }

  renderChatRooms = chatRooms => 
    chatRooms.length > 0 &&
    chatRooms.map(room => (
      <li
        key={room.id}
        style={{ backgroundColor: room.id === this.state.activeChatRoomId && '#ffffff45', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        onClick={() => this.changeChatRoom(room)}
      >
        <p className='roomName mb0'># {room.name}</p>
        <Badge>2</Badge>
      </li>
    ))

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

        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {this.renderChatRooms(this.state.chatRooms)}
        </ul>

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
    user: state.user.currentUser,
    chatRoom: state.chatRoom.currentChatRoom
  }
}

export default connect(mapStateToProps)(ChatRooms)