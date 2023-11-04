import React, { useEffect, useState } from "react";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import { auth, logInWithEmailAndPassword, signInWithGoogle, logout } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import Badge from '@mui/material/Badge';
import toast, { Toaster } from 'react-hot-toast';
import useMediaQuery from '@mui/material/useMediaQuery';

// const notify = () => toast('Here is your toast.');

const pages = ['waitingcourse', 'todaycourscomfirme', 'todaycours', 
"ancienscours","allcanceledcours",
"profs", "clients",'InscritNotComplet', "package","kpi"];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout', ];

const ResponsiveAppBar = () => {

  
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user) navigate("/");
  }, [user, loading]);

  const isMobile = useMediaQuery('(max-width:600px)');
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const goToClients = () => {
    navigate("/clients");
  };


  const goToPackage = () => {
    navigate("/package");
  };

  const goToCommandes = () => {
    navigate("/commands");
  };



  const goToProfs = () => {
    navigate("/profs");
  };

  const goToWaitingCourses = () => {

    navigate("/waitingcourse")
  }

  const goTodyCoursComfirme = () => {

    navigate("/todaycourscomfirme")
  }

  const goToAncienCours = () => {

    navigate("/ancienscours")
  }

  const goToAllCoursCanceled = () => {

    navigate("/allcanceledcours")
  }

  const goTodyCours = () => {

    navigate("/todaycours")
  }

  // InscritNotComplet
  const goToInscritNotComplet = () => {
    navigate("/Inscritnotcomplet")
  }
  

  const goTokpi = () => {

    navigate("/kpi")
  }




  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: isMobile ? 1 : 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            MajorApp
          </Typography>
          <Box sx={{ flexGrow: 1, display: 'flex'}}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
  id="menu-appbar"
  anchorEl={anchorElNav}
  anchorOrigin={{
    vertical: 'bottom',
    horizontal: 'left',
  }}
  keepMounted
  transformOrigin={{
    vertical: 'top',
    horizontal: 'left',
  }}
  open={Boolean(anchorElNav)}
  onClose={handleCloseNavMenu}
  sx={{
    display: { xs: 'block', md: 'none' },
  }}
>
  {pages.map((page, index) => (
    <MenuItem key={index} onClick={handleCloseNavMenu} component={Link} to={`/${page.toLowerCase()}`}>
      {page}
    </MenuItem>
  ))}
  {/* {user ? (
    <>
      {settings.map((setting, index) => (
        <MenuItem key={index} onClick={handleCloseNavMenu} component={Link} to={`/${setting.toLowerCase()}`}>
          {setting}
        </MenuItem>
      ))}
    </>
  ) : (
    <>
      <MenuItem onClick={handleCloseNavMenu} component={Link} to="/login">
        Log In
      </MenuItem>
      <MenuItem onClick={handleCloseNavMenu} component={Link} to="/signup">
        Sign Up
      </MenuItem>
    </>
  )} */}
</Menu>
          </Box>
     
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            MajorApp
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>

          <Button 
                onClick={goTokpi}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                KPI
          </Button>
          <Button 
                onClick={goToWaitingCourses}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Cours en attente d'attribution
          </Button>

        
          <Button 
            onClick={goTodyCoursComfirme}
            sx={{ my: 2, color: 'white', display: 'block' }}>
            Cours Comfirmés
          </Button> 


          <Button 
            onClick={goTodyCours}
            sx={{ my: 2, color: 'white', display: 'block' }}>   
            Cours Aujourd'hui
          </Button> 

          <Button 
            onClick={goToAncienCours}
            sx={{ my: 2, color: 'white', display: 'block' }}>   
            Anciens cours
          </Button> 


{/* 
          <Button 
            onClick={goToAllCoursCanceled}
            sx={{ my: 2, color: 'white', display: 'block' }}>   
            Cours annulés
          </Button>  */}
  
          <Button 
            onClick={goToProfs}
            sx={{ my: 2, color: 'white', display: 'block' }}>
            Profs
          </Button>

            <Button 
               onClick={goToClients}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Clients
              </Button>

              <Button 
               onClick={goToPackage}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
              package
              </Button>

             <Button 
               onClick={goToInscritNotComplet}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
               Inscrit NotComplet
              </Button> 
          </Box>

          <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
          // onClick={notify} 
        >
          {/* <Badge badgeContent={17} color="error">
            <NotificationsIcon  />
          </Badge> */}
    
        </IconButton>
        
      </MenuItem>

          <Box sx={{ flexGrow: 0 }}>
          
          { user &&
         <button className="login__btn login__google" onClick={logout}>
             Logout with Google
         </button>}

         { !user &&
         <button className="login__btn login__google" onClick={signInWithGoogle}>
           Login with Google
         </button>}
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;


