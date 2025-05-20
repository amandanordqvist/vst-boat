import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'owner' | 'captain' | 'crew' | 'maintenance';

interface UserRoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  hasPermission: (requiredRole: UserRole | UserRole[]) => boolean;
}

// Role hierarchy: owner > captain > crew, maintenance is separate
const roleHierarchy = {
  owner: ['owner', 'captain', 'crew', 'maintenance'],
  captain: ['captain', 'crew'],
  crew: ['crew'],
  maintenance: ['maintenance']
};

const UserRoleContext = createContext<UserRoleContextType>({
  role: 'owner', // Default to owner
  setRole: () => {},
  hasPermission: () => false
});

export function UserRoleProvider({ children, initialRole = 'owner' }: {
  children: ReactNode;
  initialRole?: UserRole;
}) {
  const [role, setRole] = useState<UserRole>(initialRole);
  
  const hasPermission = (requiredRole: UserRole | UserRole[]): boolean => {
    // If multiple roles are acceptable, check if the user has any of them
    if (Array.isArray(requiredRole)) {
      return requiredRole.some(r => roleHierarchy[role].includes(r));
    }
    
    // Single role check
    return roleHierarchy[role].includes(requiredRole);
  };
  
  return (
    <UserRoleContext.Provider value={{ role, setRole, hasPermission }}>
      {children}
    </UserRoleContext.Provider>
  );
}

export const useUserRole = () => useContext(UserRoleContext); 