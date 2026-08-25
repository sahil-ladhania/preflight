interface ImportMeta {
  readonly vitest?: {
    describe: (name: string, fn: () => void) => void;
    it: (name: string, fn: () => void) => void;
    expect: (value: unknown) => {
      toBe: (expected: unknown) => void;
      toContain: (expected: string) => void;
    };
  };
}
