// app.js (hoặc server.js)
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

// (tuỳ bạn) cấu hình static, view engine...
// app.engine('handlebars', engine({...}));
// app.set('view engine', 'handlebars');

app.get('/', (req, res) => res.send('OK - THE A HOUSE running'));

app.listen(PORT, HOST, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`);
});
