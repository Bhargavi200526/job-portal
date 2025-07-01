const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGO_URI;
console.log('Connecting to:', uri);

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => { console.log('Connected!'); process.exit(0); })
  .catch(err => { console.error('Connection failed:', err); process.exit(1); });