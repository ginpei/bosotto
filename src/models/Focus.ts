import { noop } from "../misc/misc";

export type OnFocusChange = (focus: string) => void;

export class FocusMan {
  constructor(
    public onFocusChange: OnFocusChange,
    public root: Document = document
  ) {
    this.start();
  }

  start(): () => void {
    const f = (event: PointerEvent) => this.onPointerDown(event);
    const { root } = this;
    root.addEventListener("pointerdown", f);
    return () => root.removeEventListener("pointerdown", f);
  }

  onPointerDown(event: PointerEvent): void {
    console.log(`# !`, event);
  }
}
