import express from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import servicesRouter from './routes/service.route.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===================================================
// 🧩 1. Cấu hình View Engine: Handlebars (.handlebars)
// ===================================================
app.engine(
  'handlebars',
  engine({
    extname: '.handlebars',
    helpers: {
      /**
       * formatVND: Định dạng tiền tệ VNĐ
       * Dùng trong template: {{formatVND price}}
       * -> "6.000.000 ₫"
       */
      formatVND(value) {
        const num = Number(value);
        if (isNaN(num) || num <= 0) return 'Liên hệ'; // fallback nếu không có giá
        return num.toLocaleString('vi-VN') + ' ₫';
      },

      /**
       * formatDate: (Tuỳ chọn) định dạng ngày nếu bạn cần sau này
       * {{formatDate created_at}}
       */
      formatDate(dateStr) {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('vi-VN');
      },
    },
  })
);

app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// ===================================================
// 🧩 2. File tĩnh (CSS, JS, ảnh, font…)
// ===================================================
app.use(express.static(path.join(__dirname, 'public')));

// ===================================================
// 🧩 3. Các route
// ===================================================
app.get('/', (req, res) => {
  res.render('home', {
    title: 'THE A HOUSE – Chạm phong cách, sống trọn khoảnh khắc',
  });
});

app.use('/services', servicesRouter);

// ===================================================
// 🧩 4. Khởi chạy server
// ===================================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
