require('dotenv').config();
const express = require('express');
const router = express.Router()
const { client } = require('../database/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { standardAuth } = require('../middlewares/auth.middleware');

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
            graphCount: user.graphCount,
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

// Get user graph presets
router.get('/graphs', standardAuth, async function(req,res){
    const authorization = req.headers.authorization;

    try{
        const payload = jwt.verify(authorization, process.env.SECRET);
        const user = await usercollection.findOne({email: payload.email})
        
        res.status(200).send({
            message: "Data received.",
            graphPresets: user.graphPresets
        });
    }
    catch (error){
        res.status(500).send({
            message: "Error Accessing Database",
            error: error,
        });
    }
})

// Delete a graph preset
router.delete('/deletePreset', standardAuth, async function(req,res){
    try{
        const authorization = req.headers.authorization;
        const index = req.body.index;

        const payload = jwt.verify(authorization, process.env.SECRET);
        const user = await usercollection.findOneAndUpdate({email: payload.email}, {$pull: {graphPresets: {index: index}}});

        res.status(200).send({
            message: "Preset removed.",
        });
    }
    catch (error){
        console.log('error: ', error);
        res.status(500).send({
            message: "Error Accessing Database",
            error: error,
        });
    }
})

module.exports = router;