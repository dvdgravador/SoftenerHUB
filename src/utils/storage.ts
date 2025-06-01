import { Softener, MaintenanceRecord, HardnessMeasurement, Note } from '../types';
import { supabase } from './supabase';

// Softener functions
export const getSofteners = async (): Promise<Softener[]> => {
  const { data, error } = await supabase
    .from('softeners')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getSoftenerById = async (id: string): Promise<Softener | null> => {
  const { data, error } = await supabase
    .from('softeners')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const addSoftener = async (softener: Omit<Softener, 'id' | 'created_at'>): Promise<Softener> => {
  const { data, error } = await supabase
    .from('softeners')
    .insert([softener])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateSoftener = async (id: string, softener: Omit<Softener, 'id' | 'created_at'>): Promise<Softener> => {
  const { data, error } = await supabase
    .from('softeners')
    .update(softener)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const searchSofteners = async (query: string): Promise<Softener[]> => {
  const { data, error } = await supabase
    .from('softeners')
    .select('*')
    .or(`name.ilike.%${query}%,model.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

// Maintenance record functions
export const getMaintenanceRecords = async (softenerId: string): Promise<MaintenanceRecord[]> => {
  const { data, error } = await supabase
    .from('maintenance_records')
    .select('*')
    .eq('softener_id', softenerId)
    .order('date', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const addMaintenanceRecord = async (record: Omit<MaintenanceRecord, 'id' | 'created_at'>): Promise<MaintenanceRecord> => {
  const { data, error } = await supabase
    .from('maintenance_records')
    .insert([{ ...record, softener_id: record.softenerId }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Hardness measurement functions
export const getHardnessMeasurements = async (softenerId: string): Promise<HardnessMeasurement[]> => {
  const { data, error } = await supabase
    .from('hardness_measurements')
    .select('*')
    .eq('softener_id', softenerId)
    .order('date', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const addHardnessMeasurement = async (measurement: Omit<HardnessMeasurement, 'id' | 'created_at'>): Promise<HardnessMeasurement> => {
  const { data, error } = await supabase
    .from('hardness_measurements')
    .insert([{ ...measurement, softener_id: measurement.softenerId }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Notes functions
export const getNotes = async (softenerId: string): Promise<Note[]> => {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('softener_id', softenerId)
    .order('date', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const addNote = async (note: Omit<Note, 'id' | 'created_at'>): Promise<Note> => {
  const { data, error } = await supabase
    .from('notes')
    .insert([{ ...note, softener_id: note.softenerId }])
    .select()
    .single();

  if (error) throw error;
  return data;
};