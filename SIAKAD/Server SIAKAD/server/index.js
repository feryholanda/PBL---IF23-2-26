const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = 5000;

const secretKey = 'laravel';
app.use(bodyParser.json());
app.use(cors());
//app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'akademik'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }

    console.log('Connected to the database');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const sql = 'SELECT * FROM user WHERE username = ? AND password = ?';
  db.query(sql, [username, password], (err, results) => {
    if(err){
      return res.status(500).json({ error: err.message });
    }
    
    if(results.length > 0){
      const user = results[0];
      const token = jwt.sign({id: user.id, username: user.username}, secretKey, {expiresIn: '1h'});
      res.status(200).json({success: true, token});
    }
    else{
      res.status(401).json({success: false, message: 'Invalid credentials'});
    }
  })
});

app.get('/siswa', (req, res) => {
    const sql = `SELECT nisn, nama, kelas, jurusan.namajurusan, alamat FROM siswa INNER JOIN jurusan ON siswa.namajurusan = jurusan.namajurusan 
                 ORDER BY siswa.kelas, siswa.nama`;
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

app.get('/jurusan', (req, res) => {
    const sql = 'SELECT * FROM jurusan';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

app.get('/nilai', (req, res) => {
    const { type } = req.query;
    if (!type) {
        return res.status(400).json({ error: 'Type parameter is required' });
    }

    const sql = `SELECT id, siswa.nama AS nama, siswa.kelas AS kelas, siswa.namajurusan AS jurusan, ratarata FROM nilai 
                INNER JOIN siswa ON nilai.nisn = siswa.nisn WHERE siswa.namajurusan = ? ORDER BY siswa.nama`;
    db.query(sql, [type], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

app.get('/totalsiswa', (req, res) => {
    const sql = 'SELECT COUNT(nisn) AS total FROM siswa';
    db.query(sql, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results[0]);
    });
  });
  
  app.get('/totalsiswa-bykelas', (req, res) => {
    const sql = 'SELECT COUNT(nisn) AS Total, kelas FROM siswa GROUP BY kelas';
    db.query(sql, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  });
  
  app.get('/totalsiswa-byjurusan', (req, res) => {
    const sql = 'SELECT COUNT(nisn) AS Total, namajurusan AS jurusan FROM siswa GROUP BY namajurusan';
    db.query(sql, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  });
  
  app.get('/totalsiswa-byfilter', (req, res) => {
    const { kelas } = req.query;
    const sql = 'SELECT COUNT(nisn) AS Total, namajurusan AS jurusan FROM siswa WHERE kelas = ? GROUP BY namajurusan';
    db.query(sql, [kelas], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  });

  app.post('/tambahsiswa', (req, res) => {
    const { nisn, nama, kelas, namajurusan, alamat } = req.body;
    const sql = 'INSERT INTO siswa (nisn, nama, kelas, namajurusan, alamat) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [nisn, nama, kelas, namajurusan, alamat], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: result.insertId, nisn, nama, kelas, namajurusan, alamat });
    });
  });

  app.put('/ubahsiswa/:nisn', (req, res) => {
    const nisn = req.params.nisn;
    const { nama, kelas, namajurusan, alamat } = req.body;
    const query = `
      UPDATE siswa
      SET nama = ?, kelas = ?, namajurusan = ?, alamat = ?
      WHERE nisn = ?`;
    db.query(query, [nama, kelas, namajurusan, alamat, nisn], (error, results) => {
      if (error) {
        res.status(500).send(error);
      } else {
        res.status(200).send({ message: 'Siswa updated successfully' });
      }
    });
  });

  app.delete('/hapussiswa/:nisn', (req, res) => {
    const { nisn } = req.params;
    const query = 'DELETE FROM siswa WHERE nisn = ?';
  
    db.query(query, [nisn], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Data siswa berhasil dihapus' });
    });
  });

  app.post('/tambahjurusan', (req, res) => {
    const { namajurusan, pengajar } = req.body;
    const query = 'INSERT INTO jurusan (namajurusan, pengajar) VALUES (?, ?)';
    db.query(query, [namajurusan, pengajar], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Jurusan berhasil ditambahkan' });
    });
  });
  
  app.put('/ubahjurusan/:namajurusan', (req, res) => {
    const { namajurusan } = req.params;
    const { pengajar } = req.body;
    const query = 'UPDATE jurusan SET pengajar = ? WHERE namajurusan = ?';
    db.query(query, [pengajar, namajurusan], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Jurusan berhasil diubah' });
    });
  });
  
  app.delete('/hapusjurusan/:namajurusan', (req, res) => {
    const { namajurusan } = req.params;
    const query = 'DELETE FROM jurusan WHERE namajurusan = ?';
    db.query(query, [namajurusan], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Jurusan berhasil dihapus' });
    });
  });

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});