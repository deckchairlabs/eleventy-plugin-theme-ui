import emotion from 'emotion';
//@ts-ignore
import { css as themedCss, get } from '@theme-ui/css';
import { SystemStyleObject, UseThemeFunction } from '@styled-system/css';
import { Theme } from 'theme-ui';

export type SxProp = Exclude<SystemStyleObject, UseThemeFunction> & {
  variant?: string;
  __themeKey?: string;
};

export function css(sx: SxProp, theme: Theme) {
  if (sx) {
    const { variant, __themeKey = 'variants', ...baseStyles } = sx;
    const variantStyles = themedCss(
      get(theme, __themeKey + '.' + variant, get(theme, variant))
    )({ theme });

    const mergedStyles = {
      ...variantStyles,
      ...themedCss(baseStyles)({ theme }),
    };

    return emotion.css(mergedStyles);
  }

  return undefined;
}
