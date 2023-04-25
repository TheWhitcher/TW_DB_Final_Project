require('dotenv').config();
const express = require('express');
const router = express.Router()
const { client } = require('../database/database');
const { spawn } = require('child_process');
const path = require('path');
const { restart } = require('nodemon');


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
    // TODO : Make Dynamic
    const graphName = "graphs/annual_CO2_emissions_per_Countries.png";

    // TODO: Make Dynamic by adding arguments.
    const result = await GenerateGraph();

    if(result === true){
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.status(200).send({
        message: "Generate Graph succesfull.",
        name: graphName,
        });
    }
    else{   
        res.status(400).send({
            message: 'Python script failed',
        });
    }
})

// TODO Save Graph Preset
router.post('/save', async function(req,res){

})

// TODO Download Graph
router.get('/download', async function(req,res){

})

module.exports = router;