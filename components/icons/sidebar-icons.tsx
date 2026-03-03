import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number; strokeWidth?: number };

function BaseIcon({ size = 18, strokeWidth = 2, className, children, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

export function HomeIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M3 10.5L12 3L21 10.5" />
      <path d="M5 9.5V20H10V14H14V20H19V9.5" />
    </BaseIcon>
  );
}

export function FileTextIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M14 2H7C5.9 2 5 2.9 5 4V20C5 21.1 5.9 22 7 22H17C18.1 22 19 21.1 19 20V7L14 2Z" />
      <path d="M14 2V7H19" />
      <path d="M9 13H15" />
      <path d="M9 17H15" />
    </BaseIcon>
  );
}

export function LogOutIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M9 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H9" />
      <path d="M16 17L21 12L16 7" />
      <path d="M21 12H9" />
    </BaseIcon>
  );
}
