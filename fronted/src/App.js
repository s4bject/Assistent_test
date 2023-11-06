import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Registration from './pages/registration';
import Login from './pages/login';
import Home from './pages/home'
import Profile from './pages/profile'
function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/register" element={<Registration />} /> {/* Используйте элемент Registration */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
