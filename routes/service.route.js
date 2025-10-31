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
      serviceModel.countAll()
    ]);

    // Debug nhanh khi cần: /services?debug=1
    if (req.query.debug === '1') return res.json({ total, count: rooms.length, rooms });

    const totalPages = Math.max(Math.ceil(total / limit), 1);

    res.render('vwService/list', {
      title: 'Danh sách phòng cho thuê – THE A HOUSE',
      rooms,                                   // <-- tên biến KHỚP với template
      pagination: {
        page, limit, total, totalPages,
        hasPrev: page > 1,
        hasNext: page < totalPages,
        prevLink: `/services?page=${page - 1}&limit=${limit}`,
        nextLink: `/services?page=${page + 1}&limit=${limit}`
      }
    });
  } catch (err) {
    console.error('Services list error:', err);
    next(err);
  }
});

/** Chi tiết phòng */
// routes/service.route.js
// routes/service.route.js
router.get('/:id', async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(404).render('404', { title: 'Không tìm thấy phòng' });
  }

  try {
    const room = await serviceModel.findById(id);
    if (!room) return res.status(404).render('404', { title: 'Không tìm thấy phòng' });

    res.render('vwService/details', {
      title: `${room.room_name} – THE A HOUSE`,
      service: room,
      gallery: [room.image_url]
    });
  } catch (err) { next(err); }
});



export default router;
