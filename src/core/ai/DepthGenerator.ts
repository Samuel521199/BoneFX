import * as ort from 'onnxruntime-web';

export type ModelType = 'small' | 'large' | 'hybrid';

export interface DepthGeneratorOptions {
    modelType?: ModelType;
    maxSize?: number;
    batchSize?: number;
}

export class DepthGenerator {
    private session: ort.InferenceSession | null = null;
    private modelPath: string;
    private maxSize: number;
    private batchSize: number;
    private isInitialized: boolean = false;

    constructor(options: DepthGeneratorOptions = {}) {
        const {
            modelType = 'small',
            maxSize = 512,
            batchSize = 1
        } = options;

        this.modelPath = `/models/midas-${modelType}.onnx`;
        this.maxSize = maxSize;
        this.batchSize = batchSize;
    }

    public async initialize(): Promise<void> {
        if (this.isInitialized) return;

        try {
            console.log('Initializing depth generator...');
            console.log('Model path:', this.modelPath);

            // 配置 ONNX Runtime
            ort.env.wasm.wasmPaths = {
                'ort-wasm.wasm': '/wasm/ort-wasm.wasm',
                'ort-wasm-simd.wasm': '/wasm/ort-wasm-simd.wasm',
                'ort-wasm-threaded.wasm': '/wasm/ort-wasm-threaded.wasm',
                'ort-wasm-simd-threaded.wasm': '/wasm/ort-wasm-simd-threaded.wasm'
            };

            // 设置线程数
            const numThreads = navigator.hardwareConcurrency || 4;
            console.log('Using threads:', numThreads);
            ort.env.wasm.numThreads = numThreads;

            // 创建推理会话
            console.log('Creating inference session...');
            this.session = await ort.InferenceSession.create(this.modelPath, {
                executionProviders: ['wasm'],
                graphOptimizationLevel: 'all',
                enableCpuMemArena: true,
                enableMemPattern: true,
                executionMode: 'sequential',
                extra: {
                    session: {
                        use_deterministic_compute: true
                    }
                }
            });

            console.log('Session created successfully');
            this.isInitialized = true;
        } catch (error) {
            console.error('Failed to initialize depth generator:', error);
            if (error instanceof Error) {
                throw new Error(`深度生成器初始化失败: ${error.message}`);
            }
            throw new Error('深度生成器初始化失败');
        }
    }

    public async generateDepthMap(imageData: ImageData): Promise<ImageData> {
        if (!this.isInitialized) {
            await this.initialize();
        }

        if (!this.session) {
            throw new Error('深度生成器未初始化');
        }

        try {
            console.log('Generating depth map...');
            console.log('Input image size:', imageData.width, 'x', imageData.height);

            // 预处理图像
            const { tensor, originalSize } = await this.preprocessImage(imageData);
            console.log('Preprocessed image size:', tensor.dims);

            // 运行模型推理
            console.log('Running inference...');
            const results = await this.session.run({ input: tensor });
            const depthMap = results.output;
            console.log('Inference completed');

            // 后处理深度图
            console.log('Post-processing depth map...');
            const processedMap = this.postprocessDepthMap(depthMap, originalSize);
            console.log('Depth map generation completed');

            return processedMap;
        } catch (error) {
            console.error('Failed to generate depth map:', error);
            if (error instanceof Error) {
                throw new Error(`深度图生成失败: ${error.message}`);
            }
            throw new Error('深度图生成失败');
        }
    }

    private async preprocessImage(imageData: ImageData): Promise<{
        tensor: ort.Tensor;
        originalSize: { width: number; height: number };
    }> {
        const { width, height, data } = imageData;
        const originalSize = { width, height };

        console.log('Preprocessing image...');
        console.log('Original size:', width, 'x', height);

        // 计算缩放比例
        const scale = Math.min(1, this.maxSize / Math.max(width, height));
        const newWidth = Math.floor(width * scale);
        const newHeight = Math.floor(height * scale);

        console.log('Scaled size:', newWidth, 'x', newHeight);

        // 创建临时画布进行缩放
        const canvas = document.createElement('canvas');
        canvas.width = newWidth;
        canvas.height = newHeight;
        const ctx = canvas.getContext('2d')!;

        // 绘制并缩放图像
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = width;
        tempCanvas.height = height;
        const tempCtx = tempCanvas.getContext('2d')!;
        tempCtx.putImageData(imageData, 0, 0);
        ctx.drawImage(tempCanvas, 0, 0, width, height, 0, 0, newWidth, newHeight);

        // 获取缩放后的图像数据
        const scaledData = ctx.getImageData(0, 0, newWidth, newHeight).data;
        const tensorData = new Float32Array(newWidth * newHeight * 3);

        // 归一化像素值到 [0, 1]
        for (let i = 0; i < scaledData.length; i += 4) {
            tensorData[i / 4] = scaledData[i] / 255.0;     // R
            tensorData[i / 4 + 1] = scaledData[i + 1] / 255.0; // G
            tensorData[i / 4 + 2] = scaledData[i + 2] / 255.0; // B
        }

        console.log('Image preprocessing completed');
        return {
            tensor: new ort.Tensor('float32', tensorData, [this.batchSize, 3, newHeight, newWidth]),
            originalSize
        };
    }

    private postprocessDepthMap(depthTensor: ort.Tensor, originalSize: { width: number; height: number }): ImageData {
        console.log('Post-processing depth map...');
        const depthData = depthTensor.data as Float32Array;
        const [batch, channels, height, width] = depthTensor.dims;
        const imageData = new ImageData(originalSize.width, originalSize.height);

        // 将深度值映射到 [0, 255]
        const min = Math.min(...depthData);
        const max = Math.max(...depthData);
        const range = max - min;

        console.log('Depth range:', min, 'to', max);

        // 创建临时画布进行缩放
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = width;
        tempCanvas.height = height;
        const tempCtx = tempCanvas.getContext('2d')!;
        const tempImageData = tempCtx.createImageData(width, height);

        // 填充临时图像数据
        for (let i = 0; i < depthData.length; i++) {
            const normalizedValue = (depthData[i] - min) / range;
            const pixelValue = Math.floor(normalizedValue * 255);
            
            const pixelIndex = i * 4;
            tempImageData.data[pixelIndex] = pixelValue;     // R
            tempImageData.data[pixelIndex + 1] = pixelValue; // G
            tempImageData.data[pixelIndex + 2] = pixelValue; // B
            tempImageData.data[pixelIndex + 3] = 255;        // A
        }

        // 将临时图像数据绘制到画布
        tempCtx.putImageData(tempImageData, 0, 0);

        // 创建最终画布并缩放回原始大小
        const finalCanvas = document.createElement('canvas');
        finalCanvas.width = originalSize.width;
        finalCanvas.height = originalSize.height;
        const finalCtx = finalCanvas.getContext('2d')!;
        finalCtx.drawImage(tempCanvas, 0, 0, width, height, 0, 0, originalSize.width, originalSize.height);

        console.log('Depth map post-processing completed');
        return finalCtx.getImageData(0, 0, originalSize.width, originalSize.height);
    }

    public dispose(): void {
        if (this.session) {
            this.session = null;
        }
        this.isInitialized = false;
    }
} 