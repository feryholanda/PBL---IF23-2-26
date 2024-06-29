import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Grid,
} from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF4560'];

const fetchData = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

function Dashboard() {
  const [totalSiswa, setTotalSiswa] = useState(null);
  const [dataByKelas, setDataByKelas] = useState([]);
  const [dataByJurusan, setDataByJurusan] = useState([]);
  const [dataKelas10, setDataKelas10] = useState([]);
  const [dataKelas11, setDataKelas11] = useState([]);
  const [dataKelas12, setDataKelas12] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const totalSiswaData = await fetchData("http://localhost:5000/totalsiswa");
        setTotalSiswa(totalSiswaData.total);

        const byKelasData = await fetchData("http://localhost:5000/totalsiswa-bykelas");
        setDataByKelas(byKelasData);

        const byJurusanData = await fetchData("http://localhost:5000/totalsiswa-byjurusan");
        setDataByJurusan(byJurusanData);

        const kelas10Data = await fetchData("http://localhost:5000/totalsiswa-byfilter?kelas=10");
        setDataKelas10(kelas10Data);

        const kelas11Data = await fetchData("http://localhost:5000/totalsiswa-byfilter?kelas=11");
        setDataKelas11(kelas11Data);

        const kelas12Data = await fetchData("http://localhost:5000/totalsiswa-byfilter?kelas=12");
        setDataKelas12(kelas12Data);

        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

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
        <Typography variant="h6" color="error">
          Error fetching data: {error.message}
        </Typography>
      </Box>
    );
  }

  const renderPieChart = (data, title) => (
    <Card sx={{ height: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <PieChart width={300} height={300}>
          <Pie
            data={data}
            dataKey="Total"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Total Siswa: {totalSiswa}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          {renderPieChart(
            dataByKelas.map(item => ({ name: `Kelas ${item.kelas}`, Total: item.Total })),
            'Total Siswa Berdasarkan Kelas'
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          {renderPieChart(
            dataByJurusan.map(item => ({ name: item.jurusan, Total: item.Total })),
            'Total Siswa Berdasarkan Jurusan'
          )}
        </Grid>
        <Grid item xs={12} md={4}>
          {renderPieChart(
            dataKelas10.map(item => ({ name: item.jurusan, Total: item.Total })),
            'Total Siswa Kelas 10 Berdasarkan Jurusan'
          )}
        </Grid>
        <Grid item xs={12} md={4}>
          {renderPieChart(
            dataKelas11.map(item => ({ name: item.jurusan, Total: item.Total })),
            'Total Siswa Kelas 11 Berdasarkan Jurusan'
          )}
        </Grid>
        <Grid item xs={12} md={4}>
          {renderPieChart(
            dataKelas12.map(item => ({ name: item.jurusan, Total: item.Total })),
            'Total Siswa Kelas 12 Berdasarkan Jurusan'
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
