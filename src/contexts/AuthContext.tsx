import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { toast } from 'react-toastify'; // ✅ Toast support

export type UserRole = 'super_admin' | 'admin' | 'volunteer';

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: UserRole | null;
  userEmail: string | null;
  login: (role: UserRole, email: string) => void;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define permissions for each role
const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  super_admin: [
    'manage_users',
    'delete_invoices',
    'view_all_invoices',
    'view_all_reports',
    'view_all_funds',
    'promote_users',
    'demote_users',
    'delete_users',
  ],
  admin: [
    'approve_invoices',
    'view_all_invoices',
    'view_all_reports',
    'view_all_funds',
    'edit_invoices',
    'edit_reports',
    'edit_funds',
  ],
  volunteer: [
    'create_invoices',
    'view_all_invoices',
    'create_reports',
    'view_own_reports',
  ],
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  const [userRole, setUserRole] = useState<UserRole | null>(() => {
    return localStorage.getItem('userRole') as UserRole | null;
  });
  const [userEmail, setUserEmail] = useState<string | null>(() => {
    return localStorage.getItem('userEmail');
  });

  // Sync all auth-related values to localStorage
  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated ? 'true' : 'false');
    if (userRole) {
      localStorage.setItem('userRole', userRole);
    } else {
      localStorage.removeItem('userRole');
    }
    if (userEmail) {
      localStorage.setItem('userEmail', userEmail);
    } else {
      localStorage.removeItem('userEmail');
    }
  }, [isAuthenticated, userRole, userEmail]);

  // ✅ Toast-enhanced login
  const login = (role: UserRole, email: string) => {
    setIsAuthenticated(true);
    setUserRole(role);
    setUserEmail(email);
    toast.success(`Logged in as ${role.replace('_', ' ')}`);
  };

  // ✅ Toast-enhanced logout
  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setUserEmail(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    toast.info('You have been logged out');
  };

  const hasPermission = (permission: string): boolean => {
    if (!userRole) return false;
    return ROLE_PERMISSIONS[userRole].includes(permission);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userRole,
        userEmail,
        login,
        logout,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
