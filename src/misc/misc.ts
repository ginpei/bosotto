export const noop: () => void = () => undefined;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function jcn(...names: any[]): string {
  return names
    .filter((v) => v)
    .map((v) => String(v))
    .join(" ");
}
