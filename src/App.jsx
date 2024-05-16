import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { NextUIProvider } from "@nextui-org/react";
import './App.css';
import routes from './routes/routes.js';
import React from "react";

function App() {
 
    return (
        <NextUIProvider>
            <Router>
                <Routes>
                    {routes.map((route, index) => (
                        <Route
                            key={index}
                            path={route.path}
                            element={React.createElement(route.component)}
                        />
                    ))}
                </Routes>
            </Router>
        </NextUIProvider>
    );
}

export default App;