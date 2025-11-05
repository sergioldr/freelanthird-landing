import React, { useEffect, useRef } from "react";
import anime from "animejs";

interface TitleAnimationProps {
  className?: string;
  text?: string;
  fontSize?: number;
  colors?: string[];
}

const TitleAnimation: React.FC<TitleAnimationProps> = ({
  className,
  text = "FREELANTHIRD",
  fontSize = 160,
  colors = ["#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF", "#FF922B", "#845EC2"],
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const patternRef = useRef<SVGPatternElement>(null);
  const animationsRef = useRef<anime.AnimeInstance[]>([]);

  useEffect(() => {
    if (!patternRef.current) return;

    const pattern = patternRef.current;
    const columns = 20;
    const segmentHeight = 50;

    // Clear any existing pattern elements and animations
    pattern.innerHTML = "";
    // Stop all previous animations
    animationsRef.current.forEach((animation) => {
      if (animation && animation.pause) {
        animation.pause();
      }
    });
    animationsRef.current = [];

    // Create animated rectangles for the pattern
    for (let i = 0; i < columns; i++) {
      const x = i * 70; // Increased spacing to cover wider area
      for (let j = 0; j < 8; j++) {
        const rect = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect"
        );
        rect.setAttribute("x", x.toString());
        rect.setAttribute("y", (j * segmentHeight).toString());
        rect.setAttribute("width", "70"); // Increased width to match spacing
        rect.setAttribute("height", segmentHeight.toString());
        rect.setAttribute(
          "fill",
          colors[Math.floor(Math.random() * colors.length)]
        );
        pattern.appendChild(rect);

        // Create and store animation instance using anime.js v3 syntax
        const animation = anime({
          targets: rect,
          translateY: [
            {
              value: -20 + Math.random() * 40,
              duration: 100 + Math.random() * 100,
            },
            {
              value: 0,
              duration: 1000 + Math.random() * 100,
            },
          ],
          easing: "easeInOutSine",
          loop: true,
          direction: "alternate",
          delay: Math.random() * 1000,
          autoplay: true,
        });

        animationsRef.current.push(animation);
      }
    }

    // Cleanup function
    return () => {
      animationsRef.current.forEach((animation) => {
        if (animation && animation.pause) {
          animation.pause();
        }
      });
      animationsRef.current = [];
    };
  }, [colors]);

  // Cleanup animations on unmount
  useEffect(() => {
    return () => {
      animationsRef.current.forEach((animation) => {
        if (animation && animation.pause) {
          animation.pause();
        }
      });
    };
  }, []);

  return (
    <div className={`flex justify-center items-center ${className || ""}`}>
      <style>
        {`
          @import url('https://api.fontshare.com/v2/css?f[]=satoshi@901&display=swap');
          
          .title-animation-svg {
            width: 100%;
            height: 200px;
            max-width: 100%;
          }
          
          .title-animation-text {
            font-family: 'Satoshi', sans-serif;
            user-select: none;
            font-weight: 900;
          }
          
          @media (max-width: 768px) {
            .title-animation-svg {
              height: 120px;
            }
          }
        `}
      </style>

      <svg
        ref={svgRef}
        className="title-animation-svg"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1400 200"
      >
        <defs>
          <pattern
            ref={patternRef}
            id="slidePattern"
            patternUnits="userSpaceOnUse"
            width="1400"
            height="200"
          />
        </defs>
        <text
          x="700"
          y="150"
          fontSize={fontSize}
          fill="url(#slidePattern)"
          className="title-animation-text"
          textAnchor="middle"
        >
          {text}
        </text>
      </svg>
    </div>
  );
};

export default TitleAnimation;
