const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: './.env' });

const request = require('https').request;

function getModels() {
    const options = {
        hostname: 'generativelanguage.googleapis.com',
        port: 443,
        path: '/v1beta/models?key=' + process.env.GEMINI_API_KEY,
        method: 'GET'
    };

    const req = request(options, res => {
        let rawData = '';
        res.on('data', d => rawData += d);
        res.on('end', () => {
            const data = JSON.parse(rawData);
            const flashModels = data.models.filter(m => m.name.includes('flash'));
            console.log(flashModels.map(m => m.name));
        });
    });

    req.on('error', e => console.error(e));
    req.end();
}

getModels();
