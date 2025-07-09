import { useEffect, useState, type FC } from "react";
import { Bounce } from "react-awesome-reveal";
// CustomTag.jsx
interface CustomTagProps {
  label: string;
  color?: string;
  textColor?: string;
}
const CustomTag: FC<CustomTagProps> = ({ label, color, textColor }) => {
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimKey((prev) => prev + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, []);
  return (
    <Bounce key={animKey} duration={1000} triggerOnce={true}>
      <svg
        // width="200"
        // height="50"
        viewBox="0 0 200 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", margin: "0 auto" }}
        className=" w-20 h-10 sm:w-30 sm:h-10"
      >
        {/* Left tail */}
        <path
          d="M0,60 Q20,70 40,60 Q30,80 90,70 Q40,90 0,80 Z"
          fill={color || "#e11d48"}
        />
        {/* Right tail */}
        <path
          d="M220,60 Q200,70 180,60 Q190,80 130,70 Q180,90 220,80 Z"
          fill={color || "#e11d48"}
        />
        {/* Main ribbon */}
        <rect
          x="20"
          y="20"
          rx="40"
          width="180"
          height="50"
          fill={color || "#e11d48"}
        />
        {/* Label text */}
        <text
          x="110"
          y="50"
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize="24"
          fontWeight="bold"
          fill={textColor || "#fff"}
          style={{ fontFamily: "inherit" }}
        >
          {label}
        </text>
      </svg>
    </Bounce>
  );
};

export default CustomTag;
