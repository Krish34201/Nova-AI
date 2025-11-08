const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 w-full h-full z-[-1] overflow-hidden bg-background">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
        src="https://videos.pexels.com/video-files/3196887/3196887-hd_1920_1080_30fps.mp4"
      ></video>
      <div className="absolute inset-0 bg-black/60"></div>
    </div>
  );
};

export default AnimatedBackground;
