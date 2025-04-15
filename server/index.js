require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const router = require('./router/index');
const PORT = process.env.PORT || 5000;
const app = express();
const errorMiddleware = require('./middlewares/error-middleware');

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  }),
);
app.use('/api', router);
app.use(errorMiddleware);

const start = async () => {
  try {
    // Подключение к MongoDB
    await mongoose.connect(process.env.DB_URL);
    console.log('Connected to MongoDB');

    // Запуск сервера
    app.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`));
  } catch (e) {
    console.error('Error during startup:', e);
    process.exit(1); // Завершение процесса с ошибкой
  }
};

start();
