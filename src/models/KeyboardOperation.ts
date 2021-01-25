import { EnhancedStore } from "@reduxjs/toolkit";
import { useCallback } from "react";
import { appSlice, AppState } from "./appReducer";
import { useKeyDown } from "./domEvents";
import { useFocus } from "./Focus";

export interface KeyboardShortcut {
  command: string;
  key: string;
  where: string;
}

export function useKeyboardShortcuts(
  store: EnhancedStore<AppState>,
  shortcuts: KeyboardShortcut[]
): void {
  useFocus(store);

  const callback = useCallback(
    (event: KeyboardEvent): void => {
      if (event.isComposing) {
        return;
      }

      const { focus } = store.getState();
      const shortcut = matchKeyboardShortcut(shortcuts, focus, event.code);
      if (!shortcut) {
        return;
      }

      event.preventDefault();

      executeKeyboardShortcut(store, shortcut);
    },
    [store, shortcuts]
  );

  useKeyDown(callback);
}

export function creatKeyboardShortcut(
  initial: Partial<KeyboardShortcut>
): KeyboardShortcut {
  return {
    command: "",
    key: "",
    where: "",
    ...initial,
  };
}

function matchKeyboardShortcut(
  defs: KeyboardShortcut[],
  where: KeyboardShortcut["where"],
  code: string
): KeyboardShortcut | null {
  return (
    defs.find(
      (shortcut) => shortcut.where === where && shortcut.key === code
    ) || null
  );
}

function executeKeyboardShortcut(
  store: EnhancedStore<AppState>,
  shortcut: KeyboardShortcut
) {
  const { command } = shortcut;
  if (command === "focusTalkInput") {
    store.dispatch(appSlice.actions.setFocus({ focus: "talkInput" }));
    return;
  }

  if (command === "focusTaskInput") {
    store.dispatch(appSlice.actions.setFocus({ focus: "taskInput" }));
    return;
  }

  if (command === "focusRoot") {
    store.dispatch(appSlice.actions.setFocus({ focus: "" }));
    return;
  }

  throw new Error(`Unknown command "${command}"`);
}
