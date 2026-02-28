import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: 'active' | 'inactive';
  assignedSurveys: number;
  completedResponses: number;
  initials: string;
}

export interface Survey {
  id: string;
  name: string;
  status: 'active' | 'draft' | 'completed';
  platform: 'mobile' | 'web' | 'both';
  responses: number;
  createdAt: string;
  assignedUsers: number;
  questions: number;
}

export interface Device {
  id: string;
  name: string;
  type: 'smartphone' | 'tablet' | 'desktop';
  os: string;
  status: 'online' | 'offline';
  battery: number | null;
  lastSeen: string;
  location: string;
  coordinates: { lat: number; lng: number };
  assignedUser: string;
}

export interface GeoFence {
  id: string;
  name: string;
  center: { lat: number; lng: number };
  radius: number;
  status: 'active' | 'inactive';
  assignedSurveys: number;
  activeDevices: number;
  alerts: number;
  alertOnExit: boolean;
}

interface AppState {
  users: User[];
  surveys: Survey[];
  devices: Device[];
  geoFences: GeoFence[];
  
  // Users actions
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  
  // Surveys actions
  addSurvey: (survey: Omit<Survey, 'id'>) => void;
  updateSurvey: (id: string, updates: Partial<Survey>) => void;
  deleteSurvey: (id: string) => void;
  duplicateSurvey: (id: string) => void;
  
  // Devices actions
  addDevice: (device: Omit<Device, 'id'>) => void;
  updateDevice: (id: string, updates: Partial<Device>) => void;
  deleteDevice: (id: string) => void;
  
  // GeoFences actions
  addGeoFence: (geoFence: Omit<GeoFence, 'id'>) => void;
  updateGeoFence: (id: string, updates: Partial<GeoFence>) => void;
  deleteGeoFence: (id: string) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const initialUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 234 567 8900',
    role: 'field-agent',
    status: 'active',
    assignedSurveys: 5,
    completedResponses: 234,
    initials: 'JD',
  },
  {
    id: '2',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    phone: '+1 234 567 8901',
    role: 'supervisor',
    status: 'active',
    assignedSurveys: 12,
    completedResponses: 567,
    initials: 'SW',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    phone: '+1 234 567 8902',
    role: 'field-agent',
    status: 'inactive',
    assignedSurveys: 3,
    completedResponses: 89,
    initials: 'MJ',
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily@example.com',
    phone: '+1 234 567 8903',
    role: 'field-agent',
    status: 'active',
    assignedSurveys: 8,
    completedResponses: 456,
    initials: 'ED',
  },
];

const initialSurveys: Survey[] = [
  {
    id: '1',
    name: 'Customer Satisfaction 2024',
    status: 'active',
    platform: 'both',
    responses: 1234,
    createdAt: '2024-01-15',
    assignedUsers: 12,
    questions: 15,
  },
  {
    id: '2',
    name: 'Employee Engagement Survey',
    status: 'active',
    platform: 'web',
    responses: 856,
    createdAt: '2024-01-10',
    assignedUsers: 8,
    questions: 20,
  },
  {
    id: '3',
    name: 'Product Feedback - Mobile App',
    status: 'draft',
    platform: 'mobile',
    responses: 0,
    createdAt: '2024-01-20',
    assignedUsers: 0,
    questions: 10,
  },
  {
    id: '4',
    name: 'Market Research Q1',
    status: 'completed',
    platform: 'web',
    responses: 500,
    createdAt: '2023-12-01',
    assignedUsers: 5,
    questions: 25,
  },
  {
    id: '5',
    name: 'Field Survey - Region A',
    status: 'active',
    platform: 'mobile',
    responses: 2345,
    createdAt: '2024-01-05',
    assignedUsers: 25,
    questions: 18,
  },
];

