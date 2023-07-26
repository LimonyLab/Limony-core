import React, { useContext, useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button, Drawer, List, ListItem, ListItemIcon, ListItemText, useTheme, useMediaQuery } from '@mui/material';
import { AccountCircle as AccountCircleIcon, SupervisorAccount as SupervisorAccountIcon, Chat as ChatIcon, Dashboard as DashboardIcon, Menu as MenuIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { AuthContext, useAuth } from '../../context/auth';
import axios from "axios";


const drawerWidth = 240;

const HeaderAndDrawer = ({ children }) => {
    const { currentUser } = useAuth();
    const { authToken, setAuthToken } = useContext(AuthContext); // add setAuthToken

    // Determine which navigation items to show based on currentUser role
    const navItems = currentUser.role === 'supervisor' ? 
        ['Supervisor Dashboard'] : ['Chat', 'Dashboard'];

    const handleLogout = () => {
        axios.post('http://localhost:3000/users/logout', {}, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        })
        .then(() => {
            setAuthToken(null);
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
        })
        .catch(error => {
            console.log(error);
            // Handle error as needed
        })
    };

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawer = (
        <div>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'start', padding: '10px', fontSize: '24px'}}>
                    <Typography variant="h6">
                        LimonyAssistant
                    </Typography>
            </div>
            <List>
                {navItems.map((text, index) => {
                    const icon = text === 'Supervisor Dashboard' ? <DashboardIcon /> : 
                                text === 'Chat' ? <ChatIcon /> : <DashboardIcon />;
                    return (
                        <ListItem button key={text} component={Link} to={`/${text.toLowerCase().replace(' ', '-')}`}>
                            <ListItemIcon>{icon}</ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItem>
                    )
                })}
            </List>
        </div>
    );

    return (
        <>
        <AppBar position="static" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
            <Toolbar>
                {isMobile && (
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                )}
                <Typography variant="h8" style={{flexGrow: 1}}>
                    LimonyAssistant
                </Typography>
                <IconButton component={Link} to="/profile" color="inherit">
                    <AccountCircleIcon />
                </IconButton>
                <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </Toolbar>
        </AppBar>
        {isMobile ? (
            <Drawer
                variant="temporary"
                anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
            >
                {drawer}
            </Drawer>
        ) : (
            <Drawer variant="permanent" anchor="left" open>
                {drawer}
            </Drawer>
        )}
        <main style={{ marginLeft: !isMobile ? drawerWidth : '0' }}>
            {children}
        </main>
        </>
    );
};

export default HeaderAndDrawer;
