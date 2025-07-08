import type { FC } from "react";
import { Ribbon, RibbonContainer } from "react-ribbons";
// CustomTag.jsx
interface CustomTagProps {
  label: string;
  color?: string;
  textColor?: string;
}
const CustomTag: FC<CustomTagProps> = ({ label }) => {
  return (
    <RibbonContainer>
      {/* @ts-ignore */}
      <Ribbon
      
        side="right"
        type="edge"
        size="normal"
        backgroundColor="#00cc00"
        color="#000"
        
        fontFamily="serif"
        withStripes={true}
       
      >
        {label}
      </Ribbon>
    </RibbonContainer>
  );
};

export default CustomTag;
