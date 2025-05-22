import React, { useCallback } from 'react';
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
} from '@mui/material';
import {
    Image as ImageIcon,
    Movie as MovieIcon,
    AudioFile as AudioIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
    Transform as TransformIcon,
} from '@mui/icons-material';
import { ParallaxMapGenerator } from '../../core/utils/ParallaxMapGenerator';

interface Asset {
    id: string;
    name: string;
    type: 'image' | 'video' | 'audio';
    path: string;
    parallaxMaps?: {
        diffuseMap: string;
        depthMap: string;
        normalMap: string;
    };
}

const mockAssets: Asset[] = [
    { id: '1', name: 'character.png', type: 'image', path: '/assets/character.png' },
    { id: '2', name: 'background.jpg', type: 'image', path: '/assets/background.jpg' },
    { id: '3', name: 'effect.mp4', type: 'video', path: '/assets/effect.mp4' },
    { id: '4', name: 'music.mp3', type: 'audio', path: '/assets/music.mp3' },
];

export const AssetPanel: React.FC = () => {
    const parallaxGenerator = React.useRef<ParallaxMapGenerator>(new ParallaxMapGenerator());
    const [assets, setAssets] = React.useState<Asset[]>(mockAssets);
    const [isGenerating, setIsGenerating] = React.useState(false);
    const [generatingAssetId, setGeneratingAssetId] = React.useState<string | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        parallaxGenerator.current.initialize();
        return () => {
            parallaxGenerator.current.dispose();
        };
    }, []);

    const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        const newAssets: Asset[] = Array.from(files).map((file) => {
            const type = file.type.startsWith('image/') ? 'image' :
                        file.type.startsWith('video/') ? 'video' : 'audio';
            
            return {
                id: Math.random().toString(36).substr(2, 9),
                name: file.name,
                type,
                path: URL.createObjectURL(file),
            };
        });

        setAssets(prev => [...prev, ...newAssets]);
        
        // 重置文件输入框的值，这样相同的文件可以再次被选择
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, []);

    const handleAddClick = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleDeleteAsset = useCallback((assetId: string) => {
        setAssets(prevAssets => {
            const asset = prevAssets.find(a => a.id === assetId);
            if (asset) {
                // 释放资源URL
                URL.revokeObjectURL(asset.path);
                if (asset.parallaxMaps) {
                    URL.revokeObjectURL(asset.parallaxMaps.diffuseMap);
                    URL.revokeObjectURL(asset.parallaxMaps.depthMap);
                    URL.revokeObjectURL(asset.parallaxMaps.normalMap);
                }
            }
            return prevAssets.filter(a => a.id !== assetId);
        });
    }, []);

    const handleGenerateParallaxMap = useCallback(async (asset: Asset) => {
        if (asset.type !== 'image' || isGenerating) return;

        try {
            setIsGenerating(true);
            setGeneratingAssetId(asset.id);
            
            const maps = await parallaxGenerator.current.generateParallaxMap(asset.path);
            
            // 将生成的贴图转换为URL
            const diffuseUrl = URL.createObjectURL(new Blob([maps.diffuseMap.data], { type: 'image/png' }));
            const depthUrl = URL.createObjectURL(new Blob([maps.depthMap.data], { type: 'image/png' }));
            const normalUrl = URL.createObjectURL(new Blob([maps.normalMap.data], { type: 'image/png' }));

            // 更新资产
            setAssets(prevAssets => prevAssets.map(a => 
                a.id === asset.id
                    ? {
                        ...a,
                        parallaxMaps: {
                            diffuseMap: diffuseUrl,
                            depthMap: depthUrl,
                            normalMap: normalUrl,
                        },
                    }
                    : a
            ));
        } catch (error) {
            console.error('Failed to generate parallax map:', error);
            alert('生成视差贴图失败，请重试');
        } finally {
            setIsGenerating(false);
            setGeneratingAssetId(null);
        }
    }, [isGenerating]);

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
                onChange={handleFileSelect}
                accept="image/*,video/*,audio/*"
                multiple
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
                <IconButton size="small" onClick={handleAddClick}>
                    <AddIcon />
                </IconButton>
            </Box>

            <Divider />

            {/* 资源列表 */}
            <List sx={{ flex: 1, overflow: 'auto' }}>
                {assets.map((asset) => (
                    <ListItem
                        key={asset.id}
                        secondaryAction={
                            <Box>
                                {asset.type === 'image' && !asset.parallaxMaps && (
                                    <Tooltip title="生成视差贴图">
                                        <IconButton
                                            edge="end"
                                            size="small"
                                            onClick={() => handleGenerateParallaxMap(asset)}
                                            disabled={isGenerating}
                                        >
                                            {generatingAssetId === asset.id ? (
                                                <CircularProgress size={24} />
                                            ) : (
                                                <TransformIcon />
                                            )}
                                        </IconButton>
                                    </Tooltip>
                                )}
                                <Tooltip title="删除资源">
                                    <IconButton
                                        edge="end"
                                        size="small"
                                        onClick={() => handleDeleteAsset(asset.id)}
                                        disabled={isGenerating}
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
                                    asset.parallaxMaps
                                        ? '已生成视差贴图'
                                        : asset.type
                                }
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}; 