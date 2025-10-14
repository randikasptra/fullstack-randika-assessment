import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";
import './bootstrap';

// render react in elemen id="app" in welcome.blade.php
ReactDOM.createRoot(document.getElementById("app")).render(
    <App />
);
