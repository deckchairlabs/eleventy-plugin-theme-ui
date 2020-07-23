import { Theme } from 'theme-ui';
//@ts-ignore
import { css as themedCss, get } from '@theme-ui/css';
import { css, SxProp } from '../css';

export type BoxProps = {
  children?: string;
  theme: Theme;
  __themeKey?: string;
  as?: string;
  variant?: string;
  sx?: SxProp;
};

export function Box({ children, ...props }: BoxProps) {
  const {
    theme,
    as = 'div',
    sx,
    variant,
    __themeKey,
    ...htmlAttributes
  } = props;

  const variantStyles = themedCss(
    get(theme, __themeKey + '.' + variant, get(theme, variant))
  )({ theme });

  const className = css(
    {
      label: 'Box',
      ...sx,
      ...variantStyles,
    },
    theme
  );

  const attributes = Object.entries(htmlAttributes)
    .map(([attribute, value]) => {
      if (attribute === '__keywords') {
        return;
      }
      return `${attribute}="${String(value)}"`;
    })
    .filter(Boolean)
    .join(' ');

  return `<${as} class="${className}" ${attributes}>${children}</${as}>`;
}
