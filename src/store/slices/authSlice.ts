
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    email: string;
    name: string;
  } | null;
}

const initialState: AuthState = {
  isAuthenticated: JSON.parse(localStorage.getItem('isAuthenticated') || 'false'),
  user: JSON.parse(localStorage.getItem('user') || 'null'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ email: string; password: string }>) => {
      // Simple authentication - in real app, this would validate against backend
      if (action.payload.email === 'admin@restaurant.com' && action.payload.password === 'admin123') {
        state.isAuthenticated = true;
        state.user = {
          id: '1',
          email: action.payload.email,
          name: 'Restaurant Admin',
        };
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
