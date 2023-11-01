import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Registration from './registration';
import Login from './login';
import Home from './home'
function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/register" element={<Registration />} /> {/* Используйте элемент Registration */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
