import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NextUIProvider } from "@nextui-org/react";
import './App.css';
import routes from './routes/routes.js';
import React from "react";
import ProtectedRoute from './component/ProtectedRoute.jsx';

function App() {
    return (
        <NextUIProvider>
            <Router>
                <Routes>
                    {routes.map((route, index) => {
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    route.protected ? 
                                    <ProtectedRoute>{React.createElement(route.component)}</ProtectedRoute> :
                                    React.createElement(route.component)
                                }
                            />
                        );
                    })}
                </Routes>
            </Router>
        </NextUIProvider>
    );
}

export default App;