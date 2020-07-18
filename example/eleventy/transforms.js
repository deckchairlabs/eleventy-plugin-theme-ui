const htmlnano = require('htmlnano')

const preset = Object.assign(htmlnano.presets.safe, {
    removeRedundantAttributes: true
})

module.exports = {
    htmlmin: async function (content, outputPath) {
        if (
            outputPath &&
            outputPath.endsWith('.html') &&
            process.env.NODE_ENV === 'production'
        ) {
            const { html } = await htmlnano.process(
                content,
                {
                    minifySvg: {
                        plugins: [{ removeViewBox: false }]
                    },
                    minifyCss: {
                        preset: 'advanced'
                    }
                },
                preset
            )

            return html
        }

        return content
    }
}