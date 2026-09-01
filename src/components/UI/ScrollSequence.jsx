import React, { useRef, useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';

export const ScrollSequence = ({ onExit }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
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

    const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
    const x = (canvas.width / 2) - (img.width / 2) * scale;
    const y = (canvas.height / 2) - (img.height / 2) * scale;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
  };

  // Handle scroll within the container to update frame
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (images.length === 0) return;
      
      const scrollTop = container.scrollTop;
      const maxScrollTop = container.scrollHeight - window.innerHeight;
      
      const scrollFraction = maxScrollTop > 0 ? scrollTop / maxScrollTop : 0;
      
      const frameIndex = Math.min(
        totalFrames - 1,
        Math.floor(scrollFraction * totalFrames)
      );
      
      if (images[frameIndex]) {
        requestAnimationFrame(() => drawFrame(images[frameIndex]));
      }
    };

    container.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => container.removeEventListener('scroll', handleScroll);
  }, [images]);

  // Handle resize
  useEffect(() => {
    const container = containerRef.current;
    const handleResize = () => {
      if (!container || images.length === 0) return;
      const scrollFraction = container.scrollTop / (container.scrollHeight - window.innerHeight || 1);
      const frameIndex = Math.min(totalFrames - 1, Math.floor(scrollFraction * totalFrames));
      if (images[frameIndex]) drawFrame(images[frameIndex]);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [images]);

  // Prevent scroll propagation to body
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-[60] bg-black overflow-y-auto h-screen w-screen"
    >
      {/* Fixed canvas background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full object-cover z-0 pointer-events-none"
      />
      
      {/* Scroll Spacer to create scroll height */}
      <div className="h-[500vh] w-full pointer-events-none" />

      {/* Loading overlay */}
      {loaded < totalFrames && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 text-white backdrop-blur-sm transition-opacity">
          <div className="w-64 h-2 bg-slate-800 rounded-full overflow-hidden mb-4">
            <div 
              className="h-full bg-amber-400 transition-all duration-200" 
              style={{ width: `${(loaded / totalFrames) * 100}%` }}
            />
          </div>
          <p className="font-bold text-amber-300 animate-pulse text-sm">
            Loading High-Res Sequence ({loaded}/{totalFrames})
          </p>
        </div>
      )}

      {/* UI Overlay */}
      <div className="fixed top-0 left-0 w-full p-6 z-10 flex justify-between items-start pointer-events-none">
        <button 
          onClick={onExit}
          className="pointer-events-auto flex items-center gap-2 px-4 py-2 bg-black/70 hover:bg-black text-white rounded-xl backdrop-blur border border-white/20 transition-all font-bold shadow-lg"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Dashboard
        </button>

        <div className="bg-black/70 backdrop-blur border border-white/20 px-6 py-3 rounded-2xl text-center pointer-events-none shadow-lg">
          <h2 className="text-white font-black text-xl mb-1">Scroll to Explore</h2>
          <p className="text-white/70 text-xs font-medium">Scroll down slowly for parallax animation</p>
        </div>
      </div>
    </div>
  );
};
