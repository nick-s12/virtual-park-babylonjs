import React from 'react';
import TestBabylon from './components/TestBabylon';
import { Route, Routes } from 'react-router-dom';

const App: React.FC = () => {
    return (
        <Routes>
            {/* <Route path="/" element={<TutorialBabylon />} /> */}
            <Route path="/" element={<TestBabylon />} />

            {/* <Route path="/test" element={<TestBabylon />} /> */}
        </Routes>
    )
};

export default App;
