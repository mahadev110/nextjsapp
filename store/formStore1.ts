// store/formStore.ts
import { create } from 'zustand';

interface FormState {
  name: string;
  email: string;
  message: string;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setMessage: (message: string) => void;
  resetForm: () => void;
}

export const useFormStore = create<FormState>((set) => ({
  name: '',
  email: '',
  message: '',
  setName: (name) => set({ name }),
  setEmail: (email) => set({ email }),
  setMessage: (message) => set({ message }),
  resetForm: () => set({ name: '', email: '', message: '' }),
}));
