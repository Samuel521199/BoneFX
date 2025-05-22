import * as THREE from 'three';
import { ParallaxNormalMaterial } from './ParallaxNormalMaterial';

export class ParallaxSprite extends THREE.Mesh {
    private material: ParallaxNormalMaterial;

    constructor(
        diffuseMap: THREE.Texture,
        normalMap: THREE.Texture,
        depthMap: THREE.Texture,
        width: number,
        height: number,
        options: {
            parallaxScale?: number;
            parallaxMinLayers?: number;
            parallaxMaxLayers?: number;
            lightPosition?: THREE.Vector3;
            lightColor?: THREE.Color;
            ambientColor?: THREE.Color;
        } = {}
    ) {
        // 创建平面几何体
        const geometry = new THREE.PlaneGeometry(width, height);

        // 创建材质
        const material = new ParallaxNormalMaterial(
            diffuseMap,
            normalMap,
            depthMap,
            options
        );

        super(geometry, material);
        this.material = material;

        // 设置默认朝向
        this.rotation.x = -Math.PI / 2;
    }

    public setParallaxScale(scale: number): void {
        this.material.setParallaxScale(scale);
    }

    public setLightPosition(position: THREE.Vector3): void {
        this.material.setLightPosition(position);
    }

    public setLightColor(color: THREE.Color): void {
        this.material.setLightColor(color);
    }

    public setAmbientColor(color: THREE.Color): void {
        this.material.setAmbientColor(color);
    }

    public dispose(): void {
        this.geometry.dispose();
        this.material.dispose();
    }
} 