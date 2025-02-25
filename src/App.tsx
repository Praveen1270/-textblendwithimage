import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Landing from './pages/Landing';
import Editor from './pages/Editor';

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/editor"
        element={user ? <Editor /> : <Navigate to="/" replace />}
      />
    </Routes>
  );
}

export default App;