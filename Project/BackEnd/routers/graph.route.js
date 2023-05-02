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
const GenerateGraph = (preset) => {
    return new Promise((resolve, reject) => {
        const countries = preset.countries.join(',');
        const plotType = PlotType(preset.type, preset.count, preset.world)
        console.log('countries: ', countries);
        console.log('plotType: ', plotType);
        
        if(!plotType){
            reject(false);
            return false;
        }
        
        const originalDIR = process.cwd();
        const scriptDIR = path.join(__dirname, "..", "..", "Data");
        
        process.chdir(scriptDIR);
        
        const pythonScript = path.join(scriptDIR, 'plot_gen.py');
        const python = spawn('python', [pythonScript, countries, plotType]);
        
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

// Converts preset info into plot types
function PlotType(type, count, world){
    if(count === "Per Dollar"){
        return "Carbon emission intensity of economies";
    }
    
    if(world){
        return "CO2 Global Share";
    }

    if(type === "N2O"){
        if(count === "Per Country"){
            return "Annual nitrous oxide emissions";
        }
        else if(count === "Per Capita"){
            return "Nitrous oxide per population";
        }
    }
    else if(type === "Methane"){
        if(count === "Per Country"){
            return "Annual methane emissions";
        }
        else if(count === "Per Capita"){
            return "Methane per population";
        }
    }
    else if(type === "CO2"){
        if(count === "Per Country"){
            return "Annual CO2 emissions";
        }
        else if(count === "Per Capita"){
            return "Per Capita CO2";
        }
    }

    return false;
}

// Generate a Graph
router.post('/generate', async function(req,res){
    const preset = req.body;

    try{
        const result = await GenerateGraph(preset);
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