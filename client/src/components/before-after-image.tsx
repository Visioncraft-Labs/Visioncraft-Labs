interface BeforeAfterImageProps {
  beforeImage: string;
  afterImage: string;
  beforeAlt: string;
  afterAlt: string;
  className?: string;
}

const BeforeAfterImage = ({ 
  beforeImage, 
  afterImage, 
  beforeAlt, 
  afterAlt, 
  className = "" 
}: BeforeAfterImageProps) => {
  return (
    <div className={`before-after-container ${className}`}>
      <img 
        src={beforeImage} 
        alt={beforeAlt} 
        className="w-full h-full object-cover" 
      />
      <div className="after-image">
        <img 
          src={afterImage} 
          alt={afterAlt} 
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default BeforeAfterImage;
