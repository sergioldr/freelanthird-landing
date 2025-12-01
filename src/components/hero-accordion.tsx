import { useState } from "react";

interface HeroAccordionProps {
  items: {
    title: string;
    description: string;
  }[];
}

export default function HeroAccordion({ items }: HeroAccordionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <nav className="flex flex-col h-full w-full">
      {items.map((item, index) => (
        <div
          key={index}
          className={`flex-1 relative overflow-hidden border-t first:border-t-0 transition-all duration-500 ease-out ${
            activeIndex === index ? "flex-[3]" : "flex-1"
          }`}
        >
          <button
            onClick={() => handleToggle(index)}
            className="w-full h-full flex flex-col items-center justify-center text-center cursor-pointer"
          >
            <div className="flex items-center justify-center gap-2">
              <span className="uppercase font-semibold text-white text-3xl">
                {item.title}
              </span>
              <svg
                className={`w-5 h-5 text-white transition-transform duration-300 ${
                  activeIndex === index ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
            <div
              className={`grid transition-all duration-500 ease-out ${
                activeIndex === index
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="text-white/80 text-sm px-4 pt-4 leading-relaxed max-w-md mx-auto">
                  {item.description}
                </p>
              </div>
            </div>
          </button>
        </div>
      ))}
    </nav>
  );
}
