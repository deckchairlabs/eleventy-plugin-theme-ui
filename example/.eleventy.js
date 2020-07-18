const pluginThemeUI = require('../').default
const theme = require('@theme-ui/preset-base').default

module.exports = function (eleventyConfig) {
    eleventyConfig.addPlugin(pluginThemeUI, {
        theme
    });
};