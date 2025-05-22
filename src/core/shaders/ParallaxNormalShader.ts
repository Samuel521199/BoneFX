import * as THREE from 'three';

export const ParallaxNormalShader = {
    uniforms: {
        'tDiffuse': { value: null },
        'tNormal': { value: null },
        'tDepth': { value: null },
        'parallaxScale': { value: 0.1 },
        'parallaxMinLayers': { value: 8 },
        'parallaxMaxLayers': { value: 32 },
        'lightPosition': { value: new THREE.Vector3(0, 0, 1) },
        'lightColor': { value: new THREE.Color(0xffffff) },
        'ambientColor': { value: new THREE.Color(0x404040) }
    },

    vertexShader: `
        varying vec2 vUv;
        varying vec3 vViewPosition;
        varying vec3 vNormal;
        
        void main() {
            vUv = uv;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            vViewPosition = -mvPosition.xyz;
            vNormal = normalMatrix * normal;
            gl_Position = projectionMatrix * mvPosition;
        }
    `,

    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform sampler2D tNormal;
        uniform sampler2D tDepth;
        uniform float parallaxScale;
        uniform float parallaxMinLayers;
        uniform float parallaxMaxLayers;
        uniform vec3 lightPosition;
        uniform vec3 lightColor;
        uniform vec3 ambientColor;
        
        varying vec2 vUv;
        varying vec3 vViewPosition;
        varying vec3 vNormal;
        
        vec2 parallaxOcclusionMapping(vec2 uv, vec3 viewDir) {
            float numLayers = mix(parallaxMaxLayers, parallaxMinLayers, abs(dot(vec3(0.0, 0.0, 1.0), viewDir)));
            float layerDepth = 1.0 / numLayers;
            float currentLayerDepth = 0.0;
            vec2 P = viewDir.xy * parallaxScale;
            vec2 deltaUv = P / numLayers;
            
            vec2 currentUv = uv;
            float currentDepth = texture2D(tDepth, currentUv).r;
            
            while(currentLayerDepth < currentDepth) {
                currentUv -= deltaUv;
                currentDepth = texture2D(tDepth, currentUv).r;
                currentLayerDepth += layerDepth;
            }
            
            vec2 prevUv = currentUv + deltaUv;
            float afterDepth = currentDepth - currentLayerDepth;
            float beforeDepth = texture2D(tDepth, prevUv).r - currentLayerDepth + layerDepth;
            
            float weight = afterDepth / (afterDepth - beforeDepth);
            return mix(currentUv, prevUv, weight);
        }
        
        void main() {
            vec3 viewDir = normalize(vViewPosition);
            vec2 uv = parallaxOcclusionMapping(vUv, viewDir);
            
            vec4 diffuseColor = texture2D(tDiffuse, uv);
            vec3 normal = normalize(texture2D(tNormal, uv).rgb * 2.0 - 1.0);
            
            vec3 lightDir = normalize(lightPosition);
            float diffuse = max(dot(normal, lightDir), 0.0);
            
            vec3 finalColor = diffuseColor.rgb * (ambientColor + lightColor * diffuse);
            gl_FragColor = vec4(finalColor, diffuseColor.a);
        }
    `
}; 