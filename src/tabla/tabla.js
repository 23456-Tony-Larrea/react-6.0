import React, { useState, useEffect } from "react";
import axios from "../axios/axios";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Swal from "sweetalert2";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { AddCircleOutline, Edit, Delete } from '@material-ui/icons';
import Pagination from '@mui/material/Pagination';
import Navbar from "./Navbar";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  center: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

const App = () => {

  
  const classes = useStyles();
  const [usuarios, setUsuarios] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editedUser, setEditedUser] = useState({ email: "", name: "", password: "" });
  const [accion, setAccion] = useState("agregar");
const [editModalOpen, setEditModalOpen] = useState(false);
const [editedUserId, setEditedUserId] = useState("");
const [currentPage, setCurrentPage] = useState(1);
const PER_PAGE = 4; 
const indexOfLastUsuario = currentPage * PER_PAGE;
const indexOfFirstUsuario = indexOfLastUsuario - PER_PAGE;
const currentUsuarios = usuarios.slice(indexOfFirstUsuario, indexOfLastUsuario);



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
  
  useEffect(() => {
    getUsuarios();
  }, []);
  const handleAddUserClick = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const getUsuarios = async () => {
    try {
      const res = await axios.get("/user");
      setUsuarios(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const agregarUsuario = async () => {
    try {
      await axios.post("/user", editedUser);
      Swal.fire("Usuario agregado", "", "success");
      setUsuarios([...usuarios, editedUser]);
      setEditedUser({ email: "", name: "", password: "" });
      setOpenModal(false);
    } catch (error) {
      console.log(error);
    }
  };
  

  const eliminarUsuario = async (id) => {
    console.log(id);
    try {
      await axios.delete(`/user/${id}`);
      Swal.fire("Usuario eliminado", "", "success");
      setUsuarios(usuarios.filter((usuario) => usuario.id !== id));
      console.log("userId",usuarios.id)
    } catch (error) {
      console.log(error);
    }
  };

  const actualizarUsuario = async () => {
    try {
      await axios.put(`/user/Data/${editedUser.id}`, editedUser);
      Swal.fire("Usuario actualizado", "", "success");
      setUsuarios(
        usuarios.map((u) => (u.id === editedUser.id ? editedUser : u))
      );
      setAccion("agregar");
      handleCloseEditModal();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (accion === "agregar") {
      agregarUsuario();
    } else {
      actualizarUsuario();
    }
  };

  // función para abrir el modal de edición
const handleEdit = (id) => {
  setEditedUser(usuarios.find((usuario) => usuario.id === id));
  setEditedUserId(id);
  setAccion("editar");
  setEditModalOpen(true);
};
const handleCloseEditModal = () => {
  setEditModalOpen(false);
  setEditedUserId("");
  setEditedUser({ id: "", email: "", name: "", password: "" });
};
  return (
    <div>
      <Navbar/>
      <form onSubmit={handleSubmit}>
        <h1>Lista de usuarios</h1>
        <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Id</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Password</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentUsuarios.map((usuario, index) => (
              <TableRow key={usuario.id}>
                <TableCell component="th" scope="row">
                  {index + 1 + (currentPage - 1) * PER_PAGE}
                </TableCell>
                <TableCell>{usuario.id}</TableCell>
                <TableCell>{usuario.email}</TableCell>
                <TableCell>{usuario.name}</TableCell>
                <TableCell>{usuario.password}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEdit(usuario.id)}
                    startIcon={<Edit />}
                  >
                    Editar
                  </Button>{" "}
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<Delete />}
                    onClick={() => eliminarUsuario(usuario.id)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        count={Math.ceil(usuarios.length / PER_PAGE)}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        shape="rounded"
      />
    <Button variant="contained" style={{ backgroundColor: "#4caf50", color: "white" }} onClick={handleAddUserClick}  startIcon={<AddCircleOutline />}>
        Agregar usuario
      </Button>
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Agregar usuario</DialogTitle>
        <DialogContent>
          <label>Email:</label>
          <input
            type="email"
            value={editedUser.email}
            onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
            required
          />
          <br />
          <label>Name:</label>
          <input
            type="text"
            value={editedUser.name}
            onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
            required
          />
          <br />
          <label>Password:</label>
          <input
            type="password"
            value={editedUser.password}
            onChange={(e) => setEditedUser({ ...editedUser, password: e.target.value })}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </form>
    <Dialog open={editModalOpen} onClose={handleCloseEditModal}>
  <DialogTitle>Editar usuario</DialogTitle>
  <DialogContent>
    <label>Email:</label>
    <input
      type="email"
      value={editedUser.email}
      onChange={(e) =>
        setEditedUser({ ...editedUser, email: e.target.value })
      }
      required
    />
    <br />
    <label>Name:</label>
    <input
      type="text"
      value={editedUser.name}
      onChange={(e) =>
        setEditedUser({ ...editedUser, name: e.target.value })
      }
      required
    />
    <br />
    <label>Password:</label>
    <input
      type="password"
      value={editedUser.password}
      onChange={(e) =>
        setEditedUser({ ...editedUser, password: e.target.value })
      }
      required
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseEditModal} color="primary">
      Cancelar
    </Button>
    <Button onClick={handleSubmit} color="primary">
      Guardar
    </Button>
  </DialogActions>
</Dialog>
  </div>
  );
}

export default App;