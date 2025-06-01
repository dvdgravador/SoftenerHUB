export interface Softener {
  id: string;
  name: string;
  model: string;
  location: string;
  installationDate: string;
  manualUrl?: string;
}

export interface MaintenanceRecord {
  id: string;
  softenerId: string;
  date: string;
  description: string;
}

export interface HardnessMeasurement {
  id: string;
  softenerId: string;
  date: string;
  value: number;
  unit: string;
}

export interface Note {
  id: string;
  softenerId: string;
  date: string;
  content: string;
}