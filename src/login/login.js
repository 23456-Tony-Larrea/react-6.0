import React,{useState} from 'react'
import{Grid, Container, Paper, Avatar, Typography,TextField,Button} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import fondo from '../assets/images/fondo.png'
import { LockOutlined as LockOutlinedIcon } from '@mui/icons-material'
import Swal from 'sweetalert2';
import axios from '../axios/axios'
import { useNavigate } from 'react-router-dom';

  const useStyles=makeStyles(theme=>({
  root:{
       backgroundImage: `url(${fondo})`,
       backgroundRepeat: 'no-repeat',
       backgroundSize: 'cover',
       backgroundPosition: 'center',
       height:'100vh'

  },
  container:{
    opacity: '0.8',
    height: '70%',
    marginTop: theme.spacing(10),
    [theme.breakpoints.down(400 + theme.spacing(2)+2)]:{
      marginTop:0,
      width:'100%',
      height: '100%'
    }
  },
  div: {
    marginTop:theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center '
  },
  avatar:{
    margin:theme.spacing(1),
    backgroundColor:theme.palette.secondary.main
  },
  form: {
   width:'100%',
   marginTop: theme.spacing(1)
  },
  button:{
    margin:theme.spacing(3, 0, 2)
  }
}))

const Login= () => {

const [email, setemail] = useState('')
const [password, setPassword] = useState('')
const navigate = useNavigate();


const handleSingIn = async () => {
  const url = '/auth/login'
  const body = {
    email,
    password
  }
  try{
    const res = await axios.post(url, body)
    console.log(res)
    if(res.data.status === 500 || res.data.status === 401){
      Swal.fire({
        icon: 'error',
        title: 'Login incorrecto',
        text: res.data.message
      })
    }else{
      Swal.fire({
        icon: 'success',
        title: 'Login correcto',
        text: res.data.message
        
      })
      const token = res.data.access_token
      localStorage.setItem('access_token', token)
    navigate("/tabla")
    }
  }catch(error){
    console.log(error)
    Swal.fire({
      icon: 'error',
      title: 'Login incorrecto',
      text: 'Contraseña incorrecta'
    })
  }
}
const handleregistro = () => {
    navigate("/registro");
  };

  const classes= useStyles()
  return (
   <Grid container component ='main'className={classes.root}>
    <Container component={Paper} elevation={5} maxWidth='xs' className={classes.container}>
      <div className={classes.div}>
        <Avatar className={classes.avatar}>
         <LockOutlinedIcon/>
        </Avatar>
        <Typography component='h1' variant='h5'>Sing In</Typography>
        <form className={classes.form}>
         <TextField 
         fullWidth
         autoFocus
         color='primary'
         margin='normal'
         variant='outlined'
         label='Email'
         name="email"
         onChange={(e) => setemail(e.target.value)}
         >
        
         </TextField>
         <TextField 
         fullWidth
         type='password'
         color='primary'
         margin='normal'
         variant='outlined'
         label='Password'
         onChange={(e) => setPassword(e.target.value)}
         >
        
         </TextField>
         <Button
        fullWidth
        variant='contained'
        color='secondary'
        className={classes.button}
        onClick={handleSingIn}
         >
          sing in
         </Button>
         <Button
        fullWidth
        variant='contained'
        color='secondary'
        className={classes.button}
        onClick={handleregistro}
         >
          Registro
         </Button>
        </form>
      </div>
    </Container>
    </Grid>
  )
}

export default Login