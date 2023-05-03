import React, { Component } from 'react';
import { FaRegSmileWink, FaPlus } from 'react-icons/fa';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { connect } from 'react-redux';
import { getDatabase, ref, push, update, child, onChildAdded } from 'firebase/database';
import { setCurrentChatRoom, setPrivateChatRoom } from '../../../redux/actions/chatRoom_action';
import Badge from 'react-bootstrap/Badge';
export class ChatRooms extends Component {
  state = {
    modalShow: false,
    name: "",
    description: "",
    chatRoomsRef: ref(getDatabase(), 'chatRooms'),
    chatRooms: [],
    firstLoad: true,
    activeChatRoomId: "",
  }

  componentDidMount() {
    this.AddChatRoomsListener();
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
        });
    });
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
  }

  renderChatRooms = (chatRooms) => 
    chatRooms.length > 0 &&
    chatRooms.map(chatRoom => (
      <li key={chatRoom.id}
        onClick={() => this.handleChangeChatRoom(chatRoom)}
        style={{display: 'flex', justifyContent: 'space-between', backgroundColor: chatRoom.id === this.state.activeChatRoomId && '#ffffff45' }}
      >
        # {chatRoom.name}
        <Badge style={{ float: 'right', marginTop: '4px' }} variant="danger">2</Badge>
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