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

## 8. 代码风格

### 8.1 TypeScript 规范
- 使用 TypeScript 严格模式
- 所有组件和函数必须定义类型
- 避免使用 `any` 类型
- 使用接口定义数据结构
- 使用类型别名定义复杂类型

### 8.2 React 组件规范
- 使用函数组件和 Hooks
- 组件文件使用 `.tsx` 扩展名
- 组件名称使用 PascalCase
- Props 接口命名为 `ComponentNameProps`
- 使用 `React.FC` 类型声明组件

### 8.3 文件组织
- 组件文件放在 `src/editor/components` 目录
- 工具函数放在 `src/core/utils` 目录
- AI 相关代码放在 `src/core/ai` 目录
- 样式文件与组件文件放在同一目录

## 9. 资源管理

### 9.1 资源类型
- 图片资源：支持 PNG、JPG、JPEG 格式
- 视频资源：支持 MP4、WebM 格式
- 音频资源：支持 MP3、WAV 格式

### 9.2 资源处理
- 所有资源必须通过 AssetPanel 组件导入
- 图片资源自动生成视差贴图
- 资源删除时必须释放 URL 对象
- 资源 ID 使用随机字符串生成

### 9.3 资源命名
- 文件名使用小写字母和连字符
- 避免使用空格和特殊字符
- 使用有意义的文件名

## 10. 性能优化

### 10.1 组件优化
- 使用 `React.memo` 优化纯组件
- 使用 `useCallback` 缓存函数
- 使用 `useMemo` 缓存计算结果
- 避免不必要的重渲染

### 10.2 资源优化
- 图片资源进行压缩
- 视频资源使用适当的编码
- 音频资源使用合适的比特率
- 及时释放不需要的资源

## 11. 错误处理

### 11.1 错误捕获
- 使用 try-catch 捕获异步错误
- 使用错误边界捕获渲染错误
- 记录错误日志
- 显示用户友好的错误提示

### 11.2 错误提示
- 使用 Material-UI 的 Snackbar 组件
- 错误消息要清晰明确
- 提供重试选项
- 记录详细的错误信息

## 12. 文档规范

### 12.1 代码注释
- 使用 JSDoc 格式的注释
- 为公共 API 添加文档
- 解释复杂的算法和逻辑
- 保持注释的及时更新

### 12.2 文档维护
- 及时更新 README.md
- 维护 CHANGELOG.md
- 编写使用教程
- 提供示例代码

## 13. Git 工作流

### 13.1 分支管理
- 主分支：main
- 开发分支：develop
- 功能分支：feature/*
- 修复分支：hotfix/*

### 13.2 提交规范
- 使用语义化提交信息
- 提交前进行代码格式化
- 提交前运行测试
- 提交前检查类型错误

## 14. 发布流程

### 14.1 版本管理
- 使用语义化版本号
- 主版本号：不兼容的 API 修改
- 次版本号：向下兼容的功能性新增
- 修订号：向下兼容的问题修正

### 14.2 发布检查
- 更新版本号
- 更新 CHANGELOG.md
- 运行所有测试
- 构建生产版本
- 创建发布标签 