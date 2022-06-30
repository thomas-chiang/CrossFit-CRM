const { pool } = require('./mysql_conn');

const createGym = async (obj) => {
  const [result] = await pool.query('INSERT INTO gyms SET ?', [obj]);
  return result;
};

const updateGym = async (obj) => {
  const [result] = await pool.query(
    `
      UPDATE gyms 
      SET ? 
      WHERE id = ?
    `, [obj, obj.id]);
  return result;
};

const getGyms = async () => {
  const [result] = await pool.query('select * from gyms');
  return result
};

const deleteGym = async (id) => {
  const [result] = await pool.query('delete from gyms where id = ?',[id]);
  return result
};

const getOwnedGyms = async (user) => {
  const [result] = await pool.query('select * from gyms where creator_id = ?',[user.id]);
  return result
};

module.exports = {
  createGym,
  getGyms,
  updateGym,
  deleteGym,
  getOwnedGyms
};