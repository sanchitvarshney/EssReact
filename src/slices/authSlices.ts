import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  empCode: string;
}

const initialState: AuthState = {
  token: null,
  empCode: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
    },
    setEmplyeeCode: (state, action: PayloadAction<{ empCode: string }>) => {
      state.empCode = action.payload.empCode;
    },

  },
});

export const { setCredentials,setEmplyeeCode } = authSlice.actions;
export default authSlice.reducer;
