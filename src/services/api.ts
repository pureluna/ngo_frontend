import axios from 'axios';

// Axios instance with mock baseURL
export const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Simulate delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock login credentials
const MOCK_CREDENTIALS = {
  email: 'admin@example.com',
  password: 'password123',
};

const MOCK_TOKEN = 'mockJwtToken123';

// Mock login function
export const login = async (email: string, password: string) => {
  await delay(1000);
  if (email === MOCK_CREDENTIALS.email && password === MOCK_CREDENTIALS.password) {
    return {
      success: true,
      token: MOCK_TOKEN,
      user: {
        id: 1,
        email: MOCK_CREDENTIALS.email,
        role: 'admin',
      },
    };
  }
  throw new Error('Invalid credentials');
};

let mockInvoices = [
  { id: 1, vendor: 'Acme Corp', amount: 250.00, date: '2025-06-01', status: 'Paid' },
  { id: 2, vendor: 'Globex Inc', amount: 1000.00, date: '2025-06-03', status: 'Unpaid' },
  { id: 3, vendor: 'Initech', amount: 300.00, date: '2025-06-04', status: 'Pending' },
  { id: 4, vendor: 'Hooli', amount: 500.50, date: '2025-06-05', status: 'Approved' },
];

let nextId = mockInvoices.length + 1;

export const getInvoices = async () => {
  await delay(500);
  if (Math.random() < 0.1) throw new Error('Failed to fetch invoices. Please try again later.');
  return { success: true, data: mockInvoices };
};

export const createInvoice = async (invoice: { vendor: string; amount: number }) => {
  await delay(300);
  if (!invoice.vendor || invoice.vendor.trim().length === 0) throw new Error('Vendor name is required');
  if (!invoice.amount || invoice.amount <= 0) throw new Error('Amount must be greater than 0');
  if (Math.random() < 0.2) throw new Error('Failed to create invoice. Please try again.');

  const newInvoice = {
    id: nextId++,
    vendor: invoice.vendor,
    amount: invoice.amount,
    date: new Date().toISOString().split('T')[0],
    status: 'Pending',
  };
  mockInvoices.unshift(newInvoice);
  return { success: true, data: newInvoice };
};

// ✅ NEW: Mock functions for user management
let mockUsers = [
  { id: 1, email: 'admin@example.com', role: 'admin' },
  { id: 2, email: 'volunteer@example.com', role: 'volunteer' },
];

export const getUsers = async () => {
  await delay(300);
  return { success: true, data: mockUsers };
};

export const updateUserRole = async (userId: number, newRole: 'admin' | 'volunteer') => {
  await delay(300);
  const user = mockUsers.find(u => u.id === userId);
  if (!user) throw new Error('User not found');
  if (!['admin', 'volunteer'].includes(newRole)) throw new Error('Invalid role');
  user.role = newRole;
  return { success: true, data: user };
};

export const deleteUser = async (userId: number) => {
  await delay(300);
  const index = mockUsers.findIndex(u => u.id === userId);
  if (index === -1) throw new Error('User not found');
  const deleted = mockUsers.splice(index, 1)[0];
  return { success: true, data: deleted };
};

export const createUser = async (email: string, role: 'admin' | 'volunteer') => {
  await delay(300);
  if (!email || !email.includes('@')) throw new Error('Invalid email');
  if (!['admin', 'volunteer'].includes(role)) throw new Error('Invalid role');
  const newUser = { id: Date.now(), email, role };
  mockUsers.push(newUser);
  return { success: true, data: newUser };
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});