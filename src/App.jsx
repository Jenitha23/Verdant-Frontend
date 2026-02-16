import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import routes from './routes';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          {routes.map((route, index) => {
            const Component = route.component;
            const element = route.protected ? (
              <ProtectedRoute adminOnly={route.adminOnly}>
                <Component />
              </ProtectedRoute>
            ) : (
              <Component />
            );

            return (
              <Route
                key={index}
                path={route.path}
                element={element}
              />
            );
          })}
        </Routes>
      </div>
    </Router>
  );
}

export default App;