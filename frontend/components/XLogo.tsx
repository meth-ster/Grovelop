import React from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface XLogoProps {
  size?: number;
  color?: string;
}

export const XLogo: React.FC<XLogoProps> = ({ size = 32, color = '#000000' }) => {
  return (
    <View>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
          fill={color}
        />
      </Svg>
    </View>
  );
};

export default XLogo;
