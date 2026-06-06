export default function GlobalLoading() {
  return (
    <div className="bg-[#06151a] min-h-[60vh] h-screen text-[#d4e5ec] font-['Inter'] flex flex-col items-center justify-center p-8 overflow-hidden relative w-full">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#6FF7E8]/5 blur-[100px] rounded-full z-0 animate-pulse"></div>

      <div className="relative z-10 flex flex-col items-center space-y-8">
        
        {/* Container cho hiệu ứng radar/quét */}
        <div className="relative flex items-center justify-center w-32 h-32">
          {/* Vòng ngoài cùng nhấp nháy */}
          <div className="absolute inset-0 border border-[#6FF7E8]/20 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
          
          {/* Vòng giữa quay đều */}
          <div className="absolute inset-2 border-2 border-dashed border-[#6FF7E8]/40 rounded-full animate-[spin_4s_linear_infinite]"></div>
          
          {/* Vòng trong cùng là radar sweep */}
          <div className="absolute inset-4 border border-[#6FF7E8] rounded-full shadow-[0_0_15px_rgba(111,247,232,0.3)] flex items-center justify-center bg-[#6FF7E8]/5 overflow-hidden">
            <div className="w-1/2 h-full bg-gradient-to-r from-transparent to-[#6FF7E8]/50 origin-left animate-[spin_1.5s_linear_infinite]"></div>
            
            {/* Icon trung tâm */}
            <span className="material-symbols-outlined text-[#6FF7E8] text-2xl absolute z-10">
              widgets
            </span>
          </div>
        </div>

        {/* Chữ Loading */}
        <div className="space-y-3 text-center flex flex-col items-center">
          <h2 className="text-2xl font-['Plus_Jakarta_Sans'] font-bold tracking-[0.2em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#6FF7E8] to-[#1F7EA1] animate-pulse">
            OVERLORD TOYS
          </h2>
          
          {/* Loading bar */}
          <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-[#6FF7E8] w-1/3 rounded-full animate-[slide_1.5s_ease-in-out_infinite_alternate] shadow-[0_0_10px_#6FF7E8]"></div>
          </div>
          
          <div className="flex items-center justify-center gap-1 mt-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6FF7E8]/50 animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#6FF7E8]/50 animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#6FF7E8]/50 animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
}
