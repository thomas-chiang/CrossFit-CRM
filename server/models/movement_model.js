const { pool } = require("./mysql_conn");

const createMovement = async (movement) => {
  const [result] = await pool.query("INSERT INTO movements SET ?", [movement]);
  return result;
};

const updateMovement = async (movement) => {
  const [result] = await pool.query(
    `
      UPDATE movements 
      SET ? 
      WHERE id = ?
    `,
    [movement, movement.id]
  );
  return result;
};

const getMovements = async () => {
  const [result] = await pool.query("select * from movements");
  return result;
};

const deleteMovement = async (id) => {
  const [result] = await pool.query("delete from movements where id = ?", [id]);
  return result;
};

module.exports = {
  createMovement,
  getMovements,
  updateMovement,
  deleteMovement
};
