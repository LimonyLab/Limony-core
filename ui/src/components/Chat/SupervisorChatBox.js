// src/components/Chat/SupervisorChatBox.js
import React, { useEffect, useState, useContext } from 'react';
import MyMessage from './MyMessage';
import SupervisorMessage from './SupervisorMessage';
import SendMessageForm from './SendMessageForm';
import axios from 'axios';
import { AuthProvider, AuthContext } from '../../context/auth'; // Added AuthContext
import { useAuth } from '../../context/auth'; // Corrected path to useAuth
import { useNavigate } from 'react-router-dom'; // Import useNavigate
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

    const navigate = useNavigate(); // Initialize useNavigate
    const { currentUser } = useAuth();

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
                //console.log('#### The received messages are: ', response.data.conversation)
                setMessages(response.data.conversation);
            })
            .catch(error => {
                console.error('Error fetching messages: ', error);
            });
    }, []);
    

    const handleSend = (messageContent) => {
        console.log('Our authorization bearer token is: ', authToken);
        axios.post(`http://localhost:3000/chat/new-message/${conversationId}`, 
        {
            content: messageContent,
            sender: currentUser.email, // added sender field
        },
        {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        })
        .then(response => {
            // You could optimistically add the new message to the UI here
            const newMessage = {
              content: messageContent,
              sender: currentUser.email,
              createdAt: new Date(), // added timestamp
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
            </MessagesContainer>
            <SendMessageForm onSend={handleSend} />
      </ChatContainer>
    );
}

export default SupervisorChatBox;