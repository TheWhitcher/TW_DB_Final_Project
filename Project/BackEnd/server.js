require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { connect } = require('./database/database');
const userRouter = require('./routers/user.route');
const graphRouter = require('./routers/graph.route');
//const { standardAuth } = require('./middlewares/auth.middleware');
const path = require('path');
const { job } = require('./cronjob');

// Middlewares
app.use(cors());
app.use(morgan('tiny'));
app.use(bodyParser.json());

// Cron jobs
job.start();

// Static Front end
app.use('/', express.static(path.join(__dirname + '/dist')));

// Health Route
app.get('/health', function(req, res) {
    res.status(200).send('Server Healthy')
})

// Auth Routes
app.use('/user', userRouter);

// Auth Middleware
//app.use(standardAuth);

// Graph Routes
app.use('/graph', graphRouter);

// Server Port
const port = process.env.PORT || 8080;
app.listen(port, () => {
    connect()
    console.log("Server listening on port " + port)
})