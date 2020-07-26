require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
// const cors = require('cors');

const uploadRoute = require('./routes/image-upload');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const imageRoutes = require('./routes/images');
const tagRoutes = require('./routes/tags');

// Allow passing JSON objects and Cross Origin Resource Sharing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// Initial routes
app.use('/', uploadRoute);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/tags', tagRoutes);
app.get('/', (req, res) => {
  res.send('Root directory');
});

// Initialise database connection
mongoose.connect(
  process.env.DB_CONNECTION,
  { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false },
  () => {
    console.log('Database connected okay.');
  }
);

// Define port for server to listen on
const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`Listening on port ${PORT}`));
