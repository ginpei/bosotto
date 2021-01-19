import { useEffect, useState } from "react";
import { noop } from "../misc/misc";
import { FocusMan } from "./Focus";

export interface KeyboardShortcut {
  command: string;
  key: string;
  where: string;
}

const shortcuts: KeyboardShortcut[] = [
  creatKeyboardShortcut({
    command: "focusRoot",
    key: "Escape",
    where: "talkInput",
  }),

  creatKeyboardShortcut({
    command: "focusRoot",
    key: "Escape",
    where: "taskInput",
  }),

  creatKeyboardShortcut({
    command: "focusTalkInput",
    key: "KeyN",
    where: "",
  }),

  creatKeyboardShortcut({
    command: "focusTaskInput",
    key: "KeyT",
    where: "",
  }),
];

export function useKeyboardShortcuts(on: boolean): void {
  const [focusMan] = useState(new FocusMan());

  // handle keyboard shortcuts
  useEffect(() => {
    if (!on) {
      return noop;
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);

    function onKeyDown(event: KeyboardEvent) {
      if (event.isComposing) {
        return;
      }

      const shortcut = matchKeyboardShortcut(
        shortcuts,
        focusMan.focus,
        event.code
      );
      if (!shortcut) {
        return;
      }

      event.preventDefault();

      executeKeyboardShortcut(shortcut, focusMan);
    }
  }, [on, focusMan]);

  useEffect(() => {
    focusMan.start();
  }, [focusMan]);
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
  shortcut: KeyboardShortcut,
  focusMan: FocusMan
) {
  const { command } = shortcut;
  if (command === "focusTalkInput") {
    focusMan.setFocus("talkInput");
    return;
  }

  if (command === "focusTaskInput") {
    focusMan.setFocus("taskInput");
    return;
  }

  if (command === "focusRoot") {
    focusMan.setFocus("");
    return;
  }

  throw new Error(`Unknown command "${command}"`);
}
