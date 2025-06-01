import React, { useState } from 'react';
import { Calendar, Plus, Droplets } from 'lucide-react';
import { HardnessMeasurement } from '../types';
import { addHardnessMeasurement, getHardnessMeasurements } from '../utils/storage';

interface HardnessMeasurementSectionProps {
  softenerId: string;
}

const HardnessMeasurementSection: React.FC<HardnessMeasurementSectionProps> = ({ softenerId }) => {
  const [measurements, setMeasurements] = useState<HardnessMeasurement[]>(
    getHardnessMeasurements(softenerId)
  );
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    value: '',
    unit: 'ppm',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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

    if (!formData.value) {
      newErrors.value = 'El valor es obligatorio';
    } else if (isNaN(Number(formData.value)) || Number(formData.value) < 0) {
      newErrors.value = 'El valor debe ser un número positivo';
    }

    if (!formData.unit) {
      newErrors.unit = 'La unidad es obligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const newMeasurement = addHardnessMeasurement({
        softenerId,
        date: formData.date,
        value: Number(formData.value),
        unit: formData.unit,
      });

      setMeasurements([newMeasurement, ...measurements]);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        value: '',
        unit: 'ppm',
      });
      setShowForm(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES').format(date);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
          <Droplets className="h-5 w-5 mr-2 text-teal-600" />
          Mediciones de Dureza
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center text-teal-600 hover:text-teal-800 transition duration-200"
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
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500`}
            />
            {errors.date && <p className="mt-1 text-red-500 text-sm">{errors.date}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="value" className="block text-gray-700 font-medium mb-2">
                Valor
              </label>
              <input
                type="number"
                id="value"
                name="value"
                value={formData.value}
                onChange={handleChange}
                step="0.1"
                min="0"
                className={`w-full px-3 py-2 border ${
                  errors.value ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500`}
                placeholder="Valor medido"
              />
              {errors.value && <p className="mt-1 text-red-500 text-sm">{errors.value}</p>}
            </div>

            <div>
              <label htmlFor="unit" className="block text-gray-700 font-medium mb-2">
                Unidad
              </label>
              <select
                id="unit"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  errors.unit ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500`}
              >
                <option value="ppm">ppm</option>
                <option value="°f">Grados franceses (°f)</option>
                <option value="°d">Grados alemanes (°d)</option>
                <option value="mmol/L">mmol/L</option>
              </select>
              {errors.unit && <p className="mt-1 text-red-500 text-sm">{errors.unit}</p>}
            </div>
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
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-200"
            >
              Guardar
            </button>
          </div>
        </form>
      )}

      {measurements.length === 0 ? (
        <p className="text-gray-500 italic">No hay mediciones de dureza registradas.</p>
      ) : (
        <div className="space-y-4">
          {measurements.map((measurement) => (
            <div key={measurement.id} className="border-l-4 border-teal-500 pl-4 py-2">
              <div className="flex items-center text-gray-600 mb-1">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{formatDate(measurement.date)}</span>
              </div>
              <p className="text-gray-800 font-medium">
                {measurement.value} {measurement.unit}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HardnessMeasurementSection;