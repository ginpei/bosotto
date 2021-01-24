import { configureStore, createSlice, EnhancedStore } from "@reduxjs/toolkit";
import { useState } from "react";

export type AppState = ReturnType<ReturnType<typeof createAppSlice>["reducer"]>;
export type AppActions = ReturnType<typeof createAppSlice>["actions"];

export const appSlice = createAppSlice();

export function useAppStore(): EnhancedStore<AppState> {
  const [store] = useState(
    configureStore({
      reducer: appSlice.reducer,
    })
  );

  return store;
}

function createAppSlice() {
  return createSlice({
    name: "app",
    initialState: {
      count: 0,
    },
    reducers: {
      decrease: (v) => ({ ...v, count: v.count - 1 }),
      increase: (v) => ({ ...v, count: v.count + 1 }),
    },
  });
}
