import React, { Component } from 'react';
import { FaRegSmileBeam } from 'react-icons/fa';
import { connect } from 'react-redux';
import {
  setCurrentChatRoom,
  setPrivateChatRoom
} from '../../../redux/actions/chatRoom_action';

import { child, getDatabase, ref, onChildAdded, onChildRemoved, off, DataSnapshot } from 'firebase/database';

export class Favorited extends Component {
  state = {
    favoritedChatRooms: [],
    activeChatRoomId: "",
    userRef: ref(getDatabase(), 'users'),
    firstLoad: true
  }

  componentDidMount() {
    if (this.props.user) {
      this.addListeners(this.props.user.uid);
    }
  }
  
  componentWillUnmount() {
    if (this.props.user) {
      this.removeListeners(this.props.user.uid);
    }
  }

  addListeners = (userId) => {
    const { userRef } = this.state;
    let favoriteArr = [];
    
    onChildAdded(child(userRef, `${userId}/favorited`), DataSnapshot => {
      if (this.state.firstLoad) {
        favoriteArr.push({ id: DataSnapshot.key, ...DataSnapshot.val() });
        this.setState({
          favoritedChatRooms: favoriteArr,
          firstLoad: false
        });
      } else {
        this.setState({
          favoritedChatRooms: [...this.state.favoritedChatRooms, { id: DataSnapshot.key, ...DataSnapshot.val() }],
        });
      }
    });

    onChildRemoved(child(userRef, `${userId}/favorited`), DataSnapshot => {
      const filteredChatRooms = this.state.favoritedChatRooms.filter(chatRoom => {
        return chatRoom.id !== DataSnapshot.key;
      });
      this.setState({ favoritedChatRooms: filteredChatRooms });
    });
  }

  removeListeners = (userId) => {
    const { userRef } = this.state;
    off(child(userRef, `${userId}/favorited`));
  }

  changeChatRoom = (chatRoom) => {
    this.props.dispatch(setCurrentChatRoom(chatRoom));
    this.props.dispatch(setPrivateChatRoom(false));
    this.setState({ activeChatRoomId: chatRoom.id });
  }

  renderFavoritedChatRooms = favoritedChatRooms => 
    favoritedChatRooms.length > 0 &&
    favoritedChatRooms.map(chatRoom => (
      <li key={chatRoom.id} onClick={() => this.changeChatRoom(chatRoom)}
        style={{ backgroundColor: chatRoom.id === this.state.activeChatRoomId && '#ffffff45' }}
      >
        # {chatRoom.name}
      </li>
    ))

  render() {
    const { favoritedChatRooms } = this.state;
    return (
      <div>
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <FaRegSmileBeam style={{ marginRight: '3px' }} />
          FAVORITED ({ favoritedChatRooms.length })
        </span>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {this.renderFavoritedChatRooms(favoritedChatRooms)}
        </ul>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.user_reducer.currentUser
  }
}

export default connect(mapStateToProps)(Favorited);