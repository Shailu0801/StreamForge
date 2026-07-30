import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
}

const Card = ({ children }: CardProps) => {
  return (
    <div
      className="
      rounded-2xl
      border border-slate-800
      bg-slate-900/70
      backdrop-blur-md
      shadow-xl
      transition-all
      duration-300
      hover:border-blue-500/40
      hover:-translate-y-1
      hover:shadow-blue-500/10
      p-6
    "
    >
      {children}
    </div>
  );
};

export default Card;