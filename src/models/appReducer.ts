import { configureStore, createSlice } from "@reduxjs/toolkit";

export type AppState = ReturnType<ReturnType<typeof createAppSlice>["reducer"]>;
export type AppActions = ReturnType<typeof createAppSlice>["actions"];

export const appSlice = createAppSlice();

export const appStore = configureStore({ reducer: appSlice.reducer });

function createAppSlice() {
  return createSlice({
    name: "app",
    initialState: {
      count: 0,
      focus: "",
    },
    reducers: {
      decrease: (v) => ({ ...v, count: v.count - 1 }),
      increase: (v) => ({ ...v, count: v.count + 1 }),
      setFocus: (state, action: { payload: { focus: string } }) => ({
        ...state,
        focus: action.payload.focus,
      }),
    },
  });
}
