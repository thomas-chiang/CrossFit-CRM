// Express Initialization
const express = require('express');
const cors = require('cors');
const app = express();

app.set('trust proxy', true);

app.use(express.json());
app.use(cors());

// API routes
app.use('/api/', [
  require('./server/routes/course_route'),
  require('./server/routes/user_route'),
  require('./server/routes/movement_route'),
  require('./server/routes/workout_route'),
  require('./server/routes/gym_route'),
  require('./server/routes/token_route'),
  require('./server/routes/performance_route'),
]);

// Error handling
app.use(function (err, req, res, next) {
  console.log(err);
  if(err.sql) {
    console.log(`Sql error: `+err.message);
    return res.status(400).json({error: err.sqlMessage})
  }
  if(err.status === 400) return res.status(400).json({error: err.message})
  res.status(500).json({error: 'Internal Server Error'});
});

app.listen(5000, () => {
  console.log(`Listening on port: 5000`);
});