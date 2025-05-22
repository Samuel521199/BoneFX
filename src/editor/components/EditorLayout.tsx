import React from 'react';
import { Box, Paper } from '@mui/material';

interface EditorLayoutProps {
    toolbar: React.ReactNode;
    preview: React.ReactNode;
    propertyPanel: React.ReactNode;
    timeline: React.ReactNode;
    assetPanel: React.ReactNode;
}

export const EditorLayout: React.FC<EditorLayoutProps> = ({
    toolbar,
    preview,
    propertyPanel,
    timeline,
    assetPanel,
}) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            {/* 顶部工具栏 */}
            <Paper
                elevation={3}
                sx={{
                    height: 64,
                    display: 'flex',
                    alignItems: 'center',
                    px: 2,
                }}
            >
                {toolbar}
            </Paper>

            {/* 主要内容区域 */}
            <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                {/* 左侧资源面板 */}
                <Paper
                    elevation={3}
                    sx={{
                        width: 240,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                    }}
                >
                    {assetPanel}
                </Paper>

                {/* 中间预览区域 */}
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <Box sx={{ flex: 1, position: 'relative' }}>
                        {preview}
                    </Box>
                    {/* 底部时间轴 */}
                    <Paper
                        elevation={3}
                        sx={{
                            height: 200,
                            overflow: 'hidden',
                        }}
                    >
                        {timeline}
                    </Paper>
                </Box>

                {/* 右侧属性面板 */}
                <Paper
                    elevation={3}
                    sx={{
                        width: 300,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                    }}
                >
                    {propertyPanel}
                </Paper>
            </Box>
        </Box>
    );
}; 