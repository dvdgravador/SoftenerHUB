import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, ArrowLeft, Edit } from 'lucide-react';
import { Softener } from '../types';
import { getSoftenerById } from '../utils/storage';
import MaintenanceHistorySection from './MaintenanceHistorySection';
import HardnessMeasurementSection from './HardnessMeasurementSection';
import NotesSection from './NotesSection';

const SoftenerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [softener, setSoftener] = useState<Softener | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (id) {
      const foundSoftener = getSoftenerById(id);
      if (foundSoftener) {
        setSoftener(foundSoftener);
      } else {
        setNotFound(true);
      }
    }
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES').format(date);
  };

  if (notFound) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Descalcificador no encontrado</h2>
        <p className="text-gray-600 mb-6">El descalcificador que buscas no existe o ha sido eliminado.</p>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Volver al inicio
        </button>
      </div>
    );
  }

  if (!softener) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-lg text-gray-600">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <button
        onClick={() => navigate('/')}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition duration-200"
      >
        <ArrowLeft className="h-5 w-5 mr-1" />
        <span>Volver al listado</span>
      </button>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">{softener.name}</h2>
            <p className="text-lg text-gray-600 mb-4">Modelo: {softener.model}</p>
          </div>
          <button
            onClick={() => navigate(`/edit/${softener.id}`)}
            className="flex items-center text-gray-600 hover:text-gray-800 transition duration-200"
          >
            <Edit className="h-5 w-5 mr-1" />
            <span>Editar</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div className="flex items-center text-gray-700">
            <MapPin className="h-5 w-5 mr-2 text-blue-600" />
            <span>
              <strong>Ubicación:</strong> {softener.location}
            </span>
          </div>
          <div className="flex items-center text-gray-700">
            <Calendar className="h-5 w-5 mr-2 text-blue-600" />
            <span>
              <strong>Fecha de instalación:</strong> {formatDate(softener.installationDate)}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <MaintenanceHistorySection softenerId={softener.id} />
        <HardnessMeasurementSection softenerId={softener.id} />
        <NotesSection softenerId={softener.id} />
      </div>
    </div>
  );
};

export default SoftenerDetail;