import React from 'react';
import ReactDOM from 'react-dom/client';
import { Editor } from './editor/components/Editor';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Editor />
    </React.StrictMode>
); 