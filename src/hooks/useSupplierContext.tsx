import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useSuppliers } from './useApi';
import { SupplierContextValue } from '../types';

const SupplierContext = createContext<SupplierContextValue | null>(null);

interface SupplierProviderProps {
  children: ReactNode;
}

export function SupplierProvider({ children }: SupplierProviderProps) {
  const [currentSupplierId, setCurrentSupplierId] = useState<string | null>(null);
  const { data: suppliers = [], isLoading, error } = useSuppliers();

  const value: SupplierContextValue = {
    currentSupplierId,
    setCurrentSupplierId,
    suppliers,
    isLoading,
    error: error as Error | null,
  };

  return (
    <SupplierContext.Provider value={value}>
      {children}
    </SupplierContext.Provider>
  );
}

export function useSupplierContext() {
  const context = useContext(SupplierContext);
  if (!context) {
    throw new Error('useSupplierContext must be used within a SupplierProvider');
  }
  return context;
}

// Helper hook to get current supplier
export function useCurrentSupplier() {
  const { currentSupplierId, suppliers } = useSupplierContext();
  return suppliers.find(supplier => supplier.id === currentSupplierId) || null;
}