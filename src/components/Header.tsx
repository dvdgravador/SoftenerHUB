import React from 'react';
import { Droplets } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => navigate('/')}
        >
          <Droplets className="h-8 w-8" />
          <h1 className="text-2xl font-bold">SoftenerHUB</h1>
        </div>
        <button
          onClick={() => navigate('/add')}
          className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition duration-200"
        >
          Nuevo Descalcificador
        </button>
      </div>
    </header>
  );
};

export default Header;
