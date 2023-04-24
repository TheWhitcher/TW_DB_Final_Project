require('dotenv').config();
const express = require('express');
const router = express.Router()
const { client } = require('../database/database');


const database = client.db("emission_users");
const usercollection = database.collection("users");

// Generate Graph
router.get('/generate', async function(req,res){
    
})

// Save Graph Preset
router.post('/save', async function(req,res){

})

// Download Graph
router.get('/download', async function(req,res){

})

module.exports = router;