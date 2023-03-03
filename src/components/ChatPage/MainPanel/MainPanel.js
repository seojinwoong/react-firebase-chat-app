import React, { Component } from 'react';
import MessageHeader from './MessageHeader';
import MessageForm from './MessageForm';
import Message from './Message';
import { connect } from 'react-redux';
import { getDatabase, ref, onChildAdded, child } from 'firebase/database';

export class MainPanel extends Component {
  state = {
    messages: [],
    messagesRef: ref(getDatabase(), 'messages'),
    messagesLoading: true,
    searchTerm: '',
    searchResults: [],
    searchLoading: false,
  }

  componentDidMount() {
    const { chatRoom } = this.props;
    if (chatRoom) {
      this.addMessagesListeners(chatRoom.id);      
    }
  }

  addMessagesListeners = (chatRoomId) => {
    let messagesArray = [];
    let { messagesRef } = this.state;

    onChildAdded(child(messagesRef, chatRoomId), DataSnapshot => {
      messagesArray.push(DataSnapshot.val());
      this.setState({
        messages: messagesArray,
        messagesLoading: false
      })

    })
  }

  handleSearchChange = (event) => {
    this.setState({
      searchTerm: event.target.value,
      searchLoading: true
    }, () => this.handleSearchMessages())
  }

  handleSearchMessages = () => {
    const chatRoomMessages = [...this.state.messages];
    const regex = new RegExp(this.state.searchTerm, 'gi');
    const searchResults = chatRoomMessages.reduce((acc, message) => {
      if (
        (message.content && message.content.match(regex)) ||
        message.user.name.match(regex) 
      ) {
        acc.push(message);
      }
      return acc;
    }, []);
    this.setState({ searchResults });
  }

  renderMessage = (messages) => 
    messages.length > 0 &&
    messages.map(message => (
      <Message
        key={message.timestamp}
        message={message}
        user={this.props.user}
      />
    ))

  render() {
    const { messages, searchTerm, searchResults } = this.state;
    return (
     <div style={{ padding: '2rem 2rem 0 2rem' }}>
        <MessageHeader handleSearchChange={this.handleSearchChange}/>
        <div style={{
          width: '100%',
          height: '450px',
          border: '.2rem solid #ececec',
          borderRadius: '4px',
          padding: '1rem',
          marginBottom: '1rem',
          overflowY: 'auto'
        }}>
          {
            searchTerm 
            ? this.renderMessage(searchResults)
            : this.renderMessage(messages)
          }
        </div>
        <MessageForm />
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

export default connect(mapStateToProps)(MainPanel);