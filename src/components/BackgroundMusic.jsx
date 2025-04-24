import { useEffect, useRef } from "react";

const BackgroundMusic = ({ src, loop = true }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    const playAudio = () => {
      if (audioRef.current) {
        audioRef.current.play().catch((err) => {
          console.warn("Autoplay prevented:", err);
        });
      }
    };

    playAudio();
  }, []);

  return <audio ref={audioRef} src={src} loop={loop} autoPlay />;
};

export default BackgroundMusic;
