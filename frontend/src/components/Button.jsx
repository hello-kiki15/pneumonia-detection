import React from "react";

const Button = ({ onClick, children, disabled = false, className = "" }) => {
  const baseClasses =
    "px-4 py-2 rounded-xl font-semibold transition duration-200";

  const enabledClasses =
    "bg-blue-700 text-white hover:bg-blue-800 cursor-pointer";

  const disabledClasses = "bg-gray-500 cursor-not-allowed";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${disabled ? disabledClasses : enabledClasses} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
