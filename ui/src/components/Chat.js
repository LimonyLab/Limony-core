import React, { useEffect } from 'react';
import { useAuth } from '../context/auth';
import { useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';

function Chat() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
      {user && <h2>Welcome, {user.email}!</h2>}
      <Button variant="outlined" onClick={handleLogout}>Log out</Button>
    </Box>
  );
}

export default Chat;
