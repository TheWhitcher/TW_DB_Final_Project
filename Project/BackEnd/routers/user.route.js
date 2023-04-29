require('dotenv').config();
const express = require('express');
const router = express.Router()
const { client } = require('../database/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const database = client.db("emission_users");
const usercollection = database.collection("users");

// Routes here

// Register a new User
router.post('/register', async function(req,res){
    const body = req.body;

    if(!body.email || !body.password){
        res.status(400).send({
            message: "Missing email or password"
        })
        return;
    }

    const user = await usercollection.findOne({email: body.email});

    if(user){
        res.status(409).send({
            message: "Email already taken"
        })
        return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(body.password, salt);

    const result = await usercollection.insertOne({
        email: body.email,
        password: passwordHash,
        dateOfBirth: body.dateOfBirth,
        fieldOfWork: body.fieldOfWork,
        graphPresets: [],
        graphCount: 0,
        isAdmin: false,
    })

    res.status(201).send({
        status: "success"
    })
})

// User login
router.post('/login', async function(req,res){
    const body = req.body;

    if(!body.email || !body.password){
        res.status(400).send({
            message: "Missing username or password"
        })
        return;
    }

    const user = await usercollection.findOne({email: body.email});

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
            email: user.email,
            graphPresets: user.graphPresets,
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