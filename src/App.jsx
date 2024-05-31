import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NextUIProvider } from "@nextui-org/react";
import './App.css';
import routes from './routes/routes.js';
import React from "react";
import ProtectedRoute from './component/ProtectedRoute.jsx';
import { ChatContextProvider } from './context/ChatContext'; 

function App() {
    return (
        <NextUIProvider>
            <ChatContextProvider>
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
            </ChatContextProvider>
        </NextUIProvider>
    );
}

export default App;