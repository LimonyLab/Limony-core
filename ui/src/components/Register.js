import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import { useAuth } from '../context/auth';
import { useNavigate, Link } from 'react-router-dom'; 


const Register = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate(); 

    useEffect(() => {
        if (currentUser) {
            if (currentUser.role === "employee") {
                navigate('/dashboard');
            } else if (currentUser.role === "supervisor") {
                navigate('/supervisor-dashboard');
            }
        }
    }, [currentUser, navigate]);
    
    const [user, setUser] = useState({
        email: "",
        password: "",
        profile: {
            name: "",
            age: null
        },
        healthInfo: {
            bloodPressure: {
                systolic: null,
                diastolic: null
            },
            overallHealthStatus: ""
        }
    });

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        const keys = name.split('.');
        console.log(`keys are ${keys}`);
        
        if (keys.length === 1) {
            //console.log('Handle single-level keys')
            // Handle single-level keys
            setUser(prevState => ({ ...prevState, [name]: value }));
        } else if (keys.length === 2) {
            //console.log('Handle two-level nested keys')
            // Handle two-level nested keys
            const [parent, child] = keys;
            setUser(prevState => ({
                ...prevState,
                [parent]: {
                    ...prevState[parent],
                    [child]: child === "age" ? parseInt(value, 10) : value
                }
            }));
        } else if (keys.length === 3) {
            //console.log('Handle three-level nested keys')
            // Handle three-level nested keys
            const [parent, child, grandChild] = keys;
            setUser(prevState => ({
                ...prevState,
                [parent]: {
                    ...prevState[parent],
                    [child]: {
                        ...prevState[parent][child],
                        [grandChild]: Number(value)
                    }
                }
            }));
        }
    };
    
      
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/users/register', user);
            console.log(response.data); // Handle response here
            if(response.data) {
                setSuccessMessage('Registration successful.');
                setErrorMessage(''); // Resetting error message in case it was set due to previous error
                setUser({
                    email: "",
                    password: "",
                    profile: {
                        name: "",
                        age: null
                    },
                    healthInfo: {
                        bloodPressure: {
                            systolic: null,
                            diastolic: null
                        },
                        overallHealthStatus: ""
                    }
                }); // Resetting the form to initial state
            }
        } catch (error) {
            // If registration fails, display an error message
            console.error(error);
            setErrorMessage(`${error.message} <Disable this warning for production deployement>`);
            setSuccessMessage(''); // Resetting success message in case it was set due to previous successful registration
        }
    };
    
    

    return (
        <Container component="main" maxWidth="xs">
            <Typography variant="h6" color="textSecondary" align="center" style={{ marginTop: '1em', marginBottom: '1em' }} gutterBottom>
                Please register using the email you would like to receive support on.
            </Typography>
            
        <Paper elevation={3} style={{ padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography component="h1" variant="h5">
                Register
            </Typography>
            <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: 8 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            name="email"
                            variant="outlined"
                            required
                            fullWidth
                            label="Email Address"
                            type="email"
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name="password"
                            variant="outlined"
                            required
                            fullWidth
                            label="Password"
                            type="password"
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name="profile.name"
                            variant="outlined"
                            required
                            fullWidth
                            label="Name"
                            type="text"
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name="profile.age"
                            variant="outlined"
                            required
                            fullWidth
                            label="Age"
                            type="number"
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            name="healthInfo.bloodPressure.systolic"
                            variant="outlined"
                            required
                            fullWidth
                            label="Systolic"
                            type="number"
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            name="healthInfo.bloodPressure.diastolic"
                            variant="outlined"
                            required
                            fullWidth
                            label="Diastolic"
                            type="number"
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name="healthInfo.overallHealthStatus"
                            variant="outlined"
                            required
                            fullWidth
                            label="Overall Health Status"
                            type="text"
                            onChange={handleChange}
                        />
                    </Grid>
                </Grid>
                {/* Other input fields here */}
        {successMessage && 
          <Alert severity="success" onClose={() => setSuccessMessage('')}>
            {successMessage}
          </Alert>
        }
        {errorMessage && 
          <Alert severity="error" onClose={() => setErrorMessage('')}>
            {errorMessage}
          </Alert>
        }
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    style={{ marginTop: 16 }}
                >
                    Register
                </Button>
                
            </form>
            <Grid item xs={12} style={{ marginTop: '10px' }}>
                    <Typography align="center">
                        Already have an account? <Link to="/login">Login</Link>
                    </Typography>
            </Grid>
        </Paper>
    </Container>
    );
};

export default Register;
