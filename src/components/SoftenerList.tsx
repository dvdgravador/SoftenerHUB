import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, MapPin } from 'lucide-react';
import { Softener } from '../types';
import { getSofteners, searchSofteners } from '../utils/storage';

const SoftenerList: React.FC = () => {
  const [softeners, setSofteners] = useState<Softener[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadSofteners = () => {
      if (searchQuery.trim() === '') {
        setSofteners(getSofteners());
      } else {
        setSofteners(searchSofteners(searchQuery));
      }
    };

    loadSofteners();
    // Add event listener for storage changes from other tabs
    window.addEventListener('storage', loadSofteners);
    
    return () => {
      window.removeEventListener('storage', loadSofteners);
    };
  }, [searchQuery]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES').format(date);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Buscar por nombre o modelo..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {softeners.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">
            {searchQuery ? 'No se encontraron descalcificadores que coincidan con tu búsqueda.' : 'No hay descalcificadores registrados.'}
          </p>
          <button
            onClick={() => navigate('/add')}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition duration-200"
          >
            Añadir Descalcificador
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {softeners.map((softener) => (
            <div
              key={softener.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => navigate(`/softener/${softener.id}`)}
            >
              <div className="p-5">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{softener.name}</h2>
                <p className="text-gray-600 mb-3">Modelo: {softener.model}</p>
                <div className="flex items-center text-gray-500 mb-2">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{softener.location}</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Instalado: {formatDate(softener.installationDate)}</span>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <span className="text-blue-600 font-medium">Ver detalles</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SoftenerList;