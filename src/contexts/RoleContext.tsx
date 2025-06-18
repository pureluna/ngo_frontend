// src/contexts/RoleContext.tsx
import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';


// Define the context type
interface RoleContextType {
  role: string;
  setRole: (newRole: string) => void;
}

// Create the context
const RoleContext = createContext<RoleContextType | undefined>(undefined);

// Provider component
export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRoleState] = useState<string>(() => {
    return localStorage.getItem('role') || 'volunteer'; // fallback default
  });

  // Update role in both state and localStorage
  const setRole = (newRole: string) => {
    setRoleState(newRole);
    localStorage.setItem('role', newRole);
  };

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};

// Custom hook for using the role context safely
export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
