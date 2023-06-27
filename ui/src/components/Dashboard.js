import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';

const Dashboard = () => {
    const navigate = useNavigate();

    const { currentUser } = useAuth();

    useEffect(() => {
    if (!currentUser) {
        navigate('/login');
    }
    }, [currentUser, navigate]);



    return (
        <div>
        {/* Your dashboard content */}
        </div>
    );
};

export default Dashboard;
