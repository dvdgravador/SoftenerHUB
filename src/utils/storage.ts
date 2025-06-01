import { Softener, MaintenanceRecord, HardnessMeasurement, Note } from '../types';

// Local storage keys
const SOFTENERS_KEY = 'softeners';
const MAINTENANCE_KEY = 'maintenance-records';
const HARDNESS_KEY = 'hardness-measurements';
const NOTES_KEY = 'notes';

// Helper function to get data from localStorage
const getDataFromStorage = <T>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

// Helper function to save data to localStorage
const saveDataToStorage = <T>(key: string, data: T[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Softener functions
export const getSofteners = (): Softener[] => {
  return getDataFromStorage<Softener>(SOFTENERS_KEY);
};

export const getSoftenerById = (id: string): Softener | undefined => {
  const softeners = getSofteners();
  return softeners.find(softener => softener.id === id);
};

export const addSoftener = (softener: Omit<Softener, 'id'>): Softener => {
  const softeners = getSofteners();
  const newSoftener: Softener = {
    ...softener,
    id: Date.now().toString(),
  };
  softeners.push(newSoftener);
  saveDataToStorage(SOFTENERS_KEY, softeners);
  return newSoftener;
};

export const updateSoftener = (id: string, softener: Omit<Softener, 'id'>): Softener => {
  const softeners = getSofteners();
  const updatedSoftener: Softener = { ...softener, id };
  const index = softeners.findIndex(s => s.id === id);
  
  if (index !== -1) {
    softeners[index] = updatedSoftener;
    saveDataToStorage(SOFTENERS_KEY, softeners);
  }
  
  return updatedSoftener;
};

export const searchSofteners = (query: string): Softener[] => {
  const softeners = getSofteners();
  const lowerQuery = query.toLowerCase();
  return softeners.filter(
    softener => 
      softener.name.toLowerCase().includes(lowerQuery) || 
      softener.model.toLowerCase().includes(lowerQuery)
  );
};

// Maintenance record functions
export const getMaintenanceRecords = (softenerId: string): MaintenanceRecord[] => {
  const records = getDataFromStorage<MaintenanceRecord>(MAINTENANCE_KEY);
  return records
    .filter(record => record.softenerId === softenerId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const addMaintenanceRecord = (record: Omit<MaintenanceRecord, 'id'>): MaintenanceRecord => {
  const records = getDataFromStorage<MaintenanceRecord>(MAINTENANCE_KEY);
  const newRecord: MaintenanceRecord = {
    ...record,
    id: Date.now().toString(),
  };
  records.push(newRecord);
  saveDataToStorage(MAINTENANCE_KEY, records);
  return newRecord;
};

// Hardness measurement functions
export const getHardnessMeasurements = (softenerId: string): HardnessMeasurement[] => {
  const measurements = getDataFromStorage<HardnessMeasurement>(HARDNESS_KEY);
  return measurements
    .filter(measurement => measurement.softenerId === softenerId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const addHardnessMeasurement = (measurement: Omit<HardnessMeasurement, 'id'>): HardnessMeasurement => {
  const measurements = getDataFromStorage<HardnessMeasurement>(HARDNESS_KEY);
  const newMeasurement: HardnessMeasurement = {
    ...measurement,
    id: Date.now().toString(),
  };
  measurements.push(newMeasurement);
  saveDataToStorage(HARDNESS_KEY, measurements);
  return newMeasurement;
};

// Notes functions
export const getNotes = (softenerId: string): Note[] => {
  const notes = getDataFromStorage<Note>(NOTES_KEY);
  return notes
    .filter(note => note.softenerId === softenerId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const addNote = (note: Omit<Note, 'id'>): Note => {
  const notes = getDataFromStorage<Note>(NOTES_KEY);
  const newNote: Note = {
    ...note,
    id: Date.now().toString(),
  };
  notes.push(newNote);
  saveDataToStorage(NOTES_KEY, notes);
  return newNote;
};