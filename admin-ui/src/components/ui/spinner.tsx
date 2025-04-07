import React from "react";

const Spinner = ({ size = "medium", color = "gray", className = "" }) => {
  // Size variations
  const sizeClasses: { [key: string]: string } = {
    small: "w-4 h-4",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  };

  // Color variations
  const colorClasses: { [key: string]: string } = {
    blue: "border-blue-500 border-t-blue-200",
    green: "border-green-500 border-t-green-200",
    red: "border-red-500 border-t-red-200",
    gray: "border-gray-500 border-t-gray-200",
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`
          ${sizeClasses[size] || sizeClasses.medium}
          ${colorClasses[color] || colorClasses.blue}
          border-4 
          border-solid 
          rounded-full 
          animate-spin
          ${className}
        `}
      />
    </div>
  );
};

export default Spinner;
