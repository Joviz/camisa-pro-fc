interface LogoProps {
  className?: string;
}

export const Logo = ({ className = "h-8 w-auto" }: LogoProps) => {
  return (
    <svg xmlns="http://w3.org" viewBox="0 0 1000 220" className={className}>
      <defs>
        <linearGradient id="goldMetallic" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#BF953F" />
          <stop offset="20%" stop-color="#FCF6BA" />
          <stop offset="40%" stop-color="#B38728" />
          <stop offset="60%" stop-color="#FBF5B7" />
          <stop offset="80%" stop-color="#AA771C" />
          <stop offset="100%" stop-color="#E1C670" />
        </linearGradient>

        <filter id="textShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow
            dx="0"
            dy="5"
            stdDeviation="4"
            flood-color="#000000"
            flood-opacity="0.5"
          />
        </filter>
      </defs>

      <g filter="url(#textShadow)">
        <text
          x="80"
          y="170"
          font-family="'Impact', 'Arial Black', sans-serif"
          font-size="160"
          font-weight="900"
          fill="#FFFFFF"
          letter-spacing="-2"
        >
          Camisa
        </text>

        <text
          x="565"
          y="170"
          font-family="'Impact', 'Arial Black', sans-serif"
          font-size="160"
          font-weight="900"
          fill="url(#goldMetallic)"
          letter-spacing="-2"
        >
          ProFc
        </text>
      </g>
    </svg>
  );
};
