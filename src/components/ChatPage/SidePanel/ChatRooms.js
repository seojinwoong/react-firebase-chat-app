import React, { Component } from 'react';
import { FaRegSmileWink, FaPlus } from 'react-icons/fa';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { connect } from 'react-redux';
import { getDatabase, ref, push, update, child, onChildAdded, onValue, off } from 'firebase/database';
import { setCurrentChatRoom, setPrivateChatRoom } from '../../../redux/actions/chatRoom_action';
import Badge from 'react-bootstrap/Badge';
export class ChatRooms extends Component {
  state = {
    modalShow: false,
    name: "",
    description: "",
    chatRoomsRef: ref(getDatabase(), 'chatRooms'),
    messagesRef: ref(getDatabase(), 'messages'),
    chatRooms: [],
    firstLoad: true,
    activeChatRoomId: "",
    notifications: []
  }

  componentDidMount() {
    this.AddChatRoomsListener();
  }

  componentWillUnmount() {
    off(this.state.chatRoomsRef);
    
    this.state.chatRooms.forEach(chatRoom => {
      off(child(this.state.messagesRef, chatRoom.id));
    });
  }

  setFirstChatRoom = () => {
    if (this.state.firstLoad && this.state.chatRooms.length > 0) {
      const firstChatRoom = this.state.chatRooms[0];
      this.props.dispatch(setCurrentChatRoom(firstChatRoom));
      this.setState({ activeChatRoomId: firstChatRoom.id });
      this.setState({ firstLoad: false });
    }
  }

  AddChatRoomsListener = () => {
    let chatRoomsArray = [];

    onChildAdded(this.state.chatRoomsRef, DataSnapshot => {
        chatRoomsArray.push(DataSnapshot.val());
        this.setState({ chatRooms: chatRoomsArray }, () => {
          this.setFirstChatRoom();
          this.addNotificationsListeners(DataSnapshot.key);
        });
    });
  }
  
  addNotificationsListeners = (chatRoomId) => {
    let { messagesRef } = this.state;
    onValue(child(messagesRef, chatRoomId), DataSnapshot => { // <- messages테이블의 chatRoomId가 뭐뭐뭐인 message들을 긁어오기
      if (this.props.chatRoom) {
        this.handleNotification(
          chatRoomId, // 채팅룸들의 아이디 각각
          this.props.chatRoom.id, // 현재 보고있는 채팅방의 아이디
          this.state.notifications, // notifications state, 메세지 관련 알람을 담을 배열
          DataSnapshot // chatRoomId에 해당하는 방의 메세지들
        )
      }
    })
  }

  handleNotification = (eachChatRoomId, currentChatRoomId, notifications, chatRoomMessages) => {
    let lastTotal = 0;
     
    // 이미 notifications state 안에 알림 정보가 들어있는 채팅방과 그렇지 않은 채팅방을 나눠주기
    let index = notifications.findIndex(notification => notification.id === eachChatRoomId);

    // notifications state 안에 해당 채팅방의 알림정보가 없을 때
    if (index === -1) {
      notifications.push({
        id: eachChatRoomId,
        total: chatRoomMessages.size,
        lastKnownTotal: chatRoomMessages.size,
        count: 0
      });
    } else { // 이미 해당 채팅방의 알림정보가 있을 때
      // 상대방이 채팅 보내는 그 해당 채팅방에 내가 있지 않을 때
      if (eachChatRoomId !== currentChatRoomId) {
        // 현재까지 유저가 확인한 총 메세지 갯수
        lastTotal = notifications[index].lastKnownTotal;

        // count 알림으로 보여줄 숫자 구하기
        if (chatRoomMessages.size - lastTotal > 0) {
          notifications[index].count = chatRoomMessages.size - lastTotal;
        }
      }
      // total property에 현재 전체 메세지 갯수를 넣어주기
      notifications[index].total = chatRoomMessages.size;
    }
    // 최종 목표는 notifications state 배열에 알림과 관련된 값들을 정리해서 넣는것!
    this.setState({ notifications });
  }

