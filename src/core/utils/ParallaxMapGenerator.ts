import { DepthGenerator } from '../ai/DepthGenerator';

export class ParallaxMapGenerator {
    private depthGenerator: DepthGenerator;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    constructor() {
        this.depthGenerator = new DepthGenerator();
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d')!;
    }

    public async initialize(): Promise<void> {
        await this.depthGenerator.initialize();
    }

    public async generateParallaxMap(imageUrl: string): Promise<{
        diffuseMap: ImageData;
        depthMap: ImageData;
        normalMap: ImageData;
    }> {
        // 加载原始图像
        const image = await this.loadImage(imageUrl);
        this.canvas.width = image.width;
        this.canvas.height = image.height;
        this.ctx.drawImage(image, 0, 0);
        const diffuseMap = this.ctx.getImageData(0, 0, image.width, image.height);

        // 生成深度图
        const depthMap = await this.depthGenerator.generateDepthMap(diffuseMap);

        // 从深度图生成法线贴图
        const normalMap = this.generateNormalMap(depthMap);

        return {
            diffuseMap,
            depthMap,
            normalMap,
        };
    }

    private loadImage(url: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = url;
        });
    }

    private generateNormalMap(depthMap: ImageData): ImageData {
        const { width, height, data } = depthMap;
        const normalMap = new ImageData(width, height);
        const strength = 5.0; // 法线贴图强度

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = (y * width + x) * 4;

                // 获取相邻像素的深度值
                const left = x > 0 ? data[idx - 4] : data[idx];
                const right = x < width - 1 ? data[idx + 4] : data[idx];
                const top = y > 0 ? data[idx - width * 4] : data[idx];
                const bottom = y < height - 1 ? data[idx + width * 4] : data[idx];

                // 计算法线向量
                const dx = (right - left) * strength;
                const dy = (bottom - top) * strength;
                const dz = 1.0;

                // 归一化法线向量
                const length = Math.sqrt(dx * dx + dy * dy + dz * dz);
                const nx = (dx / length + 1) * 127.5;
                const ny = (dy / length + 1) * 127.5;
                const nz = (dz / length + 1) * 127.5;

                // 设置法线贴图像素值
                normalMap.data[idx] = nx;     // R
                normalMap.data[idx + 1] = ny; // G
                normalMap.data[idx + 2] = nz; // B
                normalMap.data[idx + 3] = 255; // A
            }
        }

        return normalMap;
    }

    public dispose(): void {
        this.depthGenerator.dispose();
    }
} 