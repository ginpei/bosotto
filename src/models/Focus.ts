export type OnFocusChange = (focus: string) => void;

export class FocusMan {
  private focusValue = "";

  get focus(): string {
    return this.focusValue;
  }

  set focus(focus: string) {
    this.focusValue = focus;
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
    if (!(target instanceof HTMLElement)) {
      this.focus = "";
      return;
    }

    const elFocus = target.closest("[data-focus-name]");
    const name = elFocus?.getAttribute("data-focus-name");
    this.focus = name || "";
  }

  onFocusIn(event: FocusEvent): void {
    const { target } = event;
    if (!(target instanceof HTMLElement)) {
      this.focus = "";
      return;
    }

    const elFocus = target.closest("[data-focus-name]");
    const name = elFocus?.getAttribute("data-focus-name");
    this.focus = name || "";
  }

  private pickCurrentFocus() {
    const el = this.root.querySelector("[data-focus-current]");
    const focus = el?.getAttribute("data-focus-name") ?? "";
    this.focusValue = focus;
  }

  private emitFocusChange() {
    this.onFocusChange.forEach((v) => v(this.focusValue));
  }
}
