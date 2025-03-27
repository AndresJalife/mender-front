import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface User {
  id: number;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: {
    id: 1,
    name: "Usuario de Prueba",
    email: "prueba@gmail.com"
  },
  token: null,
  isAuthenticated: true
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    }
  }
})

export const { loginSuccess, logout, updateUser } = authSlice.actions
export default authSlice.reducer 