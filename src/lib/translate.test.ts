import { afterEach, describe, expect, it, vi } from 'vitest';
import { translateText } from './translate';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('translateText', () => {
  it('sends the entered text and selected language pair to the translation service', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({
        responseStatus: 200,
        responseData: { translatedText: 'Hola' },
      }), { status: 200, headers: { 'Content-Type': 'application/json' } }),
    );
    vi.stubGlobal('fetch', fetchMock);

    await expect(translateText('Hello', 'en', 'es')).resolves.toBe('Hola');
    const url = new URL(fetchMock.mock.calls[0][0]);
    expect(url.origin).toBe('https://api.mymemory.translated.net');
    expect(url.searchParams.get('q')).toBe('Hello');
    expect(url.searchParams.get('langpair')).toBe('en|es');
  });

  it('enforces the translation service byte limit before sending text', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await expect(translateText('न'.repeat(251), 'hi', 'en')).rejects.toThrow('under 500 bytes');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('reports service and malformed-response errors instead of showing an empty translation', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ responseStatus: 403, responseDetails: 'Daily limit reached' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    ));
    await expect(translateText('Hello', 'en', 'fr')).rejects.toThrow('Daily limit reached');

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200 }),
    ));
    await expect(translateText('Hello', 'en', 'fr')).rejects.toThrow('unreadable response');
  });
});
