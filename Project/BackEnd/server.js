require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { connect } = require('./database/database');
const userRouter = require('./routers/user.route');
const graphRouter = require('./routers/graph.route');
const path = require('path');

// Middlewares
app.use(cors());
app.use(morgan('tiny'));
app.use(bodyParser.json());

// Static Front end
app.use('/', express.static(path.join(__dirname + '/dist')));

// Health Route
app.get('/health', function(req, res) {
    res.status(200).send('Server Healthy')
})

// Auth Routes
app.use('/user', userRouter);

// Graph Routes
app.use('/graph', graphRouter);

// Server Port
const port = process.env.PORT || 8080;
app.listen(port, () => {
    connect()
    console.log("Server listening on port " + port)
})