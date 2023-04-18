const { application } = require('express');
const express = require('express');
const { restart } = require('nodemon');
const router = express.Router()
const { client } = require('../database/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const database = client.db("protected");
const usercollection = database.collection("users");

// Routes here
router.post('/register', async function(req,res){
    const body = req.body;

    if(!body.username || !body.password){
        res.status(400).send({
            message: "Missing username or password"
        })
        return;
    }

    const user = await usercollection.findOne({username: body.username});

    if(user){
        res.status(409).send({
            message: "Username already taken"
        })
        return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(body.password, salt);

    const result = await usercollection.insertOne({
        username: body.username,
        password: passwordHash,
        isAdmin: false,
    })

    res.status(201).send({
        status: "success"
    })
})

router.post('/login', async function(req,res){
    const body = req.body;

    if(!body.username || !body.password){
        res.status(400).send({
            message: "Missing username or password"
        })
        return;
    }

    const user = await usercollection.findOne({username: body.username});

    if(!user){
        res.status(401).send({
            message: "Bad username or password"
        })
        return;
    }

    const passwordHashed = user.password;
    const verify = await bcrypt.compare(body.password, passwordHashed)

    if(verify){

        const payload = {
            username: user.username,
            isAdmin: user.isAdmin,
        }
        const token = jwt.sign(payload, process.env.SECRET, {expiresIn: '1d'});

        res.status(200).send({
            message: "Logged in",
            accessToken: token,
        })
    }
    else{
        res.status(401).send({
            message: "Bad username or password"
        })
    }
})

module.exports = router;