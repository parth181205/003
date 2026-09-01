import React, { useRef, useEffect, useState } from 'react';

export const HomeParallaxBackground = () => {
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);
  const [loaded, setLoaded] = useState(0);
  const totalFrames = 300;

  // Preload images
  useEffect(() => {
    const loadedImages = [];
    let loadedCount = 0;

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const paddedNum = i.toString().padStart(3, '0');
      img.src = `/images/parallax/ezgif-frame-${paddedNum}.jpg`;
      img.onload = () => {
        loadedCount++;
        setLoaded(loadedCount);
        if (loadedCount === 1) {
          drawFrame(img);
        }
      };
      loadedImages.push(img);
    }
    setImages(loadedImages);
  }, []);

  const drawFrame = (img) => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Cover scale
    const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
    const x = (canvas.width / 2) - (img.width / 2) * scale;
    const y = (canvas.height / 2) - (img.height / 2) * scale;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
  };

  // Handle window scroll
  useEffect(() => {
    const handleScroll = () => {
      if (images.length === 0) return;
      
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      
      const scrollFraction = maxScroll > 0 ? scrollTop / maxScroll : 0;
      const frameIndex = Math.min(
        totalFrames - 1,
        Math.floor(scrollFraction * totalFrames)
      );
      
      if (images[frameIndex]) {
        requestAnimationFrame(() => drawFrame(images[frameIndex]));
      }

      // No color interpolation - Option 2 uses a static CSS gradient mask
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [images]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (images.length === 0) return;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollFraction = maxScroll > 0 ? scrollTop / maxScroll : 0;
      const frameIndex = Math.min(totalFrames - 1, Math.floor(scrollFraction * totalFrames));
      if (images[frameIndex]) drawFrame(images[frameIndex]);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [images]);

  return (
    <div className="fixed inset-0 z-0 bg-[#f0f2f5] pointer-events-none overflow-hidden">
      {/* Full grey parallax canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'contrast(1.05) opacity(0.9)' }}
      />
    </div>
  );
};
