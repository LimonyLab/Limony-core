import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';
import Box from '@mui/material/Box';
import SupervisorChatBox from './Chat/SupervisorChatBox';
import { useParams } from 'react-router-dom';

const Chat = () => {
  const navigate = useNavigate();
  const { conversationId } = useParams();  // get the conversationId from the URL
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } else if (currentUser.role !== 'supervisor') {
      navigate('/UnauthorizedPage'); // replace this with the path you want to redirect to
    }
  }, [currentUser, navigate]);
  
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
      {currentUser && <h2>Welcome, {currentUser.name}!</h2>}
      <SupervisorChatBox conversationId={conversationId} /> {/* Include the ChatBox component in the render method */}
    </Box>
  );
};

export default Chat;
