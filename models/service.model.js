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
