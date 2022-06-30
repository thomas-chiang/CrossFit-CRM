const { pool } = require('./mysql_conn')

const signUp = async (user) => {
  try {
    const [result] = await pool.query('INSERT INTO users SET ?', user);
    user.id = result.insertId;
    return {user}
  } catch (e) {
    console.log(e)
    return {
        error: 'Email or Name Already Exists',
        status: 403
    };
  } 
};

const signIn = async (role, email) => {
  const [result] = await pool.query('select * from users where role = ? and email = ? ', [ role, email ]);
  let user = result[0]
  return {user}
};

const getUserProfile = async (role, email) => {
  const [result] = await pool.query(`select * from users where role = ? and email = ? `, [ role, email ]);
  let user = result[0]
  return user
};


const getUsersByRole = async (role) => {
  const [users] = await pool.query('select id, name from users where role = ? ', [ role ]);
  return users
}


const addUserToGymbyEmail = async (gym_id, email) => {
  const conn = await pool.getConnection();
  try {
      await conn.query('START TRANSACTION');

      let [user_id] = await conn.query('select id from users where email =  ?', [email]);
      if(user_id.length === 0) throw {status: 400, message: 'incorrect email'}
      
      user_id = user_id[0].id
      let obj = {
        user_id,
        gym_id
      }

      const [result] = await conn.query('INSERT INTO user_gym SET ?', obj);
      await conn.query('COMMIT');
      return result;
  } catch (error) {
      await conn.query('ROLLBACK');
      console.log(error)
      throw error;
  } finally {
      await conn.release();
  }
}

const getUsersByGymAndRole = async (gym_id, role) => {
  const [users] = await pool.query(`
    select users.id, users.name, users.email, users.role 
    from user_gym
    inner join users
    on user_gym.user_id = users.id
    where user_gym.gym_id = ? 
    and users.role = ?
  `,[gym_id, role])

  return users
}

const deleteUserByGym = async (user_id, gym_id) => {
  //user_id = user_id.toString()
  //console.log(user_id)
  const [result] = await pool.query(`delete from user_gym where user_id = ? and gym_id = ? `,[user_id, gym_id])
  //console.log(result)
  return result
}

const getGymsByUser = async (user) => {
  const [gyms] = await pool.query(`
    select 
      gyms.id,
      gyms.name 
    from user_gym
    left join gyms on user_gym.gym_id = gyms.id
    where user_gym.user_id = ?
  `,[user.id])

  return gyms
}

module.exports = {
  signUp,
  signIn,
  getUserProfile,
  getUsersByRole,
  addUserToGymbyEmail,
  getUsersByGymAndRole,
  deleteUserByGym,
  getGymsByUser
}