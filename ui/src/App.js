import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";
import * as React from 'react';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Chat from './components/Chat';
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, AuthContext } from './context/auth';
import SupervisorPanel from './components/SupervisorPanel';
import UnauthorizedPage from './components/UnauthorizedPage';



function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );

  return (
    
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chat/:conversationId" element={<ChatWrapper />} />
           
            <Route
              path="/supervisor-panel"
              element={
                <AuthContext.Consumer>
                  {(context) => <SupervisorPanel user={context.user} />}
                </AuthContext.Consumer>
              }
            />
            <Route path="/" element={<Login />} />
            <Route path="/UnauthorizedPage" element={<UnauthorizedPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}



function ChatWrapper() {
  const { conversationId } = useParams(); // Access the conversationId from the path
  return (
    <AuthContext.Consumer>
      {(context) => <Chat conversationId={conversationId} />}
    </AuthContext.Consumer>
  );
}

export default App;