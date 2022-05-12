import { defineConfig } from 'umi';

export default defineConfig({
  publicPath: './',
  base: './data-source-web',
  outputPath: "/data-source-web",
  hash: true,
  history: {
    type: 'hash'
  },
  nodeModulesTransform: {
    type: 'none',
  },
  fastRefresh: {},
});
