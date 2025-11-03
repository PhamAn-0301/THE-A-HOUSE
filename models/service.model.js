// models/service.model.js
import db from '../utils/db.js';

export async function findAll({ page = 1, limit = 12 } = {}) {
  const offset = (page - 1) * limit;

  const rows = await db.withSchema('public')      // <-- đảm bảo đúng schema
    .from('rooms')
    .select(
      'id',
      'room_name',
      'price',
      'district',
      'city',
      'image_url',
      'icon',
      'detail',
      'address'
    )
    .orderBy('id', 'asc')
    .limit(limit)
    .offset(offset);

  return rows;
}

export async function countAll() {
  const { total } = await db.withSchema('public')
    .from('rooms')
    .count({ total: '*' })
    .first();
  return Number(total || 0);
}

export async function findById(id) {
  return db.withSchema('public')
    .from('rooms')
    .select(
      'id','room_name','price','district','city',
      'image_url','icon','detail','address'
    )
    .where('id', id)
    .first();
}
// models/service.model.js


export async function findImagesByRoomId(roomId) {
  const rows = await db.withSchema('public')
    .from('room_images')
    .select('image_url')
    .where('room_id', roomId)
    .orderBy([{ column: 'sort_order', order: 'asc' }, { column: 'id', order: 'asc' }]);
  return rows.map(r => r.image_url).filter(Boolean);
}

export async function findRelated({ excludeId, district, city, limit = 4 } = {}) {
  // Ưu tiên cùng quận; nếu không có thì rơi xuống cùng thành phố
  const base = db.withSchema('public')
    .from('rooms')
    .select('id', 'room_name', 'price', 'district', 'city', 'image_url')
    .whereNot('id', excludeId);

  if (district) {
    base.andWhere('district', district);
  } else if (city) {
    base.andWhere('city', city);
  }

  // fallback: nếu không tìm được theo quận/thành phố, lấy phòng mới nhất (trừ chính nó)
  const rows = await base.orderBy('id', 'desc').limit(limit);
  if (rows.length > 0) return rows;

  return db.withSchema('public')
    .from('rooms')
    .select('id', 'room_name', 'price', 'district', 'city', 'image_url')
    .whereNot('id', excludeId)
    .orderBy('id', 'desc')
    .limit(limit);
}