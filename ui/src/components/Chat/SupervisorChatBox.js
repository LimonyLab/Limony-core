// src/components/Chat/SupervisorChatBox.js
import React, { useEffect, useState, useContext, useRef } from 'react'; // Import useRef
import MyMessage from './MyMessage';
import SupervisorMessage from './SupervisorMessage';
import SendMessageForm from './SendMessageForm';
import axios from 'axios';
import { AuthProvider, AuthContext } from '../../context/auth';
import { useAuth } from '../../context/auth';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 280vh;
  overflow: auto;
  margin: 1em;
  padding: 1em;
  width:50%;
`;

const MessagesContainer = styled.div`
  flex-grow: 1;
  overflow: auto;
`;

function SupervisorChatBox({ conversationId }) {
    const [messages, setMessages] = useState([]);
    const { authToken } = useContext(AuthContext);

    const navigate = useNavigate();
    const { currentUser } = useAuth();
    
    const messagesEndRef = useRef(null) // Create a ref

    const scrollToBottom = () => { // Function to scroll to the bottom
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
        }
    }, [currentUser, navigate]);

    useEffect(() => {
        axios.get(`http://localhost:3000/chat/get-messages/${conversationId}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
            })
            .then(response => {
                setMessages(response.data.conversation);
            })
            .catch(error => {
                console.error('Error fetching messages: ', error);
            });
    }, []);

    useEffect(scrollToBottom, [messages]); // Call scrollToBottom each time messages updates

    const handleSend = (messageContent) => {
        console.log('Our authorization bearer token is: ', authToken);
        axios.post(`http://localhost:3000/chat/new-message/${conversationId}`, 
        {
            content: messageContent,
            sender: currentUser.email,
        },
        {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        })
        .then(response => {
            const newMessage = {
              content: messageContent,
              sender: currentUser.email,
              createdAt: new Date(),
            };
            setMessages([...messages, newMessage]);
        })
        .catch(error => {
            console.error('Error sending message: ', error);
        });
    };
    

    console.log("This is the exact messages: ", messages);
    return (
        <ChatContainer>
            <MessagesContainer>
                {messages.map((message, index) => 
                    message.sender === 'supervisor@supervisor.com'
                    ? <SupervisorMessage key={index} {...message} />
                    : <MyMessage key={index} {...message} />
                )}
                <div ref={messagesEndRef} /> {/* Add a ref to an empty div at the end of messages */}
            </MessagesContainer>
            <SendMessageForm onSend={handleSend} />
      </ChatContainer>
    );
}

export default SupervisorChatBox;
