import { Theme } from 'theme-ui';
import { css, SxProp } from '../css';

export type BoxProps = {
  theme: Theme;
  as?: string;
  variant?: string;
  sx?: SxProp;
};

export function Box(children: string, props: BoxProps) {
  const { theme, as = 'div', variant, sx, ...htmlAttributes } = props;

  const className = css(
    {
      variant,
      label: 'Box',
      ...sx,
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
