import React, { useState, useEffect } from "react";
import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Alert,
} from "@mui/material";

function Rapor() {
  const [jurusan, setJurusan] = useState([]);
  const [selectedJurusan, setSelectedJurusan] = useState("");
  const [nilai, setNilai] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingNilai, setLoadingNilai] = useState(false);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    if (selectedJurusan) {
      setLoadingNilai(true);
      fetch(`http://localhost:5000/nilai?type=${selectedJurusan}`)
        .then((response) => response.json())
        .then((data) => {
          setNilai(data);
          setLoadingNilai(false);
        })
        .catch((error) => {
          setError(error);
          setLoadingNilai(false);
        });
    }
  }, [selectedJurusan]);

  const handleJurusanChange = (event) => {
    setSelectedJurusan(event.target.value);
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
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Data Rapor
      </Typography>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="jurusan-label">Pilih Jurusan</InputLabel>
        <Select
          labelId="jurusan-label"
          value={selectedJurusan}
          onChange={handleJurusanChange}
          label="Pilih Jurusan"
        >
          {jurusan.map((jrs) => (
            <MenuItem key={jrs.namajurusan} value={jrs.namajurusan}>
              {jrs.namajurusan}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {loadingNilai ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "20vh", mt: 2 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nama</TableCell>
                <TableCell>Kelas</TableCell>
                <TableCell>Jurusan</TableCell>
                <TableCell>Rata-rata</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {nilai.length > 0 ? (
                nilai.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.nama}</TableCell>
                    <TableCell>{row.kelas}</TableCell>
                    <TableCell>{row.jurusan}</TableCell>
                    <TableCell>{row.ratarata}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No Data
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default Rapor;