const initialDevices: Device[] = [
  {
    id: 'D-7892',
    name: 'Field Device 1',
    type: 'smartphone',
    os: 'Android 13',
    status: 'online',
    battery: 85,
    lastSeen: '2 minutes ago',
    location: 'New York, NY',
    coordinates: { lat: 40.7128, lng: -74.006 },
    assignedUser: 'John Doe',
  },
  {
    id: 'D-7893',
    name: 'Field Device 2',
    type: 'tablet',
    os: 'iOS 17',
    status: 'online',
    battery: 42,
    lastSeen: '5 minutes ago',
    location: 'Los Angeles, CA',
    coordinates: { lat: 34.0522, lng: -118.2437 },
    assignedUser: 'Sarah Wilson',
  },
  {
    id: 'D-7894',
    name: 'Office Device 1',
    type: 'desktop',
    os: 'Windows 11',
    status: 'offline',
    battery: null,
    lastSeen: '2 hours ago',
    location: 'Chicago, IL',
    coordinates: { lat: 41.8781, lng: -87.6298 },
    assignedUser: 'Mike Johnson',
  },
  {
    id: 'D-7895',
    name: 'Field Device 3',
    type: 'smartphone',
    os: 'Android 14',
    status: 'online',
    battery: 98,
    lastSeen: 'Just now',
    location: 'Houston, TX',
    coordinates: { lat: 29.7604, lng: -95.3698 },
    assignedUser: 'Emily Davis',
  },
];

const initialGeoFences: GeoFence[] = [
  {
    id: '1',
    name: 'Downtown Survey Area',
    center: { lat: 40.7128, lng: -74.006 },
    radius: 500,
    status: 'active',
    assignedSurveys: 3,
    activeDevices: 5,
    alerts: 2,
    alertOnExit: true,
  },
  {
    id: '2',
    name: 'Mall Region A',
    center: { lat: 34.0522, lng: -118.2437 },
    radius: 200,
    status: 'active',
    assignedSurveys: 1,
    activeDevices: 2,
    alerts: 0,
    alertOnExit: true,
  },
  {
    id: '3',
    name: 'Industrial Zone',
    center: { lat: 41.8781, lng: -87.6298 },
    radius: 1000,
    status: 'inactive',
    assignedSurveys: 0,
    activeDevices: 0,
    alerts: 0,
    alertOnExit: false,
  },
];

export const useAppState = create<AppState>()(
  persist(
    (set) => ({
      users: initialUsers,
      surveys: initialSurveys,
      devices: initialDevices,
      geoFences: initialGeoFences,

      // Users
      addUser: (user) =>
        set((state) => ({
          users: [...state.users, { ...user, id: generateId() }],
        })),
      updateUser: (id, updates) =>
        set((state) => ({
          users: state.users.map((u) => (u.id === id ? { ...u, ...updates } : u)),
        })),
      deleteUser: (id) =>
        set((state) => ({
          users: state.users.filter((u) => u.id !== id),
        })),

      // Surveys
      addSurvey: (survey) =>
        set((state) => ({
          surveys: [...state.surveys, { ...survey, id: generateId() }],
        })),
      updateSurvey: (id, updates) =>
        set((state) => ({
          surveys: state.surveys.map((s) => (s.id === id ? { ...s, ...updates } : s)),
        })),
      deleteSurvey: (id) =>
        set((state) => ({
          surveys: state.surveys.filter((s) => s.id !== id),
        })),
      duplicateSurvey: (id) =>
        set((state) => {
          const survey = state.surveys.find((s) => s.id === id);
          if (!survey) return state;
          return {
            surveys: [
              ...state.surveys,
              {
                ...survey,
                id: generateId(),
                name: `${survey.name} (Copy)`,
                status: 'draft' as const,
                responses: 0,
                createdAt: new Date().toISOString().split('T')[0],
              },
            ],
          };
        }),

      // Devices
      addDevice: (device) =>
        set((state) => ({
          devices: [...state.devices, { ...device, id: `D-${Math.floor(1000 + Math.random() * 9000)}` }],
        })),
      updateDevice: (id, updates) =>
        set((state) => ({
          devices: state.devices.map((d) => (d.id === id ? { ...d, ...updates } : d)),
        })),
      deleteDevice: (id) =>
        set((state) => ({
          devices: state.devices.filter((d) => d.id !== id),
        })),

      // GeoFences
      addGeoFence: (geoFence) =>
        set((state) => ({
          geoFences: [...state.geoFences, { ...geoFence, id: generateId() }],
        })),
      updateGeoFence: (id, updates) =>
        set((state) => ({
          geoFences: state.geoFences.map((g) => (g.id === id ? { ...g, ...updates } : g)),
        })),
      deleteGeoFence: (id) =>
        set((state) => ({
          geoFences: state.geoFences.filter((g) => g.id !== id),
        })),
    }),
    {
      name: 'survey-admin-state',
    }
  )
);
