import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app'

// render react di elemen id="app" yang ada di welcome.blade.php
ReactDOM.createRoot(document.getElementById('app')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)
