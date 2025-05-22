import React, { useEffect, useRef } from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { EditorLayout } from './EditorLayout';
import { Toolbar } from './Toolbar';
import { PropertyPanel } from './PropertyPanel';
import { Timeline } from './Timeline';
import { AssetPanel } from './AssetPanel';
import { PreviewPanel } from './PreviewPanel';
import { BoneFXRenderer } from '../../core/renderer/Renderer';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#90caf9',
        },
        secondary: {
            main: '#f48fb1',
        },
        background: {
            default: '#1e1e1e',
            paper: '#2d2d2d',
        },
    },
});

export const Editor: React.FC = () => {
    const previewRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<BoneFXRenderer | null>(null);

    useEffect(() => {
        if (previewRef.current && !rendererRef.current) {
            rendererRef.current = new BoneFXRenderer(previewRef.current);
            
            // 渲染循环
            const animate = () => {
                requestAnimationFrame(animate);
                rendererRef.current?.render();
            };
            animate();
        }

        return () => {
            rendererRef.current?.dispose();
        };
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
                <EditorLayout
                    toolbar={<Toolbar />}
                    preview={
                        <Box ref={previewRef} sx={{ width: '100%', height: '100%' }} />
                    }
                    propertyPanel={<PropertyPanel />}
                    timeline={<Timeline />}
                    assetPanel={<AssetPanel />}
                />
            </Box>
        </ThemeProvider>
    );
}; 