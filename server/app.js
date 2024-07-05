const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors')
const routes = require('./routes');
require('dotenv').config();

app.use(express.json());
app.use(cors())
app.use(routes);

const url = process.env.MONGODB_URL;
const port = process.env.APP_PORT

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.listen(process.env.APP_PORT || 3000, () => {
    console.log(`Сервер запущено на http://localhost:${port}`);
});
