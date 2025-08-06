const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const googleAuthRoutes = require('./routes/googleAuth');
app.use('/api/google', googleAuthRoutes);

app.listen(5000, () => {
  console.log('✅ Server listening at http://localhost:5000');
});
