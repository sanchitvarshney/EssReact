import React from 'react';
import { Icons } from '../icons';

type IconName = keyof typeof Icons;

interface IconProps {
  name: IconName;
  size?: 'small' | 'inherit' | 'large' | 'medium';
  color?: string;
  hover?: boolean;
  isExpended?: boolean;
  mr?: boolean;
}

const DynamicIcon: React.FC<IconProps> = ({
  name,
  size = 'medium',
}) => {
  const IconComponent = Icons[name];

  if (!IconComponent) {
  
    return null;
  }

  return (
    <IconComponent
      fontSize={size}
      className={`hover:no-underline hover:text-white-700 text-[#000]`}
    />
  );
};

export default DynamicIcon;
