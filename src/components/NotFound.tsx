import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Página no encontrada</h2>
      <p className="text-xl text-gray-600 mb-8">
        Lo sentimos, la página que buscas no existe.
      </p>
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 text-lg"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Volver al inicio
      </button>
    </div>
  );
};

export default NotFound;