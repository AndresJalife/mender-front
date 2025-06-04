import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import User from '@/app/types/User';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// // Test
const initialState: AuthState = {
  user: {
    id: 1,
    name: "Andres Jalife",
    email: "andyjalife@gmail.com",
    username: "andyjalife",
    password: "AndresJalife"
  },
  token: null,
  isAuthenticated: true
}

// const initialState: AuthState = {
//   user: {
//     id: null,
//     name: null,
//     email: null,
//     username: null,
//     password: null
//   },
//   token: null,
//   isAuthenticated: false
// }

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