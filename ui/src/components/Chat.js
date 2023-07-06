import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';
import Box from '@mui/material/Box';
import ChatBox from './Chat/ChatBox';

const Chat = () => {
  const navigate = useNavigate();
  
  const { currentUser } = useAuth();

  console.log('currentUser is:::::: ', currentUser);
  console.log('current user email is:::: ', currentUser.email);

  useEffect(() => {
  if (!currentUser) {
      navigate('/login');
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
      <h1>Welcome to the Chat Page!</h1>
      {currentUser && <h2>Welcome, {currentUser.name}!</h2>}
      <ChatBox /> {/* Include the ChatBox component in the render method */}
    </Box>
  );
};



export default Chat;