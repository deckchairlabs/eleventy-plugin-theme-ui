const pluginThemeUI = require('../').default
const transforms = require('./eleventy/transforms.js')

module.exports = function (eleventyConfig) {
    eleventyConfig.addPlugin(pluginThemeUI, {
        themePath: './theme'
    });

    // Transform
    Object.keys(transforms).forEach((transformName) => {
        eleventyConfig.addTransform(transformName, transforms[transformName])
    })
};