const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('나녕공방 서버 작동중!');
});

app.listen(PORT, () => {
  console.log(`서버 실행중: http://localhost:${PORT}`);
});