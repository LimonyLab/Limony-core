// src/components/Chat/ChatBox.js
import React, { useEffect, useState, useContext, useRef } from 'react';
import MyMessage from './MyMessage';
import OtherMessage from './OtherMessage';
import SendMessageForm from './SendMessageForm';
import axios from 'axios';
import { AuthProvider, AuthContext } from '../../context/auth'; 
import { useAuth } from '../../context/auth'; 
import { useNavigate, useParams } from 'react-router-dom'; 
import styled from 'styled-components';

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 280vh;
  overflow: auto;
  margin: 1em;
  padding: 1em;
  width:70%;
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

    if (conversationId === undefined) {
      conversationId = currentUser.conversationId;
    }

    useEffect(() => {
      if (!currentUser) {
        navigate('/login');
      }
      if ((conversationId != currentUser.conversationId) && (currentUser.role === 'employee')) {
          navigate('/unauthorized');
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
              console.log("The following is our conversation...: ")
              console.log(response.data.conversation);
              console.log("Lets look at response.data: ", response.data);
              console.log("Lets look at currentUser: ", currentUser);
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
          ws = new WebSocket(`ws://localhost:3000/chat-socket?conversationId=${conversationId}&senderId=${currentUser.id}`);
      
          ws.onopen = () => {
            // Connection is opened
            // Trying to authenticate the user in the first message here;
            const message = {
              token: authToken
            };
            ws.send(JSON.stringify(message));
          };
      
          ws.onmessage = (message) => {
            console.log(message);
            const newMessage = JSON.parse(message.data);
            newMessage.createdAt = new Date();
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
        const message = {
          conversationId: conversationId,
          content: messageContent, 
        };
        ws.send(JSON.stringify(message));
        
        // Optimistically adding the new message to the UI here
        const newUIMessage = {
          content: messageContent,
          senderId: currentUser.id,
          senderName: currentUser.name,
          createdAt: new Date(),
        };
        setMessages((prevMessages) => [...prevMessages, newUIMessage]);
    };
    
      
    
    return (
        <ChatContainer>
            <MessagesContainer>
                {messages.map((message, index) => 
                    message.senderId === currentUser.id
                    ? <OtherMessage key={index} {...message}/>
                    : <MyMessage key={index} {...message}/>
                )}
                <div ref={messagesEndRef} />
            </MessagesContainer>

            <SendMessageForm onSend={handleSend} />
      </ChatContainer>
    );
    
}

export default ChatBox;
