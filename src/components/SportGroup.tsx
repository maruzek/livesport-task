import type { ReactNode } from "react";

type SportGroupProps = {
  sport: string;
  children: ReactNode;
};

const SportGroup = ({ sport, children }: SportGroupProps) => {
  return (
    <div key={sport} className="flex w-full flex-col">
      <span className="w-full bg-red-700 px-4 py-1 font-bold text-white">
        {sport}
      </span>
      {children}
    </div>
  );
};

export default SportGroup;
