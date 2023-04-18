require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { connect } = require('./database/database');
const authRouter = require('./routers/auth.route');
const { standardAuth, adminAuth } = require('./middlewares/auth.middleware');

app.use(cors());
app.use(morgan('tiny'));
app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.send('Hello World')
})

app.use('/auth', authRouter);

// Global auth middleware
// app.use(standardAuth);

// Admin route
app.get('/admin', adminAuth, function(req,res){
    res.status(200).send({
        message: "Admin Only"
    })
})
// Route specific secured
app.get('/secure', standardAuth, function(req,res){
    res.status(200).send({
        message: "Route Secured"
    })
})

// Not secure
app.get('/notsecure', function(req,res){
    res.status(200).send({
        message: "Route not Secured"
    })
})

const port = process.env.PORT || 8080;
app.listen(port, () => {
    connect()
    console.log("Server listening on port " + port)
})