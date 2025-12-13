export type IssueStatus = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';
export type Department = 'SANITATION' | 'ROADS' | 'WATER' | 'ELECTRICITY' | 'OTHER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'CITIZEN' | 'ADMIN' | 'FIELD_WORKER';
  avatar?: string;
}

export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  status: IssueStatus;
  department: Department;
  location: Location;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface DashboardStats {
  totalIssues: number;
  resolvedIssues: number;
  pendingIssues: number;
  avgResolutionTimeHours: number;
}
