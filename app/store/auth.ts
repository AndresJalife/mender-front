import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import User from '@/app/types/User';
import { UserSex } from '@/app/types/enums';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// Test
// const initialState: AuthState = {
//   user: {
//     user_id: 1,
//     password: "AndresJalife",
//     email: "andyjalife@gmail.com",
//     name: "Andres Jalife",
//     username: "ajalife",
//     country: "ar",
//     new: false,
//     sex: UserSex.MALE,
//     created_date: "10/03/2025",
//     uid: "Eodt4Y0UOtYRYHe0BjQP72otifI3"
// },
//   token: "mock-token-to-prevent-auto-login",
//   isAuthenticated: true
// }

//@ts-ignore
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false
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