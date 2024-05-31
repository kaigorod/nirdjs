

import dts from 'bun-plugin-dts';

await Bun.$`rm -Rf ./dist; mkdir dist`

await Bun.build({
  entrypoints: ['./index.ts'],
  outdir: './dist',
  plugins: [
    dts()
  ],
});