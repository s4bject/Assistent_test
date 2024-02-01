// App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Registration from './pages/registration';
import Login from './pages/login';
import Home from './pages/home';
import Profile from './pages/profile';
import WorkoutPlanList from './pages/workout_list';
import WorkoutExc from './pages/workout_plan';
import { apiUrl } from './config';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/register" element={<Registration apiUrl={apiUrl} />} />
          <Route path="/login" element={<Login apiUrl={apiUrl} />} />
          <Route path="/" element={<Home apiUrl={apiUrl} />} />
          <Route path="/profile" element={<Profile apiUrl={apiUrl} />} />
          <Route path="/workout/plan" element={<WorkoutPlanList apiUrl={apiUrl} />} />
          <Route path="/workout/plan/:planId" element={<WorkoutExc apiUrl={apiUrl} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
