import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import SoftenerList from './components/SoftenerList';
import SoftenerForm from './components/SoftenerForm';
import SoftenerDetail from './components/SoftenerDetail';
import NotFound from './components/NotFound';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<SoftenerList />} />
            <Route path="/add" element={<SoftenerForm />} />
            <Route path="/edit/:id" element={<SoftenerForm />} />
            <Route path="/softener/:id" element={<SoftenerDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <footer className="bg-gray-800 text-white py-4 text-center">
          <p className="text-sm">© {new Date().getFullYear()} SoftenerHUB - Gestión de Descalcificadores</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
