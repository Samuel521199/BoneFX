import React from 'react';
import {
    Box,
    Typography,
    TextField,
    Slider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Divider,
} from '@mui/material';

export const PropertyPanel: React.FC = () => {
    return (
        <Box sx={{ p: 2, height: '100%', overflow: 'auto' }}>
            <Typography variant="h6" gutterBottom>
                属性
            </Typography>

            {/* 变换属性 */}
            <Typography variant="subtitle2" gutterBottom>
                变换
            </Typography>
            <Box sx={{ mb: 2 }}>
                <TextField
                    label="X"
                    type="number"
                    size="small"
                    fullWidth
                    margin="dense"
                />
                <TextField
                    label="Y"
                    type="number"
                    size="small"
                    fullWidth
                    margin="dense"
                />
                <TextField
                    label="Z"
                    type="number"
                    size="small"
                    fullWidth
                    margin="dense"
                />
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* 旋转属性 */}
            <Typography variant="subtitle2" gutterBottom>
                旋转
            </Typography>
            <Box sx={{ mb: 2 }}>
                <Typography gutterBottom>X轴旋转</Typography>
                <Slider
                    size="small"
                    min={0}
                    max={360}
                    defaultValue={0}
                    valueLabelDisplay="auto"
                />
                <Typography gutterBottom>Y轴旋转</Typography>
                <Slider
                    size="small"
                    min={0}
                    max={360}
                    defaultValue={0}
                    valueLabelDisplay="auto"
                />
                <Typography gutterBottom>Z轴旋转</Typography>
                <Slider
                    size="small"
                    min={0}
                    max={360}
                    defaultValue={0}
                    valueLabelDisplay="auto"
                />
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* 缩放属性 */}
            <Typography variant="subtitle2" gutterBottom>
                缩放
            </Typography>
            <Box sx={{ mb: 2 }}>
                <TextField
                    label="X缩放"
                    type="number"
                    size="small"
                    fullWidth
                    margin="dense"
                />
                <TextField
                    label="Y缩放"
                    type="number"
                    size="small"
                    fullWidth
                    margin="dense"
                />
                <TextField
                    label="Z缩放"
                    type="number"
                    size="small"
                    fullWidth
                    margin="dense"
                />
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* 材质属性 */}
            <Typography variant="subtitle2" gutterBottom>
                材质
            </Typography>
            <Box sx={{ mb: 2 }}>
                <FormControl fullWidth size="small" margin="dense">
                    <InputLabel>材质类型</InputLabel>
                    <Select label="材质类型" defaultValue="parallax">
                        <MenuItem value="parallax">视差贴图</MenuItem>
                        <MenuItem value="normal">法线贴图</MenuItem>
                        <MenuItem value="basic">基础材质</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    label="视差强度"
                    type="number"
                    size="small"
                    fullWidth
                    margin="dense"
                />
                <TextField
                    label="光照强度"
                    type="number"
                    size="small"
                    fullWidth
                    margin="dense"
                />
            </Box>
        </Box>
    );
}; 