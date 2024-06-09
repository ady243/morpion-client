import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NextUIProvider } from "@nextui-org/react";
import './App.css';
import routes from './routes/routes.js';
import React from "react";
import ProtectedRoute from './component/ProtectedRoute.jsx';
import { AuthContextProvider } from './context/AuthContext'; 
import { ChatContextProvider } from './context/ChatContext.jsx';

function App() {
    return (
        <NextUIProvider>
            <AuthContextProvider>
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
            </AuthContextProvider>
        </NextUIProvider>
    );
}

export default App;
