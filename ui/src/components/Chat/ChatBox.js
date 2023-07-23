// src/components/Chat/ChatBox.js
import React, { useEffect, useState, useContext, useRef } from 'react';
import MyMessage from './MyMessage';
import SupervisorMessage from './SupervisorMessage';
import SendMessageForm from './SendMessageForm';
import axios from 'axios';
import { AuthProvider, AuthContext } from '../../context/auth'; // Added AuthContext
import { useAuth } from '../../context/auth'; // Corrected path to useAuth
import { useNavigate, useParams } from 'react-router-dom'; // Import useNavigate
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

let ws;

function ChatBox() {
    const [messages, setMessages] = useState([]);
    const { authToken } = useContext(AuthContext);

    // Declare sender and receiver of the message as well as the conversationId
    let { conversationId } = useParams();
    const { currentUser } = useAuth();
    const [receiver, setReceiver] = useState('');

    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
      if (!currentUser) {
          navigate('/login');
      }
    }, [currentUser, navigate]);

    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        // Fetching the messages from the server
        axios.get(`http://localhost:3000/chat/get-messages?conversationId=${conversationId}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
            })
            .then(response => {
                setMessages(response.data.conversation);
                console.log("Lets look at response.data: ", response.data);
                console.log("Lets look at currentUser.id: ", currentUser.id);
                if (response.data.userId === currentUser.id) {
                  setReceiver("supervisor@supervisor.com");
                } else {
                  setReceiver(response.data.userId);
                }
            })
            .catch(error => {
                console.error('Error fetching messages: ', error);
            });
    }, []);

    useEffect(() => {
      if (receiver && currentUser) {
          console.log('////////// Creating a new websocket with receiver: ' + receiver);
          ws = new WebSocket(`ws://localhost:3000/chat-socket?conversationId=${conversationId}&sender=${currentUser.id}&receiver=${JSON.stringify(receiver)}`);
      
          ws.onopen = () => {
            // Connection is opened
            console.log('WebSocket connection open');
          };
      
          ws.onmessage = (message) => {
            console.log(message);
            const newMessage = JSON.parse(message.data);
            setMessages((prevMessages) => [...prevMessages, newMessage]);
          };
      
          ws.onerror = (error) => {
            // Error occurred
            console.error('WebSocket error: ', error);
          };
      
          ws.onclose = () => {
              // Connection is closed
              ws.close();
              console.log('WebSocket connection closed');
          };
      
          return () => {
            // Clean up the WebSocket connection when the component unmounts
            ws.close();
          };
        }
    }, [receiver]);
  

    useEffect(scrollToBottom, [messages]);

  
    const handleSend = (messageContent) => {
        // Sending a new message using the WebSocket connection
        console.log(`Sending message with conversationId: ${conversationId}, content: ${messageContent}, sender: ${currentUser.email}, receiver: ${receiver}`)
        const message = {
          conversationId: conversationId,
          content: messageContent,
          sender: currentUser.email,
          receiver: receiver,
        };
        ws.send(JSON.stringify(message));
        
        // Optimistically adding the new message to the UI here
        const newUIMessage = {
          content: messageContent,
          sender: currentUser.email,
          createdAt: new Date(),
        };
        setMessages((prevMessages) => [...prevMessages, newUIMessage]);
    };
    
      
    
    return (
        <ChatContainer>
            <MessagesContainer>
                {messages.map((message, index) => 
                    message.sender === 'supervisor@supervisor.com'
                    ? <SupervisorMessage key={index} {...message} />
                    : <MyMessage key={index} {...message} />
                )}
                <div ref={messagesEndRef} />
            </MessagesContainer>

            <SendMessageForm onSend={handleSend} />
      </ChatContainer>
    );
    
}

export default ChatBox;
