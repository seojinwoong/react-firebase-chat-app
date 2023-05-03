import React, { Component } from 'react';
import { FaRegSmile } from 'react-icons/fa';
import { connect } from 'react-redux';
import { getDatabase, ref, onChildAdded } from 'firebase/database';
import { setCurrentChatRoom, setPrivateChatRoom } from '../../../redux/actions/chatRoom_action';
export class DirectMessages extends Component {

  state = {
    usersRef: ref(getDatabase(), 'users'),
    users: [],
    activeChatRoom: ""
  }

  componentDidMount() {
    if (this.props.user) {
      this.addUserListener(this.props.user.uid);
    }
  }

  addUserListener = (currentUserId) => {
    const { usersRef } = this.state;
    let usersArray = [];
    
    onChildAdded(usersRef, DataSnapshot => {
        if ( currentUserId !== DataSnapshot.key ) {
          let user = DataSnapshot.val();
          user["uid"] = DataSnapshot.key;
          user["status"] = 'offline';
          usersArray.push(user);
          this.setState({ users: usersArray });
        }
    });
  }

  getChatRoomId = userId => {
    const currentUserId = this.props.user.uid;
    return userId > currentUserId ? `${userId}/${currentUserId}` : `${currentUserId}/${userId}`;
  }

  changeChatRoom = user => {
    const chatRoomId = this.getChatRoomId(user.uid);
    const chatRoomData = {
      id: chatRoomId,
      name: user.name
    }
    this.props.dispatch(setCurrentChatRoom(chatRoomData));
    this.props.dispatch(setPrivateChatRoom(true));
    this.setState({ activeChatRoom: user.uid });
  }

  renderUserLists = users => 
    users.length > 0 &&
    users.map(user => (
      <li key={user.uid} onClick={() => this.changeChatRoom(user)} style={{ backgroundColor: this.state.activeChatRoom === user.uid && "#ffffff45" }}>
        # {user.name}
      </li>
    ))

  render() {
    const { users } = this.state;
    return (
      <div>
         <span style={{ display: 'flex', alignItems: 'center' }}>
            <FaRegSmile style={{ marginRight: 3 }} />  DIRECT MESSAGES(1)
          </span>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {this.renderUserLists(users)}
          </ul>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.user_reducer.currentUser,
  }
} 

export default connect(mapStateToProps)(DirectMessages);