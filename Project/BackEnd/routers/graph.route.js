require('dotenv').config();
const express = require('express');
const router = express.Router()
const { client } = require('../database/database');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const Blob = require('blob');
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

// Generate Graph
router.get('/generate', async function(req,res){
    // TODO: Make Dynamic by adding arguments.
    try{
        const result = await GenerateGraph();
        const imagePath = path.join(__dirname, "..", "..", "Data", "images", "graph.png");

        const pngBuffer = fs.readFileSync(imagePath)

        const pngBlob = new blob([pngBuffer], {type: 'image/png'})
        // fs.readFile(imagePath, function(err, data) {
        //     if(err) {
        //         console.log('err: ', err);
        //         return;
        //     }

        //     const blob = Blob([data], {type: 'image/png'});
        //     const dataURL = blobUtil.createObjectURL(blob);

        //     res.status(200).send({
        //         message: "Generate Graph succesfull.",
        //         image: dataURL
        //     });
        //     console.log("Python Success");
        // })
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
    const authorization = req.headers.authorization;
    try{

        const payload = jwt.verify(authorization, process.env.SECRET);
        const user = await usercollection.findOne({email: payload.email})
        
        let count = user.graphCount;
        count++;
        
        await usercollection.updateOne({email: payload.email}, {$push: {graphPresets: {graph: data}}, $set: {graphCount: count}})
        
        res.status(200).send({
            message: "Database updated."
        });
    }
    catch (error){
        console.log("Update Failed");
        res.status(500).send({
            message: "Error updating Database",
            error: error,
        });
    }
})

module.exports = router;