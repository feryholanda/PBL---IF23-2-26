import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Box,
  Alert,
  Button,
  Modal,
  TextField,
} from "@mui/material";

function Jurusan() {
  const [jurusan, setJurusan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [newJurusan, setNewJurusan] = useState({
    namajurusan: "",
    pengajar: ""
  });
  const [isUpdate, setIsUpdate] = useState(false);
  const [currentJurusan, setCurrentJurusan] = useState(null);

  const fetchJurusan = () => {
    setLoading(true);
    fetch("http://localhost:5000/jurusan")
      .then((response) => response.json())
      .then((data) => {
        setJurusan(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchJurusan();
  }, []);

  const handleOpen = (jurusan = null) => {
    if (jurusan) {
      setNewJurusan(jurusan);
      setIsUpdate(true);
      setCurrentJurusan(jurusan.namajurusan);
    } else {
      setNewJurusan({
        namajurusan: "",
        pengajar: ""
      });
      setIsUpdate(false);
    }
    setOpen(true);
  };
  
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewJurusan((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = isUpdate ? `http://localhost:5000/ubahjurusan/${currentJurusan}` : "http://localhost:5000/tambahjurusan";
    const method = isUpdate ? "PUT" : "POST";
    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newJurusan),
    })
      .then((response) => response.json())
      .then((data) => {
        handleClose();
        fetchJurusan();
      })
      .catch((error) => {
        setError(error);
      });
  };

  const handleDelete = (namajurusan) => {
    fetch(`http://localhost:5000/hapusjurusan/${namajurusan}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => {
        fetchJurusan();
      })
      .catch((error) => {
        setError(error);
      });
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <Alert severity="error">Error fetching data: {error.message}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Data Jurusan
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpen()} sx={{ mb: 2 }}>
        Tambah Jurusan
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={{ 
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}>
          <Typography variant="h6" id="modal-title">
            {isUpdate ? "Update Jurusan" : "Tambah Jurusan"}
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Nama Jurusan"
              name="namajurusan"
              value={newJurusan.namajurusan}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Pengajar"
              name="pengajar"
              value={newJurusan.pengajar}
              onChange={handleChange}
              required
            />
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" color="primary" type="submit">
                Submit
              </Button>
              <Button variant="outlined" color="secondary" onClick={handleClose} sx={{ ml: 2 }}>
                Cancel
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nama Jurusan</TableCell>
              <TableCell>Pengajar</TableCell>
              <TableCell>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jurusan.map((row) => (
              <TableRow key={row.namajurusan}>
                <TableCell>{row.namajurusan}</TableCell>
                <TableCell>{row.pengajar}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpen(row)}
                    sx={{ mr: 2 }}
                  >
                    Update
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDelete(row.namajurusan)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Jurusan;
