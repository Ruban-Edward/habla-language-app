declare module '@piper-plus/g2p/fr' {
  export class FrenchG2P {
    phonemize(text: string): { tokens: string[]; prosody: (null | { a1: number; a2: number; a3: number })[] };
  }
}

declare module '@piper-plus/g2p/encode' {
  export class Encoder {
    constructor(phonemeIdMap: Record<string, number[]>);
    encode(tokens: string[]): { phonemeIds: number[]; droppedSymbols: string[] };
  }
}

declare module 'onnxruntime-web/ort-wasm-simd-threaded.wasm?url' {
  const url: string;
  export default url;
}
