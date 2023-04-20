import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import Login from './login/login';
import Registro from './login/registro';
import Tabla from './tabla/tabla';
import Navbar from './tabla/Navbar';


const App = () => {
  
  return (
    <BrowserRouter>
      
  
      <Routes>
      
        <Route path="/" exact = "*" element={<Login />} />
        <Route path="/registro" exact = "*" element={<Registro />} />
        <Route path="/tabla" exact = "*" element={<Tabla />} />
        <Route path="/navbar" exact = "*" element={<Navbar />} />
       
      </Routes>
    </BrowserRouter>
  );
};

export default App;