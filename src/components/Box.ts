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

export function Box({
  children,
  as = 'div',
  theme,
  __themeKey,
  variant,
  ...props
}: BoxProps) {
  const { sx, ...htmlAttributes } = props;

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
      value = value === true ? attribute : value;
      return `${attribute}="${String(value)}"`;
    })
    .filter(Boolean)
    .join(' ');

  return `<${as} class="${className}" ${attributes}>${children}</${as}>`;
}
