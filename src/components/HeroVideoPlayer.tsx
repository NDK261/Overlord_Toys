"use client";

import { useState, useRef, useEffect } from "react";

export default function HeroVideoPlayer({ videoSrc, audioSrc }: { videoSrc: string; audioSrc: string }) {
  // Bắt đầu với trạng thái tắt tiếng vì trình duyệt không cho phép tự động phát âm thanh
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Xử lý khi người dùng chuyển tab (visibility change)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Nếu chuyển sang tab khác, tự động tạm dừng âm thanh
        audioRef.current?.pause();
      } else {
        // Nếu quay lại tab này và chưa bị tắt tiếng, tiếp tục phát
        if (!isMuted) {
          audioRef.current?.play().catch(() => {
            // Xử lý lỗi nếu trình duyệt chặn
            console.log("Browser blocked autoplay on return");
          });
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isMuted]);

  // Xử lý bật/tắt tiếng khi bấm nút
  useEffect(() => {
    if (!isMuted) {
      audioRef.current?.play().catch(() => {
        setIsMuted(true);
      });
    } else {
      audioRef.current?.pause();
    }
  }, [isMuted]);

  return (
    <div className="w-full h-full relative group/player">
      <video
        src={videoSrc}
        autoPlay
        loop
        muted // Luôn để video gốc là muted để đảm bảo nó luôn tự động phát được
        playsInline
        className="w-full h-full object-cover rounded-3xl"
      />
      {/* Thẻ audio chạy song song với video để kiểm soát âm thanh */}
      <audio ref={audioRef} src={audioSrc} loop />
      
      <button
        onClick={(e) => {
          e.preventDefault();
          setIsMuted(!isMuted);
        }}
        className="absolute bottom-4 right-4 bg-black/60 hover:bg-[#6FF7E8]/20 backdrop-blur-md p-3 rounded-full text-white transition-all opacity-50 group-hover/player:opacity-100 flex items-center justify-center border border-white/10 hover:border-[#6FF7E8]/50 shadow-lg z-50"
        title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
      >
        <span className="material-symbols-outlined text-xl">
          {isMuted ? "volume_off" : "volume_up"}
        </span>
      </button>
    </div>
  );
}
