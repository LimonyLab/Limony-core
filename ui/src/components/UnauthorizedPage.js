import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';
import styled from 'styled-components';


const UnauthorizedContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #0d2154; // a bold red background
`;

const UnauthorizedText = styled.h1`
  font-size: 3rem;
  color: #ffffff; // white text
  text-align: center;
  width: 100%; // Add this line
`;


const UnauthorizedDescription = styled.p`
  font-size: 1.2rem;
  color: #ffffff; // white text
  text-align: center;
  margin-top: 1rem;
  width: 100%; // Add this line
`;

const UnauthorizedPage = () => {
    const navigate = useNavigate();

    console.log('We are in unauthorized Page...');

    const { currentUser } = useAuth();

    useEffect(() => {
    if (!currentUser) {
        navigate('/login');
    }
    }, [currentUser, navigate]);

    return (
        <UnauthorizedContainer>
          <UnauthorizedText>403 Unauthorized
          <UnauthorizedDescription>You do not possess the enough privileges to view this page.</UnauthorizedDescription>

          </UnauthorizedText>
        </UnauthorizedContainer>
    );
};



export default UnauthorizedPage;

