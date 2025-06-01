import React, { useState } from 'react';
import { Calendar, Plus, StickyNote } from 'lucide-react';
import { Note } from '../types';
import { addNote, getNotes } from '../utils/storage';

interface NotesSectionProps {
  softenerId: string;
}

const NotesSection: React.FC<NotesSectionProps> = ({ softenerId }) => {
  const [notes, setNotes] = useState<Note[]>(getNotes(softenerId));
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    content: '',
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

    if (!formData.content.trim()) {
      newErrors.content = 'El contenido es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const newNote = addNote({
        softenerId,
        date: formData.date,
        content: formData.content,
      });

      setNotes([newNote, ...notes]);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        content: '',
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
          <StickyNote className="h-5 w-5 mr-2 text-yellow-600" />
          Notas
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center text-yellow-600 hover:text-yellow-800 transition duration-200"
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
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500`}
            />
            {errors.date && <p className="mt-1 text-red-500 text-sm">{errors.date}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="content" className="block text-gray-700 font-medium mb-2">
              Contenido
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={3}
              className={`w-full px-3 py-2 border ${
                errors.content ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500`}
              placeholder="Escribe tu nota aquí..."
            />
            {errors.content && <p className="mt-1 text-red-500 text-sm">{errors.content}</p>}
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
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition duration-200"
            >
              Guardar
            </button>
          </div>
        </form>
      )}

      {notes.length === 0 ? (
        <p className="text-gray-500 italic">No hay notas registradas.</p>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <div key={note.id} className="border-l-4 border-yellow-500 pl-4 py-2">
              <div className="flex items-center text-gray-600 mb-1">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{formatDate(note.date)}</span>
              </div>
              <p className="text-gray-800 whitespace-pre-line">{note.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotesSection;