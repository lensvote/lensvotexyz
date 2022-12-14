import clsx from 'clsx';
import type { ElementType, FC, MouseEvent, ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  forceRounded?: boolean;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
}

export const Card: FC<CardProps> = ({
  children,
  as: Tag = 'div',
  className = '',
  forceRounded = false,
  onClick
}) => {
  return (
    <Tag
      className={clsx(
        forceRounded ? 'rounded-md' : 'rounded-none sm:rounded-md',
        'bg-white',
        className
      )}
      onClick={onClick}
    >
      {children}
    </Tag>
  );
};
