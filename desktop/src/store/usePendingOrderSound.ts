import { useEffect, useRef } from "react";

// usePendingOrderSound.ts
export function usePendingOrderSound(hasPending: boolean) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/order-sound.mp3");
      audioRef.current.loop = true;
    }

    if (hasPending) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [hasPending]);
}
