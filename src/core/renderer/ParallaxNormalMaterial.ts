import * as THREE from 'three';
import { ParallaxNormalShader } from '../shaders/ParallaxNormalShader';

export class ParallaxNormalMaterial extends THREE.ShaderMaterial {
    constructor(
        diffuseMap: THREE.Texture,
        normalMap: THREE.Texture,
        depthMap: THREE.Texture,
        options: {
            parallaxScale?: number;
            parallaxMinLayers?: number;
            parallaxMaxLayers?: number;
            lightPosition?: THREE.Vector3;
            lightColor?: THREE.Color;
            ambientColor?: THREE.Color;
        } = {}
    ) {
        super({
            uniforms: {
                ...ParallaxNormalShader.uniforms,
                tDiffuse: { value: diffuseMap },
                tNormal: { value: normalMap },
                tDepth: { value: depthMap },
                parallaxScale: { value: options.parallaxScale ?? 0.1 },
                parallaxMinLayers: { value: options.parallaxMinLayers ?? 8 },
                parallaxMaxLayers: { value: options.parallaxMaxLayers ?? 32 },
                lightPosition: { value: options.lightPosition ?? new THREE.Vector3(0, 0, 1) },
                lightColor: { value: options.lightColor ?? new THREE.Color(0xffffff) },
                ambientColor: { value: options.ambientColor ?? new THREE.Color(0x404040) }
            },
            vertexShader: ParallaxNormalShader.vertexShader,
            fragmentShader: ParallaxNormalShader.fragmentShader,
            transparent: true
        });

        // 设置纹理参数
        diffuseMap.wrapS = diffuseMap.wrapT = THREE.RepeatWrapping;
        normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping;
        depthMap.wrapS = depthMap.wrapT = THREE.RepeatWrapping;
    }

    public setParallaxScale(scale: number): void {
        this.uniforms.parallaxScale.value = scale;
    }

    public setLightPosition(position: THREE.Vector3): void {
        this.uniforms.lightPosition.value = position;
    }

    public setLightColor(color: THREE.Color): void {
        this.uniforms.lightColor.value = color;
    }

    public setAmbientColor(color: THREE.Color): void {
        this.uniforms.ambientColor.value = color;
    }
} 