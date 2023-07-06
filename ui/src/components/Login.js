import React, { useState, useContext } from "react";
import axios from "axios";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom'; 
import { AuthContext } from '../context/auth';


const Login = () => {
    const { setAuthToken, setCurrentUser } = useContext(AuthContext);
    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const navigate = useNavigate(); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prevState => ({
            ...prevState,
            [name]: value
        }));
    };


    const login = (email, password) => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await axios.post("http://localhost:3000/users/login", { email, password });
                // Set auth token in local storage and context

                console.log("this is the user data returned...:");
                console.log(response);

                const { token, user } = response.data; // Assuming user data is also returned
                localStorage.setItem("jwtToken", token);
                localStorage.setItem("user", JSON.stringify(user)); // store user data
                setAuthToken(token);
                setCurrentUser(user); // set user data in context
                resolve();
    
            } catch (error) {
                reject(error);
            }
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
    
        login(form.email, form.password)
          .then(() => {
            setSuccessMessage("Login successful!");
            navigate('/dashboard'); 
          })
          .catch((error) => {
            setErrorMessage("Login failed!");
            console.error(error);
          });
    };
    

    const successAlert = successMessage ? <Alert severity="success">{successMessage}</Alert> : null;
    const errorAlert = errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null;

    return (
        <Container component="main" maxWidth="xs">
            {successAlert}
            {errorAlert}
            <Paper
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: 2,
                }}
            >
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                value={form.email}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                autoComplete="current-password"
                                value={form.password}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                            >
                                Sign In
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
};

export default Login;
