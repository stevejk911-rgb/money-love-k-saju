
import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading = false,
  className = '',
  ...props 
}) => {
  const baseStyles = "w-full py-5 px-8 font-black text-[11px] tracking-[0.3em] uppercase transition-all duration-500 active:scale-[0.97] flex items-center justify-center relative overflow-hidden group";
  
  const variants = {
    // Blindfold Red
    primary: "bg-red-700 text-white shadow-[0_15px_40px_-10px_rgba(185,28,28,0.4)] hover:bg-red-600 hover:shadow-[0_20px_50px_-5px_rgba(185,28,28,0.6)] rounded-none",
    
    // Stealth Black
    secondary: "bg-white text-black hover:bg-zinc-200 rounded-none shadow-2xl",
    
    // Minimalist
    outline: "bg-transparent border border-zinc-800 text-zinc-500 hover:border-white hover:text-white rounded-none",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className} ${isLoading ? 'opacity-80 cursor-wait' : ''}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {/* Silk Glow Effect */}
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
      )}
      
      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : children}
    </button>
  );
};
