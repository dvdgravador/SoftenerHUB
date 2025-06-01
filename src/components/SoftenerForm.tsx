import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addSoftener, getSoftenerById, updateSoftener } from '../utils/storage';

const SoftenerForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    model: '',
    location: '',
    installationDate: new Date().toISOString().split('T')[0],
    manualUrl: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadSoftener = async () => {
      if (id) {
        try {
          setLoading(true);
          const softener = await getSoftenerById(id);
          if (softener) {
            setFormData({
              name: softener.name,
              model: softener.model,
              location: softener.location,
              installationDate: softener.installationDate,
              manualUrl: softener.manualUrl || ''
            });
          } else {
            navigate('/not-found');
          }
        } catch (err) {
          setError('Error al cargar el descalcificador');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    loadSoftener();
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }
    
    if (!formData.model.trim()) {
      newErrors.model = 'El modelo es obligatorio';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'La ubicación es obligatoria';
    }
    
    if (!formData.installationDate) {
      newErrors.installationDate = 'La fecha de instalación es obligatoria';
    }

    if (formData.manualUrl && !formData.manualUrl.includes('drive.google.com')) {
      newErrors.manualUrl = 'La URL debe ser de Google Drive';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        setLoading(true);
        setError(null);
        if (id) {
          await updateSoftener(id, formData);
          navigate(`/softener/${id}`);
        } else {
          const newSoftener = await addSoftener(formData);
          navigate(`/softener/${newSoftener.id}`);
        }
      } catch (err) {
        setError('Error al guardar el descalcificador');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {id ? 'Cargando descalcificador...' : 'Guardando descalcificador...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {id ? 'Editar Descalcificador' : 'Añadir Nuevo Descalcificador'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
              Cliente
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Nombre del cliente"
            />
            {errors.name && <p className="mt-1 text-red-500 text-sm">{errors.name}</p>}
          </div>
          
          <div className="mb-4">
            <label htmlFor="model" className="block text-gray-700 font-medium mb-2">
              Modelo
            </label>
            <input
              type="text"
              id="model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.model ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Modelo del descalcificador"
            />
            {errors.model && <p className="mt-1 text-red-500 text-sm">{errors.model}</p>}
          </div>
          
          <div className="mb-4">
            <label htmlFor="location" className="block text-gray-700 font-medium mb-2">
              Ubicación
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.location ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Ubicación del descalcificador"
            />
            {errors.location && <p className="mt-1 text-red-500 text-sm">{errors.location}</p>}
          </div>
          
          <div className="mb-4">
            <label htmlFor="installationDate" className="block text-gray-700 font-medium mb-2">
              Fecha de Instalación
            </label>
            <input
              type="date"
              id="installationDate"
              name="installationDate"
              value={formData.installationDate}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.installationDate ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.installationDate && <p className="mt-1 text-red-500 text-sm">{errors.installationDate}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="manualUrl" className="block text-gray-700 font-medium mb-2">
              Manual de Instrucciones (Google Drive)
            </label>
            <input
              type="url"
              id="manualUrl"
              name="manualUrl"
              value={formData.manualUrl}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.manualUrl ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="URL del manual en Google Drive"
            />
            {errors.manualUrl && <p className="mt-1 text-red-500 text-sm">{errors.manualUrl}</p>}
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(id ? `/softener/${id}` : '/')}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
              disabled={loading}
            >
              {id ? 'Guardar Cambios' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SoftenerForm;