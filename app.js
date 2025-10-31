import express from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔹 Khai báo view engine dùng đuôi .handlebars
app.engine('handlebars', engine({
  extname: '.handlebars',
  helpers: {
    formatVND(value){ 
      const n = Number(value||0);
      return n.toLocaleString('vi-VN') + ' ₫';
    }
  }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// 🔹 Phục vụ file tĩnh (ảnh, CSS, fonts…)
app.use(express.static(path.join(__dirname, 'public')));

// 🔹 Route chính
app.get('/', (req, res) => {
  res.render('home', { title: 'THE A HOUSE – Chạm phong cách, sống trọn khoảnh khắc' });
});
import servicesRouter from './routes/service.route.js';
app.use('/services', servicesRouter);
app.listen(process.env.PORT || 3000, () => {
  console.log('✅ Server running on http://localhost:3000');
});
