import React, { useState } from 'react';

interface ImageMagnifierProps {
  src: string;
}

const ImageMagnifier: React.FC<ImageMagnifierProps> = ({ src }) => {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    
    // Calculate cursor position as a percentage of the image dimensions
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    setCursorPosition({ x, y });
  };

  return (
    <div 
      className="relative w-full h-full group z-20"
      onMouseEnter={() => setShowMagnifier(true)}
      onMouseLeave={() => setShowMagnifier(false)}
      onMouseMove={handleMouseMove}
    >
      {src && (
        <img 
          src={src} 
          className="w-full max-h-[500px] object-contain cursor-crosshair block" 
          alt="Product Main"
        />
      )}
      
      {showMagnifier && (
        <div 
          className="absolute hidden md:block z-[60] bg-white border border-gray-200 shadow-2xl overflow-hidden rounded-md"
          style={{
            // Position: To the right of the image (100% + gap)
            left: '105%',
            top: '0',
            width: '500px', 
            height: '500px', 
            backgroundImage: `url('${src}')`,
            // Move background based on cursor percentage
            backgroundPosition: `${cursorPosition.x}% ${cursorPosition.y}%`,
            // Zoom scale (2.5x)
            backgroundSize: '250%', 
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Optional: Crosshair indicator inside zoom window or just pure image */}
        </div>
      )}
    </div>
  );
};

export default ImageMagnifier;