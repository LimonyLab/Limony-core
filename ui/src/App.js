import { AuthContext } from './context/auth';
import { useParams } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import * as React from 'react';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboards/Dashboard';
import Chat from './components/Chat';
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './context/auth';
import SupervisorDashboard from './components/Dashboards/SupervisorDashboard';
import UnauthorizedPage from './components/UnauthorizedPage';
import HeaderAndDrawer from './components/Commons/HeaderAndDrawer';

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
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="*" element={
              <HeaderAndDrawer>
                <Routes>
                  <Route path="/dashboard" element={<ProtectedComponent Component={Dashboard} />} />
                  <Route path="/chat/:conversationId" element={<ProtectedComponent Component={ChatWrapper} />} />
                  <Route path="/chat" element={<ProtectedComponent Component={Chat} />} />
                  <Route path="/supervisor-dashboard" element={<ProtectedComponent Component={SupervisorDashboard} />} />
                </Routes>
              </HeaderAndDrawer>
            }/>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

function ProtectedComponent({ Component }) {
  const auth = useAuth();
  if (auth.currentUser) {
    return <Component />;
  } else {
    return <Navigate to="/unauthorized" />;
  }
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
