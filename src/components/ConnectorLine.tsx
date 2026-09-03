import React from 'react';

export const ConnectorLine: React.FC = () => {
  return (
    <div className="hidden lg:block w-full pt-3 pb-2 select-none pointer-events-none" aria-hidden="true">
      <svg
        viewBox="0 0 1200 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-12 text-neutral-900 dark:text-neutral-400 stroke-current"
      >
        <defs>
          {/* Arrowhead marker definition pointing upward */}
          <marker
            id="arrow-up-1"
            viewBox="0 0 12 12"
            refX="6"
            refY="3"
            markerWidth="8"
            markerHeight="8"
            orient="auto"
          >
            <path
              d="M 2 9 L 6 3 L 10 9"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </marker>
          <marker
            id="arrow-up-2"
            viewBox="0 0 12 12"
            refX="6"
            refY="3"
            markerWidth="8"
            markerHeight="8"
            orient="auto"
          >
            <path
              d="M 2 9 L 6 3 L 10 9"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </marker>
        </defs>

        {/* 
          First curve: Flows under card 1, 2, 3 and arches upward to point at card 4 (x ~ 700)
        */}
        <path
          d="M 100 14 C 240 14, 380 20, 520 28 C 630 35, 685 30, 698 8"
          strokeWidth="1.2"
          strokeLinecap="round"
          markerEnd="url(#arrow-up-1)"
        />

        {/* 
          Second curve: Continues from card 4 area, swoops under card 5, and arches upward to point at card 6 (x ~ 1080)
        */}
        <path
          d="M 708 26 C 770 34, 880 34, 980 32 C 1045 30, 1072 24, 1078 8"
          strokeWidth="1.2"
          strokeLinecap="round"
          markerEnd="url(#arrow-up-2)"
        />
      </svg>
    </div>
  );
};
