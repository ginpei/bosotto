import { useEffect, useState } from "react";
import { noop } from "../misc/misc";

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

  useEffect(() => {
    if (!on) {
      return noop;
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);

    function onKeyDown(event: KeyboardEvent) {
      const shortcut = matchKeyboardShortcut(shortcuts, focus, event.code);
      if (!shortcut) {
        return;
      }

      event.preventDefault();

      executeKeyboardShortcut(shortcut, setFocus);
    }
  }, [on, focus]);
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
    root.addEventListener("pointerdown", onPointerDown);
    return () => root.removeEventListener("pointerdown", onPointerDown);

    function onPointerDown(event: PointerEvent) {
      const { target } = event;
      if (!(target instanceof HTMLElement)) {
        setFocus("");
        return;
      }

      const elFocus = target.closest("[data-focus-name]");
      const name = elFocus?.getAttribute("data-focus-name");
      setFocus(name || "");
    }
  }, [setFocus, root]);

  useEffect(() => {
    root.addEventListener("focusin", onFocus);
    return () => root.removeEventListener("focusin", onFocus);

    function onFocus(event: FocusEvent) {
      const { target } = event;
      if (!(target instanceof HTMLElement)) {
        setFocus("");
        return;
      }

      const elFocus = target.closest("[data-focus-name]");
      const name = elFocus?.getAttribute("data-focus-name");
      setFocus(name || "");
    }
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
