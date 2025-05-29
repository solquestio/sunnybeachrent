const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const ncp = promisify(require('ncp').ncp);

async function prepareDeploy() {
    const sourceDir = __dirname;
    const targetDir = path.join(__dirname, 'public');
    
    // Files to exclude
    const exclude = [
        'node_modules',
        '.git',
        '.firebase',
        'firebase-debug.log',
        'firebase-debug.*.log',
        'deploy.js',
        'package*.json',
        'firebase.json',
        '.firebaserc',
        '.gitignore'
    ];

    console.log('Preparing files for deployment...');
    
    // Copy all files except excluded ones
    await ncp(sourceDir, targetDir, {
        filter: (fileName) => {
            const relativePath = path.relative(sourceDir, fileName);
            return !exclude.some(pattern => {
                return relativePath.startsWith(pattern) || 
                       relativePath.includes(`/${pattern}`) ||
                       relativePath === pattern;
            });
        }
    });

    console.log('Files ready in public directory!');
}

prepareDeploy().catch(console.error);