  isFormValid = (name, description) => name && description;

  setModalShow = () => { this.setState({ modalShow: true }) };

  setModalHide = () => { this.setState({ modalShow: false }) };

  handleSubmit = (e) => {
    e.preventDefault();

    const { name, description } = this.state;
    if (this.isFormValid(name, description)) {
      this.addChatRoom();
    }
  }

  addChatRoom = async () => {
    const key = push(this.state.chatRoomsRef).key;
    const { name, description } = this.state;
    const { user } = this.props;
    const newChatRoom = {
      id: key,
      name,
      description,
      createdBy: {
        name: user.displayName,
        image: user.photoURL
      }
    }

    try {
      await update(child(this.state.chatRoomsRef, key), newChatRoom);
      this.setState({
        name: "",
        description: "",
        modalShow: false
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  handleChangeChatRoom = (chatRoom) => {
    this.props.dispatch(setCurrentChatRoom(chatRoom));
    this.props.dispatch(setPrivateChatRoom(false));
    this.setState({ activeChatRoomId: chatRoom.id });
    this.clearNotification(chatRoom.id);
  }

  clearNotification = (chatRoomId) => {
    let index = this.state.notifications.findIndex(
      notification => notification.id === this.props.chatRoom.id
    )

    if (index !== -1) {
      let updatedNotifications = [...this.state.notifications];
      updatedNotifications[index].count = 0;
      updatedNotifications[index].lastKnownTotal = updatedNotifications[index].total;
      this.setState({ notifications: updatedNotifications }, () => {
        document.querySelector(`li[data-chatroomid="${chatRoomId}"]`).click();
      });
    }
  }

  getNotificationCount = (chatRoom) => {
    let count = 0;
    
    this.state.notifications.forEach(notification => {
      if (notification.id === chatRoom.id) {
        count = notification.count;
      }
    });
    if (count > 0) return count;
  }

  renderChatRooms = (chatRooms) => 
    chatRooms.length > 0 &&
    chatRooms.map(chatRoom => (
      <li key={chatRoom.id}
        data-chatroomid={chatRoom.id}
        onClick={() => this.handleChangeChatRoom(chatRoom)}
        style={{display: 'flex', justifyContent: 'space-between', backgroundColor: chatRoom.id === this.state.activeChatRoomId && '#ffffff45' }}
      >
        # {chatRoom.name}
        <Badge style={{ float: 'right', marginTop: '4px' }} variant="danger">
          {this.getNotificationCount(chatRoom)}
        </Badge>
      </li>
    ))
  
  render() {
    return (
      <div>
        <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}>
          <FaRegSmileWink style={{ marginRight: 3 }}/>
          CHAT ROOMS {" "} (1)
          <FaPlus style={{ position: 'absolute', right: 0, cursor: 'pointer' }} onClick={this.setModalShow}/>
        </div>

        <ul style={{ listStyleType: 'none', padding: 0 }}>
          { this.renderChatRooms(this.state.chatRooms) }
        </ul>

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
            <Form onSubmit={this.handleSubmit}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>채팅방 이름</Form.Label>
                <Form.Control 
                  onChange={e => this.setState({ name: e.target.value })}
                  type="text" placeholder="채팅방 이름을 작성해주세요." />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>채팅방 상세설명</Form.Label>
                <Form.Control 
                  onChange={e => this.setState({ description: e.target.value })}
                  as="textarea" placeholder="채팅방 이름을 작성해주세요." />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
             <Button onClick={this.handleSubmit}>채팅방 개설</Button>
             <Button onClick={this.setModalHide}>닫기</Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.user_reducer.currentUser,
    chatRoom: state.chatRoom_reducer.currentChatRoom
  }
}

export default connect(mapStateToProps)(ChatRooms);