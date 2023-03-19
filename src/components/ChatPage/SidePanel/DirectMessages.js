import React, { Component } from 'react';
import { FaRegSmile } from 'react-icons/fa';
import { connect } from 'react-redux';
import { getDatabase, ref, onChildAdded, DataSnapshot } from 'firebase/database';

export class DirectMessages extends Component {

  state = {
    usersRef: ref(getDatabase(), 'users'),
    users: [],
  }

  componentDidMount() {
    if (this.props.user) {
      this.addUsersListeners(this.props.user.uid);
    }
  }

  addUsersListeners = (currentUserId) => {
    const { usersRef } = this.state;
    let usersArray = [];

    onChildAdded(usersRef, DataSnapshot => {
      if (currentUserId !== DataSnapshot.key) {
        let user = DataSnapshot.val();
        user['uid'] = DataSnapshot.key;
        user['status'] = 'offline';
        usersArray.push(user);
        this.setState({ users: usersArray });
      }
    });
  }

  renderDirectMessages = (users) => {
    console.log('users 출력', users);
  }

  render() {
    const { users } = this.state;
    return (
      <div>
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <FaRegSmile style={{ marginRight: 3 }}/> DIRECT MESSAGES (1)
        </span>        
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {this.renderDirectMessages(users)}
        </ul>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.user.currentUser
  }
}

export default connect(mapStateToProps)(DirectMessages);