export type TranslationLanguage = 'en' | 'es' | 'fr' | 'hi';

type TranslationResponse = {
  responseStatus: number;
  responseDetails?: string;
  responseData?: { translatedText: string };
};

function isTranslationResponse(value: unknown): value is TranslationResponse {
  if (!value || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  const data = record.responseData;
  return (
    typeof record.responseStatus === 'number' &&
    (data === undefined ||
      (!!data && typeof data === 'object' && typeof (data as Record<string, unknown>).translatedText === 'string'))
  );
}

export async function translateText(
  text: string,
  source: TranslationLanguage,
  target: TranslationLanguage,
  signal?: AbortSignal,
): Promise<string> {
  const query = text.trim();
  if (!query) throw new Error('Enter a word or sentence to translate.');
  if (source === target) throw new Error('Choose two different languages.');
  if (new TextEncoder().encode(query).byteLength > 500) {
    throw new Error('Please keep the text under 500 bytes. Shorter phrases translate more reliably.');
  }

  const url = new URL('https://api.mymemory.translated.net/get');
  url.searchParams.set('q', query);
  url.searchParams.set('langpair', `${source}|${target}`);

  const response = await fetch(url, { signal, headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`The translation service returned an error (${response.status}).`);

  const value: unknown = await response.json();
  if (!isTranslationResponse(value)) throw new Error('The translation service returned an unreadable response.');
  if (value.responseStatus !== 200) {
    throw new Error(value.responseDetails || 'The translation service could not translate this text.');
  }
  if (!value.responseData) throw new Error('The translation service returned an unreadable response.');

  const translated = value.responseData.translatedText.trim();
  if (!translated) throw new Error('The translation service returned an empty result.');
  return translated;
}
