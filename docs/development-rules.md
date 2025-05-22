# BoneFX 开发规范

## 1. 项目结构规范

### 1.1 目录结构
```
BoneFX/
├── editor/              # 编辑器界面
│   ├── components/      # UI组件
│   │   ├── common/     # 通用组件
│   │   ├── timeline/   # 时间轴组件
│   │   ├── canvas/     # 画布组件
│   │   └── panels/     # 面板组件
│   ├── views/          # 视图组件
│   │   ├── main/       # 主视图
│   │   ├── preview/    # 预览视图
│   │   └── settings/   # 设置视图
│   └── styles/         # 样式文件
├── core/               # 核心渲染引擎
│   ├── renderer/       # 渲染器实现
│   ├── shaders/        # 着色器文件
│   └── utils/          # 工具函数
├── ai/                 # AI模型集成
│   ├── models/         # AI模型定义
│   ├── processors/     # 图像处理器
│   └── interfaces/     # AI接口定义
├── animation/          # 动画系统
│   ├── bones/          # 骨骼系统
│   ├── timeline/       # 时间轴系统
│   └── effects/        # 特效系统
├── plugins/            # 引擎插件
│   ├── unity/          # Unity插件
│   ├── unreal/         # Unreal插件
│   └── webgl/          # WebGL插件
├── tools/              # 开发工具
│   ├── converters/     # 格式转换工具
│   └── preview/        # 预览工具
└── examples/           # 示例项目
```

### 1.2 文件命名规范
- 类文件：使用PascalCase（如：`ParallaxRenderer.ts`）
- 工具函数：使用camelCase（如：`textureUtils.ts`）
- 配置文件：使用kebab-case（如：`config.json`）
- 着色器文件：使用snake_case（如：`parallax_shader.glsl`）
- React组件：使用PascalCase（如：`TimelineEditor.tsx`）
- 样式文件：使用kebab-case（如：`timeline-editor.css`）

## 2. 代码规范

### 2.1 TypeScript规范
```typescript
// 类定义
export class ParallaxRenderer {
    private readonly _texture: WebGLTexture;
    private _rotation: number = 0;

    constructor(options: RendererOptions) {
        // 实现
    }

    public render(): void {
        // 实现
    }
}

// 接口定义
export interface RendererOptions {
    width: number;
    height: number;
    quality: 'low' | 'medium' | 'high';
}

// 类型定义
export type TextureFormat = 'rgba' | 'rgb' | 'grayscale';
```

### 2.2 React组件规范
```typescript
// 组件定义
export const TimelineEditor: React.FC<TimelineEditorProps> = ({
    timeline,
    onUpdate,
    ...props
}) => {
    // 实现
};

// Props接口
interface TimelineEditorProps {
    timeline: Timeline;
    onUpdate: (timeline: Timeline) => void;
    className?: string;
}

// 样式定义
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
    },
    // ...
}));
```

### 2.3 状态管理规范
```typescript
// Zustand store定义
interface EditorState {
    currentFrame: number;
    timeline: Timeline;
    setCurrentFrame: (frame: number) => void;
    updateTimeline: (timeline: Timeline) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
    currentFrame: 0,
    timeline: new Timeline(),
    setCurrentFrame: (frame) => set({ currentFrame: frame }),
    updateTimeline: (timeline) => set({ timeline }),
}));
```

### 2.4 错误处理规范
```typescript
try {
    // 可能抛出错误的代码
} catch (error) {
    if (error instanceof TextureError) {
        // 处理纹理错误
    } else if (error instanceof ShaderError) {
        // 处理着色器错误
    } else {
        // 处理未知错误
        throw new BoneFXError('Unknown error occurred', error);
    }
}
```

## 3. 插件开发规范

### 3.1 插件接口
```typescript
export interface IBoneFXPlugin {
    initialize(): Promise<void>;
    render(sprite: Sprite): void;
    cleanup(): void;
}
```

### 3.2 插件实现
```typescript
export class UnityPlugin implements IBoneFXPlugin {
    public async initialize(): Promise<void> {
        // Unity特定初始化
    }

    public render(sprite: Sprite): void {
        // Unity特定渲染
    }

    public cleanup(): void {
        // Unity特定清理
    }
}
```

## 4. AI模型集成规范

### 4.1 模型接口
```typescript
export interface IAIProcessor {
    processImage(input: ImageData): Promise<ProcessedData>;
    validateInput(input: ImageData): boolean;
}
```

### 4.2 模型实现
```typescript
export class DepthProcessor implements IAIProcessor {
    public async processImage(input: ImageData): Promise<ProcessedData> {
        // 实现深度处理
    }

    public validateInput(input: ImageData): boolean {
        // 实现输入验证
    }
}
```

## 5. 测试规范

### 5.1 单元测试
```typescript
describe('ParallaxRenderer', () => {
    it('should initialize with valid options', () => {
        // 测试实现
    });

    it('should throw error with invalid options', () => {
        // 测试实现
    });
});
```

### 5.2 组件测试
```typescript
describe('TimelineEditor', () => {
    it('should render timeline correctly', () => {
        // 测试实现
    });

    it('should handle timeline updates', () => {
        // 测试实现
    });
});
```

## 6. 性能优化规范

### 6.1 渲染优化
- 使用WebGL 2.0特性
- 实现纹理缓存
- 使用批处理渲染
- 实现LOD系统

### 6.2 编辑器性能优化
- 使用虚拟滚动
- 实现画布缓存
- 使用Web Workers处理复杂计算
- 实现增量更新

### 6.3 内存管理
- 及时释放WebGL资源
- 实现资源池
- 使用弱引用管理缓存

## 7. 文档规范

### 7.1 API文档
- 使用TypeDoc生成API文档
- 为所有公共API添加详细注释
- 提供使用示例

### 7.2 组件文档
- 使用Storybook管理组件文档
- 为每个组件提供使用示例
- 包含Props说明和类型定义

### 7.3 示例文档
- 提供完整的示例代码
- 包含效果预览
- 提供性能数据 