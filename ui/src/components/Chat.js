import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/auth';
import Box from '@mui/material/Box';
import ChatBox from './Chat/ChatBox';

const Chat = () => {
  const navigate = useNavigate();
  const { conversationId } = useParams(); 
  const { currentUser } = useAuth();
  


  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } 
  }, [currentUser, navigate, conversationId]);


  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh'
      }}
    >
      
      <ChatBox conversationId={conversationId} /> {/* Include the ChatBox component in the render method */}
    </Box>
  );
};



export default Chat;