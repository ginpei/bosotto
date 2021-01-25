import { EnhancedStore } from "@reduxjs/toolkit";
import { useEffect } from "react";
import { appSlice } from "./appReducer";
import { useFocusIn, usePointerDown } from "./domEvents";

const attrFocusName = "data-focus-name";
const attrFocusCurrent = "data-focus-current";

export function useFocus(appStore: EnhancedStore): void {
  useFocusChangeEffect((focus) => {
    appStore.dispatch(appSlice.actions.setFocus({ focus }));
  });
}

/**
 * Mark focus element as "current" by adding an attr.
 */
export function useCurrentFocusAttr(focus: string): void {
  useEffect(() => {
    const elLast = document.querySelector(`[${attrFocusCurrent}]`);
    elLast?.removeAttribute(attrFocusCurrent);

    const el = findByFocusName(focus);
    el?.setAttribute(attrFocusCurrent, "true");
  }, [focus]);
}

function useFocusChangeEffect(callback: (focus: string) => void): void {
  usePointerDown((event) => {
    const { target } = event;
    const newFocus = getFocusName(target);
    callback(newFocus);
  });

  useFocusIn((event) => {
    const { target } = event;
    const newFocus = getFocusName(target);
    callback(newFocus);
  });
}

function getFocusName(el: EventTarget | null) {
  if (!(el instanceof Element)) {
    return "";
  }

  const elFocus = el.closest(`[${attrFocusName}]`);
  const focus = elFocus?.getAttribute(attrFocusName) || "";
  return focus;
}

function findByFocusName(focus: string): Element | null {
  const el = document.querySelector(`[${attrFocusName}="${focus}"]`);
  return el;
}
