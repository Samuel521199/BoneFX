import { DepthGenerator, DepthGeneratorOptions } from '../ai/DepthGenerator';

export interface ParallaxMapOptions {
    depthGenerator?: DepthGeneratorOptions;
    normalStrength?: number;
    quality?: 'low' | 'medium' | 'high';
}

export class ParallaxMapGenerator {
    private depthGenerator: DepthGenerator;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private normalStrength: number;
    private quality: 'low' | 'medium' | 'high';

    constructor(options: ParallaxMapOptions = {}) {
        const {
            depthGenerator = {},
            normalStrength = 5.0,
            quality = 'medium'
        } = options;

        this.depthGenerator = new DepthGenerator(depthGenerator);
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d')!;
        this.normalStrength = normalStrength;
        this.quality = quality;
    }

    public async initialize(): Promise<void> {
        await this.depthGenerator.initialize();
    }

    public async generateParallaxMap(imageUrl: string): Promise<{
        diffuseMap: ImageData;
        depthMap: ImageData;
        normalMap: ImageData;
    }> {
        try {
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
        } catch (error) {
            console.error('Failed to generate parallax map:', error);
            throw new Error('视差贴图生成失败');
        }
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
        const strength = this.normalStrength;

        // 根据质量设置采样步长
        const step = this.quality === 'high' ? 1 : this.quality === 'medium' ? 2 : 4;

        for (let y = 0; y < height; y += step) {
            for (let x = 0; x < width; x += step) {
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
                for (let sy = 0; sy < step; sy++) {
                    for (let sx = 0; sx < step; sx++) {
                        const pixelIdx = ((y + sy) * width + (x + sx)) * 4;
                        if (pixelIdx < normalMap.data.length) {
                            normalMap.data[pixelIdx] = nx;     // R
                            normalMap.data[pixelIdx + 1] = ny; // G
                            normalMap.data[pixelIdx + 2] = nz; // B
                            normalMap.data[pixelIdx + 3] = 255; // A
                        }
                    }
                }
            }
        }

        return normalMap;
    }

    public setNormalStrength(strength: number): void {
        this.normalStrength = strength;
    }

    public setQuality(quality: 'low' | 'medium' | 'high'): void {
        this.quality = quality;
    }

    public dispose(): void {
        this.depthGenerator.dispose();
    }
} 