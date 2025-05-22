import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      'app.title': 'BoneFX Editor',
      'app.description': 'A powerful 2D pseudo-3D animation tool',
      'menu.file': 'File',
      'menu.edit': 'Edit',
      'menu.view': 'View',
      'menu.help': 'Help',
      'toolbar.new': 'New',
      'toolbar.open': 'Open',
      'toolbar.save': 'Save',
      'toolbar.undo': 'Undo',
      'toolbar.redo': 'Redo',
    }
  },
  zh: {
    translation: {
      'app.title': 'BoneFX 编辑器',
      'app.description': '强大的2D伪3D动画制作工具',
      'menu.file': '文件',
      'menu.edit': '编辑',
      'menu.view': '视图',
      'menu.help': '帮助',
      'toolbar.new': '新建',
      'toolbar.open': '打开',
      'toolbar.save': '保存',
      'toolbar.undo': '撤销',
      'toolbar.redo': '重做',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'zh', // 默认语言
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 