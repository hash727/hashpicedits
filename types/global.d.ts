// types/global.d.ts

interface EyeDropperOpenOptions {
  signal?: AbortSignal;
}

interface EyeDropperResult {
  sRGBHex: string;
}

interface EyeDropper {
  //   new (): EyeDropper;
  open(options?: EyeDropperOpenOptions): Promise<EyeDropperResult>;
}

// Descire the EyeDropper CLASS/CONSTRUCTOR
interface EyeDropperConstructor {
  readonly prototype: EyeDropper;
  new (): EyeDropper;
}

declare global {
  interface Window {
    EyeDropper: EyeDropperConstructor;
  }
}

export {}; // Ensure this is treated as a module
