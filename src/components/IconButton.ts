import { Box, BoxProps } from './Box';

export type IconButtonProps = BoxProps & {
  size: number;
};

export function IconButton({ size = 32, ...props }: IconButtonProps) {
  return Box({
    as: 'button',
    variant: 'icon',
    __themeKey: 'buttons',
    sx: {
      label: 'IconButton',
      appearance: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 1,
      width: size,
      height: size,
      color: 'inherit',
      bg: 'transparent',
      border: 'none',
      borderRadius: 4,
    },
    ...props,
  });
}
