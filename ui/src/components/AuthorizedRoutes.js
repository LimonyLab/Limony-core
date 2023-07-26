import { Routes, Route, useParams } from "react-router-dom";
import Dashboard from './Dashboards/Dashboard';
import Chat from './Chat';
import { AuthProvider, AuthContext } from '../context/auth';
import SupervisorDashboard from './Dashboards/SupervisorDashboard';
import HeaderAndDrawer from './Commons/HeaderAndDrawer';
import ProtectedRoute from './ProtectedRoute'; 

import Register from './Register';
import Login from './Login';

const AuthorizedRoutes = () => {
  return (
    <AuthProvider>
      <HeaderAndDrawer>
        <Routes>
          <ProtectedRoute path="/dashboard" element={<Dashboard />} />
          <ProtectedRoute path="/chat/:conversationId" element={<ChatWrapper />} />
          <ProtectedRoute path="/chat/" element={<Chat />} />

          <ProtectedRoute path="/register" element={<Register />} />
          <ProtectedRoute path="/login" element={<Login />} />
          <ProtectedRoute path="/" element={<Login />} />

          <ProtectedRoute
            path="/supervisor-dashboard"
            element={
              <AuthContext.Consumer>
                {(context) => <SupervisorDashboard user={context.user} />}
              </AuthContext.Consumer>
            }
          />
        </Routes>
      </HeaderAndDrawer>
    </AuthProvider>
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

export default AuthorizedRoutes;
