import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Registration from './registration';
import Login from './login';
import Home from './home'
import Profile from './profile'
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
