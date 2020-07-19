const pluginThemeUI = require('../').default
const transforms = require('./eleventy/transforms.js')
const theme = require('./theme')

module.exports = function (eleventyConfig) {
    eleventyConfig.addPlugin(pluginThemeUI, {
        theme
    });

    // Transform
    Object.keys(transforms).forEach((transformName) => {
        eleventyConfig.addTransform(transformName, transforms[transformName])
    })

    return {
        templateFormats: ['njk', 'md'],
        htmlTemplateEngine: 'njk',
        markdownTemplateEngine: 'njk',
        passthroughFileCopy: true
    }
};