import { useDispatch } from "react-redux";

import type { AppDispatch } from "../features/Store";

// Typed dispatch hook - use instead of plain `useDispatch`.
export const useAppDispatch: () => AppDispatch = useDispatch;
