import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export const Toggle: React.FC<ToggleProps> = ({ checked, onChange, label }) => {
  return (
    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onChange(!checked)}>
      <div className={`relative w-12 h-7 rounded-full p-1 transition-colors duration-300 ease-in-out ${checked ? 'bg-gradient-to-r from-accent to-accentHover' : 'bg-slate-700'}`}>
        <div className={`absolute top-1 bottom-1 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </div>
      {label && <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{label}</span>}
    </div>
  );
};