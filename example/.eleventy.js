const pluginThemeUI = require('../').default
const theme = require('./theme')

module.exports = function (eleventyConfig) {
    eleventyConfig.addPlugin(pluginThemeUI, {
        theme
    });
};