// webpack.config.js – custom publicPath for GitHub Pages subdirectory
const { createWebpackConfigAsync } = require('@expo/webpack-config');

module.exports = async function (env, argv) {
    const config = await createWebpackConfigAsync(env, argv);

    // When building for production (predeploy), set the publicPath to the GitHub Pages subfolder
    if (process.env.NODE_ENV === 'production') {
        config.output.publicPath = '/Demo_app/';
    }

    return config;
};
