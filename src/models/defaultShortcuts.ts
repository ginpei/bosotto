import { creatKeyboardShortcut, KeyboardShortcut } from "./KeyboardOperation";

export const defaultShortcuts: KeyboardShortcut[] = [
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
