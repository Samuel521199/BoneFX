import React from 'react';
import { Box, Typography } from '@mui/material';
import { useAssetStore } from '../../stores/assetStore';

export const AssetViewer: React.FC = () => {
  const { selectedAsset } = useAssetStore();

  if (!selectedAsset) {
    return (
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
        }}
      >
        <Typography variant="h6" color="text.secondary">
          请选择一个资源
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        bgcolor: 'background.default',
        overflow: 'auto',
      }}
    >
      <Box
        sx={{
          maxWidth: '100%',
          maxHeight: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Typography variant="h6">{selectedAsset.name}</Typography>
        <img
          src={selectedAsset.url}
          alt={selectedAsset.name}
          style={{
            maxWidth: '100%',
            maxHeight: 'calc(100vh - 200px)',
            objectFit: 'contain',
          }}
        />
        {selectedAsset.parallaxMapUrl && (
          <>
            <Typography variant="h6">视差贴图</Typography>
            <img
              src={selectedAsset.parallaxMapUrl}
              alt={`${selectedAsset.name} - 视差贴图`}
              style={{
                maxWidth: '100%',
                maxHeight: 'calc(100vh - 200px)',
                objectFit: 'contain',
              }}
            />
          </>
        )}
      </Box>
    </Box>
  );
}; 