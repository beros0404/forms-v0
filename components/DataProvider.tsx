'use client'

import { createContext, useContext, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface FormData {
  sectionA?: any;
  sectionB?: any;
  sectionC?: any;
  sectionD?: any;
  sectionE?: any;
}

interface DataContextValue {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  submitData: () => Promise<void>;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [formData, setFormData] = useState<FormData>({});

  const submitData = async () => {
    try {
      // Combine all form data
      const allFormData = {
        ...formData.sectionA,
        ...formData.sectionB,
        ...formData.sectionC,
        ...formData.sectionD,
        ...formData.sectionE,
      };

      // Submit data to Supabase
      const { error } = await supabase.from('formularios').insert([allFormData]);
      if (error) {
        console.error('Error submitting data:', error);
        // Handle error, e.g., display error message
      } else {
        console.log('Data submitted successfully');
        // Handle success, e.g., redirect to success page
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      // Handle error
    }
  };

  const contextValue = { formData, setFormData, submitData };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

export const useFormData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useFormData must be used within a DataProvider');
  }
  return context;
};

