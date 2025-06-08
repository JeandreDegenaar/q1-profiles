// main.jsx

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

/**
 * Entry point for the React application.
 * Uses React 18's createRoot API to render the App component inside <StrictMode>.
 */
createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>,
);

