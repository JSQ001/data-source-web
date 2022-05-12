import { defineConfig } from 'umi';
export default defineConfig({
    publicPath: './',
    base: '/data-source-web',
    outputPath: "/data-source-web",
    hash: true,
    history: {
        type: 'hash'
    },
    nodeModulesTransform: {
        type: 'none',
    },
    fastRefresh: {},
    headScripts: [
        { src: './config.js' },
    ],
    chainWebpack(memo, { env, webpack, createCSSRule }) {
        // 设置 alias
        //memo.resolve.alias.set('@', 'src');
        //
        // // 删除 umi 内置插件
        // memo.plugins.delete('progress');
        // memo.plugins.delete('friendly-error');
        // memo.plugins.delete('copy');
    },
});
//# sourceMappingURL=.umirc.js.map