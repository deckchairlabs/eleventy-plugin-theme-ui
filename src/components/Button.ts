import { Box, BoxProps } from './Box';
import { SxProp } from '../css';

const defaultStyles: SxProp = {
  label: 'Button',
  appearance: 'none',
  display: 'inline-block',
  textAlign: 'center',
  lineHeight: 'inherit',
  textDecoration: 'none',
  fontSize: 'inherit',
  px: 3,
  py: 2,
  color: 'white',
  bg: 'primary',
  border: 0,
  borderRadius: 4,
};

export function Button(children: string, props: BoxProps) {
  const as = props?.as || 'button';
  const variant = props?.variant || 'primary';

  return Box(children, {
    ...props,
    sx: defaultStyles,
    as,
    variant,
  });
}
