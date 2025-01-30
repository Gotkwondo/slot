import { ReactNode, ComponentProps } from 'react';

type Props = {
  children?: ReactNode;
  inverted?: boolean;
} & ComponentProps<'button'>;

/**
 * 버튼 컴포넌트
 * @param inverted - 버튼 스타일을 반전시킬지 여부
 * @returns
 */
const Button = ({
  children,
  inverted = false,
  className = '',
  ...rest
}: Props) => {
  if (inverted) {
    return (
      <button
        className={`px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-100 hover:text-green-900 cursor-pointer ${className}`}
        {...rest}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      className={`px-3 py-2 border border-green-500 rounded-md hover:bg-green-500 hover:text-white cursor-pointer ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export { Button };
