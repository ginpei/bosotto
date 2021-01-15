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
  const [focus, setFocus] = useState<KeyboardShortcut["where"]>("");
  useFocusWatcher(setFocus);

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

      const shortcut = matchKeyboardShortcut(shortcuts, focus, event.code);
      if (!shortcut) {
        return;
      }

      event.preventDefault();

      executeKeyboardShortcut(shortcut, setFocus);
    }
  }, [on, focus]);

  // handle focus UI
  // TODO separate focus and shortcuts more better
  useEffect(() => {
    const elLastFocus = document.querySelector("[data-focus-current='true']");
    elLastFocus?.removeAttribute("data-focus-current");

    const elFocus = document.querySelector(`[data-focus-name="${focus}"]`);
    if (elFocus) {
      elFocus.setAttribute("data-focus-current", "true");
    }
  }, [focus]);
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

function useFocusWatcher(
  setFocus: (focus: string) => void,
  root = document
): void {
  useEffect(() => {
    const man = new FocusMan(
      [
        (focus) => {
          setFocus(focus);
        },
      ],
      root
    );
    return man.start();
  }, [setFocus, root]);
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
  setFocus: (focus: string) => void
) {
  const { command } = shortcut;
  if (command === "focusTalkInput") {
    const el = document.querySelector(
      "[data-focus-name='talkInput']"
    ) as HTMLElement;
    el.focus();
    setFocus("talkInput");
    return;
  }

  if (command === "focusTaskInput") {
    const el = document.querySelector(
      "[data-focus-name='taskInput']"
    ) as HTMLElement;
    el.focus();
    setFocus("taskInput");
    return;
  }

  if (command === "focusRoot") {
    (document.activeElement as HTMLElement)?.blur();
    setFocus("");
    return;
  }

  throw new Error(`Unknown command "${command}"`);
}
