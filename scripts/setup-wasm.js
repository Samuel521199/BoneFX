const https = require('https');
const fs = require('fs');
const path = require('path');

const WASM_FILES = [
    {
        name: 'ort-wasm.wasm',
        url: 'https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/ort-wasm.wasm'
    },
    {
        name: 'ort-wasm-simd.wasm',
        url: 'https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/ort-wasm-simd.wasm'
    },
    {
        name: 'ort-wasm-threaded.wasm',
        url: 'https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/ort-wasm-threaded.wasm'
    },
    {
        name: 'ort-wasm-simd-threaded.wasm',
        url: 'https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/ort-wasm-simd-threaded.wasm'
    }
];

const WASM_DIR = path.join(__dirname, '../public/wasm');

// 确保目录存在
if (!fs.existsSync(WASM_DIR)) {
    fs.mkdirSync(WASM_DIR, { recursive: true });
}

// 下载 WASM 文件
async function downloadWasmFiles() {
    console.log('Downloading WASM files...');
    
    for (const file of WASM_FILES) {
        const filePath = path.join(WASM_DIR, file.name);
        
        // 如果文件已存在，跳过下载
        if (fs.existsSync(filePath)) {
            console.log(`File ${file.name} already exists, skipping...`);
            continue;
        }
        
        console.log(`Downloading ${file.name}...`);
        
        try {
            await new Promise((resolve, reject) => {
                https.get(file.url, (response) => {
                    if (response.statusCode !== 200) {
                        reject(new Error(`Failed to download ${file.name}: ${response.statusCode}`));
                        return;
                    }
                    
                    const fileStream = fs.createWriteStream(filePath);
                    response.pipe(fileStream);
                    
                    fileStream.on('finish', () => {
                        fileStream.close();
                        console.log(`Downloaded ${file.name} successfully`);
                        resolve();
                    });
                    
                    fileStream.on('error', (err) => {
                        fs.unlink(filePath, () => {});
                        reject(err);
                    });
                }).on('error', (err) => {
                    reject(err);
                });
            });
        } catch (error) {
            console.error(`Error downloading ${file.name}:`, error.message);
        }
    }
}

// 执行下载
downloadWasmFiles().catch(console.error); 