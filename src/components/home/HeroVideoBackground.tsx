import { useState } from 'react';

const HeroVideoBackground = () => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Overlay */}
      <div className="absolute inset-0 bg-background/80 dark:bg-background/85 z-10" />
      
      {/* Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        onLoadedData={() => setLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      >
        <source
          src="https://videos.pexels.com/video-files/3130284/3130284-uhd_2560_1440_30fps.mp4"
          type="video/mp4"
        />
      </video>

      {/* Brand glow on top of video */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] will-change-transform" />
        <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] will-change-transform" />
      </div>
    </div>
  );
};

export default HeroVideoBackground;
