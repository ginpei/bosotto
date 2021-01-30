import { configureStore, createSlice } from "@reduxjs/toolkit";
import { Task } from "./Task";

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
      showingArchivedTasks: false,
      userTasks: [] as Task[],
    },
    reducers: {
      decrease: (v) => ({ ...v, count: v.count - 1 }),
      increase: (v) => ({ ...v, count: v.count + 1 }),
      setFocus: (state, action: { payload: { focus: string } }) => ({
        ...state,
        focus: action.payload.focus,
      }),
      setShowingArchivedTasks: (
        state,
        action: { payload: { show: boolean } }
      ) => ({
        ...state,
        showingArchivedTasks: action.payload.show,
      }),
      setUserTasks: (state, action: { payload: { userTasks: Task[] } }) => ({
        ...state,
        userTasks: action.payload.userTasks,
      }),
    },
  });
}
