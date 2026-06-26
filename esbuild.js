const esbuild = require('esbuild');

const watch = process.argv.includes('--watch');

const config = {
  entryPoints: ['src/extension.ts'],
  bundle: true,
  outfile: 'dist/extension.js',
  platform: 'node',
  target: 'node16',
  external: ['vscode'],
  format: 'cjs',
  sourcemap: true,
};

async function run() {
  if (watch) {
    const ctx = await esbuild.context(config);
    await ctx.watch();
    console.log('👀 watching...');
  } else {
    await esbuild.build(config);
    console.log('✅ build done');
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});