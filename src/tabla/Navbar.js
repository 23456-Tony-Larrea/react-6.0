import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useNavigate } from 'react-router-dom';
import axios from "../axios/axios";

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: theme.palette.primary.main,
  },
  title: {
    flexGrow: 1,
  },
}));

const Navbar = () => {
     // expire token
 const token = localStorage.getItem("access_token");

 axios.interceptors.request.use(
   (config) => {
     config.headers.authorization = `Bearer ${token}`;
     return config;
   },
   (error) => {
     if (error.response.status === 401) {
       localStorage.removeItem("token");
     }
   }
 );
  
  const classes = useStyles();
  const navigate = useNavigate();


  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout");
      // redirigir a la página de login
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AppBar position="static" className={classes.appBar}>
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          Test
        </Typography>
        <Button color="inherit" onClick={handleLogout}>
          Salir
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;