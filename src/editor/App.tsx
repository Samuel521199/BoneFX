import React from 'react';
import { useTranslation } from 'react-i18next';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';

const App: React.FC = () => {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'zh' ? 'en' : 'zh';
    i18n.changeLanguage(newLang);
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {t('app.title')}
          </Typography>
          <Button 
            color="inherit" 
            startIcon={<LanguageIcon />}
            onClick={toggleLanguage}
          >
            {i18n.language === 'zh' ? 'English' : '中文'}
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {t('app.title')}
        </Typography>
        <Typography variant="body1">
          {t('app.description')}
        </Typography>
      </Box>
    </div>
  );
};

export default App; 