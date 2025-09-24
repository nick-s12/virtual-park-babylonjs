import React from 'react';
import ParkPage from './components/ParkPage';
import { Route, Routes } from 'react-router-dom';

const App: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<ParkPage />} />
        </Routes>
    )
};

export default App;
