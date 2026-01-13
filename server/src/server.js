const app = require('./app');
require('dotenv').config();

const PORT = process.env.PORT || 7484;

// Just require DB to initialize connection
require('./config/db');

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
