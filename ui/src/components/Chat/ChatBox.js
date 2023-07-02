// src/components/Chat/ChatBox.js
import React, { useEffect, useState, useContext } from 'react';
import Message from './Message';
import SendMessageForm from './SendMessageForm';
import axios from 'axios';
import { AuthProvider, AuthContext } from '../../context/auth'; // Added AuthContext
import { useAuth } from '../../context/auth'; // Corrected path to useAuth
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import styled from 'styled-components';

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 80vh;
  overflow: auto;
  margin: 1em;
  padding: 1em;
  width:50%;
`;

const MessagesContainer = styled.div`
  flex-grow: 1;
  overflow: auto;
`;

function ChatBox() {
    const [messages, setMessages] = useState([]);
    const { authToken } = useContext(AuthContext);

    const navigate = useNavigate(); // Initialize useNavigate
    const { currentUser } = useAuth();

    console.log('currentUser is:::::: ', currentUser);

    useEffect(() => {
    if (!currentUser) {
        navigate('/login');
    }
    }, [currentUser, navigate]);



        
    useEffect(() => {
        axios.get('http://localhost:3000/chat/get-messages', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
            })
            .then(response => {
                setMessages(response.data);
            })
            .catch(error => {
                console.error('Error fetching messages: ', error);
            });
    }, []);
    

    const handleSend = (messageContent) => {
        axios.post('http://localhost:3000/chat/send-message', 
        {
            content: messageContent,
            // Add other data like the sender and timestamp if necessary
        },
        {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        })
        .then(response => {
            // You could optimistically add the new message to the UI here
            setMessages([...messages, response.data]);
        })
        .catch(error => {
            console.error('Error sending message: ', error);
        });
    };

    
    return (
        <ChatContainer>
            <MessagesContainer>
            {messages.map((message, index) => 
                <Message key={index} {...message} />
            )}
            </MessagesContainer>

            <SendMessageForm onSend={handleSend} />
      </ChatContainer>
    );
}

export default ChatBox;
