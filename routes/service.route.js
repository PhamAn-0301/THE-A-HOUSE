// routes/service.route.js
import express from 'express';
import * as serviceModel from '../models/service.model.js';

const router = express.Router();

/** Danh sách phòng */
router.get('/', async (req, res, next) => {
  try {
    const page  = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.max(parseInt(req.query.limit || '12', 10), 1);

    const [rooms, total] = await Promise.all([
      serviceModel.findAll({ page, limit }),
      serviceModel.countAll(),
    ]);

    // Debug nhanh khi cần: /services?debug=1
    if (req.query.debug === '1') return res.json({ total, count: rooms.length, rooms });

    const totalPages = Math.max(Math.ceil(total / limit), 1);

    res.render('vwService/list', {
      title: 'Danh sách phòng cho thuê – THE A HOUSE',
      rooms,
      pagination: {
        page, limit, total, totalPages,
        hasPrev: page > 1,
        hasNext: page < totalPages,
        prevLink: `/services?page=${page - 1}&limit=${limit}`,
        nextLink: `/services?page=${page + 1}&limit=${limit}`,
      },
    });
  } catch (err) {
    console.error('Services list error:', err);
    next(err);
  }
});

/** Chi tiết phòng */
router.get('/:id', async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(404).render('404', { title: 'Không tìm thấy phòng' });
  }

  try {
    const room = await serviceModel.findById(id);
    if (!room) {
      return res.status(404).render('404', { title: 'Không tìm thấy phòng' });
    }

    // Lấy ảnh phụ nếu model có hàm; nếu chưa có thì mặc định mảng rỗng
    let extraImages = [];
    if (typeof serviceModel.findImagesByRoomId === 'function') {
      extraImages = await serviceModel.findImagesByRoomId(id); // trả về mảng url
    }

    // Gallery = [ảnh chính] + ảnh phụ (lọc trùng, bỏ rỗng)
    const seen = new Set();
    const gallery = [room.image_url, ...(extraImages || [])].filter(u => {
      if (!u) return false;
      const k = String(u).trim();
      if (!k || seen.has(k)) return false;
      seen.add(k);
      return true;
    });

    // Phòng liên quan (ưu tiên cùng quận; nếu không có quận thì rơi về city)
    // Lưu ý: hàm findRelated nên nhận 'excludeId' theo gợi ý trước đó
    const relatedRooms = (typeof serviceModel.findRelated === 'function')
      ? await serviceModel.findRelated({
          excludeId: room.id,
          district: room.district || null,
          city: room.city || 'Hồ Chí Minh',
          limit: 4,
        })
      : [];

    res.render('vwService/details', {
      title: `${room.room_name} – THE A HOUSE`,
      service: room,
      gallery: gallery.length ? gallery : [room.image_url],
      relatedRooms, // để handlebars hiển thị "Phòng tương tự"
    });
  } catch (err) {
    next(err);
  }
});

export default router;
