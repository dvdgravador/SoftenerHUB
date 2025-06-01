import React, { useState } from 'react';
import { Calendar, Plus, PenTool as Tool } from 'lucide-react';
import { MaintenanceRecord } from '../types';
import { addMaintenanceRecord, getMaintenanceRecords } from '../utils/storage';

interface MaintenanceHistorySectionProps {
  softenerId: string;
}

const MaintenanceHistorySection: React.FC<MaintenanceHistorySectionProps> = ({ softenerId }) => {
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>(
    getMaintenanceRecords(softenerId)
  );
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.date) {
      newErrors.date = 'La fecha es obligatoria';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es obligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const newRecord = addMaintenanceRecord({
        softenerId,
        date: formData.date,
        description: formData.description,
      });

      setMaintenanceRecords([newRecord, ...maintenanceRecords]);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        description: '',
      });
      setShowForm(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES').format(date);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
          <Tool className="h-5 w-5 mr-2 text-blue-600" />
          Historial de Mantenimiento
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center text-blue-600 hover:text-blue-800 transition duration-200"
        >
          <Plus className="h-5 w-5 mr-1" />
          <span>Añadir</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 bg-gray-50 p-4 rounded-lg">
          <div className="mb-4">
            <label htmlFor="date" className="block text-gray-700 font-medium mb-2">
              Fecha
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                errors.date ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.date && <p className="mt-1 text-red-500 text-sm">{errors.date}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className={`w-full px-3 py-2 border ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Describe las actuaciones realizadas o piezas sustituidas"
            />
            {errors.description && (
              <p className="mt-1 text-red-500 text-sm">{errors.description}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Guardar
            </button>
          </div>
        </form>
      )}

      {maintenanceRecords.length === 0 ? (
        <p className="text-gray-500 italic">No hay registros de mantenimiento.</p>
      ) : (
        <div className="space-y-4">
          {maintenanceRecords.map((record) => (
            <div key={record.id} className="border-l-4 border-blue-500 pl-4 py-2">
              <div className="flex items-center text-gray-600 mb-1">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{formatDate(record.date)}</span>
              </div>
              <p className="text-gray-800">{record.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MaintenanceHistorySection;