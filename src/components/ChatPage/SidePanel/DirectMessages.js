import React, { Component } from 'react';
import { FaRegSmile } from 'react-icons/fa';
import { connect } from 'react-redux';
import { getDatabase, ref, onChildAdded } from 'firebase/database';
export class DirectMessages extends Component {

  state = {
    usersRef: ref(getDatabase(), 'users'),
    users: [],
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

  renderUserLists = () => {

  }

  render() {
    const { users } = this.state;
    return (
      <div>
         <span style={{ display: 'flex', alignItems: 'center' }}>
            <FaRegSmile style={{ marginRight: 3 }} />  DIRECT MESSAGES(1)
          </span>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {this.renderUserLists()}
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