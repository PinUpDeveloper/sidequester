const path = require('path');
const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../../public')));

app.use('/', authRoutes);
app.use('/users', userRoutes);
app.use('/posts', postRoutes);

app.use(errorHandler);

module.exports = app;
