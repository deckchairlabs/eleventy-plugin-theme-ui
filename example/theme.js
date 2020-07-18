const theme = require('@theme-ui/preset-base').default

module.exports = {
    ...theme,
    buttons: {
        base: {
            appearance: 'none',
            display: 'inline-block',
            textAlign: 'center',
            lineHeight: 'inherit',
            textDecoration: 'none',
            fontSize: 'inherit',
            paddingX: 3,
            paddingY: 2,
            border: 0,
            borderRadius: 4,
        },
        primary: {
            variant: 'buttons.base',
            backgroundColor: 'primary',
            color: 'white'
        },
        secondary: {
            variant: 'buttons.base',
            backgroundColor: 'secondary',
            color: 'white'
        }
    }
}