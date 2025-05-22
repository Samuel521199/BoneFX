import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemButton,
    Divider,
    IconButton,
    Button,
    CircularProgress,
    Tooltip,
    Menu,
    MenuItem,
    Slider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
} from '@mui/material';
import {
    Image as ImageIcon,
    Movie as MovieIcon,
    AudioFile as AudioIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
    Transform as TransformIcon,
    Settings as SettingsIcon,
    Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { ParallaxMapGenerator } from '../../core/utils/ParallaxMapGenerator';
import { useAssetStore } from '../../stores/assetStore';

interface Asset {
    id: string;
    name: string;
    type: 'image' | 'video' | 'audio' | 'depth' | 'normal';
    url: string;
    parallaxMapUrl?: string;
}

// 文件转 base64
function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export const AssetPanel: React.FC = () => {
    const parallaxGenerator = React.useRef<ParallaxMapGenerator | null>(null);
    const [isGenerating, setIsGenerating] = React.useState(false);
    const [generatingAssetId, setGeneratingAssetId] = React.useState<string | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [settingsAnchorEl, setSettingsAnchorEl] = React.useState<null | HTMLElement>(null);
    const [settingsOpen, setSettingsOpen] = React.useState(false);
    const [quality, setQuality] = React.useState<'low' | 'medium' | 'high'>('medium');
    const [normalStrength, setNormalStrength] = React.useState(5.0);
    const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewAsset, setPreviewAsset] = useState<Asset | null>(null);
    const { assets, addAsset, removeAsset, updateAsset, selectAsset, setAssets } = useAssetStore();

    // 页面加载时恢复 localStorage
    useEffect(() => {
        const saved = localStorage.getItem('assets');
        if (saved) {
            try {
                const parsed: Asset[] = JSON.parse(saved);
                setAssets(parsed);
            } catch {}
        }
        // eslint-disable-next-line
    }, []);

    // 每次 assets 变化时同步 localStorage
    useEffect(() => {
        localStorage.setItem('assets', JSON.stringify(assets));
    }, [assets]);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        for (const file of Array.from(files)) {
            if (file.type.startsWith('image/')) {
                const base64 = await fileToBase64(file);
                const asset: Asset = {
                    id: Date.now().toString() + Math.random().toString(36).slice(2),
                    name: file.name,
                    type: 'image',
                    url: base64,
                };
                addAsset(asset);
                console.log('添加图片资源:', asset);
            }
        }
    };

    const handleAddClick = () => {
        fileInputRef.current?.click();
    };

    const handleDeleteAsset = (assetId: string) => {
        setAssets(prevAssets => {
            const asset = prevAssets.find(a => a.id === assetId);
            if (asset) {
                // 释放资源URL
                URL.revokeObjectURL(asset.url);
                if (asset.parallaxMapUrl) {
                    URL.revokeObjectURL(asset.parallaxMapUrl);
                }
            }
            return prevAssets.filter(a => a.id !== assetId);
        });
    };

    const handleSettingsClick = (event: React.MouseEvent<HTMLElement>) => {
        setSettingsAnchorEl(event.currentTarget);
        setSettingsOpen(true);
    };

    const handleSettingsClose = () => {
        setSettingsAnchorEl(null);
        setSettingsOpen(false);
    };

    const handleQualityChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const newQuality = event.target.value as 'low' | 'medium' | 'high';
        setQuality(newQuality);
        parallaxGenerator.current?.setQuality(newQuality);
    };

    const handleNormalStrengthChange = (event: Event, newValue: number | number[]) => {
        const strength = newValue as number;
        setNormalStrength(strength);
        parallaxGenerator.current?.setNormalStrength(strength);
    };

    const handleGenerateParallaxMap = async (asset: Asset) => {
        console.log('点击生成视差贴图', asset);
        if (!parallaxGenerator.current) {
            parallaxGenerator.current = new ParallaxMapGenerator();
        }
        setIsGenerating(true);
        setGeneratingAssetId(asset.id);
        try {
            const { depthMap } = await parallaxGenerator.current.generateParallaxMap(asset.url);
            // 将 ImageData 转为 PNG Blob
            const canvas = document.createElement('canvas');
            canvas.width = depthMap.width;
            canvas.height = depthMap.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('无法创建画布上下文');
            ctx.putImageData(depthMap, 0, 0);
            const blob: Blob = await new Promise(resolve => canvas.toBlob(blob => resolve(blob!), 'image/png'));
            const depthMapUrl = URL.createObjectURL(blob);
            updateAsset(asset.id, {
                ...asset,
                parallaxMapUrl: depthMapUrl
            });
            alert('视差贴图生成成功！');
        } catch (error) {
            console.error('生成视差贴图失败:', error);
            alert('生成视差贴图失败: ' + (error instanceof Error ? error.message : error));
        } finally {
            setIsGenerating(false);
            setGeneratingAssetId(null);
            console.log('生成结束');
        }
    };

    const handlePreview = (asset: Asset) => {
        setPreviewAsset(asset);
        setPreviewOpen(true);
    };

    const handleClosePreview = () => {
        setPreviewOpen(false);
        setPreviewAsset(null);
    };

    const handleAssetClick = (asset: Asset) => {
        selectAsset(asset);
    };

    const getAssetIcon = (type: Asset['type']) => {
        switch (type) {
            case 'image':
                return <ImageIcon />;
            case 'video':
                return <MovieIcon />;
            case 'audio':
                return <AudioIcon />;
        }
    };

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* 隐藏的文件输入框 */}
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileUpload}
                accept="image/*,video/*,audio/*"
                multiple
                id="asset-upload"
                aria-label="导入图片"
            />

            {/* 标题栏 */}
            <Box
                sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <Typography variant="h6">资源</Typography>
                <Box>
                    <IconButton size="small" onClick={handleSettingsClick}>
                        <SettingsIcon />
                    </IconButton>
                    <IconButton size="small" onClick={handleAddClick}>
                        <AddIcon />
                    </IconButton>
                </Box>
            </Box>

            <Divider />

            {/* 资源列表 */}
            <List sx={{ flex: 1, overflow: 'auto' }}>
                {assets.map((asset) => (
                    <ListItem
                        key={asset.id}
                        selected={selectedAsset?.id === asset.id}
                        onClick={() => handleAssetClick(asset)}
                        secondaryAction={
                            <Box>
                                {asset.type === 'image' && !asset.parallaxMapUrl && (
                                    <Tooltip title="生成视差贴图">
                                        <IconButton
                                            edge="end"
                                            onClick={() => handleGenerateParallaxMap(asset)}
                                            disabled={isGenerating}
                                            aria-label="生成视差贴图"
                                        >
                                            {generatingAssetId === asset.id ? (
                                                <CircularProgress size={24} />
                                            ) : (
                                                <TransformIcon />
                                            )}
                                        </IconButton>
                                    </Tooltip>
                                )}
                                <Tooltip title="预览">
                                    <IconButton
                                        edge="end"
                                        onClick={() => handlePreview(asset)}
                                        aria-label="预览"
                                    >
                                        <VisibilityIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="删除">
                                    <IconButton
                                        edge="end"
                                        onClick={() => handleDeleteAsset(asset.id)}
                                        aria-label="删除"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        }
                        disablePadding
                    >
                        <ListItemButton>
                            <ListItemIcon>{getAssetIcon(asset.type)}</ListItemIcon>
                            <ListItemText
                                primary={asset.name}
                                secondary={
                                    asset.parallaxMapUrl
                                        ? '已生成视差贴图'
                                        : asset.type
                                }
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            {/* 设置对话框 */}
            <Dialog open={settingsOpen} onClose={handleSettingsClose}>
                <DialogTitle>视差贴图设置</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>生成质量</InputLabel>
                            <Select
                                value={quality}
                                label="生成质量"
                                onChange={handleQualityChange}
                            >
                                <MenuItem value="low">低（快速）</MenuItem>
                                <MenuItem value="medium">中（平衡）</MenuItem>
                                <MenuItem value="high">高（精细）</MenuItem>
                            </Select>
                        </FormControl>
                        <Typography gutterBottom>法线贴图强度</Typography>
                        <Slider
                            value={normalStrength}
                            onChange={handleNormalStrengthChange}
                            min={1}
                            max={10}
                            step={0.1}
                            marks
                            valueLabelDisplay="auto"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSettingsClose}>确定</Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={previewOpen}
                onClose={handleClosePreview}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>预览</DialogTitle>
                <DialogContent>
                    {previewAsset && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box>
                                <Typography variant="subtitle1">原始图片</Typography>
                                <img
                                    src={previewAsset.url}
                                    alt={previewAsset.name}
                                    style={{ maxWidth: '100%', height: 'auto' }}
                                    onError={e => {
                                        (e.target as HTMLImageElement).src = '';
                                        alert('图片加载失败，base64数据有误');
                                    }}
                                />
                            </Box>
                            {previewAsset.parallaxMapUrl && (
                                <Box>
                                    <Typography variant="subtitle1">视差贴图</Typography>
                                    <img
                                        src={previewAsset.parallaxMapUrl}
                                        alt={`${previewAsset.name} - 视差贴图`}
                                        style={{ maxWidth: '100%', height: 'auto' }}
                                    />
                                </Box>
                            )}
                        </Box>
                    )}
                </DialogContent>
            </Dialog>
        </Box>
    );
}; 