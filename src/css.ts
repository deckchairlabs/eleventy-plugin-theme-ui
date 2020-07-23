import emotion from 'emotion';
//@ts-ignore
import { css as themedCss, get } from '@theme-ui/css';
import { SystemStyleObject, UseThemeFunction } from '@styled-system/css';
import { Theme } from 'theme-ui';

export type SxProp = Exclude<SystemStyleObject, UseThemeFunction> & {
  variant?: string;
  label?: string;
};

export function css(sx: SxProp, theme: Theme) {
  if (sx) {
    const { label, ...styles } = sx;

    const mergedStyles = {
      label: process.env.NODE_ENV === 'production' ? undefined : label,
      ...themedCss(styles)({ theme }),
    };

    return emotion.css(mergedStyles);
  }

  return undefined;
}
