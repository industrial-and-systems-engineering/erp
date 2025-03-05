import { create } from 'zustand';

export const countstore= create((set) => ({
 UserNumber:0,
  checkcount: async () => {
    try {
      const response = await fetch('/api/getcount', { credentials: 'include' });
      const data = await response.json();
      set({ UserNumber:data.usernumber });
    } catch (error) {
      console.error('Error checking authentication:', error);
    }
  }
}));


