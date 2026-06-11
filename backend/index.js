const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('나녕공방 서버 작동중!');
});

app.post('/upload-artwork', upload.single('photo'), async (req, res) => {
  try {
    const file = req.file;
    const username = req.body.username || '익명';

    if (!file) return res.status(400).json({ error: '파일 없음' });

    const id = Math.random().toString(36).substring(2, 10);
    const ext = file.mimetype.split('/')[1]?.replace('jpeg', 'jpg') ?? 'jpg';
    const path = `artwork/${id}.${ext}`;

    const { error: uploadErr } = await supabase.storage
      .from('nntablet')
      .upload(path, file.buffer, { contentType: file.mimetype, upsert: true });

    if (uploadErr) return res.status(500).json({ error: uploadErr.message });

    const { data: { publicUrl } } = supabase.storage.from('nntablet').getPublicUrl(path);

    const { error: dbErr } = await supabase.from('gallery').insert({
      image_url: publicUrl,
      username,
      likes: 0,
      saves: 0,
    });

    if (dbErr) return res.status(500).json({ error: dbErr.message });

    res.json({ success: true, publicUrl });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`서버 실행중: http://localhost:${PORT}`);
});
