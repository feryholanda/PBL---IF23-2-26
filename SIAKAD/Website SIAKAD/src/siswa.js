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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

function Siswa() {
  const [siswa, setSiswa] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [jurusan, setJurusan] = useState([]);
  const [newSiswa, setNewSiswa] = useState({
    nisn: "",
    nama: "",
    kelas: "",
    namajurusan: "",
    alamat: ""
  });
  const [isUpdate, setIsUpdate] = useState(false);
  const [currentSiswa, setCurrentSiswa] = useState(null);

  const fetchSiswa = () => {
    setLoading(true);
    fetch("http://localhost:5000/siswa")
      .then((response) => response.json())
      .then((data) => {
        setSiswa(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  };

  const fetchJurusan = () => {
    fetch("http://localhost:5000/jurusan")
      .then((response) => response.json())
      .then((data) => {
        setJurusan(data);
      })
      .catch((error) => {
        setError(error);
      });
  };

  useEffect(() => {
    fetchSiswa();
    fetchJurusan();
  }, []);

  const handleOpen = (siswa = null) => {
    if (siswa) {
      setNewSiswa(siswa);
      setIsUpdate(true);
      setCurrentSiswa(siswa.nisn);
    } else {
      setNewSiswa({
        nisn: "",
        nama: "",
        kelas: "",
        namajurusan: "",
        alamat: ""
      });
      setIsUpdate(false);
    }
    setOpen(true);
  };
  
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSiswa((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = isUpdate ? `http://localhost:5000/ubahsiswa/${currentSiswa}` : "http://localhost:5000/tambahsiswa";
    const method = isUpdate ? "PUT" : "POST";
    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newSiswa),
    })
      .then((response) => response.json())
      .then((data) => {
        handleClose();
        fetchSiswa();
      })
      .catch((error) => {
        setError(error);
      });
  };

  const handleDelete = (nisn) => {
    fetch(`http://localhost:5000/hapussiswa/${nisn}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => {
        fetchSiswa();
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
        Data Siswa
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpen()} sx={{ mb: 2 }}>
        Tambah Siswa
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
            {isUpdate ? "Update Siswa" : "Tambah Siswa"}
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="NISN"
              name="nisn"
              value={newSiswa.nisn}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Nama"
              name="nama"
              value={newSiswa.nama}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Kelas"
              name="kelas"
              value={newSiswa.kelas}
              onChange={handleChange}
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="jurusan-label">Jurusan</InputLabel>
              <Select
                labelId="jurusan-label"
                name="namajurusan"
                value={newSiswa.namajurusan}
                onChange={handleChange}
                required
              >
                {jurusan.map((jur) => (
                  <MenuItem key={jur.namajurusan} value={jur.namajurusan}>
                    {jur.namajurusan}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              margin="normal"
              label="Alamat"
              name="alamat"
              value={newSiswa.alamat}
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
              <TableCell>NISN</TableCell>
              <TableCell>Nama</TableCell>
              <TableCell>Kelas</TableCell>
              <TableCell>Jurusan</TableCell>
              <TableCell>Alamat</TableCell>
              <TableCell>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {siswa.map((row) => (
              <TableRow key={row.nisn}>
                <TableCell>{row.nisn}</TableCell>
                <TableCell>{row.nama}</TableCell>
                <TableCell>{row.kelas}</TableCell>
                <TableCell>{row.namajurusan}</TableCell>
                <TableCell>{row.alamat}</TableCell>
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
                    onClick={() => handleDelete(row.nisn)}
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

export default Siswa;
