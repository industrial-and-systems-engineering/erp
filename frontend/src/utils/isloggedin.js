import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  isAuthenticated: false,
  checkAuth: async () => {
    try {
      const response = await fetch('/api/isloggedin/user', { credentials: 'include' });
      const data = await response.json();
      set({ isAuthenticated: data.isLoggedIn });
    } catch (error) {
      console.error('Error checking authentication:', error);
      set({ isAuthenticated: false });
    }
  }
}));

export const useAuthStore1 = create((set) => ({
  isAuthenticated1: false,
  checkAuth1: async () => {
    try {
      const response = await fetch('/api/isloggedin/technician', { credentials: 'include' });
      const data = await response.json();
      set({ isAuthenticated1: data.isLoggedIn });
    } catch (error) {
      console.error('Error checking authentication:', error);
      set({ isAuthenticated1: false });
    }
  }
}));

export const useAuthStore2 = create((set) => ({
  isAuthenticated2: false,
  checkAuth2: async () => {
    try {
      const response = await fetch('/api/isloggedin/csc', { credentials: 'include' });
      const data = await response.json();
      set({ isAuthenticated2: data.isLoggedIn });
    } catch (error) {
      console.error('Error checking authentication:', error);
      set({ isAuthenticated2: false });
    }
  }
}));


