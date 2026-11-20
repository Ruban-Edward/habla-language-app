import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { defineConfig, type Plugin } from 'vitest/config';
import react from '@vitejs/plugin-react';

/** Files in `public/` that the installed app needs offline. */
function publicFiles(dir: string, root = dir): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? publicFiles(path, root) : [relative(root, path).split('\\').join('/')];
  });
}

/**
 * Emit `sw.js` with the list of built files. The app shell is cached on install; the French speech engine
 * (dynamically imported chunks and WebAssembly) is only cached once a learner downloads it.
 */
function hablaServiceWorker(): Plugin {
  return {
    name: 'habla-service-worker',
    apply: 'build',
    generateBundle(_options, bundle) {
      const precache = ['./', 'index.html', ...publicFiles('public')];
      const onDemand: string[] = [];
      for (const file of Object.values(bundle)) {
        if (file.fileName.endsWith('.map') || file.fileName === 'index.html') continue;
        const lazy = file.fileName.endsWith('.wasm') || (file.type === 'chunk' && file.isDynamicEntry && !file.isEntry);
        (lazy ? onDemand : precache).push(file.fileName);
      }
      const version = createHash('sha256').update(JSON.stringify([precache, onDemand])).digest('hex').slice(0, 12);
      const source = readFileSync('pwa/service-worker.js', 'utf8')
        .replace('__HABLA_VERSION__', version)
        .replace('__HABLA_PRECACHE__', JSON.stringify(precache))
        .replace('__HABLA_ON_DEMAND__', JSON.stringify(onDemand));
      this.emitFile({ type: 'asset', fileName: 'sw.js', source });
    },
  };
}

export default defineConfig({
  plugins: [react(), hablaServiceWorker()],
  test: { environment: 'node' },
});
