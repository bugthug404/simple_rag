import React from "react";
import { twMerge } from "tailwind-merge";

interface EasyButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

const EasyButton: React.FC<EasyButtonProps> = ({
  className = "",
  children = "Button",
  type = "button",
  ...rest
}: EasyButtonProps) => {
  const buttonClasses = twMerge(
    "px-6 py-2 bg-blue-200 rounded-full font-semibold text-sm active:scale-[0.99]",
    className
  );

  return (
    <button className={buttonClasses} type={type} {...rest}>
      {children}
    </button>
  );
};

export default EasyButton;
