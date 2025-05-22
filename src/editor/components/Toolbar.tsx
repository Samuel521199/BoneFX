import React from 'react';
import {
    AppBar,
    Toolbar as MuiToolbar,
    IconButton,
    Button,
    Divider,
    Box,
} from '@mui/material';
import {
    Add as AddIcon,
    Save as SaveIcon,
    OpenInNew as OpenIcon,
    PlayArrow as PlayIcon,
    Stop as StopIcon,
    Undo as UndoIcon,
    Redo as RedoIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';

export const Toolbar: React.FC = () => {
    return (
        <MuiToolbar variant="dense">
            {/* 文件操作 */}
            <Button startIcon={<AddIcon />} color="inherit">
                新建
            </Button>
            <Button startIcon={<OpenIcon />} color="inherit">
                打开
            </Button>
            <Button startIcon={<SaveIcon />} color="inherit">
                保存
            </Button>

            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

            {/* 编辑操作 */}
            <IconButton color="inherit" title="撤销">
                <UndoIcon />
            </IconButton>
            <IconButton color="inherit" title="重做">
                <RedoIcon />
            </IconButton>
            <IconButton color="inherit" title="删除">
                <DeleteIcon />
            </IconButton>

            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

            {/* 预览控制 */}
            <IconButton color="inherit" title="播放">
                <PlayIcon />
            </IconButton>
            <IconButton color="inherit" title="停止">
                <StopIcon />
            </IconButton>

            <Box sx={{ flexGrow: 1 }} />

            {/* 右侧工具 */}
            <Button color="inherit">导出</Button>
            <Button color="inherit">设置</Button>
        </MuiToolbar>
    );
}; 