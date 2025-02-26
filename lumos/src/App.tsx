import React, { useEffect } from 'react';
import './App.css';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { Login, SPAContainer } from './pages/index.js';
import { useSelector } from 'react-redux';
import { ReduxState } from './redux/index.js';

const App = () => {
    const navigate = useNavigate();
    const user = useSelector((state: ReduxState) => state.user);

    useEffect(() => {
        if (!user?.email && !user?.isVerified) {
            navigate('/login');
        }
    }, [user]);

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<SPAContainer />} />
            <Route path="/" element={<Navigate to={'/login'} />} />
        </Routes>
    );
};

export default App;
