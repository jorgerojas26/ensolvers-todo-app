require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');

const auth_routes = require('./routes/auth');
const user_routes = require('./routes/users');
const folder_routes = require('./routes/folders');
const todo_routes = require('./routes/todos');

//middlewares
const isAuthenticated = require('./middlewares/isAuthenticated');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join('frontend', 'build')));

//routes
app.use('/auth', auth_routes);

app.use(isAuthenticated);
app.use('/users', user_routes);
app.use('/folders', folder_routes);
app.use('/todos', todo_routes);

app.use(function (err, req, res, next) {
    console.log(err.message);
    res.status(err.status || 500);
    res.json({ error: err.message });
});

app.use(express.static(path.join(__dirname, 'frontend/build')));

app.get('/*', function (req, res) {
    res.sendFile(path.resolve(__dirname, 'frontend/build', 'index.html'));
});

app.listen(process.env.PORT ?? 5000, () => {
    console.log('Server running in port: ' + process.env.PORT ?? 5000);
});
