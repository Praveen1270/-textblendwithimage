import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Landing from './pages/Landing';
import Editor from './pages/Editor';
import NotFound from './pages/NotFound'; // Assuming you have a NotFound component

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route 
        path="/editor" 
        element={user ? <Editor /> : <Navigate to="/" replace />} 
      />
      <Route path="*" element={<NotFound />} /> {/* Catch-all route for 404 */}
    </Routes>
  );
}

export default App;
