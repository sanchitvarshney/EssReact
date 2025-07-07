// src/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { baseApiInstance } from "../services/baseApiInstance";
import authReducer from "../slices/authSlices";


export const store = configureStore({
  reducer: {
    [baseApiInstance.reducerPath]: baseApiInstance.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApiInstance.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 
