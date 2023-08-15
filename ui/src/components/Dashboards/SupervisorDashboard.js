import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/auth';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import UnauthorizedPage from '../UnauthorizedPage';


const PanelContainer = styled.div`
  background-color: #c3eaf7;
  color: #fff;
  min-height: 100vh;
  padding: 20px;
`;

const ConversationCard = styled.div`
  background-color: #333;
  border: 1px solid #444;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 16px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  &:hover {
    background-color: #444;
    transform: scale(1.02);
  }
`;

const Email = styled.p`
  font-size: 18px;
  color: #ddd;
  margin: 0;
`;

const LastUpdated = styled.p`
  font-size: 14px;
  color: #999;
  margin: 0;
`;


function SupervisorDashboard() {
  const [conversations, setConversations] = useState([]);
  const { authToken, currentUser } = useContext(AuthContext); // get currentUser from context
  const navigate = useNavigate();

  // Check user role and redirect if not a supervisor
  useEffect(() => {
    if (currentUser.role !== 'supervisor') {
      navigate('/UnauthorizedPage'); // or wherever you want to redirect
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    axios.get('http://localhost:3000/chat/all-conversations', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    })
    .then(response => {
      setConversations(response.data.conversations);
    })
    .catch(error => {
      console.error('Error fetching conversations: ', error);
    });
  }, []);

  const handleChatSelect = (conversationId) => {
    // Navigate to the chat page with the selected conversationId
    navigate(`/chat/${conversationId}`);
  };

  return (
    <PanelContainer>
      {conversations.map((conversation, index) => (
        <ConversationCard key={index} onClick={() => handleChatSelect(conversation._id)}>
          <Email>Email: {conversation.userId.email}</Email>
          <LastUpdated>Last updated: {new Date(conversation.lastUpdated).toLocaleString()}</LastUpdated>
        </ConversationCard>
      ))}
    </PanelContainer>
  );
}

export default SupervisorDashboard;
