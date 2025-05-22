import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';

export class BoneFXRenderer {
    private scene: THREE.Scene;
    private camera: THREE.OrthographicCamera;
    private renderer: THREE.WebGLRenderer;
    private composer: EffectComposer;
    private clock: THREE.Clock;

    constructor(container: HTMLElement) {
        // 初始化场景
        this.scene = new THREE.Scene();
        this.clock = new THREE.Clock();

        // 设置正交相机
        const aspect = container.clientWidth / container.clientHeight;
        const frustumSize = 10;
        this.camera = new THREE.OrthographicCamera(
            frustumSize * aspect / -2,
            frustumSize * aspect / 2,
            frustumSize / 2,
            frustumSize / -2,
            0.1,
            1000
        );
        this.camera.position.z = 5;

        // 初始化渲染器
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(this.renderer.domElement);

        // 初始化后期处理
        this.composer = new EffectComposer(this.renderer);
        const renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);

        // 添加窗口大小变化监听
        window.addEventListener('resize', this.onWindowResize.bind(this));
    }

    private onWindowResize(): void {
        const container = this.renderer.domElement.parentElement;
        if (!container) return;

        const width = container.clientWidth;
        const height = container.clientHeight;
        const aspect = width / height;

        // 更新相机
        const frustumSize = 10;
        this.camera.left = frustumSize * aspect / -2;
        this.camera.right = frustumSize * aspect / 2;
        this.camera.top = frustumSize / 2;
        this.camera.bottom = frustumSize / -2;
        this.camera.updateProjectionMatrix();

        // 更新渲染器
        this.renderer.setSize(width, height);
        this.composer.setSize(width, height);
    }

    public render(): void {
        this.composer.render();
    }

    public getScene(): THREE.Scene {
        return this.scene;
    }

    public getCamera(): THREE.OrthographicCamera {
        return this.camera;
    }

    public dispose(): void {
        this.renderer.dispose();
        this.composer.dispose();
        window.removeEventListener('resize', this.onWindowResize.bind(this));
    }
} 