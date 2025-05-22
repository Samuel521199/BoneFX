import * as ort from 'onnxruntime-web';

export class DepthGenerator {
    private session: ort.InferenceSession | null = null;
    private modelPath: string;

    constructor(modelPath: string = '/models/midas.onnx') {
        this.modelPath = modelPath;
    }

    public async initialize(): Promise<void> {
        try {
            this.session = await ort.InferenceSession.create(this.modelPath);
        } catch (error) {
            console.error('Failed to load depth estimation model:', error);
            throw error;
        }
    }

    public async generateDepthMap(imageData: ImageData): Promise<ImageData> {
        if (!this.session) {
            throw new Error('DepthGenerator not initialized');
        }

        // 预处理图像
        const tensor = this.preprocessImage(imageData);

        // 运行模型推理
        const results = await this.session.run({ input: tensor });
        const depthMap = results.output;

        // 后处理深度图
        return this.postprocessDepthMap(depthMap);
    }

    private preprocessImage(imageData: ImageData): ort.Tensor {
        // 将图像转换为模型所需的格式
        const { width, height, data } = imageData;
        const tensorData = new Float32Array(width * height * 3);

        // 归一化像素值到 [0, 1]
        for (let i = 0; i < data.length; i += 4) {
            tensorData[i / 4] = data[i] / 255.0;     // R
            tensorData[i / 4 + 1] = data[i + 1] / 255.0; // G
            tensorData[i / 4 + 2] = data[i + 2] / 255.0; // B
        }

        return new ort.Tensor('float32', tensorData, [1, 3, height, width]);
    }

    private postprocessDepthMap(depthTensor: ort.Tensor): ImageData {
        const depthData = depthTensor.data as Float32Array;
        const [batch, channels, height, width] = depthTensor.dims;
        const imageData = new ImageData(width, height);

        // 将深度值映射到 [0, 255]
        const min = Math.min(...depthData);
        const max = Math.max(...depthData);
        const range = max - min;

        for (let i = 0; i < depthData.length; i++) {
            const normalizedValue = (depthData[i] - min) / range;
            const pixelValue = Math.floor(normalizedValue * 255);
            
            const pixelIndex = i * 4;
            imageData.data[pixelIndex] = pixelValue;     // R
            imageData.data[pixelIndex + 1] = pixelValue; // G
            imageData.data[pixelIndex + 2] = pixelValue; // B
            imageData.data[pixelIndex + 3] = 255;        // A
        }

        return imageData;
    }

    public dispose(): void {
        if (this.session) {
            this.session = null;
        }
    }
} 