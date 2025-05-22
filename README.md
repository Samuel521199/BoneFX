# BoneFX - 2D伪3D动画制作工具

BoneFX是一个强大的2D伪3D动画制作工具，支持视差贴图、法线贴图、骨骼动画和AI模型集成。可以独立运行，也可以作为插件集成到其他游戏引擎中。

## 特性

- 2D精灵的伪3D渲染和动画制作
- 视差贴图和法线贴图支持
- 骨骼动画系统
- AI模型集成（深度图生成）
- 多引擎支持（Unity, Unreal, WebGL）
- 实时渲染和动画预览
- 动画时间轴编辑
- 骨骼绑定和权重编辑
- 动画导出和导入

## 快速开始

### Web版本
1. 访问在线编辑器：
```bash
https://bonefx-editor.web.app
```

### 本地开发版本
1. 安装依赖：
```bash
npm install
```

2. 启动开发服务器：
```bash
npm run dev
```

3. 构建生产版本：
```bash
npm run build
```

## 作为插件使用

### Unity插件
1. 从Asset Store导入BoneFX插件
2. 在场景中添加BoneFX组件
3. 导入动画资源
4. 开始使用

### Unreal插件
1. 从Marketplace导入BoneFX插件
2. 在项目中启用插件
3. 使用BoneFX蓝图节点
4. 开始使用

## 项目结构

```
BoneFX/
├── editor/              # 编辑器界面
│   ├── components/      # UI组件
│   ├── views/          # 视图组件
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

## 开发规范

请参考 `docs/development-rules.md` 了解详细的开发规范。

## 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License 