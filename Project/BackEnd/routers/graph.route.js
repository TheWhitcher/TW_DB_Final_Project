require('dotenv').config();
const express = require('express');
const router = express.Router()
const { client } = require('../database/database');
const { spawn } = require('child_process');
const path = require('path');
const jwt = require('jsonwebtoken');

const database = client.db("emission_users");
const usercollection = database.collection("users");

// Executes a python script
const GenerateGraph = () => {
    return new Promise((resolve, reject) => {
        
        const originalDIR = process.cwd();
        const scriptDIR = path.join(__dirname, "..", "..", "Data");
        
        process.chdir(scriptDIR);
        
        const pythonScript = path.join(scriptDIR, 'annualGlobalC02.py');
        const python = spawn('python', [pythonScript]);
        
        python.on('exit', (code) => {
            if(code === 0){
                
                process.chdir(originalDIR);
                resolve (true);
            }
            else{
                process.chdir(originalDIR);
                python.stderr.on('data', (data) => {
                    console.error(`stderr: ${data}`);
                    reject(false);
                })
                return false;
            }
        })
    })
}

// TODO: Make Dynamic by adding arguments.
// Generate Graph
router.get('/generate', async function(req,res){
    try{
        const result = await GenerateGraph();
        const imagePath = path.join(__dirname, "..", "..", "Data", "images", "graph.png");
        
        if(result){
            res.setHeader('Content-Type', "image/png");
            res.setHeader('Content-Disposition', 'attachment; filename=graph');
            
            res.status(200).sendFile(imagePath);
        }
        else{
            console.log("Python Script failed")
        }
    }
    catch (error){

        res.status(400).send({
            message: 'Python script failed',
            error: error,
        });

        console.log("Python Failed");
        console.log('error: ', error);
    }
})

// Save graph preset to the users document in the database.
router.post('/save', async function(req,res){
    const data = req.body;
    console.log('data: ', data);
    const authorization = req.headers.authorization;
    try{

        const payload = jwt.verify(authorization, process.env.SECRET);
        await usercollection.findOneAndUpdate({email: payload.email}, {$push: {graphPresets: data}})
        
        res.status(200).send({
            message: "Database updated."
        });
    }
    catch (error){
        console.log("Update Failed");
        console.log('error: ', error);

        res.status(500).send({
            message: "Error updating Database",
            error: error,
        });
    }
})

module.exports = router;