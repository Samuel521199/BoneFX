import React from 'react';
import {
    Box,
    Typography,
    IconButton,
    Slider,
    Paper,
} from '@mui/material';
import {
    PlayArrow as PlayIcon,
    Pause as PauseIcon,
    SkipNext as NextIcon,
    SkipPrevious as PrevIcon,
} from '@mui/icons-material';

export const Timeline: React.FC = () => {
    return (
        <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* 时间轴控制 */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <IconButton size="small">
                    <PrevIcon />
                </IconButton>
                <IconButton size="small">
                    <PlayIcon />
                </IconButton>
                <IconButton size="small">
                    <PauseIcon />
                </IconButton>
                <IconButton size="small">
                    <NextIcon />
                </IconButton>
                <Typography variant="body2" sx={{ mx: 2 }}>
                    00:00 / 00:10
                </Typography>
            </Box>

            {/* 时间轴滑块 */}
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ width: 40 }}>
                    0s
                </Typography>
                <Slider
                    size="small"
                    defaultValue={0}
                    min={0}
                    max={10}
                    step={0.1}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value}s`}
                    sx={{ mx: 2 }}
                />
                <Typography variant="body2" sx={{ width: 40 }}>
                    10s
                </Typography>
            </Box>

            {/* 关键帧轨道 */}
            <Paper
                variant="outlined"
                sx={{
                    mt: 2,
                    height: 100,
                    overflow: 'auto',
                    bgcolor: 'background.paper',
                }}
            >
                {/* 这里可以添加关键帧轨道的内容 */}
            </Paper>
        </Box>
    );
}; 