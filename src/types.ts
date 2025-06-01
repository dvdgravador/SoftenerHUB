export interface Softener {
  id: string;
  name: string;
  model: string;
  location: string;
  installationDate: string;
  manualUrl?: string;
  created_at?: string;
}

export interface MaintenanceRecord {
  id: string;
  softenerId: string;
  date: string;
  description: string;
  created_at?: string;
}

export interface HardnessMeasurement {
  id: string;
  softenerId: string;
  date: string;
  value: number;
  unit: string;
  created_at?: string;
}

export interface Note {
  id: string;
  softenerId: string;
  date: string;
  content: string;
  created_at?: string;
}