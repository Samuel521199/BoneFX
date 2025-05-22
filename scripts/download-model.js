const https = require('https');
const fs = require('fs');
const path = require('path');

const MODEL_URL = 'https://github.com/isl-org/MiDaS/releases/download/v2_1/model-small.onnx';
const MODEL_DIR = path.join(__dirname, '../public/models');
const MODEL_PATH = path.join(MODEL_DIR, 'midas.onnx');

// 确保目录存在
if (!fs.existsSync(MODEL_DIR)) {
    fs.mkdirSync(MODEL_DIR, { recursive: true });
}

// 下载模型
console.log('Downloading depth estimation model...');
https.get(MODEL_URL, (response) => {
    const file = fs.createWriteStream(MODEL_PATH);
    response.pipe(file);
    file.on('finish', () => {
        file.close();
        console.log('Model downloaded successfully!');
    });
}).on('error', (err) => {
    console.error('Error downloading model:', err);
    fs.unlink(MODEL_PATH, () => {});
}); 