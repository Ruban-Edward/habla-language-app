import { Encoder } from '@piper-plus/g2p/encode';
import { FrenchG2P } from '@piper-plus/g2p/fr';
import { describe, expect, it } from 'vitest';
import { addFrenchNasalVowelAliases, speechSupported, speak } from './speech';

describe('speech playback', () => {
  it('reports unsupported playback instead of silently ignoring it', async () => {
    expect(speechSupported).toBe(false);
    await expect(speak('bonjour', 'fr-FR')).resolves.toEqual({
      ok: false,
      reason: 'unsupported',
    });
  });

  it('keeps French nasal vowels when encoding legacy Piper phoneme maps', async () => {
    const text = 'Un bon vin blanc.';
    const tokens = new FrenchG2P().phonemize(text).tokens;
    const legacyMap: Record<string, number[]> = { _: [0], '^': [1], $: [2] };
    let nextId = 3;
    for (const token of tokens) {
      for (const character of token) {
        if (!legacyMap[character]) legacyMap[character] = [nextId++];
      }
    }
    for (const phoneme of ['ɛ̃', 'ɑ̃', 'ɔ̃']) {
      for (const character of phoneme) {
        if (!legacyMap[character]) legacyMap[character] = [nextId++];
      }
    }

    addFrenchNasalVowelAliases(legacyMap);
    expect(new Encoder(legacyMap).encode(tokens).droppedSymbols).toEqual([]);
  });
});
