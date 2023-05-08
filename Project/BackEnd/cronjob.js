const CronJob = require('cron').CronJob;
const path = require('path');
const { spawn } = require('child_process');

const job = new CronJob('0 0 0 * * 0', function() {
    const originalDIR = process.cwd();
    const scriptDIR = path.join(__dirname, "..", "..", "Data");
    
    process.chdir(scriptDIR);
    
    const pythonScript = path.join(scriptDIR, 'plot_gen.py');
    const python = spawn('python', [pythonScript]);

    python.on('error', function(err) {
        console.error('Failed to start Python script:', err);
    });
    python.on('exit', function(code, signal) {
        if (code !== 0) {
            console.error('Python script exited with error code:', code);
        }
    });
    },
    null,
    false,
    'America/New_York'
);

module.exports = {
    job,
};