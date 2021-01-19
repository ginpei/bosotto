// TODO rename to FocusMan.ts or such

export type OnFocusChange = (focus: string) => void;

export class FocusMan {
  private focusValue = "";

  get focus(): string {
    return this.focusValue;
  }

  set focus(focus: string) {
    this.focusValue = focus;
    this.updateActiveFocusable();
    this.emitFocusChange();
  }

  constructor(
    private onFocusChange: OnFocusChange[] = [],
    public root: Document = document
  ) {}

  start(): () => void {
    const { root } = this;

    this.pickCurrentFocus();

    const onPointerDown = (event: PointerEvent) => this.onPointerDown(event);
    const onFocusIn = (event: FocusEvent) => this.onFocusIn(event);

    root.addEventListener("pointerdown", onPointerDown);
    root.addEventListener("focusin", onFocusIn);
    return () => {
      root.removeEventListener("pointerdown", onPointerDown);
      root.removeEventListener("focusin", onFocusIn);
    };
  }

  onPointerDown(event: PointerEvent): void {
    const { target } = event;
    if (!(target instanceof Element)) {
      this.focus = "";
      return;
    }

    const elFocus = target.closest(SEL_FOCUS_NAME);
    const name = this.getFocusNameOn(elFocus);
    this.focus = name;
  }

  onFocusIn(event: FocusEvent): void {
    const { target } = event;
    if (!(target instanceof Element)) {
      this.focus = "";
      return;
    }

    const elFocus = target.closest(SEL_FOCUS_NAME);
    const name = this.getFocusNameOn(elFocus);
    this.focus = name;
  }

  setFocus(focusName: string): void {
    (document.activeElement as HTMLElement)?.blur();

    const el = document.querySelector(`[data-focus-name='${focusName}']`);
    if (el instanceof HTMLElement) {
      el.focus();
    }
    this.focus = focusName;
  }

  private updateActiveFocusable() {
    const elLastFocus = document.querySelector("[data-focus-current='true']");
    elLastFocus?.removeAttribute("data-focus-current");

    const elFocus = document.querySelector(
      `[${ATTR_FOCUS_NAME}="${this.focus}"]`
    );
    if (elFocus) {
      elFocus.setAttribute("data-focus-current", "true");
    }
  }

  private pickCurrentFocus() {
    const el = this.root.querySelector(SEL_FOCUS_NAME);
    const name = this.getFocusNameOn(el);
    this.focusValue = name;
    this.updateActiveFocusable();
  }

  private emitFocusChange() {
    this.onFocusChange.forEach((v) => v(this.focusValue));
  }

  private getFocusNameOn(el: Element | null) {
    return el?.getAttribute(ATTR_FOCUS_NAME) ?? "";
  }
}

const ATTR_FOCUS_NAME = "data-focus-name";
const SEL_FOCUS_NAME = "[data-focus-name]";

// private getFocusableElementsFrom(from: Element | null) {
//   const els: Element[] = [];
//   for (let el = from; el; el = el.parentElement) {
//     if (el.hasAttribute(ATTR_FOCUS_NAME)) {
//       els.push(el);
//     }
//   }

//   return els;
// }
