import React, { useState } from 'react';

interface InstrumentChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  description?: string;
}

export const InstrumentChip: React.FC<InstrumentChipProps> = ({ label, selected, onClick, description }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          px-3 py-2 rounded-full text-xs font-medium border transition-all duration-200 select-none
          ${selected 
            ? 'bg-accent/20 border-accent/50 text-white shadow-[0_0_15px_rgba(124,58,237,0.3)]' 
            : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:border-white/10 hover:text-slate-200'}
        `}
      >
        {label}
      </button>
      
      {description && isHovered && (
        <div 
          className="absolute z-[100] bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-slate-900 border border-accent/30 rounded-xl shadow-2xl text-[11px] text-slate-200 leading-relaxed animate-in fade-in zoom-in-95 pointer-events-none"
        >
          {description}
          {/* Tooltip Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-8 border-transparent border-t-slate-900"></div>
        </div>
      )}
    </div>
  );
};