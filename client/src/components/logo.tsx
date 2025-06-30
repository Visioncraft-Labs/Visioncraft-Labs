import logoImage from "@assets/neon-cube-logo.png";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

const Logo = ({ className = "", showText = true, size = "md" }: LogoProps) => {
  const logoSizes = {
    sm: "h-8",
    md: "h-12", 
    lg: "h-16"
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl"
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <img 
        src={logoImage} 
        alt="VisionCraft Labs" 
        className={`${logoSizes[size]} w-auto object-contain`}
      />
      {showText && (
        <span className={`font-inter font-bold gradient-text-primary ${textSizes[size]}`}>
          VisionCraft Labs
        </span>
      )}
    </div>
  );
};

export default Logo;