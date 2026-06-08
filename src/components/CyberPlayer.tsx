import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import {
  Play,
  Pause,
  Maximize,
  Minimize,
  RefreshCw,
  SkipBack,
  SkipForward,
  Loader2,
  AlertCircle
} from "lucide-react";
import { Channel } from "../channelsData";

interface CyberPlayerProps {
  channel: Channel | null;
  onPrev?: () => void;
  onNext?: () => void;
  onStatusChange?: (channelId: string, status: "PLAYING" | "ERROR") => void;
}

export default function CyberPlayer({ channel, onPrev, onNext, onStatusChange }: CyberPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const activeChannelIdRef = useRef<string | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [streamStatus, setStreamStatus] = useState<"IDLE" | "LOADING" | "PLAYING" | "ERROR">("IDLE");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const initPlayer = () => {
    const video = videoRef.current;
    if (!video || !channel) return;

    activeChannelIdRef.current = channel.id;

    // Destroy existing HLS instances
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // Reset native video source to prevent previous stream leaks or 'no supported sources' mismatch
    try {
      video.pause();
      video.removeAttribute("src");
      video.load();
    } catch (e) {
      console.log("Cleanup error:", e);
    }

    setStreamStatus("LOADING");
    setErrorMessage(null);

    // Prefer Hls.js library because it offers reliable MSE-driven playback across most browsers (Chrome, Edge, Firefox).
    if (Hls.isSupported()) {
      const hls = new Hls({
        maxMaxBufferLength: 8,
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 3,
        manifestLoadingTimeOut: 10000,
      });

      hlsRef.current = hls;
      hls.loadSource(channel.url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (activeChannelIdRef.current !== channel.id) return;
        setStreamStatus("PLAYING");
        onStatusChange?.(channel.id, "PLAYING");
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              if (activeChannelIdRef.current === channel.id) {
                setIsPlaying(true);
              }
            })
            .catch((err) => {
              console.log("Play blocked/autoplay:", err);
              if (activeChannelIdRef.current === channel.id) {
                setIsPlaying(false);
              }
            });
        }
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (activeChannelIdRef.current !== channel.id) return;
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              setErrorMessage("নেটওয়ার্ক সংযোগ পরীক্ষা করুন।");
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              setErrorMessage("স্ট্রীম লোড হতে সমস্যা হচ্ছে।");
              hls.recoverMediaError();
              break;
            default:
              setStreamStatus("ERROR");
              onStatusChange?.(channel.id, "ERROR");
              setErrorMessage("চ্যানেলটি বন্ধ আছে অথবা লিঙ্কটি পরিবর্তন হয়েছে।");
              break;
          }
        }
      });

      return () => {
        if (hlsRef.current) {
          hlsRef.current.destroy();
          hlsRef.current = null;
        }
      };
    } 
    // Fall back to native HLS support (e.g. Safari on iOS, where MSE is not supported but native HLS is).
    else if (video.canPlayType("application/vnd.apple.mpegurl") || video.canPlayType("application/x-mpegURL")) {
      video.src = channel.url;
      
      const onLoadedMetadata = () => {
        if (activeChannelIdRef.current !== channel.id) return;
        setStreamStatus("PLAYING");
        onStatusChange?.(channel.id, "PLAYING");
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              if (activeChannelIdRef.current === channel.id) {
                setIsPlaying(true);
              }
            })
            .catch((e) => {
              console.log("Autoplay blocked:", e);
              if (activeChannelIdRef.current === channel.id) {
                setIsPlaying(false);
              }
            });
        }
      };

      const onError = (ev: any) => {
        if (activeChannelIdRef.current !== channel.id) return;
        console.warn("Native play error:", ev);
        setStreamStatus("ERROR");
        onStatusChange?.(channel.id, "ERROR");
        setErrorMessage("চ্যানেলটি চালু করা যাচ্ছে না। দয়া করে রিফ্রেশ করুন।");
      };

      video.addEventListener("loadedmetadata", onLoadedMetadata);
      video.addEventListener("error", onError);

      return () => {
        video.removeEventListener("loadedmetadata", onLoadedMetadata);
        video.removeEventListener("error", onError);
      };
    } else {
      setStreamStatus("ERROR");
      setErrorMessage("আপনার ব্রাউজারে এই ভিডিও প্লে করা সম্ভব নয়।");
      return () => {};
    }
  };

  useEffect(() => {
    const cleanup = initPlayer();
    return () => {
      activeChannelIdRef.current = null;
      if (cleanup) {
        cleanup();
      }
    };
  }, [channel]);

  // Play Pause Toggle
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((err) => console.log("Play failed", err));
      }
    }
  };

  // Reconnect/Retry Stream
  const handleReload = () => {
    initPlayer();
  };

  // True Fullscreen: enters native fullscreen directly on the <video> element
  // This achieves perfect "ফুল স্কিন করলে ফুল টিভি হবে" across devices.
  const handleToggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (!document.fullscreenElement) {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if ((video as any).webkitRequestFullscreen) {
        (video as any).webkitRequestFullscreen();
      } else if ((video as any).msRequestFullscreen) {
        (video as any).msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  return (
    <div className="relative w-full bg-zinc-950 flex flex-col rounded-xl overflow-hidden shadow-2xl border border-white/5">
      
      {/* Video Content Panel */}
      <div className="relative aspect-video w-full bg-black flex items-center justify-center">
        {channel ? (
          <video
            ref={videoRef}
            className="w-full h-full object-contain cursor-pointer"
            onClick={togglePlay}
            playsInline
            controls={isFullscreen} // Shows native fullscreen overlay controls if desired
          />
        ) : (
          <div className="text-center p-6 text-zinc-500">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-zinc-600" />
            <p className="text-xs">টিভি লোড হচ্ছে...</p>
          </div>
        )}

        {/* Loading Overlay */}
        {channel && streamStatus === "LOADING" && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center pointer-events-none select-none z-10">
            <Loader2 className="w-10 h-10 text-white animate-spin mb-3.5" />
            <p className="text-sm font-medium tracking-wide text-zinc-300">চ্যানেল কানেক্ট করা হচ্ছে...</p>
          </div>
        )}

        {/* Error State Overlay */}
        {channel && streamStatus === "ERROR" && (
          <div className="absolute inset-0 flex flex-col z-10 overflow-hidden select-none">
            {/* Color bars background */}
            <div className="w-full h-4/5 flex">
              <div className="flex-1 bg-[#FFFFFF]"></div>
              <div className="flex-1 bg-[#D1D100]"></div>
              <div className="flex-1 bg-[#00D1D1]"></div>
              <div className="flex-1 bg-[#00D100]"></div>
              <div className="flex-1 bg-[#D100D1]"></div>
              <div className="flex-1 bg-[#D10000]"></div>
              <div className="flex-1 bg-[#0000D1]"></div>
            </div>
            {/* Lower black & color bar blocks */}
            <div className="w-full h-1/5 flex">
              <div className="flex-1 bg-[#0000D1]"></div>
              <div className="flex-1 bg-[#131313]"></div>
              <div className="flex-1 bg-[#D100D1]"></div>
              <div className="flex-1 bg-[#131313]"></div>
              <div className="flex-1 bg-[#00D1D1]"></div>
              <div className="flex-1 bg-[#131313]"></div>
              <div className="flex-1 bg-[#FFFFFF]"></div>
            </div>
            
            {/* Dark blur overlay card */}
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-4 text-center">
              {/* Retro scanline overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,14,0)_50%,rgba(0,0,0,0.3)_50%)] bg-[size:100%_4px] pointer-events-none"></div>
              
              <div className="bg-zinc-950/90 backdrop-blur-sm border border-red-500/40 px-6 py-5 rounded-xl flex flex-col items-center gap-3.5 shadow-2xl relative max-w-sm">
                {/* Blinking Red Indicator + NO SIGNAL */}
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                  </span>
                  <span className="text-sm font-black tracking-widest text-red-500 uppercase animate-pulse">
                    NO SIGNAL / নো সিগনাল
                  </span>
                </div>
                
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white tracking-wide">{channel.name}</h4>
                  <p className="text-[11px] text-zinc-400 max-w-[280px] leading-relaxed mx-auto">
                    {errorMessage || "চ্যানেলটির ভিডিও লোড করা সম্ভব হচ্ছে না। লিংকটি সাময়িকভাবে বন্ধ আছে।"}
                  </p>
                </div>

                <button
                  onClick={handleReload}
                  className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 active:scale-95 text-white rounded-lg text-xs font-bold transition shadow-lg"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  RETRY / আবার চেষ্টা করুন
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Control Bar (Play, Next, Prev, Fullscreen) */}
      {channel && (
        <div className="bg-zinc-900/90 border-t border-white/5 py-3 px-4 flex items-center justify-between gap-4">
          
          {/* Main Playback & Navigation Controls */}
          <div className="flex items-center gap-2.5">
            {/* Previous Button */}
            <button
              onClick={onPrev}
              disabled={!onPrev}
              className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center transition text-white disabled:opacity-30"
              title="পূর্ববর্তী চ্যানেল"
            >
              <SkipBack className="w-4 h-4 fill-white" />
            </button>

            {/* Play/Pause Button */}
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-lg bg-white text-black hover:bg-zinc-200 flex items-center justify-center transition font-semibold"
              title={isPlaying ? "বিরতি" : "চালু করুন"}
            >
              {isPlaying ? <Pause className="w-4.5 h-4.5 fill-black" /> : <Play className="w-4.5 h-4.5 fill-black pl-0.5" />}
            </button>

            {/* Next Button */}
            <button
              onClick={onNext}
              disabled={!onNext}
              className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center transition text-white disabled:opacity-30"
              title="পরবর্তী চ্যানেল"
            >
              <SkipForward className="w-4 h-4 fill-white" />
            </button>
          </div>

          {/* Active Station Label */}
          <div className="hidden sm:block truncate text-left flex-1 px-4">
            <span className="block text-[9px] text-zinc-500 uppercase tracking-widest leading-none">চলতি চ্যানেল</span>
            <span className="block text-xs font-bold text-white tracking-wide mt-1 truncate">
              {channel.name}
            </span>
          </div>

          {/* Action Control Items: Reload + Fullscreen */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleReload}
              className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/5 flex items-center justify-center transition"
              title="রিলোড করুন"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleToggleFullscreen}
              className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/5 flex items-center justify-center transition"
              title="ফুল স্ক্রিন"
            >
              <Maximize className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
